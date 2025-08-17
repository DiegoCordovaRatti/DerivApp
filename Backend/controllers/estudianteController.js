import {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  actualizarEstudiante,
  cambiarEstadoEstudiante,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesActivos,
  obtenerEstudiantesPorEstablecimiento,
  eliminarEstudiante,
  // Métodos de derivaciones
  crearDerivacion,
  obtenerDerivacionesEstudiante,
  obtenerDerivacionPorId,
  actualizarDerivacion,
  eliminarDerivacion,
  cambiarEstadoDerivacion,
  obtenerDerivacionesPorEstado,
  obtenerDerivacionesRecientes,
  // Métodos de seguimientos
  crearSeguimiento,
  obtenerSeguimientosDerivacion,
  obtenerSeguimientoPorId,
  actualizarSeguimiento,
  eliminarSeguimiento,
  // Estudiantes con derivaciones
  obtenerEstudiantesConDerivaciones
} from '../models/Estudiante.js';

// ===== CONTROLADORES DE ESTUDIANTES =====

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

// Cambiar estado de estudiante
export const cambiarEstadoEstudianteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;
    
    if (!nuevoEstado || !['activo', 'egresado', 'derivado'].includes(nuevoEstado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: activo, egresado o derivado'
      });
    }
    
    const resultado = await cambiarEstadoEstudiante(id, nuevoEstado);
    
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
    
    if (!['activo', 'egresado', 'derivado'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: activo, egresado o derivado'
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

// Obtener estudiantes por establecimiento
export const obtenerEstudiantesPorEstablecimientoCtrl = async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    if (!establecimientoId) {
      return res.status(400).json({
        error: 'ID del establecimiento es requerido'
      });
    }
    
    const estudiantes = await obtenerEstudiantesPorEstablecimiento(establecimientoId);
    
    res.json({
      estudiantes,
      total: estudiantes.length,
      establecimientoId
    });
  } catch (error) {
    console.error('Error al obtener estudiantes por establecimiento:', error);
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

// ===== CONTROLADORES DE DERIVACIONES =====

// Crear una nueva derivación
export const crearDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    console.log('Datos recibidos en crearDerivacionCtrl:', { estudianteId, body: req.body });
    const nuevaDerivacion = await crearDerivacion(estudianteId, req.body);
    console.log('Derivación creada:', nuevaDerivacion);
    
    res.status(201).json({
      message: 'Derivación creada exitosamente',
      derivacion: nuevaDerivacion
    });
  } catch (error) {
    console.error('Error al crear derivación:', error);
    res.status(400).json({
      error: 'Error al crear derivación',
      details: error.message
    });
  }
};

// Obtener derivaciones de un estudiante
export const obtenerDerivacionesEstudianteCtrl = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const derivaciones = await obtenerDerivacionesEstudiante(estudianteId);
    
    res.json({
      derivaciones,
      total: derivaciones.length,
      estudianteId
    });
  } catch (error) {
    console.error('Error al obtener derivaciones del estudiante:', error);
    res.status(500).json({
      error: 'Error al obtener derivaciones',
      details: error.message
    });
  }
};

// Obtener derivación por ID
export const obtenerDerivacionPorIdCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const derivacion = await obtenerDerivacionPorId(estudianteId, derivacionId);
    
    res.json({
      derivacion
    });
  } catch (error) {
    console.error('Error al obtener derivación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Derivación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al obtener derivación',
      details: error.message
    });
  }
};

// Actualizar derivación
export const actualizarDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const derivacionActualizada = await actualizarDerivacion(estudianteId, derivacionId, req.body);
    
    res.json({
      message: 'Derivación actualizada exitosamente',
      derivacion: derivacionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar derivación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Derivación no encontrada'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar derivación',
      details: error.message
    });
  }
};

// Cambiar estado de derivación
export const cambiarEstadoDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const { nuevoEstado } = req.body;
    
    if (!nuevoEstado || !['en_proceso', 'cerrado', 'en_alerta'].includes(nuevoEstado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: en_proceso, cerrado o en_alerta'
      });
    }
    
    const resultado = await cambiarEstadoDerivacion(estudianteId, derivacionId, nuevoEstado);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al cambiar estado de derivación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Derivación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al cambiar estado',
      details: error.message
    });
  }
};

// Obtener derivaciones por estado
export const obtenerDerivacionesPorEstadoCtrl = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!['en_proceso', 'cerrado', 'en_alerta'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: en_proceso, cerrado o en_alerta'
      });
    }
    
    const derivaciones = await obtenerDerivacionesPorEstado(estado);
    
    res.json({
      derivaciones,
      total: derivaciones.length,
      estado
    });
  } catch (error) {
    console.error('Error al obtener derivaciones por estado:', error);
    res.status(500).json({
      error: 'Error al obtener derivaciones',
      details: error.message
    });
  }
};

// Obtener derivaciones recientes
export const obtenerDerivacionesRecientesCtrl = async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const derivaciones = await obtenerDerivacionesRecientes(parseInt(limite));
    
    res.json({
      derivaciones,
      total: derivaciones.length,
      limite: parseInt(limite)
    });
  } catch (error) {
    console.error('Error al obtener derivaciones recientes:', error);
    res.status(500).json({
      error: 'Error al obtener derivaciones recientes',
      details: error.message
    });
  }
};

