import dotenv from 'dotenv';
import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { crearPerfilUsuario, ROLES } from '../models/Usuario.js';

dotenv.config();

// Script para crear el primer usuario administrador
const createFirstAdmin = async () => {
  try {
    console.log('🔐 CREANDO PRIMER USUARIO ADMINISTRADOR');
    console.log('====================================\n');
    
    // Datos del administrador
    const adminData = {
      email: process.env.FIREBASE_ADMIN,
      password: process.env.FIREBASE_ADMIN_PASS, // Cambiar en producción
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: ROLES.ADMIN,
      establecimientoId: 'establecimiento-principal'
    };
    
    console.log('1️⃣ Creando usuario en Firebase Auth...');
    
    // Verificar si ya existe
    try {
      const existingUser = await firebaseAdmin.auth().getUserByEmail(adminData.email);
      console.log('⚠️ Usuario ya existe en Firebase Auth:', existingUser.uid);
      
      // Verificar si tiene perfil en Firestore
      const { obtenerPerfilUsuario } = await import('../models/Usuario.js');
      const perfil = await obtenerPerfilUsuario(existingUser.uid);
      
      if (perfil) {
        console.log('✅ Perfil ya existe en Firestore');
        console.log('\n📋 DATOS DEL ADMINISTRADOR EXISTENTE:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log(`   Rol: ${perfil.rol}`);
        console.log(`   UID: ${existingUser.uid}`);
        return;
      } else {
        console.log('⚠️ Usuario existe en Auth pero no tiene perfil. Creando perfil...');
        
        // Crear perfil para usuario existente
        const perfil = await crearPerfilUsuario(existingUser.uid, {
          email: adminData.email,
          nombre: adminData.nombre,
          apellido: adminData.apellido,
          rol: adminData.rol,
          establecimientoId: adminData.establecimientoId
        });
        
        console.log('✅ Perfil creado en Firestore');
        console.log('\n📋 DATOS DEL ADMINISTRADOR:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log(`   Rol: ${perfil.rol}`);
        console.log(`   UID: ${existingUser.uid}`);
        return;
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
      // Usuario no existe, proceder a crearlo
      console.log('📝 Usuario no existe, creando...');
    }
    
    // Crear usuario en Firebase Auth
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: adminData.email,
      password: adminData.password,
      displayName: `${adminData.nombre} ${adminData.apellido}`,
      emailVerified: true // Admin ya está verificado
    });
    
    console.log('✅ Usuario creado en Firebase Auth');
    console.log(`   UID: ${firebaseUser.uid}`);
    
    console.log('\n2️⃣ Creando perfil en Firestore...');
    
    // Crear perfil en Firestore
    const perfil = await crearPerfilUsuario(firebaseUser.uid, {
      email: adminData.email,
      nombre: adminData.nombre,
      apellido: adminData.apellido,
      rol: adminData.rol,
      establecimientoId: adminData.establecimientoId
    });
    
    console.log('✅ Perfil creado en Firestore');
    console.log(`   ID: ${perfil.id}`);
    
    console.log('\n🎉 ¡ADMINISTRADOR CREADO EXITOSAMENTE!');
    console.log('\n📋 DATOS PARA INICIAR SESIÓN:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Rol: ${adminData.rol}`);
    console.log(`   UID: ${firebaseUser.uid}`);
    
    console.log('\n⚠️ IMPORTANTE:');
    console.log('   - Cambia la contraseña después del primer login');
    console.log('   - Este usuario puede crear otros usuarios desde la aplicación');
    console.log('   - Mantén estas credenciales seguras');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 El email ya está en uso. Usa otro email o elimina el usuario existente.');
    } else if (error.code === 'app/no-app') {
      console.log('\n💡 Firebase Admin no está configurado. Verifica las variables de entorno.');
    }
    
    process.exit(1);
  }
  
  process.exit(0);
};

// Verificar configuración antes de ejecutar
console.log('🔧 Verificando configuración...');

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('❌ FIREBASE_PROJECT_ID no está configurado');
  process.exit(1);
}

console.log(`✅ Proyecto: ${process.env.FIREBASE_PROJECT_ID}`);
console.log('');

// Ejecutar
createFirstAdmin();
