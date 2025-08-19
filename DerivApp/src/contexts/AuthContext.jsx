import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { message } from 'antd';
import { auth } from '../config/firebase';
import { apiService } from '../services/apiService';

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Roles y permisos (replicados del backend)
export const ROLES = {
  ADMIN: 'administrador',
  PSICOLOGO: 'psicologo',
  TRABAJADOR_SOCIAL: 'trabajador_social', 
  JEFE_CONVIVENCIA: 'jefe_convivencia',
  DOCENTE: 'docente'
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Función para verificar permisos
  const hasPermission = (seccion, accion = 'ver') => {
    if (!userProfile?.permisos) return false;
    
    const permisoSeccion = userProfile.permisos[seccion];
    if (typeof permisoSeccion === 'boolean') {
      return permisoSeccion;
    }
    
    if (typeof permisoSeccion === 'object') {
      return permisoSeccion[accion] || false;
    }
    
    return false;
  };

  // Función para verificar roles
  const hasRole = (...rolesPermitidos) => {
    if (!userProfile?.rol) return false;
    return rolesPermitidos.includes(userProfile.rol);
  };

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async (firebaseUser) => {
    try {
      const idToken = await getIdToken(firebaseUser);
      setToken(idToken);
      
      // Configurar token en apiService para futuras llamadas
      apiService.setAuthToken(idToken);
      
      // Obtener perfil desde el backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/perfil-autenticado`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.usuario);
        return data.usuario;
      } else {
        throw new Error(data.message || 'Error al obtener perfil');
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      message.error('Error al obtener perfil de usuario');
      return null;
    }
  };

  // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Obtener perfil del backend
      const profile = await fetchUserProfile(firebaseUser);
      
      if (!profile) {
        await signOut(auth);
        throw new Error('No se pudo obtener el perfil del usuario');
      }
      
      if (!profile.activo) {
        await signOut(auth);
        throw new Error('Usuario inactivo. Contacta al administrador.');
      }
      
      message.success(`¡Bienvenido ${profile.nombre}!`);
      return { user: firebaseUser, profile };
      
    } catch (error) {
      console.error('Error en login:', error);
      
      // Mensajes de error específicos
      if (error.code === 'auth/user-not-found') {
        message.error('Usuario no encontrado');
      } else if (error.code === 'auth/wrong-password') {
        message.error('Contraseña incorrecta');
      } else if (error.code === 'auth/invalid-email') {
        message.error('Email inválido');
      } else if (error.code === 'auth/user-disabled') {
        message.error('Usuario deshabilitado');
      } else if (error.code === 'auth/too-many-requests') {
        message.error('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        message.error(error.message || 'Error al iniciar sesión');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setToken(null);
      apiService.removeAuthToken();
      message.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error en logout:', error);
      message.error('Error al cerrar sesión');
    }
  };

  // Función para refrescar token
  const refreshToken = async () => {
    try {
      if (user) {
        const newToken = await getIdToken(user, true); // Force refresh
        setToken(newToken);
        apiService.setAuthToken(newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return null;
    }
  };

  // Efecto para escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser);
        } else {
          setUser(null);
          setUserProfile(null);
          setToken(null);
          apiService.removeAuthToken();
        }
      } catch (error) {
        console.error('Error en onAuthStateChanged:', error);
        setUser(null);
        setUserProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refrescar token automáticamente cada 50 minutos
  useEffect(() => {
    if (user) {
      const interval = setInterval(refreshToken, 50 * 60 * 1000); // 50 minutos
      return () => clearInterval(interval);
    }
  }, [user]);

  // Valores del contexto
  const value = {
    // Estado
    user,
    userProfile,
    loading,
    token,
    isAuthenticated: !!user && !!userProfile,
    
    // Funciones de autenticación
    login,
    logout,
    refreshToken,
    
    // Funciones de permisos
    hasPermission,
    hasRole,
    
    // Constantes
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
