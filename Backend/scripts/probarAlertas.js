import { db } from '../config/fireBaseDB.js';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';

// Función para obtener una derivación existente
const obtenerDerivacionExistente = async () => {
  try {
    const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
    
    for (const estudianteDoc of estudiantesSnapshot.docs) {
      const estudianteId = estudianteDoc.id;
      const derivacionesSnapshot = await getDocs(
        collection(db, "estudiantes", estudianteId, "derivaciones")
      );
      
      if (!derivacionesSnapshot.empty) {
        const derivacionDoc = derivacionesSnapshot.docs[0];
        return {
          estudianteId,
          derivacionId: derivacionDoc.id,
          derivacion: derivacionDoc.data()
        };
      }
    }
    
    throw new Error('No se encontraron derivaciones');
  } catch (error) {
    console.error('Error al obtener derivación existente:', error);
    throw error;
  }
};

// Función para crear un seguimiento de prueba
const crearSeguimientoPrueba = async (estudianteId, derivacionId) => {
  try {
    const datosSeguimiento = {
      tipo: 'evaluacion',
      descripcion: 'Seguimiento de prueba para verificar alertas',
      resultado: 'negativo', // Esto debería aumentar el nivel de alerta
      responsable: 'Trabajador Social',
      observaciones: 'Prueba automática de alertas',
      fecha: new Date(),
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const seguimientoRef = await addDoc(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos"), 
      datosSeguimiento
    );
    
    console.log(`✅ Seguimiento creado: ${seguimientoRef.id}`);
    return { id: seguimientoRef.id, ...datosSeguimiento };
  } catch (error) {
    console.error('Error al crear seguimiento de prueba:', error);
    throw error;
  }
};

// Función para verificar alertas de una derivación
const verificarAlertas = async (estudianteId, derivacionId) => {
  try {
    const alertasSnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas")
    );
    
    if (alertasSnapshot.empty) {
      console.log('❌ No se encontraron alertas para la derivación');
      return null;
    }
    
    const alertas = alertasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ Se encontraron ${alertas.length} alertas:`);
    
    alertas.forEach(alerta => {
      console.log(`   - ID: ${alerta.id}`);
      console.log(`   - Nivel: ${alerta.nivelAlerta}`);
      console.log(`   - Score Normalizado: ${alerta.scoreNormalizado?.toFixed(1)}%`);
      console.log(`   - Score Real: ${alerta.scoreReal?.toFixed(2)}`);
      console.log(`   - Fecha: ${alerta.fecha_creacion}`);
    });
    
    return alertas;
  } catch (error) {
    console.error('Error al verificar alertas:', error);
    throw error;
  }
};

// Función principal de prueba
const probarAlertas = async () => {
  try {
    console.log('🧪 Iniciando prueba de alertas automáticas...');
    
    // 1. Obtener una derivación existente
    console.log('\n1️⃣ Obteniendo derivación existente...');
    const { estudianteId, derivacionId, derivacion } = await obtenerDerivacionExistente();
    console.log(`   ✅ Derivación encontrada: ${derivacion.motivo || 'Sin motivo'} (${derivacionId})`);
    
    // 2. Verificar alertas antes del seguimiento
    console.log('\n2️⃣ Verificando alertas antes del seguimiento...');
    const alertasAntes = await verificarAlertas(estudianteId, derivacionId);
    
    // 3. Crear un seguimiento de prueba
    console.log('\n3️⃣ Creando seguimiento de prueba...');
    const seguimiento = await crearSeguimientoPrueba(estudianteId, derivacionId);
    console.log(`   ✅ Seguimiento creado con resultado: ${seguimiento.resultado}`);
    
    // 4. Verificar alertas después del seguimiento
    console.log('\n4️⃣ Verificando alertas después del seguimiento...');
    const alertasDespues = await verificarAlertas(estudianteId, derivacionId);
    
    // 5. Comparar resultados
    console.log('\n5️⃣ Comparando resultados...');
    if (alertasAntes && alertasDespues) {
      const alertaAntes = alertasAntes[0];
      const alertaDespues = alertasDespues[0];
      
      console.log(`   📊 Antes: ${alertaAntes.nivelAlerta} (${alertaAntes.scoreNormalizado?.toFixed(1)}%)`);
      console.log(`   📊 Después: ${alertaDespues.nivelAlerta} (${alertaDespues.scoreNormalizado?.toFixed(1)}%)`);
      
      if (alertaDespues.scoreNormalizado > alertaAntes.scoreNormalizado) {
        console.log('   ✅ La alerta aumentó correctamente');
      } else if (alertaDespues.scoreNormalizado < alertaAntes.scoreNormalizado) {
        console.log('   ✅ La alerta disminuyó correctamente');
      } else {
        console.log('   ⚠️ La alerta se mantuvo igual');
      }
    } else if (!alertasAntes && alertasDespues) {
      console.log('   ✅ Se creó una nueva alerta correctamente');
    } else {
      console.log('   ❌ No se detectaron cambios en las alertas');
    }
    
    console.log('\n✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
};

// Ejecutar la prueba
probarAlertas(); 