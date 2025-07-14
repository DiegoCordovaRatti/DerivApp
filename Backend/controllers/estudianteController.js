import {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  actualizarEstudiante,
  agregarNotaEstudiante,
  cambiarEstadoEstudiante,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesActivos,
  eliminarEstudiante
} from '../models/Estudiante.js';

// Crear un nuevo estudiante
export const crearEstudianteCtrl = async (req, res) => {
  try {
    const nuevoEstudiante = await crearEstudiante(req.body);
    
    res.status(201).json({
      message: 'Estudiante creado exitosamente',
      estudiante: nuevoEstudiante
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(400).json({
      error: 'Error al crear estudiante',
      details: error.message
    });
  }
};

// Obtener todos los estudiantes
export const obtenerEstudiantesCtrl = async (req, res) => {
  try {
    const estudiantes = await obtenerEstudiantes();
    
    res.json({
      estudiantes,
      total: estudiantes.length
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({
      error: 'Error al obtener estudiantes',
      details: error.message
    });
  }
};

// Obtener estudiante por ID
export const obtenerEstudiantePorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await obtenerEstudiantePorId(id);
    
    res.json({
      estudiante
    });
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener estudiante',
      details: error.message
    });
  }
};

// Obtener estudiante por RUT
export const obtenerEstudiantePorRutCtrl = async (req, res) => {
  try {
    const { rut } = req.params;
    const estudiante = await obtenerEstudiantePorRut(rut);
    
    if (!estudiante) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    
    res.json({
      estudiante
    });
  } catch (error) {
    console.error('Error al buscar estudiante por RUT:', error);
    res.status(500).json({
      error: 'Error al buscar estudiante',
      details: error.message
    });
  }
};

// Actualizar estudiante
export const actualizarEstudianteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteActualizado = await actualizarEstudiante(id, req.body);
    
    res.json({
      message: 'Estudiante actualizado exitosamente',
      estudiante: estudianteActualizado
    });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar estudiante',
      details: error.message
    });
  }
};

// Agregar nota a estudiante
export const agregarNotaEstudianteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota } = req.body;
    
    if (!nota || nota.trim().length === 0) {
      return res.status(400).json({
        error: 'La nota es requerida'
      });
    }
    
    const resultado = await agregarNotaEstudiante(id, nota);
    
    res.json({
      message: resultado.message,
      notas: resultado.notas
    });
  } catch (error) {
    console.error('Error al agregar nota:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al agregar nota',
      details: error.message
    });
  }
};

// Cambiar estado de estudiante
export const cambiarEstadoEstudianteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado, fechaEgreso } = req.body;
    
    if (!nuevoEstado || !['activo', 'inactivo', 'egresado'].includes(nuevoEstado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: activo, inactivo o egresado'
      });
    }
    
    const resultado = await cambiarEstadoEstudiante(id, nuevoEstado, fechaEgreso);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al cambiar estado',
      details: error.message
    });
  }
};

// Obtener estudiantes por estado
export const obtenerEstudiantesPorEstadoCtrl = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!['activo', 'inactivo', 'egresado'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: activo, inactivo o egresado'
      });
    }
    
    const estudiantes = await obtenerEstudiantesPorEstado(estado);
    
    res.json({
      estudiantes,
      total: estudiantes.length,
      estado
    });
  } catch (error) {
    console.error('Error al obtener estudiantes por estado:', error);
    res.status(500).json({
      error: 'Error al obtener estudiantes',
      details: error.message
    });
  }
};

// Obtener estudiantes activos
export const obtenerEstudiantesActivosCtrl = async (req, res) => {
  try {
    const estudiantes = await obtenerEstudiantesActivos();
    
    res.json({
      estudiantes,
      total: estudiantes.length
    });
  } catch (error) {
    console.error('Error al obtener estudiantes activos:', error);
    res.status(500).json({
      error: 'Error al obtener estudiantes activos',
      details: error.message
    });
  }
};

// Eliminar estudiante
export const eliminarEstudianteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarEstudiante(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Estudiante no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar estudiante',
      details: error.message
    });
  }
};

// Buscar estudiantes (búsqueda por nombre o RUT)
export const buscarEstudiantesCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const estudiantes = await obtenerEstudiantes();
    const terminoBusqueda = q.toLowerCase();
    
    const estudiantesFiltrados = estudiantes.filter(estudiante => 
      estudiante.nombre.toLowerCase().includes(terminoBusqueda) ||
      estudiante.rut.includes(terminoBusqueda) ||
      estudiante.curso.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      estudiantes: estudiantesFiltrados,
      total: estudiantesFiltrados.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar estudiantes:', error);
    res.status(500).json({
      error: 'Error al buscar estudiantes',
      details: error.message
    });
  }
};

export default {
  crearEstudianteCtrl,
  obtenerEstudiantesCtrl,
  obtenerEstudiantePorIdCtrl,
  obtenerEstudiantePorRutCtrl,
  actualizarEstudianteCtrl,
  agregarNotaEstudianteCtrl,
  cambiarEstadoEstudianteCtrl,
  obtenerEstudiantesPorEstadoCtrl,
  obtenerEstudiantesActivosCtrl,
  eliminarEstudianteCtrl,
  buscarEstudiantesCtrl
};
