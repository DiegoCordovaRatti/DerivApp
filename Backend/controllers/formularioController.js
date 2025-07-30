import {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  obtenerFormulariosPorDerivacion,
  obtenerFormulariosPorTipo,
  obtenerFormulariosPorCreador,
  obtenerFormulariosRecientes,
  generarFormularioIA
} from '../models/Formulario.js';

// Crear un nuevo formulario
export const crearFormularioCtrl = async (req, res) => {
  try {
    const nuevoFormulario = await crearFormulario(req.body);
    
    res.status(201).json({
      message: 'Formulario creado exitosamente',
      formulario: nuevoFormulario
    });
  } catch (error) {
    console.error('Error al crear formulario:', error);
    res.status(400).json({
      error: 'Error al crear formulario',
      details: error.message
    });
  }
};

// Obtener todos los formularios
export const obtenerFormulariosCtrl = async (req, res) => {
  try {
    const formularios = await obtenerFormularios();
    
    res.json({
      formularios,
      total: formularios.length
    });
  } catch (error) {
    console.error('Error al obtener formularios:', error);
    res.status(500).json({
      error: 'Error al obtener formularios',
      details: error.message
    });
  }
};

// Obtener formulario por ID
export const obtenerFormularioPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const formulario = await obtenerFormularioPorId(id);
    
    res.json({
      formulario
    });
  } catch (error) {
    console.error('Error al obtener formulario:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Formulario no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener formulario',
      details: error.message
    });
  }
};

// Actualizar formulario
export const actualizarFormularioCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const formularioActualizado = await actualizarFormulario(id, req.body);
    
    res.json({
      message: 'Formulario actualizado exitosamente',
      formulario: formularioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar formulario:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Formulario no encontrado'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar formulario',
      details: error.message
    });
  }
};

// Eliminar formulario
export const eliminarFormularioCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarFormulario(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar formulario:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Formulario no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar formulario',
      details: error.message
    });
  }
};

// Obtener formularios por derivación
export const obtenerFormulariosPorDerivacionCtrl = async (req, res) => {
  try {
    const { derivacionId } = req.params;
    const formularios = await obtenerFormulariosPorDerivacion(derivacionId);
    
    res.json({
      formularios,
      total: formularios.length,
      derivacionId
    });
  } catch (error) {
    console.error('Error al obtener formularios de la derivación:', error);
    res.status(500).json({
      error: 'Error al obtener formularios de la derivación',
      details: error.message
    });
  }
};

// Obtener formularios por tipo
export const obtenerFormulariosPorTipoCtrl = async (req, res) => {
  try {
    const { tipo } = req.params;
    
    if (!['informe_intervencion', 'plan_acción'].includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo inválido. Debe ser: informe_intervencion o plan_acción'
      });
    }
    
    const formularios = await obtenerFormulariosPorTipo(tipo);
    
    res.json({
      formularios,
      total: formularios.length,
      tipo
    });
  } catch (error) {
    console.error('Error al obtener formularios por tipo:', error);
    res.status(500).json({
      error: 'Error al obtener formularios por tipo',
      details: error.message
    });
  }
};

// Obtener formularios por creador
export const obtenerFormulariosPorCreadorCtrl = async (req, res) => {
  try {
    const { creadoPor } = req.params;
    const formularios = await obtenerFormulariosPorCreador(creadoPor);
    
    res.json({
      formularios,
      total: formularios.length,
      creadoPor
    });
  } catch (error) {
    console.error('Error al obtener formularios del creador:', error);
    res.status(500).json({
      error: 'Error al obtener formularios del creador',
      details: error.message
    });
  }
};

// Obtener formularios recientes
export const obtenerFormulariosRecientesCtrl = async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const formularios = await obtenerFormulariosRecientes(parseInt(limite));
    
    res.json({
      formularios,
      total: formularios.length,
      limite: parseInt(limite)
    });
  } catch (error) {
    console.error('Error al obtener formularios recientes:', error);
    res.status(500).json({
      error: 'Error al obtener formularios recientes',
      details: error.message
    });
  }
};

// Generar formulario con IA
export const generarFormularioIACtrl = async (req, res) => {
  try {
    const formularioGenerado = await generarFormularioIA(req.body);
    
    res.status(201).json({
      message: 'Formulario generado con IA exitosamente',
      formulario: formularioGenerado
    });
  } catch (error) {
    console.error('Error al generar formulario con IA:', error);
    res.status(400).json({
      error: 'Error al generar formulario con IA',
      details: error.message
    });
  }
};

// Obtener informes de intervención
export const obtenerInformesIntervencionCtrl = async (req, res) => {
  try {
    const formularios = await obtenerFormulariosPorTipo('informe_intervencion');
    
    res.json({
      informes: formularios,
      total: formularios.length
    });
  } catch (error) {
    console.error('Error al obtener informes de intervención:', error);
    res.status(500).json({
      error: 'Error al obtener informes de intervención',
      details: error.message
    });
  }
};

// Obtener planes de acción
export const obtenerPlanesAccionCtrl = async (req, res) => {
  try {
    const formularios = await obtenerFormulariosPorTipo('plan_acción');
    
    res.json({
      planes: formularios,
      total: formularios.length
    });
  } catch (error) {
    console.error('Error al obtener planes de acción:', error);
    res.status(500).json({
      error: 'Error al obtener planes de acción',
      details: error.message
    });
  }
};

// Buscar formularios
export const buscarFormulariosCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const formularios = await obtenerFormularios();
    const terminoBusqueda = q.toLowerCase();
    
    const formulariosFiltrados = formularios.filter(formulario => 
      formulario.contenido?.toLowerCase().includes(terminoBusqueda) ||
      formulario.tipo?.toLowerCase().includes(terminoBusqueda) ||
      formulario.derivacionId?.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      formularios: formulariosFiltrados,
      total: formulariosFiltrados.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar formularios:', error);
    res.status(500).json({
      error: 'Error al buscar formularios',
      details: error.message
    });
  }
};

// Obtener estadísticas de formularios
export const obtenerEstadisticasFormulariosCtrl = async (req, res) => {
  try {
    const formularios = await obtenerFormularios();
    
    const estadisticas = {
      total: formularios.length,
      porTipo: {
        informe_intervencion: 0,
        plan_acción: 0
      },
      generadosPorIA: 0,
      porMes: {}
    };
    
    formularios.forEach(formulario => {
      // Contar por tipo
      if (estadisticas.porTipo[formulario.tipo] !== undefined) {
        estadisticas.porTipo[formulario.tipo]++;
      }
      
      // Contar generados por IA
      if (formulario.generado_por_ia) {
        estadisticas.generadosPorIA++;
      }
      
      // Contar por mes
      const fecha = formulario.fecha_creacion.toDate ? formulario.fecha_creacion.toDate() : new Date(formulario.fecha_creacion);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      estadisticas.porMes[mes] = (estadisticas.porMes[mes] || 0) + 1;
    });
    
    res.json({
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de formularios:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

export default {
  crearFormularioCtrl,
  obtenerFormulariosCtrl,
  obtenerFormularioPorIdCtrl,
  actualizarFormularioCtrl,
  eliminarFormularioCtrl,
  obtenerFormulariosPorDerivacionCtrl,
  obtenerFormulariosPorTipoCtrl,
  obtenerFormulariosPorCreadorCtrl,
  obtenerFormulariosRecientesCtrl,
  generarFormularioIACtrl,
  obtenerInformesIntervencionCtrl,
  obtenerPlanesAccionCtrl,
  buscarFormulariosCtrl,
  obtenerEstadisticasFormulariosCtrl
}; 