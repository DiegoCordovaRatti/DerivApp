// Script para verificar la configuración de Firebase y API
export const checkFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Variables de entorno de Firebase faltantes:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Todas las variables de Firebase están configuradas');
  return true;
};

export const checkAPIConnection = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    console.log(`🔌 Verificando conexión con API: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/auth/roles-permisos`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API conectada correctamente');
      console.log('📋 Roles disponibles:', Object.values(data.roles));
      return true;
    } else {
      console.error('❌ API respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error conectando con API:', error.message);
    return false;
  }
};

export const runFullCheck = async () => {
  console.log('🔧 VERIFICACIÓN DE CONFIGURACIÓN DE DERIVAPP');
  console.log('==============================================\n');
  
  // 1. Verificar variables de entorno
  console.log('1️⃣ Verificando variables de entorno...');
  const firebaseOk = checkFirebaseConfig();
  console.log('');
  
  // 2. Verificar conexión con API
  console.log('2️⃣ Verificando conexión con API...');
  const apiOk = await checkAPIConnection();
  console.log('');
  
  // 3. Verificar Firebase Auth
  console.log('3️⃣ Verificando Firebase Auth...');
  try {
    const { auth } = await import('../config/firebase.js');
    console.log('✅ Firebase Auth inicializado correctamente');
    console.log(`   App: ${auth.app.options.projectId}`);
  } catch (error) {
    console.error('❌ Error inicializando Firebase Auth:', error.message);
  }
  
  console.log('\n📋 RESUMEN:');
  console.log(`   Firebase Config: ${firebaseOk ? '✅' : '❌'}`);
  console.log(`   API Connection: ${apiOk ? '✅' : '❌'}`);
  
  if (firebaseOk && apiOk) {
    console.log('\n🎉 ¡Configuración completa! El sistema está listo para usar.');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Crear usuarios en Firebase Console');
    console.log('   2. Crear perfiles en Firestore');
    console.log('   3. Probar login en la aplicación');
  } else {
    console.log('\n⚠️ Configuración incompleta. Revisa los errores arriba.');
  }
};

// Hacer disponible en window para uso desde consola
if (typeof window !== 'undefined') {
  window.checkDerivAppSetup = runFullCheck;
  window.checkFirebase = checkFirebaseConfig;
  window.checkAPI = checkAPIConnection;
}

export default {
  checkFirebaseConfig,
  checkAPIConnection,
  runFullCheck
};
