import { db } from '../config/fireBaseDB.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  collectionGroup,
  orderBy,
  limit
} from "firebase/firestore";

// Validación de datos de estudiante
const validarEstudiante = (estudiante) => {
  const errores = [];
  
  if (!estudiante.nombre || estudiante.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!estudiante.rut || !/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(estudiante.rut)) {
    errores.push("El RUT debe tener formato válido (ej: 12.345.678-9)");
  }
  
  if (!estudiante.curso || estudiante.curso.trim().length < 2) {
    errores.push("El curso es obligatorio");
  }
  
  if (!estudiante.establecimientoId || estudiante.establecimientoId.trim().length === 0) {
    errores.push("El ID del establecimiento es obligatorio");
  }
  
  if (!estudiante.estado || !['activo', 'egresado', 'derivado'].includes(estudiante.estado)) {
    errores.push("El estado debe ser: activo, egresado o derivado");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo estudiante
export const crearEstudiante = async (datosEstudiante) => {
  try {
    const validacion = validarEstudiante(datosEstudiante);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const estudianteData = {
      ...datosEstudiante,
      estado: datosEstudiante.estado || 'activo',
      telegram_id: datosEstudiante.telegram_id || null, // ID de Telegram para notificaciones automáticas
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "estudiantes"), estudianteData);
    return { id: docRef.id, ...estudianteData };
  } catch (error) {
    throw new Error(`Error al crear estudiante: ${error.message}`);
  }
};

// Obtener todos los estudiantes
export const obtenerEstudiantes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "estudiantes"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }
};

// Obtener estudiante por ID
export const obtenerEstudiantePorId = async (id) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Estudiante no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener estudiante: ${error.message}`);
  }
};

// Obtener estudiante por RUT
export const obtenerEstudiantePorRut = async (rut) => {
  try {
    const q = query(collection(db, "estudiantes"), where("rut", "==", rut));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al buscar estudiante por RUT: ${error.message}`);
  }
};

// Obtener estudiantes por establecimiento
export const obtenerEstudiantesPorEstablecimiento = async (establecimientoId) => {
  try {
    const q = query(collection(db, "estudiantes"), where("establecimientoId", "==", establecimientoId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes por establecimiento: ${error.message}`);
  }
};

// Obtener estudiantes por estado
export const obtenerEstudiantesPorEstado = async (estado) => {
  try {
    const q = query(collection(db, "estudiantes"), where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes por estado: ${error.message}`);
  }
};

// Obtener estudiantes activos
export const obtenerEstudiantesActivos = async () => {
  try {
    const q = query(collection(db, "estudiantes"), where("estado", "==", "activo"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes activos: ${error.message}`);
  }
};

// Actualizar estudiante
export const actualizarEstudiante = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.nombre || datosActualizados.rut || datosActualizados.curso) {
      const estudianteActual = await obtenerEstudiantePorId(id);
      const datosCompletos = { ...estudianteActual, ...datosActualizados };
      const validacion = validarEstudiante(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    const datosConTimestamp = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar estudiante: ${error.message}`);
  }
};

// Cambiar estado de estudiante
export const cambiarEstadoEstudiante = async (id, nuevoEstado) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    await updateDoc(docRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    return { message: `Estudiante ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado: ${error.message}`);
  }
};

// Actualizar Telegram ID de estudiante
export const actualizarTelegramId = async (id, telegramId) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    await updateDoc(docRef, {
      telegram_id: telegramId,
      fecha_actualizacion: new Date()
    });
    return { message: "Telegram ID actualizado correctamente" };
  } catch (error) {
    throw new Error(`Error al actualizar Telegram ID: ${error.message}`);
  }
};

