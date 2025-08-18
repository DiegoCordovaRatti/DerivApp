import { apiService } from './apiService';

// Servicio de autenticación
export const authService = {
  // Verificar token
  verificarToken: async (token) => {
    try {
      const response = await apiService.post('/auth/firebase/verificar-token', { token });
      return response;
    } catch (error) {
      console.error('Error al verificar token:', error);
      throw error;
    }
  },

  // Obtener perfil autenticado
  obtenerPerfil: async () => {
    try {
      const response = await apiService.get('/auth/perfil-autenticado');
      return response;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  // Obtener roles y permisos disponibles
  obtenerRolesPermisos: async () => {
    try {
      const response = await apiService.get('/auth/roles-permisos');
      return response;
    } catch (error) {
      console.error('Error al obtener roles y permisos:', error);
      throw error;
    }
  },

  // Crear usuario (solo admin)
  crearUsuario: async (datosUsuario) => {
    try {
      const response = await apiService.post('/auth/firebase/crear-usuario', datosUsuario);
      return response;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Desactivar usuario (solo admin)
  desactivarUsuario: async (usuarioId) => {
    try {
      const response = await apiService.patch(`/auth/desactivar/${usuarioId}`);
      return response;
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      throw error;
    }
  },

  // Obtener usuarios por establecimiento
  obtenerUsuariosPorEstablecimiento: async (establecimientoId) => {
    try {
      const response = await apiService.get(`/auth/establecimiento/${establecimientoId}`);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios por establecimiento:', error);
      throw error;
    }
  },

  // Obtener usuarios por rol
  obtenerUsuariosPorRol: async (rol) => {
    try {
      const response = await apiService.get(`/auth/rol/${rol}`);
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      throw error;
    }
  }
};

export default authService;
