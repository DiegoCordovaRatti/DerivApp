import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock apiService before importing authService
vi.mock('../../services/apiService.js', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import { authService } from '../../services/authService.js';

describe('AuthService', () => {
  let mockApiService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { apiService } = await import('../../services/apiService.js');
    mockApiService = apiService;
  });

  describe('verificarToken', () => {
    it('should verify token successfully', async () => {
      const mockResponse = {
        valid: true,
        user: { uid: 'test-uid', email: 'test@test.com' }
      };
      
      mockApiService.post.mockResolvedValue(mockResponse);
      
      const result = await authService.verificarToken('valid-token');
      
      expect(mockApiService.post).toHaveBeenCalledWith('/auth/firebase/verificar-token', {
        token: 'valid-token'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle token verification error', async () => {
      const mockError = new Error('Token invalid');
      mockApiService.post.mockRejectedValue(mockError);
      
      await expect(authService.verificarToken('invalid-token')).rejects.toThrow('Token invalid');
      
      expect(mockApiService.post).toHaveBeenCalledWith('/auth/firebase/verificar-token', {
        token: 'invalid-token'
      });
    });
  });

  describe('obtenerPerfil', () => {
    it('should fetch user profile successfully', async () => {
      const mockProfile = {
        usuario: {
          id: 'test-uid',
          nombre: 'Test User',
          email: 'test@test.com',
          rol: 'profesor'
        }
      };
      
      mockApiService.get.mockResolvedValue(mockProfile);
      
      const result = await authService.obtenerPerfil();
      
      expect(mockApiService.get).toHaveBeenCalledWith('/auth/perfil-autenticado');
      expect(result).toEqual(mockProfile);
    });

    it('should handle profile fetch error', async () => {
      const mockError = new Error('Unauthorized');
      mockApiService.get.mockRejectedValue(mockError);
      
      await expect(authService.obtenerPerfil()).rejects.toThrow('Unauthorized');
    });
  });

  describe('obtenerRolesPermisos', () => {
    it('should fetch roles and permissions successfully', async () => {
      const mockRolesPermisos = {
        roles: {
          ADMIN: 'admin',
          PROFESOR: 'profesor',
          COORDINADOR: 'coordinador'
        },
        permisos: {
          CREAR_USUARIOS: 'crear_usuarios',
          GESTIONAR_ESTUDIANTES: 'gestionar_estudiantes'
        }
      };
      
      mockApiService.get.mockResolvedValue(mockRolesPermisos);
      
      const result = await authService.obtenerRolesPermisos();
      
      expect(mockApiService.get).toHaveBeenCalledWith('/auth/roles-permisos');
      expect(result).toEqual(mockRolesPermisos);
    });
  });

  describe('crearUsuario', () => {
    it('should create user successfully', async () => {
      const userData = {
        nombre: 'New User',
        email: 'newuser@test.com',
        rol: 'profesor',
        establecimientoId: 'est123'
      };
      
      const mockResponse = {
        message: 'Usuario creado exitosamente',
        usuario: { id: 'new-user-id', ...userData }
      };
      
      mockApiService.post.mockResolvedValue(mockResponse);
      
      const result = await authService.crearUsuario(userData);
      
      expect(mockApiService.post).toHaveBeenCalledWith('/auth/firebase/crear-usuario', userData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle user creation error', async () => {
      const userData = {
        nombre: 'New User',
        email: 'existing@test.com'
      };
      
      const mockError = new Error('Email ya existe');
      mockApiService.post.mockRejectedValue(mockError);
      
      await expect(authService.crearUsuario(userData)).rejects.toThrow('Email ya existe');
    });
  });

  describe('desactivarUsuario', () => {
    it('should deactivate user successfully', async () => {
      const userId = 'user-to-deactivate';
      const mockResponse = {
        message: 'Usuario desactivado exitosamente'
      };
      
      mockApiService.put.mockResolvedValue(mockResponse);
      
      const result = await authService.desactivarUsuario(userId);
      
      expect(mockApiService.put).toHaveBeenCalledWith(`/auth/usuarios/${userId}/desactivar`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle user deactivation error', async () => {
      const userId = 'nonexistent-user';
      const mockError = new Error('Usuario no encontrado');
      mockApiService.put.mockRejectedValue(mockError);
      
      await expect(authService.desactivarUsuario(userId)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('Error handling', () => {
    it('should log errors and re-throw them', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Network error');
      
      mockApiService.get.mockRejectedValue(mockError);
      
      await expect(authService.obtenerPerfil()).rejects.toThrow('Network error');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener perfil:', mockError);
      
      consoleSpy.mockRestore();
    });
  });
});