// Buscar estudiante por Telegram ID
export const obtenerEstudiantePorTelegramId = async (telegramId) => {
  try {
    const q = query(collection(db, "estudiantes"), where("telegram_id", "==", telegramId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al buscar estudiante por Telegram ID: ${error.message}`);
  }
};

// Eliminar estudiante
export const eliminarEstudiante = async (id) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    await deleteDoc(docRef);
    return { message: "Estudiante eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar estudiante: ${error.message}`);
  }
};

// ===== MÉTODOS PARA SUBCOLECCIÓN DERIVACIONES =====

// Crear una nueva derivación para un estudiante
export const crearDerivacion = async (estudianteId, datosDerivacion) => {
  try {
    const derivacionData = {
      ...datosDerivacion,
      fecha_derivacion: new Date(datosDerivacion.fecha_derivacion || new Date()),
      estado: datosDerivacion.estado || 'en_proceso',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const derivacionRef = collection(db, "estudiantes", estudianteId, "derivaciones");
    const docRef = await addDoc(derivacionRef, derivacionData);
    return { id: docRef.id, ...derivacionData };
  } catch (error) {
    throw new Error(`Error al crear derivación: ${error.message}`);
  }
};

// Obtener todas las derivaciones de un estudiante
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  try {
    const derivacionesRef = collection(db, "estudiantes", estudianteId, "derivaciones");
    const querySnapshot = await getDocs(derivacionesRef);
    
    // Obtener derivaciones y sus seguimientos
    const derivacionesConSeguimientos = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const derivacion = { id: doc.id, ...doc.data() };
        
        try {
          // Obtener seguimientos de esta derivación
          const seguimientosRef = collection(db, "estudiantes", estudianteId, "derivaciones", doc.id, "seguimientos");
          const seguimientosSnapshot = await getDocs(seguimientosRef);
          const seguimientos = seguimientosSnapshot.docs.map(seguimientoDoc => ({
            id: seguimientoDoc.id,
            ...seguimientoDoc.data()
          }));
          
          return {
            ...derivacion,
            seguimientos: seguimientos
          };
        } catch (error) {
          console.error(`Error al cargar seguimientos para derivación ${doc.id}:`, error);
          return {
            ...derivacion,
            seguimientos: []
          };
        }
      })
    );
    
    return derivacionesConSeguimientos;
  } catch (error) {
    throw new Error(`Error al obtener derivaciones del estudiante: ${error.message}`);
  }
};

// Obtener una derivación específica
export const obtenerDerivacionPorId = async (estudianteId, derivacionId) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    const docSnap = await getDoc(derivacionRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Derivación no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener derivación: ${error.message}`);
  }
};

// Actualizar derivación
export const actualizarDerivacion = async (estudianteId, derivacionId, datosActualizados) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    
    const datosConTimestamp = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(derivacionRef, datosConTimestamp);
    
    // Actualizar automáticamente la alerta de la derivación
    await actualizarAlertaDerivacion(estudianteId, derivacionId);
    
    return { id: derivacionId, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar derivación: ${error.message}`);
  }
};

// Cambiar estado de derivación
export const cambiarEstadoDerivacion = async (estudianteId, derivacionId, nuevoEstado) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    await updateDoc(derivacionRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    
    // Actualizar automáticamente la alerta de la derivación
    await actualizarAlertaDerivacion(estudianteId, derivacionId);
    
    return { message: `Derivación ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado de derivación: ${error.message}`);
  }
};

// Obtener derivaciones por estado
export const obtenerDerivacionesPorEstado = async (estado) => {
  try {
    // Usar collectionGroup para buscar en todas las subcolecciones de derivaciones
    const derivacionesRef = collectionGroup(db, "derivaciones");
    const q = query(derivacionesRef, where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener derivaciones por estado: ${error.message}`);
  }
};

// Obtener derivaciones recientes
export const obtenerDerivacionesRecientes = async (limite = 10) => {
  try {
    const derivacionesRef = collectionGroup(db, "derivaciones");
    const q = query(
      derivacionesRef, 
      orderBy("fecha_derivacion", "desc"), 
      limit(limite)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener derivaciones recientes: ${error.message}`);
  }
};

