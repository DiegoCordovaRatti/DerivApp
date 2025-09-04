import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import estudianteRoutes from '../../routes/estudianteRoutes.js';
import { authMiddleware } from '../../middleware/auth.js';

// Mock Firebase Admin and middleware
jest.mock('../../config/firebaseAdmin.js', () => ({
  firebaseAdmin: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'test-user-uid',
        email: 'test@test.com'
      })
    }),
    firestore: () => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(),
          get: jest.fn(() => ({
            exists: true,
            data: () => ({ id: 'test-user-uid', rol: 'profesor' })
          })),
          update: jest.fn(),
          delete: jest.fn()
        })),
        add: jest.fn(() => ({ id: 'new-doc-id' })),
        where: jest.fn(() => ({
          get: jest.fn(() => ({
            docs: []
          }))
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(() => ({
            docs: []
          }))
        }))
      }))
    })
  }
}));

// Mock auth middleware
jest.mock('../../middleware/auth.js', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { uid: 'test-user-uid' };
    next();
  }
}));

// Mock Estudiante model
jest.mock('../../models/Estudiante.js', () => ({
  crearEstudiante: jest.fn(),
  obtenerEstudiantes: jest.fn(),
  obtenerEstudiantePorId: jest.fn(),
  obtenerEstudiantePorRut: jest.fn(),
  actualizarEstudiante: jest.fn(),
  eliminarEstudiante: jest.fn(),
  cambiarEstadoEstudiante: jest.fn(),
  obtenerEstudiantesPorEstado: jest.fn(),
  obtenerEstudiantesActivos: jest.fn(),
  obtenerEstudiantesPorEstablecimiento: jest.fn()
}));

describe('Estudiantes Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/estudiantes', estudianteRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/estudiantes', () => {
    it('should get all students successfully', async () => {
      const { obtenerEstudiantes } = await import('../../models/Estudiante.js');
      
      const mockStudents = [
        {
          id: 'est1',
          nombre: 'Juan Pérez',
          rut: '12345678-9',
          email: 'juan@test.com',
          estado: 'activo'
        },
        {
          id: 'est2',
          nombre: 'María González',
          rut: '98765432-1',
          email: 'maria@test.com',
          estado: 'activo'
        }
      ];

      obtenerEstudiantes.mockResolvedValue(mockStudents);

      const response = await request(app)
        .get('/api/estudiantes')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toHaveProperty('estudiantes');
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body.estudiantes).toEqual(mockStudents);
    });

    it('should filter students by estado', async () => {
      const { obtenerEstudiantesPorEstado } = await import('../../models/Estudiante.js');
      
      const activeStudents = [
        {
          id: 'est1',
          nombre: 'Juan Pérez',
          estado: 'activo'
        }
      ];

      obtenerEstudiantesPorEstado.mockResolvedValue(activeStudents);

      const response = await request(app)
        .get('/api/estudiantes?estado=activo')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(obtenerEstudiantesPorEstado).toHaveBeenCalledWith('activo');
      expect(response.body.estudiantes).toEqual(activeStudents);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/estudiantes')
        .expect(401);
    });
  });

  describe('POST /api/estudiantes', () => {
    it('should create a new student successfully', async () => {
      const { crearEstudiante } = await import('../../models/Estudiante.js');
      
      const newStudentData = {
        nombre: 'Carlos López',
        rut: '11111111-1',
        email: 'carlos@test.com',
        telefono: '123456789',
        fechaNacimiento: '2005-01-01',
        establecimientoId: 'est123'
      };

      const createdStudent = {
        id: 'new-student-id',
        ...newStudentData,
        estado: 'activo',
        fechaCreacion: new Date().toISOString()
      };

      crearEstudiante.mockResolvedValue(createdStudent);

      const response = await request(app)
        .post('/api/estudiantes')
        .set('Authorization', 'Bearer valid-token')
        .send(newStudentData)
        .expect(201);

      expect(crearEstudiante).toHaveBeenCalledWith(newStudentData);
      expect(response.body).toHaveProperty('message', 'Estudiante creado exitosamente');
      expect(response.body).toHaveProperty('estudiante');
      expect(response.body.estudiante.id).toBe('new-student-id');
    });

    it('should handle validation errors', async () => {
      const { crearEstudiante } = await import('../../models/Estudiante.js');
      
      crearEstudiante.mockRejectedValue(new Error('RUT ya existe'));

      const invalidData = {
        nombre: 'Carlos López',
        rut: '12345678-9' // Existing RUT
      };

      const response = await request(app)
        .post('/api/estudiantes')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Error al crear estudiante');
      expect(response.body).toHaveProperty('details', 'RUT ya existe');
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/estudiantes')
        .send({ nombre: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/estudiantes/:id', () => {
    it('should get student by ID successfully', async () => {
      const { obtenerEstudiantePorId } = await import('../../models/Estudiante.js');
      
      const mockStudent = {
        id: 'est123',
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan@test.com'
      };

      obtenerEstudiantePorId.mockResolvedValue(mockStudent);

      const response = await request(app)
        .get('/api/estudiantes/est123')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(obtenerEstudiantePorId).toHaveBeenCalledWith('est123');
      expect(response.body).toHaveProperty('estudiante');
      expect(response.body.estudiante).toEqual(mockStudent);
    });

    it('should return 404 if student not found', async () => {
      const { obtenerEstudiantePorId } = await import('../../models/Estudiante.js');
      
      obtenerEstudiantePorId.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/estudiantes/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Estudiante no encontrado');
    });
  });

  describe('PUT /api/estudiantes/:id', () => {
    it('should update student successfully', async () => {
      const { actualizarEstudiante } = await import('../../models/Estudiante.js');
      
      const updateData = {
        telefono: '987654321',
        email: 'nuevoemail@test.com'
      };

      const updatedStudent = {
        id: 'est123',
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        ...updateData
      };

      actualizarEstudiante.mockResolvedValue(updatedStudent);

      const response = await request(app)
        .put('/api/estudiantes/est123')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(200);

      expect(actualizarEstudiante).toHaveBeenCalledWith('est123', updateData);
      expect(response.body).toHaveProperty('message', 'Estudiante actualizado exitosamente');
      expect(response.body.estudiante.telefono).toBe('987654321');
    });

    it('should handle update errors', async () => {
      const { actualizarEstudiante } = await import('../../models/Estudiante.js');
      
      actualizarEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'));

      const response = await request(app)
        .put('/api/estudiantes/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .send({ nombre: 'Nuevo Nombre' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Error al actualizar estudiante');
    });
  });

  describe('DELETE /api/estudiantes/:id', () => {
    it('should delete student successfully', async () => {
      const { eliminarEstudiante } = await import('../../models/Estudiante.js');
      
      eliminarEstudiante.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/estudiantes/est123')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(eliminarEstudiante).toHaveBeenCalledWith('est123');
      expect(response.body).toHaveProperty('message', 'Estudiante eliminado exitosamente');
    });

    it('should handle deletion errors', async () => {
      const { eliminarEstudiante } = await import('../../models/Estudiante.js');
      
      eliminarEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'));

      const response = await request(app)
        .delete('/api/estudiantes/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Error al eliminar estudiante');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle malformed JSON', async () => {
      await request(app)
        .post('/api/estudiantes')
        .set('Authorization', 'Bearer valid-token')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/estudiantes')
        .set('Authorization', 'Bearer valid-token')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

