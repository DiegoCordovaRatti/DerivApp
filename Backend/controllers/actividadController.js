import {
  crearActividad,
  obtenerActividades,
  obtenerActividadPorId,
  obtenerActividadesPorUsuario,
  obtenerActividadesPorTipoAccion,
  obtenerActividadesPorObjeto,
  obtenerActividadesRecientes,
  obtenerActividadesPorFecha,
  obtenerEstadisticasActividades,
  logCreacion,
  logActualizacion,
  logEliminacion,
  logVisualizacion
} from '../models/Actividad.js';

// Crear una nueva actividad
export const crearActividadCtrl = async (req, res) => {
  try {
    const nuevaActividad = await crearActividad(req.body);
    
    res.status(201).json({
      message: 'Actividad registrada exitosamente',
      actividad: nuevaActividad
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(400).json({
      error: 'Error al crear actividad',
      details: error.message
    });
  }
};

// Obtener todas las actividades
export const obtenerActividadesCtrl = async (req, res) => {
  try {
    const actividades = await obtenerActividades();
    
    res.json({
      actividades,
      total: actividades.length
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      error: 'Error al obtener actividades',
      details: error.message
    });
  }
};

// Obtener actividad por ID
export const obtenerActividadPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const actividad = await obtenerActividadPorId(id);
    
    res.json({
      actividad
    });
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Actividad no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al obtener actividad',
      details: error.message
    });
  }
};

// Obtener actividades por usuario
export const obtenerActividadesPorUsuarioCtrl = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const actividades = await obtenerActividadesPorUsuario(usuarioId);
    
    res.json({
      actividades,
      total: actividades.length,
      usuarioId
    });
  } catch (error) {
    console.error('Error al obtener actividades del usuario:', error);
    res.status(500).json({
      error: 'Error al obtener actividades del usuario',
      details: error.message
    });
  }
};

// Obtener actividades por tipo de acción
export const obtenerActividadesPorTipoAccionCtrl = async (req, res) => {
  try {
    const { tipoAccion } = req.params;
    
    if (!['crear', 'actualizar', 'eliminar', 'ver'].includes(tipoAccion)) {
      return res.status(400).json({
        error: 'Tipo de acción inválido. Debe ser: crear, actualizar, eliminar o ver'
      });
    }
    
    const actividades = await obtenerActividadesPorTipoAccion(tipoAccion);
    
    res.json({
      actividades,
      total: actividades.length,
      tipoAccion
    });
  } catch (error) {
    console.error('Error al obtener actividades por tipo de acción:', error);
    res.status(500).json({
      error: 'Error al obtener actividades por tipo de acción',
      details: error.message
    });
  }
};

// Obtener actividades por objeto afectado
export const obtenerActividadesPorObjetoCtrl = async (req, res) => {
  try {
    const { objetoAfectado } = req.params;
    
    if (!['estudiante', 'derivacion', 'alerta', 'formulario', 'citacion', 'establecimiento', 'usuario'].includes(objetoAfectado)) {
      return res.status(400).json({
        error: 'Objeto afectado inválido'
      });
    }
    
    const actividades = await obtenerActividadesPorObjeto(objetoAfectado);
    
    res.json({
      actividades,
      total: actividades.length,
      objetoAfectado
    });
  } catch (error) {
    console.error('Error al obtener actividades por objeto:', error);
    res.status(500).json({
      error: 'Error al obtener actividades por objeto',
      details: error.message
    });
  }
};

// Obtener actividades recientes
export const obtenerActividadesRecientesCtrl = async (req, res) => {
  try {
    const { limite = 20 } = req.query;
    const actividades = await obtenerActividadesRecientes(parseInt(limite));
    
    res.json({
      actividades,
      total: actividades.length,
      limite: parseInt(limite)
    });
  } catch (error) {
    console.error('Error al obtener actividades recientes:', error);
    res.status(500).json({
      error: 'Error al obtener actividades recientes',
      details: error.message
    });
  }
};

// Obtener actividades por fecha
export const obtenerActividadesPorFechaCtrl = async (req, res) => {
  try {
    const { fecha } = req.params;
    
    if (!fecha) {
      return res.status(400).json({
        error: 'Fecha es requerida'
      });
    }
    
    const actividades = await obtenerActividadesPorFecha(fecha);
    
    res.json({
      actividades,
      total: actividades.length,
      fecha
    });
  } catch (error) {
    console.error('Error al obtener actividades por fecha:', error);
    res.status(500).json({
      error: 'Error al obtener actividades por fecha',
      details: error.message
    });
  }
};