// Eliminar derivación
export const eliminarDerivacion = async (estudianteId, derivacionId) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    
    // Verificar que la derivación existe
    const docSnap = await getDoc(derivacionRef);
    if (!docSnap.exists()) {
      throw new Error("Derivación no encontrada");
    }
    
    await deleteDoc(derivacionRef);
    return { message: "Derivación eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar derivación: ${error.message}`);
  }
};

// Función para calcular el nivel de alerta basado en seguimientos y derivación
const calcularNivelAlerta = (seguimientos, derivacion) => {
  try {
    // Paso 1: Asignación de valores a los seguimientos (vᵢ)
    const valoresResultado = {
      'positivo': -1,    // Avance positivo → valor negativo (mejora)
      'negativo': 1,     // Retroceso/crítico → valor positivo (empeoramiento)
      'neutro': 0,       // Neutral → valor cero
      'pendiente': 0     // Pendiente → valor cero (neutral)
    };

    // Paso 2: Definir la prioridad del caso (P)
    const valoresPrioridad = {
      'baja': 1,
      'media': 2,
      'alta': 3
    };

    // Paso 3: Considerar el estado del caso (E)
    const valoresEstado = {
      'abierta': 1,      // Caso abierto → permite evaluación
      'cerrada': 0,      // Caso cerrado → anula el score
      'en_proceso': 1,   // En proceso → considerado abierto
      'resuelto': 0      // Resuelto → considerado cerrado
    };

    // Obtener valores de la derivación
    const prioridad = derivacion.prioridad || 'baja';
    const estado = derivacion.estado_derivacion || derivacion.estado || 'abierta';
    
    const P = valoresPrioridad[prioridad.toLowerCase()] || 1;
    const E = valoresEstado[estado.toLowerCase()] || 1;
    const n = seguimientos ? seguimientos.length : 0;

    // Si el caso está cerrado, no hay alerta
    if (E === 0) {
      return {
        scoreReal: 0,
        scoreNormalizado: 0,
        nivelAlerta: 'Sin riesgo / Bajo'
      };
    }

    // Paso 4: Calcular el puntaje total (Sᵣ)
    let sumaSeguimientos = 0;
    if (seguimientos && seguimientos.length > 0) {
      seguimientos.forEach(seguimiento => {
        const valor = valoresResultado[seguimiento.resultado?.toLowerCase()] || 0;
        sumaSeguimientos += valor;
      });
    }

    // Fórmula: Sᵣ = (Σᵢ₌₁ⁿ vᵢ) · P · E
    const Sr = sumaSeguimientos * P * E;

    // Paso 5: Calcular el puntaje máximo y mínimo posibles
    // S_max = n · 1 · P · E = n · P · E
    const S_max = n * P * E;
    // S_min = n · (-1) · P · E = -n · P · E
    const S_min = -n * P * E;

    // Paso 6: Normalizar el puntaje (Sₙ)
    let Sn = 0;
    if (S_max !== S_min) {
      // Fórmula: Sₙ = ((Sᵣ - S_min) / (S_max - S_min)) * 100
      // Simplificada: Sₙ = ((Sᵣ + nPE) / (2nPE)) * 100
      Sn = ((Sr - S_min) / (S_max - S_min)) * 100;
      // Asegurar que esté en el rango 0-100
      Sn = Math.max(0, Math.min(100, Sn));
    }

    // Paso 7: Interpretar el nivel de alerta según el puntaje (Sₙ)
    let nivelAlerta;
    if (Sn >= 80) {
      nivelAlerta = 'Alerta crítica';
    } else if (Sn >= 60) {
      nivelAlerta = 'Alerta alta';
    } else if (Sn >= 30) {
      nivelAlerta = 'Alerta moderada';
    } else {
      nivelAlerta = 'Sin riesgo / Bajo';
    }

    return {
      scoreReal: Sr,
      scoreNormalizado: Sn,
      nivelAlerta
    };
  } catch (error) {
    console.error('Error al calcular nivel de alerta:', error);
    return {
      scoreReal: 0,
      scoreNormalizado: 0,
      nivelAlerta: 'Sin riesgo / Bajo'
    };
  }
};

