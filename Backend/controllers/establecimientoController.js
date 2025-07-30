import {
  crearEstablecimiento,
  obtenerEstablecimientos,
  obtenerEstablecimientoPorId,
  actualizarEstablecimiento,
  eliminarEstablecimiento,
  agregarUsuarioAEquipo,
  removerUsuarioDeEquipo,
  obtenerEstablecimientosPorComuna,
  obtenerEstablecimientosPorRegion
} from '../models/Establecimiento.js';

// Crear un nuevo establecimiento
export const crearEstablecimientoCtrl = async (req, res) => {
  try {
    const nuevoEstablecimiento = await crearEstablecimiento(req.body);
    
    res.status(201).json({
      message: 'Establecimiento creado exitosamente',
      establecimiento: nuevoEstablecimiento
    });
  } catch (error) {
    console.error('Error al crear establecimiento:', error);
    res.status(400).json({
      error: 'Error al crear establecimiento',
      details: error.message
    });
  }
};

// Obtener todos los establecimientos
export const obtenerEstablecimientosCtrl = async (req, res) => {
  try {
    const establecimientos = await obtenerEstablecimientos();
    
    res.json({
      establecimientos,
      total: establecimientos.length
    });
  } catch (error) {
    console.error('Error al obtener establecimientos:', error);
    res.status(500).json({
      error: 'Error al obtener establecimientos',
      details: error.message
    });
  }
};

// Obtener establecimiento por ID
export const obtenerEstablecimientoPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const establecimiento = await obtenerEstablecimientoPorId(id);
    
    res.json({
      establecimiento
    });
  } catch (error) {
    console.error('Error al obtener establecimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener establecimiento',
      details: error.message
    });
  }
};

// Actualizar establecimiento
export const actualizarEstablecimientoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const establecimientoActualizado = await actualizarEstablecimiento(id, req.body);
    
    res.json({
      message: 'Establecimiento actualizado exitosamente',
      establecimiento: establecimientoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar establecimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar establecimiento',
      details: error.message
    });
  }
};

// Eliminar establecimiento
export const eliminarEstablecimientoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarEstablecimiento(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar establecimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar establecimiento',
      details: error.message
    });
  }
};

// Agregar usuario al equipo psicosocial
export const agregarUsuarioAEquipoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;
    
    if (!usuarioId) {
      return res.status(400).json({
        error: 'ID del usuario es requerido'
      });
    }
    
    const resultado = await agregarUsuarioAEquipo(id, usuarioId);
    
    res.json({
      message: resultado.message,
      equipoPsicosocial: resultado.equipoPsicosocial
    });
  } catch (error) {
    console.error('Error al agregar usuario al equipo:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado'
      });
    }
    if (error.message.includes('ya existe')) {
      return res.status(400).json({
        error: 'El usuario ya está en el equipo psicosocial'
      });
    }
    res.status(500).json({
      error: 'Error al agregar usuario al equipo',
      details: error.message
    });
  }
};

// Remover usuario del equipo psicosocial
export const removerUsuarioDeEquipoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;
    
    if (!usuarioId) {
      return res.status(400).json({
        error: 'ID del usuario es requerido'
      });
    }
    
    const resultado = await removerUsuarioDeEquipo(id, usuarioId);
    
    res.json({
      message: resultado.message,
      equipoPsicosocial: resultado.equipoPsicosocial
    });
  } catch (error) {
    console.error('Error al remover usuario del equipo:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado'
      });
    }
    if (error.message.includes('no está en el equipo')) {
      return res.status(400).json({
        error: 'El usuario no está en el equipo psicosocial'
      });
    }
    res.status(500).json({
      error: 'Error al remover usuario del equipo',
      details: error.message
    });
  }
};

// Obtener establecimientos por comuna
export const obtenerEstablecimientosPorComunaCtrl = async (req, res) => {
  try {
    const { comuna } = req.params;
    
    if (!comuna || comuna.trim().length === 0) {
      return res.status(400).json({
        error: 'Comuna es requerida'
      });
    }
    
    const establecimientos = await obtenerEstablecimientosPorComuna(comuna);
    
    res.json({
      establecimientos,
      total: establecimientos.length,
      comuna
    });
  } catch (error) {
    console.error('Error al obtener establecimientos por comuna:', error);
    res.status(500).json({
      error: 'Error al obtener establecimientos',
      details: error.message
    });
  }
};

// Obtener establecimientos por región
export const obtenerEstablecimientosPorRegionCtrl = async (req, res) => {
  try {
    const { region } = req.params;
    
    if (!region || region.trim().length === 0) {
      return res.status(400).json({
        error: 'Región es requerida'
      });
    }
    
    const establecimientos = await obtenerEstablecimientosPorRegion(region);
    
    res.json({
      establecimientos,
      total: establecimientos.length,
      region
    });
  } catch (error) {
    console.error('Error al obtener establecimientos por región:', error);
    res.status(500).json({
      error: 'Error al obtener establecimientos',
      details: error.message
    });
  }
};

// Buscar establecimientos
export const buscarEstablecimientosCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const establecimientos = await obtenerEstablecimientos();
    const terminoBusqueda = q.toLowerCase();
    
    const establecimientosFiltrados = establecimientos.filter(establecimiento => 
      establecimiento.nombre.toLowerCase().includes(terminoBusqueda) ||
      establecimiento.comuna.toLowerCase().includes(terminoBusqueda) ||
      establecimiento.region.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      establecimientos: establecimientosFiltrados,
      total: establecimientosFiltrados.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar establecimientos:', error);
    res.status(500).json({
      error: 'Error al buscar establecimientos',
      details: error.message
    });
  }
};

export default {
  crearEstablecimientoCtrl,
  obtenerEstablecimientosCtrl,
  obtenerEstablecimientoPorIdCtrl,
  actualizarEstablecimientoCtrl,
  eliminarEstablecimientoCtrl,
  agregarUsuarioAEquipoCtrl,
  removerUsuarioDeEquipoCtrl,
  obtenerEstablecimientosPorComunaCtrl,
  obtenerEstablecimientosPorRegionCtrl,
  buscarEstablecimientosCtrl
}; 