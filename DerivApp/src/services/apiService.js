// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Token de autenticación
let authToken = null;

// Función para establecer token de autenticación
export const setAuthToken = (token) => {
  authToken = token;
};

// Función para remover token de autenticación
export const removeAuthToken = () => {
  authToken = null;
};

// Función para obtener headers con autenticación
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Función genérica para hacer peticiones HTTP
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: getHeaders(),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    // Manejar errores de autenticación
    if (response.status === 401) {
      // Token expirado o inválido
      removeAuthToken();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    if (response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error en petición ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Funciones específicas para diferentes métodos HTTP
export const get = (endpoint) => apiRequest('GET', endpoint);
export const post = (endpoint, data) => apiRequest('POST', endpoint, data);
export const put = (endpoint, data) => apiRequest('PUT', endpoint, data);
export const patch = (endpoint, data) => apiRequest('PATCH', endpoint, data);
export const del = (endpoint) => apiRequest('DELETE', endpoint);

// Objeto principal del servicio API
export const apiService = {
  setAuthToken,
  removeAuthToken,
  get,
  post,
  put,
  patch,
  del,
  request: apiRequest
}; 