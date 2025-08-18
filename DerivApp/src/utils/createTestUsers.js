// Script para crear usuarios de prueba (ejecutar desde consola del navegador)
// NOTA: Este script debe ejecutarse desde la consola del navegador cuando tengas acceso de administrador

const createTestUsers = async () => {
  const API_URL = 'http://localhost:3000/api'; // Ajustar según tu configuración
  
  const testUsers = [
    {
      email: 'admin@derivapp.com',
      password: 'admin123',
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'administrador',
      establecimientoId: 'establecimiento-001'
    },
    {
      email: 'psicologo@derivapp.com',
      password: 'psicologo123',
      nombre: 'María',
      apellido: 'Psicóloga',
      rol: 'psicologo',
      establecimientoId: 'establecimiento-001'
    },
    {
      email: 'trabajador.social@derivapp.com',
      password: 'social123',
      nombre: 'Carlos',
      apellido: 'Trabajador Social',
      rol: 'trabajador_social',
      establecimientoId: 'establecimiento-001'
    },
    {
      email: 'jefe.convivencia@derivapp.com',
      password: 'jefe123',
      nombre: 'Ana',
      apellido: 'Jefe Convivencia',
      rol: 'jefe_convivencia',
      establecimientoId: 'establecimiento-001'
    },
    {
      email: 'docente@derivapp.com',
      password: 'docente123',
      nombre: 'Pedro',
      apellido: 'Docente',
      rol: 'docente',
      establecimientoId: 'establecimiento-001'
    }
  ];

  console.log('🔐 Creando usuarios de prueba...\n');

  // Nota: Este endpoint requiere autenticación de administrador
  // Debes estar logueado como admin para ejecutar este script
  
  for (const user of testUsers) {
    try {
      const response = await fetch(`${API_URL}/auth/firebase/crear-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('firebase-token')}` // O el método que uses para almacenar el token
        },
        body: JSON.stringify(user)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Usuario creado: ${user.email} (${user.rol})`);
      } else {
        const error = await response.json();
        console.error(`❌ Error creando ${user.email}:`, error.message);
      }
    } catch (error) {
      console.error(`❌ Error creando ${user.email}:`, error);
    }
  }
  
  console.log('\n🎉 Proceso completado!');
  console.log('\n📋 Usuarios de prueba:');
  testUsers.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.rol})`);
  });
};

// Exportar para uso desde consola
window.createTestUsers = createTestUsers;

console.log('💡 Para crear usuarios de prueba, ejecuta: createTestUsers()');

export default createTestUsers;