// Función para actualizar o crear alerta para una derivación
const actualizarAlertaDerivacion = async (estudianteId, derivacionId) => {
  try {
    // Obtener la derivación
    const derivacion = await obtenerDerivacionPorId(estudianteId, derivacionId);
    if (!derivacion) {
      throw new Error('Derivación no encontrada');
    }

    // Obtener todos los seguimientos de la derivación
    const seguimientos = await obtenerSeguimientosDerivacion(estudianteId, derivacionId);

    // Calcular el nivel de alerta
    const alertaCalculada = calcularNivelAlerta(seguimientos, derivacion);

    // Verificar si ya existe una alerta para esta derivación
    const alertaExistente = await obtenerAlertaReciente(estudianteId, derivacionId);

    const datosAlerta = {
      scoreReal: alertaCalculada.scoreReal,
      scoreNormalizado: alertaCalculada.scoreNormalizado,
      nivelAlerta: alertaCalculada.nivelAlerta,
      derivacionId: derivacionId,
      estudianteId: estudianteId
    };

    if (alertaExistente) {
      // Actualizar alerta existente y activarla
      await actualizarAlerta(estudianteId, derivacionId, alertaExistente.id, {
        ...datosAlerta,
        activo: true // Activar la alerta cuando se agrega un seguimiento
      });
      return { id: alertaExistente.id, ...datosAlerta, activo: true };
    } else {
      // Crear nueva alerta (ya se crea como activa por defecto)
      return await crearAlerta(estudianteId, derivacionId, datosAlerta);
    }
  } catch (error) {
    console.error('Error al actualizar alerta de derivación:', error);
    throw error;
  }
};

// Crear un nuevo seguimiento para una derivación
export const crearSeguimiento = async (estudianteId, derivacionId, datosSeguimiento) => {
  try {
    const seguimientoData = {
      ...datosSeguimiento,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const seguimientoRef = await addDoc(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos"), 
      seguimientoData
    );
    
    // Actualizar automáticamente la alerta de la derivación
    await actualizarAlertaDerivacion(estudianteId, derivacionId);
    
    return { id: seguimientoRef.id, ...seguimientoData };
  } catch (error) {
    throw new Error(`Error al crear seguimiento: ${error.message}`);
  }
};

// Obtener todos los seguimientos de una derivación
export const obtenerSeguimientosDerivacion = async (estudianteId, derivacionId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos")
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener seguimientos: ${error.message}`);
  }
};

// Obtener un seguimiento específico
export const obtenerSeguimientoPorId = async (estudianteId, derivacionId, seguimientoId) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Seguimiento no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener seguimiento: ${error.message}`);
  }
};

// Actualizar un seguimiento
export const actualizarSeguimiento = async (estudianteId, derivacionId, seguimientoId, datosActualizados) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (!docSnap.exists()) {
      throw new Error("Seguimiento no encontrado");
    }
    
    const datosActualizadosConFecha = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(seguimientoRef, datosActualizadosConFecha);
    
    // Actualizar automáticamente la alerta de la derivación
    await actualizarAlertaDerivacion(estudianteId, derivacionId);
    
    return { message: "Seguimiento actualizado correctamente" };
  } catch (error) {
    throw new Error(`Error al actualizar seguimiento: ${error.message}`);
  }
};

// Eliminar un seguimiento
export const eliminarSeguimiento = async (estudianteId, derivacionId, seguimientoId) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (!docSnap.exists()) {
      throw new Error("Seguimiento no encontrado");
    }
    
    await deleteDoc(seguimientoRef);
    
    // Actualizar automáticamente la alerta de la derivación
    await actualizarAlertaDerivacion(estudianteId, derivacionId);
    
    return { message: "Seguimiento eliminado correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar seguimiento: ${error.message}`);
  }
};

