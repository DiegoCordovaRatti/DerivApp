import { db } from '../config/fireBaseDB.js';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';

// Función para calcular el nivel de alerta basado en seguimientos y derivación
const calcularNivelAlerta = (seguimientos, derivacion) => {
  try {
    // Valores de resultado de seguimientos
    const valoresResultado = {
      'positivo': 1,
      'negativo': 3,
      'neutro': 2,
      'pendiente': 2
    };

    // Valores de prioridad
    const valoresPrioridad = {
      'alta': 3,
      'media': 2,
      'baja': 1
    };

    // Valores de estado de derivación
    const valoresEstado = {
      'abierta': 2,
      'cerrada': 1
    };

    // Calcular score de seguimientos
    let scoreSeguimientos = 0;
    if (seguimientos && seguimientos.length > 0) {
      seguimientos.forEach(seguimiento => {
        const valor = valoresResultado[seguimiento.resultado?.toLowerCase()] || 2;
        scoreSeguimientos += valor;
      });
      scoreSeguimientos = scoreSeguimientos / seguimientos.length;
    } else {
      scoreSeguimientos = 2; // Valor neutro si no hay seguimientos
    }

    // Obtener valores de la derivación
    const prioridad = derivacion.prioridad || 'baja';
    const estado = derivacion.estado_derivacion || 'abierta';
    
    const valorPrioridad = valoresPrioridad[prioridad] || 1;
    const valorEstado = valoresEstado[estado] || 1;

    // Calcular score real
    const scoreReal = (scoreSeguimientos * 0.5) + (valorPrioridad * 0.3) + (valorEstado * 0.2);

    // Normalizar score (0-100)
    const scoreNormalizado = Math.min(100, Math.max(0, (scoreReal / 3) * 100));

    // Determinar nivel de alerta
    let nivelAlerta;
    if (scoreNormalizado >= 80) {
      nivelAlerta = 'Alerta crítica';
    } else if (scoreNormalizado >= 60) {
      nivelAlerta = 'Alerta alta';
    } else if (scoreNormalizado >= 40) {
      nivelAlerta = 'Alerta moderada';
    } else {
      nivelAlerta = 'Sin riesgo / Bajo';
    }

    return {
      scoreReal,
      scoreNormalizado,
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

// Función para crear alerta para una derivación
const crearAlerta = async (estudianteId, derivacionId, datosAlerta) => {
  try {
    const alertaData = {
      ...datosAlerta,
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

// Función para obtener seguimientos de una derivación
const obtenerSeguimientosDerivacion = async (estudianteId, derivacionId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos")
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener seguimientos: ${error.message}`);
  }
};

// Función para verificar si una derivación ya tiene alertas
const tieneAlertas = async (estudianteId, derivacionId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas")
    );
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error al verificar alertas:', error);
    return false;
  }
};

// Función principal para inicializar alertas
const inicializarAlertas = async () => {
  try {
    console.log('🚀 Iniciando inicialización de alertas...');
    
    // Obtener todos los estudiantes
    const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
    let totalDerivaciones = 0;
    let alertasCreadas = 0;
    let alertasExistentes = 0;
    
    for (const estudianteDoc of estudiantesSnapshot.docs) {
      const estudianteId = estudianteDoc.id;
      console.log(`📋 Procesando estudiante: ${estudianteDoc.data().nombre}`);
      
      // Obtener derivaciones del estudiante
      const derivacionesSnapshot = await getDocs(
        collection(db, "estudiantes", estudianteId, "derivaciones")
      );
      
      for (const derivacionDoc of derivacionesSnapshot.docs) {
        const derivacionId = derivacionDoc.id;
        const derivacion = derivacionDoc.data();
        totalDerivaciones++;
        
        console.log(`  📄 Derivación: ${derivacion.motivo || 'Sin motivo'} (${derivacionId})`);
        
        // Verificar si ya tiene alertas
        const yaTieneAlertas = await tieneAlertas(estudianteId, derivacionId);
        
        if (yaTieneAlertas) {
          console.log(`    ✅ Ya tiene alertas`);
          alertasExistentes++;
          continue;
        }
        
        // Obtener seguimientos de la derivación
        const seguimientos = await obtenerSeguimientosDerivacion(estudianteId, derivacionId);
        console.log(`    📊 Seguimientos encontrados: ${seguimientos.length}`);
        
        // Calcular nivel de alerta
        const alertaCalculada = calcularNivelAlerta(seguimientos, derivacion);
        
        // Crear alerta
        const datosAlerta = {
          scoreReal: alertaCalculada.scoreReal,
          scoreNormalizado: alertaCalculada.scoreNormalizado,
          nivelAlerta: alertaCalculada.nivelAlerta,
          derivacionId: derivacionId,
          estudianteId: estudianteId
        };
        
        await crearAlerta(estudianteId, derivacionId, datosAlerta);
        console.log(`    🚨 Alerta creada: ${alertaCalculada.nivelAlerta} (${alertaCalculada.scoreNormalizado.toFixed(1)}%)`);
        alertasCreadas++;
      }
    }
    
    console.log('\n📈 Resumen de inicialización:');
    console.log(`   Total de derivaciones procesadas: ${totalDerivaciones}`);
    console.log(`   Alertas existentes: ${alertasExistentes}`);
    console.log(`   Alertas creadas: ${alertasCreadas}`);
    console.log('✅ Inicialización completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  }
};

// Ejecutar la inicialización
inicializarAlertas(); 