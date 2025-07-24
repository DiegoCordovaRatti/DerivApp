import {
  crearCaso,
  obtenerCasos,
  obtenerCasoPorId,
  obtenerCasosPorEstudiante,
  obtenerCasosPorResponsable,
  obtenerCasosPorEstado,
  actualizarCaso,
  cambiarEstadoCaso,
  cerrarCaso,
  obtenerCasosActivos,
  obtenerCasosPendientes,
  eliminarCaso
} from '../models/Caso.js';

// Crear un nuevo caso
export const crearCasoCtrl = async (req, res) => {
  try {
    const nuevoCaso = await crearCaso(req.body);
    
    res.status(201).json({
      message: 'Caso creado exitosamente',
      caso: nuevoCaso
    });
  } catch (error) {
    console.error('Error al crear caso:', error);
    res.status(400).json({
      error: 'Error al crear caso',
      details: error.message
    });
  }
};

// Obtener todos los casos
export const obtenerCasosCtrl = async (req, res) => {
  try {
    const casos = await obtenerCasos();
    
    res.json({
      casos,
      total: casos.length
    });
  } catch (error) {
    console.error('Error al obtener casos:', error);
    res.status(500).json({
      error: 'Error al obtener casos',
      details: error.message
    });
  }
};

// Obtener caso por ID
export const obtenerCasoPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const caso = await obtenerCasoPorId(id);
    
    res.json({
      caso
    });
  } catch (error) {
    console.error('Error al obtener caso:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Caso no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener caso',
      details: error.message
    });
  }
};

// Obtener casos por estudiante
export const obtenerCasosPorEstudianteCtrl = async (req, res) => {
  try {
    const { studentId } = req.params;
    const casos = await obtenerCasosPorEstudiante(studentId);
    
    res.json({
      casos,
      total: casos.length,
      studentId
    });
  } catch (error) {
    console.error('Error al obtener casos del estudiante:', error);
    res.status(500).json({
      error: 'Error al obtener casos del estudiante',
      details: error.message
    });
  }
};

// Obtener casos por responsable
export const obtenerCasosPorResponsableCtrl = async (req, res) => {
  try {
    const { responsableId } = req.params;
    const casos = await obtenerCasosPorResponsable(responsableId);
    
    res.json({
      casos,
      total: casos.length,
      responsableId
    });
  } catch (error) {
    console.error('Error al obtener casos del responsable:', error);
    res.status(500).json({
      error: 'Error al obtener casos del responsable',
      details: error.message
    });
  }
};

// Obtener casos por estado
export const obtenerCasosPorEstadoCtrl = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!['en seguimiento', 'cerrado', 'archivado', 'pendiente'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: en seguimiento, cerrado, archivado o pendiente'
      });
    }
    
    const casos = await obtenerCasosPorEstado(estado);
    
    res.json({
      casos,
      total: casos.length,
      estado
    });
  } catch (error) {
    console.error('Error al obtener casos por estado:', error);
    res.status(500).json({
      error: 'Error al obtener casos por estado',
      details: error.message
    });
  }
};

// Actualizar caso
export const actualizarCasoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const casoActualizado = await actualizarCaso(id, req.body);
    
    res.json({
      message: 'Caso actualizado exitosamente',
      caso: casoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar caso:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Caso no encontrado'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar caso',
      details: error.message
    });
  }
};

// Cambiar estado de caso
export const cambiarEstadoCasoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;
    
    if (!nuevoEstado || !['en seguimiento', 'cerrado', 'archivado', 'pendiente'].includes(nuevoEstado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: en seguimiento, cerrado, archivado o pendiente'
      });
    }
    
    const resultado = await cambiarEstadoCaso(id, nuevoEstado);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al cambiar estado del caso:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Caso no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al cambiar estado del caso',
      details: error.message
    });
  }
};

// Cerrar caso
export const cerrarCasoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await cerrarCaso(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al cerrar caso:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Caso no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al cerrar caso',
      details: error.message
    });
  }
};

// Obtener casos activos
export const obtenerCasosActivosCtrl = async (req, res) => {
  try {
    const casos = await obtenerCasosActivos();
    
    res.json({
      casos,
      total: casos.length
    });
  } catch (error) {
    console.error('Error al obtener casos activos:', error);
    res.status(500).json({
      error: 'Error al obtener casos activos',
      details: error.message
    });
  }
};

// Obtener casos pendientes
export const obtenerCasosPendientesCtrl = async (req, res) => {
  try {
    const casos = await obtenerCasosPendientes();
    
    res.json({
      casos,
      total: casos.length
    });
  } catch (error) {
    console.error('Error al obtener casos pendientes:', error);
    res.status(500).json({
      error: 'Error al obtener casos pendientes',
      details: error.message
    });
  }
};

// Eliminar caso
export const eliminarCasoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarCaso(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar caso:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Caso no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar caso',
      details: error.message
    });
  }
};

// Buscar casos (búsqueda por motivo o estudiante)
export const buscarCasosCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 3) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 3 caracteres'
      });
    }
    
    const casos = await obtenerCasos();
    const terminoBusqueda = q.toLowerCase();
    
    const casosFiltrados = casos.filter(caso => 
      caso.motivo.toLowerCase().includes(terminoBusqueda) ||
      caso.studentId.toLowerCase().includes(terminoBusqueda) ||
      caso.responsableId.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      casos: casosFiltrados,
      total: casosFiltrados.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar casos:', error);
    res.status(500).json({
      error: 'Error al buscar casos',
      details: error.message
    });
  }
};

// Obtener estadísticas de casos
export const obtenerEstadisticasCasosCtrl = async (req, res) => {
  try {
    const casos = await obtenerCasos();
    
    const estadisticas = {
      total: casos.length,
      porEstado: {
        'en seguimiento': casos.filter(c => c.estado === 'en seguimiento').length,
        'cerrado': casos.filter(c => c.estado === 'cerrado').length,
        'archivado': casos.filter(c => c.estado === 'archivado').length,
        'pendiente': casos.filter(c => c.estado === 'pendiente').length
      },
      recientes: casos
        .filter(c => {
          const fecha = new Date(c.fechaApertura);
          const hace30Dias = new Date();
          hace30Dias.setDate(hace30Dias.getDate() - 30);
          return fecha >= hace30Dias;
        })
        .length
    };
    
    res.json({
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

export default {
  crearCasoCtrl,
  obtenerCasosCtrl,
  obtenerCasoPorIdCtrl,
  obtenerCasosPorEstudianteCtrl,
  obtenerCasosPorResponsableCtrl,
  obtenerCasosPorEstadoCtrl,
  actualizarCasoCtrl,
  cambiarEstadoCasoCtrl,
  cerrarCasoCtrl,
  obtenerCasosActivosCtrl,
  obtenerCasosPendientesCtrl,
  eliminarCasoCtrl,
  buscarCasosCtrl,
  obtenerEstadisticasCasosCtrl
}; 