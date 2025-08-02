import { crearSeguimiento } from '../models/Estudiante.js';

// Función para agregar un seguimiento de prueba
const agregarSeguimientoPrueba = async () => {
  try {
    // Reemplaza estos IDs con los de tu base de datos
    const estudianteId = 'TU_ESTUDIANTE_ID'; // Reemplaza con un ID real
    const derivacionId = 'TU_DERIVACION_ID';  // Reemplaza con un ID real
    
    const datosSeguimiento = {
      tipo: 'Evaluación psicológica',
      fecha: new Date('2024-01-15'), // Fecha específica para prueba
      responsable: 'Psicólogo María González',
      descripcion: 'Primera sesión de evaluación psicológica. El estudiante muestra buena disposición para el trabajo terapéutico.',
      duracion: '45 minutos',
      observaciones: 'Se recomienda continuar con sesiones semanales',
      resultado: 'Evaluación inicial completada'
    };
    
    console.log('Datos del seguimiento a crear:', datosSeguimiento);
    const seguimiento = await crearSeguimiento(estudianteId, derivacionId, datosSeguimiento);
    console.log('Seguimiento agregado exitosamente:', seguimiento);
  } catch (error) {
    console.error('Error al agregar seguimiento:', error);
  }
};

// Ejecutar el script
agregarSeguimientoPrueba(); 