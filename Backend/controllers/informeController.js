import {
  crearInforme,
  obtenerInformes,
  obtenerInformePorId,
  obtenerInformesPorCaso,
  obtenerInformesPorAutor,
  actualizarInforme,
  eliminarInforme
} from '../models/Informe.js';

// Crear un nuevo informe
export const crearInformeCtrl = async (req, res) => {
  try {
    const nuevoInforme = await crearInforme(req.body);
    
    res.status(201).json({
      message: 'Informe creado exitosamente',
      informe: nuevoInforme
    });
  } catch (error) {
    console.error('Error al crear informe:', error);
    res.status(400).json({
      error: 'Error al crear informe',
      details: error.message
    });
  }
};

// Obtener todos los informes
export const obtenerInformesCtrl = async (req, res) => {
  try {
    const informes = await obtenerInformes();
    
    res.json({
      informes,
      total: informes.length
    });
  } catch (error) {
    console.error('Error al obtener informes:', error);
    res.status(500).json({
      error: 'Error al obtener informes',
      details: error.message
    });
  }
};

// Obtener informe por ID
export const obtenerInformePorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const informe = await obtenerInformePorId(id);
    
    res.json({
      informe
    });
  } catch (error) {
    console.error('Error al obtener informe:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Informe no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener informe',
      details: error.message
    });
  }
};

// Obtener informes por caso
export const obtenerInformesPorCasoCtrl = async (req, res) => {
  try {
    const { caseId } = req.params;
    const informes = await obtenerInformesPorCaso(caseId);
    
    res.json({
      informes,
      total: informes.length,
      caseId
    });
  } catch (error) {
    console.error('Error al obtener informes del caso:', error);
    res.status(500).json({
      error: 'Error al obtener informes del caso',
      details: error.message
    });
  }
};

// Obtener informes por autor
export const obtenerInformesPorAutorCtrl = async (req, res) => {
  try {
    const { autorId } = req.params;
    const informes = await obtenerInformesPorAutor(autorId);
    
    res.json({
      informes,
      total: informes.length,
      autorId
    });
  } catch (error) {
    console.error('Error al obtener informes del autor:', error);
    res.status(500).json({
      error: 'Error al obtener informes del autor',
      details: error.message
    });
  }
};

// Actualizar informe
export const actualizarInformeCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const informeActualizado = await actualizarInforme(id, req.body);
    
    res.json({
      message: 'Informe actualizado exitosamente',
      informe: informeActualizado
    });
  } catch (error) {
    console.error('Error al actualizar informe:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Informe no encontrado'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar informe',
      details: error.message
    });
  }
};

// Eliminar informe
export const eliminarInformeCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarInforme(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar informe:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Informe no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar informe',
      details: error.message
    });
  }
};

export default {
  crearInformeCtrl,
  obtenerInformesCtrl,
  obtenerInformePorIdCtrl,
  obtenerInformesPorCasoCtrl,
  obtenerInformesPorAutorCtrl,
  actualizarInformeCtrl,
  eliminarInformeCtrl
}; 