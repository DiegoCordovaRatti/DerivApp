import dotenv from 'dotenv';
import { firebaseAdmin } from './config/firebaseAdmin.js';
import { crearPerfilUsuario, obtenerPerfilUsuario, ROLES } from './models/Usuario.js';

dotenv.config();

// Test de configuración de Firebase Auth
const testFirebaseAuth = async () => {
  try {
    console.log('🧪 Iniciando pruebas de Firebase Authentication...\n');
    
    // 1. Verificar configuración de Firebase Admin
    console.log('1️⃣ Verificando configuración de Firebase Admin...');
    const app = firebaseAdmin.app();
    console.log('✅ Firebase Admin configurado correctamente');
    console.log(`   Project ID: ${app.options.projectId}\n`);
    
    // 2. Crear usuario de prueba
    console.log('2️⃣ Creando usuario de prueba...');
    const testEmail = `test-${Date.now()}@derivapp.com`;
    const testPassword = 'testpass123';
    
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: testEmail,
      password: testPassword,
      displayName: 'Usuario de Prueba',
      emailVerified: false
    });
    
    console.log('✅ Usuario creado en Firebase Auth');
    console.log(`   UID: ${firebaseUser.uid}`);
    console.log(`   Email: ${firebaseUser.email}\n`);
    
    // 3. Crear perfil en Firestore
    console.log('3️⃣ Creando perfil en Firestore...');
    const perfil = await crearPerfilUsuario(firebaseUser.uid, {
      email: testEmail,
      nombre: 'Usuario',
      apellido: 'Prueba',
      rol: ROLES.DOCENTE,
      establecimientoId: 'test-establecimiento'
    });
    
    console.log('✅ Perfil creado en Firestore');
    console.log(`   ID: ${perfil.id}`);
    console.log(`   Rol: ${perfil.rol}`);
    console.log(`   Permisos:`, perfil.permisos);
    console.log('\n');
    
    // 4. Verificar que se puede obtener el perfil
    console.log('4️⃣ Verificando obtención de perfil...');
    const perfilObtenido = await obtenerPerfilUsuario(firebaseUser.uid);
    
    if (perfilObtenido) {
      console.log('✅ Perfil obtenido correctamente');
      console.log(`   Nombre: ${perfilObtenido.nombre} ${perfilObtenido.apellido}`);
      console.log(`   Activo: ${perfilObtenido.activo}\n`);
    } else {
      console.log('❌ Error: No se pudo obtener el perfil\n');
    }
    
    // 5. Generar token personalizado para pruebas
    console.log('5️⃣ Generando token personalizado...');
    const customToken = await firebaseAdmin.auth().createCustomToken(firebaseUser.uid);
    console.log('✅ Token personalizado generado');
    console.log(`   Token: ${customToken.substring(0, 50)}...\n`);
    
    // 6. Limpiar - eliminar usuario de prueba
    console.log('6️⃣ Limpiando usuario de prueba...');
    await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
    console.log('✅ Usuario eliminado de Firebase Auth');
    
    console.log('\n🎉 Todas las pruebas de Firebase Auth pasaron exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Configura las variables de entorno de Firebase Admin');
    console.log('   2. Ejecuta el servidor: npm start');
    console.log('   3. Prueba los endpoints en: http://localhost:3000/api/auth/');
    
  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error);
    
    if (error.code === 'app/no-app') {
      console.log('\n💡 Solución: Verifica la configuración de Firebase Admin en firebaseAdmin.js');
    }
    
    if (error.message.includes('service account')) {
      console.log('\n💡 Solución: Configura FIREBASE_SERVICE_ACCOUNT_KEY en el archivo .env');
    }
    
    process.exit(1);
  }
  
  process.exit(0);
};

// Ejecutar pruebas
console.log('🔐 Firebase Authentication Test Suite');
console.log('=====================================\n');
testFirebaseAuth();