// ===== FUNCIONES PARA ALERTAS =====

// Crear una nueva alerta para una derivación
export const crearAlerta = async (estudianteId, derivacionId, datosAlerta) => {
  try {
    const alertaData = {
      ...datosAlerta,
      activo: true, // ✅ Agregar campo activo por defecto
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas"), 
      alertaData
    );
    return { id: docRef.id, ...alertaData };
  } catch (error) {
    throw new Error(`Error al crear alerta: ${error.message}`);
  }
};

// Obtener todas las alertas de una derivación
export const obtenerAlertasDerivacion = async (estudianteId, derivacionId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas")
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas: ${error.message}`);
  }
};

// Obtener alerta por ID
export const obtenerAlertaPorId = async (estudianteId, derivacionId, alertaId) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    const alertaSnap = await getDoc(alertaRef);
    
    if (alertaSnap.exists()) {
      return { id: alertaSnap.id, ...alertaSnap.data() };
    } else {
      throw new Error("Alerta no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener alerta: ${error.message}`);
  }
};

// Actualizar una alerta
export const actualizarAlerta = async (estudianteId, derivacionId, alertaId, datosActualizados) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    const datosActualizadosConFecha = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(alertaRef, datosActualizadosConFecha);
    return { mensaje: "Alerta actualizada exitosamente" };
  } catch (error) {
    throw new Error(`Error al actualizar alerta: ${error.message}`);
  }
};

// Eliminar una alerta
export const eliminarAlerta = async (estudianteId, derivacionId, alertaId) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    await deleteDoc(alertaRef);
    return { mensaje: "Alerta eliminada exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar alerta: ${error.message}`);
  }
};