// Obtener todas las derivaciones para selección de eventos
export const obtenerTodasDerivacionesCtrl = async (req, res) => {
  try {
    console.log('🔍 Obteniendo todas las derivaciones...');
    const derivaciones = await obtenerEstudiantesConDerivaciones();
    console.log('👥 Estudiantes con derivaciones:', derivaciones.length);
    
    // Extraer solo las derivaciones con información básica del estudiante
    const derivacionesSimplificadas = [];
    derivaciones.forEach(estudiante => {
      if (estudiante.derivaciones && estudiante.derivaciones.length > 0) {
        console.log(`📋 Estudiante ${estudiante.nombre} tiene ${estudiante.derivaciones.length} derivaciones`);
        estudiante.derivaciones.forEach(derivacion => {
          derivacionesSimplificadas.push({
            id: derivacion.id,
            estudianteId: estudiante.id,
            estudiante: {
              nombre: estudiante.nombre,
              rut: estudiante.rut,
              curso: estudiante.curso
            },
            motivo: derivacion.motivo,
            descripcion: derivacion.descripcion,
            estado: derivacion.estado_derivacion,
            prioridad: derivacion.prioridad,
            fecha_creacion: derivacion.fecha_creacion
          });
        });
      } else {
        console.log(`⚠️ Estudiante ${estudiante.nombre} no tiene derivaciones`);
      }
    });
    
    console.log('🎯 Total derivaciones simplificadas:', derivacionesSimplificadas.length);
    
    res.json({
      derivaciones: derivacionesSimplificadas,
      total: derivacionesSimplificadas.length
    });
  } catch (error) {
    console.error('Error al obtener todas las derivaciones:', error);
    res.status(500).json({
      error: 'Error al obtener derivaciones',
      details: error.message
    });
  }
};

// Eliminar derivación
export const eliminarDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    
    const resultado = await eliminarDerivacion(estudianteId, derivacionId);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar derivación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Derivación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar derivación',
      details: error.message
    });
  }
};

// ===== CONTROLADORES DE SEGUIMIENTOS =====

// Crear un nuevo seguimiento
export const crearSeguimientoCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const datosSeguimiento = req.body;
    
    const nuevoSeguimiento = await crearSeguimiento(estudianteId, derivacionId, datosSeguimiento);
    
    res.status(201).json({
      message: 'Seguimiento creado exitosamente',
      seguimiento: nuevoSeguimiento
    });
  } catch (error) {
    console.error('Error al crear seguimiento:', error);
    res.status(400).json({
      error: 'Error al crear seguimiento',
      details: error.message
    });
  }
};

// Obtener todos los seguimientos de una derivación
export const obtenerSeguimientosDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    
    const seguimientos = await obtenerSeguimientosDerivacion(estudianteId, derivacionId);
    
    res.json({
      seguimientos,
      total: seguimientos.length
    });
  } catch (error) {
    console.error('Error al obtener seguimientos:', error);
    res.status(500).json({
      error: 'Error al obtener seguimientos',
      details: error.message
    });
  }
};

// Obtener un seguimiento específico
export const obtenerSeguimientoPorIdCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId, seguimientoId } = req.params;
    
    const seguimiento = await obtenerSeguimientoPorId(estudianteId, derivacionId, seguimientoId);
    
    res.json({
      seguimiento
    });
  } catch (error) {
    console.error('Error al obtener seguimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Seguimiento no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al obtener seguimiento',
      details: error.message
    });
  }
};

// Actualizar un seguimiento
export const actualizarSeguimientoCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId, seguimientoId } = req.params;
    const datosActualizados = req.body;
    
    const resultado = await actualizarSeguimiento(estudianteId, derivacionId, seguimientoId, datosActualizados);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al actualizar seguimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Seguimiento no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al actualizar seguimiento',
      details: error.message
    });
  }
};

// Eliminar un seguimiento
export const eliminarSeguimientoCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId, seguimientoId } = req.params;
    
    const resultado = await eliminarSeguimiento(estudianteId, derivacionId, seguimientoId);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar seguimiento:', error);
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({
        error: 'Seguimiento no encontrado'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar seguimiento',
      details: error.message
    });
  }
};

export default {
  // Métodos de estudiantes
  crearEstudianteCtrl,
  obtenerEstudiantesCtrl,
  obtenerEstudiantePorIdCtrl,
  obtenerEstudiantePorRutCtrl,
  actualizarEstudianteCtrl,
  cambiarEstadoEstudianteCtrl,
  obtenerEstudiantesPorEstadoCtrl,
  obtenerEstudiantesPorEstablecimientoCtrl,
  obtenerEstudiantesActivosCtrl,
  eliminarEstudianteCtrl,
  buscarEstudiantesCtrl,
  // Métodos de derivaciones
  crearDerivacionCtrl,
  obtenerDerivacionesEstudianteCtrl,
  obtenerDerivacionPorIdCtrl,
  actualizarDerivacionCtrl,
  eliminarDerivacionCtrl,
  cambiarEstadoDerivacionCtrl,
  obtenerDerivacionesPorEstadoCtrl,
  obtenerDerivacionesRecientesCtrl,
  obtenerTodasDerivacionesCtrl,
  // Métodos de seguimientos
  crearSeguimientoCtrl,
  obtenerSeguimientosDerivacionCtrl,
  obtenerSeguimientoPorIdCtrl,
  actualizarSeguimientoCtrl,
  eliminarSeguimientoCtrl
};
