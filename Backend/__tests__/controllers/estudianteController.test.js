import { jest } from '@jest/globals';
import {
  crearEstudianteCtrl,
  obtenerEstudiantesCtrl,
  obtenerEstudiantePorIdCtrl,
  actualizarEstudianteCtrl,
  eliminarEstudianteCtrl
} from '../../controllers/estudianteController.js';

// Mock the Estudiante model
jest.mock('../../models/Estudiante.js', () => ({
  crearEstudiante: jest.fn(),
  obtenerEstudiantes: jest.fn(),
  obtenerEstudiantePorId: jest.fn(),
  obtenerEstudiantePorRut: jest.fn(),
  actualizarEstudiante: jest.fn(),
  eliminarEstudiante: jest.fn(),
  cambiarEstadoEstudiante: jest.fn(),
  obtenerEstudiantesPorEstado: jest.fn(),
  obtenerEstudiantesActivos: jest.fn()
}));

describe('EstudianteController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { uid: 'test-user-id' }
    };
    
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(() => mockRes)
    };
    
    jest.clearAllMocks();
  });

  describe('crearEstudianteCtrl', () => {
    it('should create a new student successfully', async () => {
      const { crearEstudiante } = await import('../../models/Estudiante.js');
      
      const mockEstudiante = {
        id: 'est123',
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan@test.com',
        telefono: '123456789',
        fechaNacimiento: '2005-01-01',
        establecimientoId: 'establecimiento123'
      };

      crearEstudiante.mockResolvedValue(mockEstudiante);

      mockReq.body = {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan@test.com',
        telefono: '123456789',
        fechaNacimiento: '2005-01-01',
        establecimientoId: 'establecimiento123'
      };

      await crearEstudianteCtrl(mockReq, mockRes);

      expect(crearEstudiante).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Estudiante creado exitosamente',
        estudiante: mockEstudiante
      });
    });

    it('should handle creation errors', async () => {
      const { crearEstudiante } = await import('../../models/Estudiante.js');
      
      crearEstudiante.mockRejectedValue(new Error('RUT ya existe'));

      mockReq.body = {
        nombre: 'Juan Pérez',
        rut: '12345678-9'
      };

      await crearEstudianteCtrl(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error al crear estudiante',
        details: 'RUT ya existe'
      });
    });
  });

  describe('obtenerEstudiantesCtrl', () => {
    it('should return all students successfully', async () => {
      const { obtenerEstudiantes } = await import('../../models/Estudiante.js');
      
      const mockEstudiantes = [
        {
          id: 'est1',
          nombre: 'Juan Pérez',
          rut: '12345678-9'
        },
        {
          id: 'est2',
          nombre: 'María González',
          rut: '98765432-1'
        }
      ];

      obtenerEstudiantes.mockResolvedValue(mockEstudiantes);

      await obtenerEstudiantesCtrl(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        estudiantes: mockEstudiantes,
        total: 2
      });
    });

    it('should handle query parameters', async () => {
      const { obtenerEstudiantesPorEstado } = await import('../../models/Estudiante.js');
      
      mockReq.query = { estado: 'activo' };
      obtenerEstudiantesPorEstado.mockResolvedValue([]);

      await obtenerEstudiantesCtrl(mockReq, mockRes);

      expect(obtenerEstudiantesPorEstado).toHaveBeenCalledWith('activo');
    });
  });

  describe('obtenerEstudiantePorIdCtrl', () => {
    it('should return student by ID successfully', async () => {
      const { obtenerEstudiantePorId } = await import('../../models/Estudiante.js');
      
      const mockEstudiante = {
        id: 'est123',
        nombre: 'Juan Pérez',
        rut: '12345678-9'
      };

      obtenerEstudiantePorId.mockResolvedValue(mockEstudiante);
      mockReq.params = { id: 'est123' };

      await obtenerEstudiantePorIdCtrl(mockReq, mockRes);

      expect(obtenerEstudiantePorId).toHaveBeenCalledWith('est123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        estudiante: mockEstudiante
      });
    });

    it('should return error if student not found', async () => {
      const { obtenerEstudiantePorId } = await import('../../models/Estudiante.js');
      
      obtenerEstudiantePorId.mockResolvedValue(null);
      mockReq.params = { id: 'nonexistent' };

      await obtenerEstudiantePorIdCtrl(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Estudiante no encontrado'
      });
    });
  });

  describe('actualizarEstudianteCtrl', () => {
    it('should update student successfully', async () => {
      const { actualizarEstudiante } = await import('../../models/Estudiante.js');
      
      const mockEstudianteActualizado = {
        id: 'est123',
        nombre: 'Juan Carlos Pérez',
        rut: '12345678-9'
      };

      actualizarEstudiante.mockResolvedValue(mockEstudianteActualizado);
      mockReq.params = { id: 'est123' };
      mockReq.body = { nombre: 'Juan Carlos Pérez' };

      await actualizarEstudianteCtrl(mockReq, mockRes);

      expect(actualizarEstudiante).toHaveBeenCalledWith('est123', mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Estudiante actualizado exitosamente',
        estudiante: mockEstudianteActualizado
      });
    });

    it('should handle update errors', async () => {
      const { actualizarEstudiante } = await import('../../models/Estudiante.js');
      
      actualizarEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'));
      mockReq.params = { id: 'nonexistent' };
      mockReq.body = { nombre: 'Nuevo Nombre' };

      await actualizarEstudianteCtrl(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error al actualizar estudiante',
        details: 'Estudiante no encontrado'
      });
    });
  });

  describe('eliminarEstudianteCtrl', () => {
    it('should delete student successfully', async () => {
      const { eliminarEstudiante } = await import('../../models/Estudiante.js');
      
      eliminarEstudiante.mockResolvedValue(true);
      mockReq.params = { id: 'est123' };

      await eliminarEstudianteCtrl(mockReq, mockRes);

      expect(eliminarEstudiante).toHaveBeenCalledWith('est123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Estudiante eliminado exitosamente'
      });
    });

    it('should handle deletion errors', async () => {
      const { eliminarEstudiante } = await import('../../models/Estudiante.js');
      
      eliminarEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'));
      mockReq.params = { id: 'nonexistent' };

      await eliminarEstudianteCtrl(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error al eliminar estudiante',
        details: 'Estudiante no encontrado'
      });
    });
  });
});