// Obtener la alerta más reciente de una derivación
export const obtenerAlertaReciente = async (estudianteId, derivacionId) => {
  try {
    // Primero intentar obtener alertas activas
    try {
      const q = query(
        collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas"),
        where("activo", "==", true),
        orderBy("fecha_creacion", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
    } catch (error) {
      // Si falla el filtro por activo, obtener todas las alertas y filtrar manualmente
      console.log(`Filtro por activo falló para ${estudianteId}/${derivacionId}, usando fallback:`, error.message);
    }
    
    // Fallback: obtener todas las alertas y filtrar manualmente
    const q = query(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas"),
      orderBy("fecha_creacion", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const alertaData = doc.data();
      
      // Si la alerta no tiene campo activo, considerarla como activa (compatibilidad hacia atrás)
      if (alertaData.activo === undefined) {
        alertaData.activo = true;
      }
      
      // Solo retornar si está activa
      if (alertaData.activo) {
        return { id: doc.id, ...alertaData };
      }
    }
    
    return null;
  } catch (error) {
    throw new Error(`Error al obtener alerta reciente: ${error.message}`);
  }
};

// Obtener estudiantes con sus derivaciones
export const obtenerEstudiantesConDerivaciones = async () => {
  try {
    const estudiantes = await obtenerEstudiantes();
    
    // Obtener derivaciones para cada estudiante
    const estudiantesConDerivaciones = await Promise.all(
      estudiantes.map(async (estudiante) => {
        try {
          const derivaciones = await obtenerDerivacionesEstudiante(estudiante.id);
          return {
            ...estudiante,
            derivaciones: derivaciones || []
          };
        } catch (error) {
          console.error(`Error al cargar derivaciones para estudiante ${estudiante.id}:`, error);
          return {
            ...estudiante,
            derivaciones: []
          };
        }
      })
    );
    
    return estudiantesConDerivaciones;
  } catch (error) {
    console.error('Error al obtener estudiantes con derivaciones:', error);
    throw error;
  }
};

// Obtener alertas recientes de todos los estudiantes
export const obtenerAlertasRecientes = async () => {
  try {
    const alertas = [];
    const estudiantes = await obtenerEstudiantesConDerivaciones();
    
    for (const estudiante of estudiantes) {
      if (estudiante.derivaciones && estudiante.derivaciones.length > 0) {
        for (const derivacion of estudiante.derivaciones) {
          const alertaReciente = await obtenerAlertaReciente(estudiante.id, derivacion.id);
          if (alertaReciente) {
            alertas.push({
              ...alertaReciente,
              estudiante: {
                id: estudiante.id,
                nombre: estudiante.nombre,
                rut: estudiante.rut,
                curso: estudiante.curso
              },
              derivacion: {
                id: derivacion.id,
                motivo: derivacion.motivo,
                descripcion: derivacion.descripcion
              }
            });
          }
        }
      }
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    return alertas.sort((a, b) => {
      const fechaA = a.fecha_creacion?.toDate?.() || new Date(a.fecha_creacion);
      const fechaB = b.fecha_creacion?.toDate?.() || new Date(b.fecha_creacion);
      return fechaB - fechaA;
    });
  } catch (error) {
    console.error('Error al obtener alertas recientes:', error);
    throw error;
  }
};

// Función para migrar alertas existentes y agregar campo activo
export const migrarAlertasExistentes = async () => {
  try {
    console.log('Iniciando migración de alertas existentes...');
    const estudiantes = await obtenerEstudiantesConDerivaciones();
    let alertasMigradas = 0;
    
    for (const estudiante of estudiantes) {
      if (estudiante.derivaciones && estudiante.derivaciones.length > 0) {
        for (const derivacion of estudiante.derivaciones) {
          try {
            // Obtener todas las alertas de esta derivación
            const alertasRef = collection(db, "estudiantes", estudiante.id, "derivaciones", derivacion.id, "alertas");
            const querySnapshot = await getDocs(alertasRef);
            
            for (const alertaDoc of querySnapshot.docs) {
              const alertaData = alertaDoc.data();
              
              // Si la alerta no tiene campo activo, agregarlo
              if (alertaData.activo === undefined) {
                await updateDoc(alertaDoc.ref, {
                  activo: true,
                  fecha_actualizacion: new Date()
                });
                alertasMigradas++;
                console.log(`Alerta migrada: ${estudiante.nombre} - ${derivacion.motivo}`);
              }
            }
          } catch (error) {
            console.error(`Error migrando alertas para derivación ${derivacion.id}:`, error);
          }
        }
      }
    }
    
    console.log(`Migración completada. ${alertasMigradas} alertas migradas.`);
    return { success: true, alertasMigradas };
  } catch (error) {
    console.error('Error en migración de alertas:', error);
    throw error;
  }
};

export default {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  obtenerEstudiantesPorEstablecimiento,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesActivos,
  actualizarEstudiante,
  cambiarEstadoEstudiante,
  actualizarTelegramId,
  obtenerEstudiantePorTelegramId,
  eliminarEstudiante,
  crearDerivacion,
  obtenerDerivacionesEstudiante,
  obtenerDerivacionPorId,
  actualizarDerivacion,
  eliminarDerivacion,
  cambiarEstadoDerivacion,
  obtenerDerivacionesPorEstado,
  obtenerDerivacionesRecientes,
  crearSeguimiento,
  obtenerSeguimientosDerivacion,
  obtenerSeguimientoPorId,
  actualizarSeguimiento,
  eliminarSeguimiento,
  crearAlerta,
  obtenerAlertasDerivacion,
  obtenerAlertaPorId,
  actualizarAlerta,
  eliminarAlerta,
  obtenerAlertaReciente,
  obtenerAlertasRecientes,
  migrarAlertasExistentes,
  obtenerEstudiantesConDerivaciones,
  validarEstudiante
};
