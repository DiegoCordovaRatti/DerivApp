import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante
} from '../../services/estudianteService.js';

// Mock fetch API
global.fetch = vi.fn();

describe('EstudianteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('obtenerEstudiantes', () => {
    it('should fetch students successfully', async () => {
      const mockStudents = [
        {
          id: 'est1',
          nombre: 'Juan Pérez',
          rut: '12345678-9',
          email: 'juan@test.com'
        },
        {
          id: 'est2',
          nombre: 'María González',
          rut: '98765432-1',
          email: 'maria@test.com'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estudiantes: mockStudents })
      });

      const result = await obtenerEstudiantes();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/estudiantes', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(result).toEqual(mockStudents);
    });

    it('should return empty array on fetch error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await obtenerEstudiantes();

      expect(result).toEqual([]);
    });

    it('should handle response without estudiantes property', async () => {
      const mockResponse = [
        { id: 'est1', nombre: 'Juan Pérez' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await obtenerEstudiantes();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('obtenerEstudiantePorId', () => {
    it('should fetch student by ID successfully', async () => {
      const mockStudent = {
        id: 'est123',
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan@test.com'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estudiante: mockStudent })
      });

      const result = await obtenerEstudiantePorId('est123');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/estudiantes/est123', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw error if student not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Estudiante no encontrado' })
      });

      await expect(obtenerEstudiantePorId('nonexistent')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('crearEstudiante', () => {
    it('should create student successfully', async () => {
      const newStudent = {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        email: 'juan@test.com',
        telefono: '123456789'
      };

      const createdStudent = {
        id: 'est123',
        ...newStudent
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Estudiante creado exitosamente',
          estudiante: createdStudent
        })
      });

      const result = await crearEstudiante(newStudent);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      });
      expect(result.estudiante).toEqual(createdStudent);
    });

    it('should handle creation errors', async () => {
      const newStudent = {
        nombre: 'Juan Pérez',
        rut: '12345678-9'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'RUT ya existe' })
      });

      await expect(crearEstudiante(newStudent)).rejects.toThrow('RUT ya existe');
    });
  });

  describe('actualizarEstudiante', () => {
    it('should update student successfully', async () => {
      const studentId = 'est123';
      const updateData = {
        nombre: 'Juan Carlos Pérez',
        telefono: '987654321'
      };

      const updatedStudent = {
        id: studentId,
        nombre: 'Juan Carlos Pérez',
        rut: '12345678-9',
        telefono: '987654321'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Estudiante actualizado exitosamente',
          estudiante: updatedStudent
        })
      });

      const result = await actualizarEstudiante(studentId, updateData);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/api/estudiantes/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      expect(result.estudiante).toEqual(updatedStudent);
    });

    it('should handle update errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Estudiante no encontrado' })
      });

      await expect(actualizarEstudiante('nonexistent', {})).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('eliminarEstudiante', () => {
    it('should delete student successfully', async () => {
      const studentId = 'est123';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Estudiante eliminado exitosamente'
        })
      });

      const result = await eliminarEstudiante(studentId);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/api/estudiantes/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(result.message).toBe('Estudiante eliminado exitosamente');
    });

    it('should handle deletion errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Estudiante no encontrado' })
      });

      await expect(eliminarEstudiante('nonexistent')).rejects.toThrow('Estudiante no encontrado');
    });
  });

  describe('Error handling', () => {
    it('should handle network errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await obtenerEstudiantes();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener estudiantes:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle API errors with proper error messages', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Error interno del servidor' })
      });

      await expect(obtenerEstudiantePorId('est123')).rejects.toThrow('Error interno del servidor');
    });

    it('should handle API errors without error property', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({})
      });

      await expect(obtenerEstudiantePorId('est123')).rejects.toThrow('Error 400');
    });
  });
});

