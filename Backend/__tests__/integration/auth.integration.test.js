import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../../routes/authRoutes.js';

// Mock Firebase Admin
jest.mock('../../config/firebaseAdmin.js', () => ({
  firebaseAdmin: {
    auth: () => ({
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'test-uid',
        email: 'test@test.com'
      })
    }),
    firestore: () => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(),
          get: jest.fn(() => ({
            exists: true,
            data: () => ({
              id: 'test-uid',
              nombre: 'Test User',
              email: 'test@test.com',
              rol: 'profesor'
            })
          }))
        })),
        where: jest.fn(() => ({
          get: jest.fn(() => ({
            empty: true,
            docs: []
          }))
        }))
      }))
    })
  }
}));

// Mock Usuario model
jest.mock('../../models/Usuario.js', () => ({
  crearUsuario: jest.fn(),
  obtenerUsuarioPorEmail: jest.fn(),
  obtenerUsuarioPorId: jest.fn(),
  actualizarUsuario: jest.fn(),
  ROLES: {
    ADMIN: 'admin',
    COORDINADOR: 'coordinador', 
    PROFESOR: 'profesor'
  },
  PERMISOS: {
    CREAR_USUARIOS: 'crear_usuarios',
    GESTIONAR_ESTUDIANTES: 'gestionar_estudiantes'
  }
}));

describe('Auth Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const { crearUsuario, obtenerUsuarioPorEmail } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorEmail.mockResolvedValue(null);
      crearUsuario.mockResolvedValue({
        id: 'new-user-id',
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor',
        establecimientoId: 'est123'
      });

      const userData = {
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor',
        telefono: '123456789',
        password: 'password123',
        establecimientoId: 'est123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).not.toHaveProperty('password');
      expect(response.body.usuario.email).toBe('test@test.com');
    });

    it('should return error for duplicate email', async () => {
      const { obtenerUsuarioPorEmail } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'test@test.com'
      });

      const userData = {
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'El email ya está registrado');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com'
          // Missing required fields
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/firebase/verificar-token', () => {
    it('should verify valid Firebase token', async () => {
      const { firebaseAdmin } = await import('../../config/firebaseAdmin.js');
      
      firebaseAdmin.auth().verifyIdToken.mockResolvedValue({
        uid: 'firebase-uid',
        email: 'test@test.com',
        name: 'Test User'
      });

      const response = await request(app)
        .post('/api/auth/firebase/verificar-token')
        .send({ token: 'valid-firebase-token' })
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.uid).toBe('firebase-uid');
    });

    it('should reject invalid Firebase token', async () => {
      const { firebaseAdmin } = await import('../../config/firebaseAdmin.js');
      
      firebaseAdmin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/api/auth/firebase/verificar-token')
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('valid', false);
      expect(response.body).toHaveProperty('error', 'Token inválido');
    });

    it('should require token in request body', async () => {
      const response = await request(app)
        .post('/api/auth/firebase/verificar-token')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/roles-permisos', () => {
    it('should return available roles and permissions', async () => {
      const response = await request(app)
        .get('/api/auth/roles-permisos')
        .expect(200);

      expect(response.body).toHaveProperty('roles');
      expect(response.body).toHaveProperty('permisos');
      expect(response.body.roles).toHaveProperty('ADMIN');
      expect(response.body.roles).toHaveProperty('PROFESOR');
      expect(response.body.permisos).toHaveProperty('CREAR_USUARIOS');
    });
  });

  describe('Protected routes', () => {
    it('should require authentication for protected endpoints', async () => {
      const response = await request(app)
        .get('/api/auth/perfil-autenticado')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should access protected route with valid token', async () => {
      const { obtenerUsuarioPorId } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorId.mockResolvedValue({
        id: 'test-uid',
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor'
      });

      const response = await request(app)
        .get('/api/auth/perfil-autenticado')
        .set('Authorization', 'Bearer valid-firebase-token')
        .expect(200);

      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario.email).toBe('test@test.com');
    });
  });
});

