import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { 
  registrarUsuario, 
  loginUsuario, 
  obtenerPerfilAutenticado,
  crearUsuarioFirebase,
  verificarTokenFirebase
} from '../../controllers/authController.js';

// Mock the Usuario model
jest.mock('../../models/Usuario.js', () => ({
  crearUsuario: jest.fn(),
  obtenerUsuarioPorEmail: jest.fn(),
  obtenerUsuarioPorId: jest.fn(),
  actualizarUsuario: jest.fn(),
  actualizarUltimoAcceso: jest.fn(),
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

// Mock Firebase Admin
jest.mock('../../config/firebaseAdmin.js', () => ({
  firebaseAdmin: {
    auth: () => ({
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUser: jest.fn(),
      verifyIdToken: jest.fn()
    }),
    firestore: () => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(),
          get: jest.fn()
        }))
      }))
    })
  }
}));

describe('AuthController', () => {
  let app;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    mockReq = {
      body: {},
      user: {},
      headers: {}
    };
    
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes),
      send: jest.fn(() => mockRes)
    };
    
    jest.clearAllMocks();
  });

  describe('registrarUsuario', () => {
    it('should register a new user successfully', async () => {
      const { crearUsuario, obtenerUsuarioPorEmail } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorEmail.mockResolvedValue(null);
      crearUsuario.mockResolvedValue({
        id: '123',
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor',
        password: 'hashedPassword'
      });

      mockReq.body = {
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor',
        telefono: '123456789',
        password: 'password123',
        establecimientoId: 'est123'
      };

      await registrarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
        usuario: expect.objectContaining({
          id: '123',
          nombre: 'Test User',
          email: 'test@test.com',
          rol: 'profesor'
        })
      });
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: expect.not.objectContaining({
            password: expect.anything()
          })
        })
      );
    });

    it('should return error if user already exists', async () => {
      const { obtenerUsuarioPorEmail } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorEmail.mockResolvedValue({
        id: '123',
        email: 'test@test.com'
      });

      mockReq.body = {
        email: 'test@test.com'
      };

      await registrarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'El email ya está registrado'
      });
    });

    it('should handle registration errors', async () => {
      const { crearUsuario, obtenerUsuarioPorEmail } = await import('../../models/Usuario.js');
      
      obtenerUsuarioPorEmail.mockResolvedValue(null);
      crearUsuario.mockRejectedValue(new Error('Database error'));

      mockReq.body = {
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor'
      };

      await registrarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error interno del servidor'
      });
    });
  });

  describe('verificarTokenFirebase', () => {
    it('should verify token successfully', async () => {
      const { firebaseAdmin } = await import('../../config/firebaseAdmin.js');
      
      firebaseAdmin.auth().verifyIdToken.mockResolvedValue({
        uid: 'firebase123',
        email: 'test@test.com',
        name: 'Test User'
      });

      mockReq.body = {
        token: 'valid-firebase-token'
      };

      await verificarTokenFirebase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        valid: true,
        user: expect.objectContaining({
          uid: 'firebase123',
          email: 'test@test.com'
        })
      });
    });

    it('should return error for invalid token', async () => {
      const { firebaseAdmin } = await import('../../config/firebaseAdmin.js');
      
      firebaseAdmin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      mockReq.body = {
        token: 'invalid-token'
      };

      await verificarTokenFirebase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        valid: false,
        error: 'Token inválido'
      });
    });
  });

  describe('obtenerPerfilAutenticado', () => {
    it('should return authenticated user profile', async () => {
      const { obtenerUsuarioPorId } = await import('../../models/Usuario.js');
      
      mockReq.user = { uid: 'firebase123' };
      
      obtenerUsuarioPorId.mockResolvedValue({
        id: 'firebase123',
        nombre: 'Test User',
        email: 'test@test.com',
        rol: 'profesor'
      });

      await obtenerPerfilAutenticado(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        usuario: expect.objectContaining({
          id: 'firebase123',
          nombre: 'Test User',
          email: 'test@test.com',
          rol: 'profesor'
        })
      });
    });

    it('should return error if user not found', async () => {
      const { obtenerUsuarioPorId } = await import('../../models/Usuario.js');
      
      mockReq.user = { uid: 'nonexistent' };
      obtenerUsuarioPorId.mockResolvedValue(null);

      await obtenerPerfilAutenticado(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Usuario no encontrado'
      });
    });
  });
});