// Obtener estadísticas de actividades
export const obtenerEstadisticasActividadesCtrl = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasActividades();
    
    res.json({
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de actividades:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

// Log de creación (helper)
export const logCreacionCtrl = async (req, res) => {
  try {
    const { usuarioId, objetoAfectado, objetoId, detalles } = req.body;
    
    if (!usuarioId || !objetoAfectado || !objetoId) {
      return res.status(400).json({
        error: 'usuarioId, objetoAfectado y objetoId son requeridos'
      });
    }
    
    const actividad = await logCreacion(usuarioId, objetoAfectado, objetoId, detalles);
    
    res.status(201).json({
      message: 'Log de creación registrado',
      actividad
    });
  } catch (error) {
    console.error('Error al registrar log de creación:', error);
    res.status(500).json({
      error: 'Error al registrar log de creación',
      details: error.message
    });
  }
};

// Log de actualización (helper)
export const logActualizacionCtrl = async (req, res) => {
  try {
    const { usuarioId, objetoAfectado, objetoId, detalles } = req.body;
    
    if (!usuarioId || !objetoAfectado || !objetoId) {
      return res.status(400).json({
        error: 'usuarioId, objetoAfectado y objetoId son requeridos'
      });
    }
    
    const actividad = await logActualizacion(usuarioId, objetoAfectado, objetoId, detalles);
    
    res.status(201).json({
      message: 'Log de actualización registrado',
      actividad
    });
  } catch (error) {
    console.error('Error al registrar log de actualización:', error);
    res.status(500).json({
      error: 'Error al registrar log de actualización',
      details: error.message
    });
  }
};

// Log de eliminación (helper)
export const logEliminacionCtrl = async (req, res) => {
  try {
    const { usuarioId, objetoAfectado, objetoId, detalles } = req.body;
    
    if (!usuarioId || !objetoAfectado || !objetoId) {
      return res.status(400).json({
        error: 'usuarioId, objetoAfectado y objetoId son requeridos'
      });
    }
    
    const actividad = await logEliminacion(usuarioId, objetoAfectado, objetoId, detalles);
    
    res.status(201).json({
      message: 'Log de eliminación registrado',
      actividad
    });
  } catch (error) {
    console.error('Error al registrar log de eliminación:', error);
    res.status(500).json({
      error: 'Error al registrar log de eliminación',
      details: error.message
    });
  }
};

// Log de visualización (helper)
export const logVisualizacionCtrl = async (req, res) => {
  try {
    const { usuarioId, objetoAfectado, objetoId, detalles } = req.body;
    
    if (!usuarioId || !objetoAfectado || !objetoId) {
      return res.status(400).json({
        error: 'usuarioId, objetoAfectado y objetoId son requeridos'
      });
    }
    
    const actividad = await logVisualizacion(usuarioId, objetoAfectado, objetoId, detalles);
    
    res.status(201).json({
      message: 'Log de visualización registrado',
      actividad
    });
  } catch (error) {
    console.error('Error al registrar log de visualización:', error);
    res.status(500).json({
      error: 'Error al registrar log de visualización',
      details: error.message
    });
  }
};

// Buscar actividades
export const buscarActividadesCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const actividades = await obtenerActividades();
    const terminoBusqueda = q.toLowerCase();
    
    const actividadesFiltradas = actividades.filter(actividad => 
      actividad.detalles?.toLowerCase().includes(terminoBusqueda) ||
      actividad.objetoAfectado?.toLowerCase().includes(terminoBusqueda) ||
      actividad.tipoAccion?.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      actividades: actividadesFiltradas,
      total: actividadesFiltradas.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar actividades:', error);
    res.status(500).json({
      error: 'Error al buscar actividades',
      details: error.message
    });
  }
};

export default {
  crearActividadCtrl,
  obtenerActividadesCtrl,
  obtenerActividadPorIdCtrl,
  obtenerActividadesPorUsuarioCtrl,
  obtenerActividadesPorTipoAccionCtrl,
  obtenerActividadesPorObjetoCtrl,
  obtenerActividadesRecientesCtrl,
  obtenerActividadesPorFechaCtrl,
  obtenerEstadisticasActividadesCtrl,
  logCreacionCtrl,
  logActualizacionCtrl,
  logEliminacionCtrl,
  logVisualizacionCtrl,
  buscarActividadesCtrl
}; 