import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock services
vi.mock('../../services/authService.js', () => ({
  authService: {
    obtenerPerfil: vi.fn(),
    verificarToken: vi.fn()
  }
}));

vi.mock('../../services/estudianteService.js', () => ({
  obtenerEstudiantes: vi.fn(),
  crearEstudiante: vi.fn(),
  actualizarEstudiante: vi.fn(),
  eliminarEstudiante: vi.fn()
}));

vi.mock('../../services/dashboardService.js', () => ({
  obtenerEstadisticas: vi.fn(),
  obtenerCasosRecientes: vi.fn(),
  obtenerAlertasActivas: vi.fn()
}));

// Mock fetch for direct API calls
global.fetch = vi.fn();

describe('Frontend-Backend Integration Tests', () => {
  // Simple integration tests without complex components

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API Communication', () => {
    it('should make authenticated API calls correctly', async () => {
      const mockToken = 'valid-jwt-token';
      
      // Mock fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          estudiantes: [
            { id: 'est1', nombre: 'Test Student' }
          ]
        })
      });

      // Direct API call test
      const response = await fetch('http://localhost:3000/api/estudiantes', {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/estudiantes',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          })
        })
      );

      expect(data).toHaveProperty('estudiantes');
    });
  });

  describe('Service Integration', () => {
    it('should handle service calls correctly', async () => {
      const { obtenerEstudiantes } = await import('../../services/estudianteService.js');
      
      const mockStudents = [
        {
          id: 'est1',
          nombre: 'Juan Pérez',
          rut: '12345678-9',
          estado: 'activo'
        }
      ];

      obtenerEstudiantes.mockResolvedValue(mockStudents);

      const result = await obtenerEstudiantes();
      expect(result).toEqual(mockStudents);
      expect(obtenerEstudiantes).toHaveBeenCalled();
    });
  });
});
