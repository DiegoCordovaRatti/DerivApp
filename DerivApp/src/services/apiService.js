// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Función genérica para hacer peticiones HTTP
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
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