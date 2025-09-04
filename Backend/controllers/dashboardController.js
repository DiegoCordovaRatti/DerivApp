import { obtenerEstudiantesConDerivaciones, obtenerAlertasRecientes as obtenerAlertasRecientesModel } from '../models/Estudiante.js';

// Obtener estadísticas generales del dashboard
export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    // Obtener estudiantes con derivaciones
    const estudiantes = await obtenerEstudiantesConDerivaciones();
    
    // Filtrar solo estudiantes con derivaciones
    const estudiantesConDerivaciones = estudiantes.filter(
      estudiante => estudiante.derivaciones && estudiante.derivaciones.length > 0
    );

    // Contar derivaciones activas
    let derivacionesActivas = 0;
    let derivacionesCerradas = 0;
    
    estudiantesConDerivaciones.forEach(estudiante => {
      estudiante.derivaciones.forEach(derivacion => {
        if (derivacion.estado_derivacion === 'abierta') {
          derivacionesActivas++;
        } else if (derivacion.estado_derivacion === 'cerrada') {
          derivacionesCerradas++;
        }
      });
    });

    // Obtener alertas recientes
    const alertasRecientes = await obtenerAlertasRecientesModel();

    const estadisticas = {
      totalEstudiantesDerivados: estudiantesConDerivaciones.length,
      derivacionesActivas,
      derivacionesCerradas,
      alertasRecientes: alertasRecientes.length,
      alertasCriticas: alertasRecientes.filter(alerta => 
        alerta.nivelAlerta === 'Alerta crítica'
      ).length,
      alertasAltas: alertasRecientes.filter(alerta => 
        alerta.nivelAlerta === 'Alerta alta'
      ).length
    };

    res.json({
      success: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: error.message
    });
  }
};

// Obtener estadísticas de derivaciones por categoría
export const obtenerEstadisticasDerivacionesPorCategoria = async (req, res) => {
  try {
    const estudiantes = await obtenerEstudiantesConDerivaciones();
    
    // Inicializar contadores por categoría - incluyendo todas las categorías del sistema
    const estadisticasPorCategoria = {
      'Violencia o Abuso': 0,
      'Emocional': 0,
      'Conductual / Disciplinario': 0,
      'Académico': 0,
      'Inasistencia / Riesgo de Deserción': 0,
      'Familiar': 0,
      'Socioeconómico': 0,
      'Contexto Social / Relaciones': 0,
      'Diversidad e Inclusión': 0,
      'Higiene / Autocuidado': 0,
      'Otro': 0
    };
    
    // Contar derivaciones por categoría
    estudiantes.forEach(estudiante => {
      if (estudiante.derivaciones) {
        estudiante.derivaciones.forEach(derivacion => {
          const tipoCaso = derivacion.tipo_caso || derivacion.categoria || derivacion.motivo || 'Otro';
          
          // Mapear tipos de caso exactos de la base de datos
          if (tipoCaso.toLowerCase() === 'violencia' || tipoCaso.toLowerCase() === 'abuso') {
            estadisticasPorCategoria['Violencia o Abuso']++;
          } else if (tipoCaso.toLowerCase() === 'emocional') {
            estadisticasPorCategoria['Emocional']++;
          } else if (tipoCaso.toLowerCase() === 'conductual' || tipoCaso.toLowerCase() === 'disciplinario') {
            estadisticasPorCategoria['Conductual / Disciplinario']++;
          } else if (tipoCaso.toLowerCase() === 'academico') {
            estadisticasPorCategoria['Académico']++;
          } else if (tipoCaso.toLowerCase() === 'inasistencia' || tipoCaso.toLowerCase() === 'desercion') {
            estadisticasPorCategoria['Inasistencia / Riesgo de Deserción']++;
          } else if (tipoCaso.toLowerCase() === 'familiar') {
            estadisticasPorCategoria['Familiar']++;
          } else if (tipoCaso.toLowerCase() === 'socioeconomico') {
            estadisticasPorCategoria['Socioeconómico']++;
          } else if (tipoCaso.toLowerCase() === 'social' || tipoCaso.toLowerCase() === 'relaciones') {
            estadisticasPorCategoria['Contexto Social / Relaciones']++;
          } else if (tipoCaso.toLowerCase() === 'diversidad' || tipoCaso.toLowerCase() === 'inclusion') {
            estadisticasPorCategoria['Diversidad e Inclusión']++;
          } else if (tipoCaso.toLowerCase() === 'higiene' || tipoCaso.toLowerCase() === 'autocuidado') {
            estadisticasPorCategoria['Higiene / Autocuidado']++;
          } else {
            estadisticasPorCategoria['Otro']++;
          }
        });
      }
    });

    res.json({
      success: true,
      estadisticas: estadisticasPorCategoria
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de derivaciones por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de derivaciones por categoría',
      error: error.message
    });
  }
};

// Obtener estadísticas de alertas por nivel
export const obtenerEstadisticasAlertasPorNivel = async (req, res) => {
  try {
    const alertas = await obtenerAlertasRecientesModel();
    
    // Inicializar contadores por nivel
    const estadisticasPorNivel = {
      'Alerta crítica': 0,
      'Alerta alta': 0,
      'Alerta moderada': 0,
      'Sin riesgo / Bajo': 0
    };
    
    // Contar alertas por nivel
    alertas.forEach(alerta => {
      const nivel = alerta.nivelAlerta || 'Sin riesgo / Bajo';
      if (estadisticasPorNivel.hasOwnProperty(nivel)) {
        estadisticasPorNivel[nivel]++;
      } else {
        estadisticasPorNivel['Sin riesgo / Bajo']++;
      }
    });

    res.json({
      success: true,
      estadisticas: estadisticasPorNivel
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de alertas por nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de alertas por nivel',
      error: error.message
    });
  }
};

// Obtener alertas recientes para el dashboard
export const obtenerAlertasRecientes = async (req, res) => {
  try {
    const alertas = await obtenerAlertasRecientesModel();
    
    // Limitar a las 5 alertas más recientes
    const alertasRecientes = alertas.slice(0, 5).map(alerta => ({
      id: alerta.id,
      estudiante: alerta.estudiante,
      nivelAlerta: alerta.nivelAlerta,
      scoreNormalizado: alerta.scoreNormalizado,
      fecha: alerta.fecha_creacion,
      color: getColorNivelAlerta(alerta.nivelAlerta)
    }));

    res.json({
      success: true,
      alertas: alertasRecientes
    });
  } catch (error) {
    console.error('Error al obtener alertas recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas recientes',
      error: error.message
    });
  }
};

// Obtener eventos próximos (placeholder para futura implementación)
export const obtenerEventosProximos = async (req, res) => {
  try {
    // Por ahora retornamos datos simulados
    // En el futuro esto se conectará con el módulo de agenda
    const eventos = [
      {
        id: 1,
        titulo: 'Seguimiento Juan Pérez',
        fecha: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        hora: '09:00',
        ubicacion: 'Sala de entrevistas',
        tipo: 'seguimiento'
      },
      {
        id: 2,
        titulo: 'Reunión equipo psicosocial',
        fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
        hora: '14:00',
        ubicacion: 'Sala de reuniones',
        tipo: 'reunion'
      }
    ];

    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos próximos',
      error: error.message
    });
  }
};

// Función auxiliar para obtener color del nivel de alerta
const getColorNivelAlerta = (nivelAlerta) => {
  const colores = {
    'Alerta crítica': '#cf1322',
    'Alerta alta': '#ff4d4f',
    'Alerta moderada': '#faad14',
    'Sin riesgo / Bajo': '#52c41a'
  };
  return colores[nivelAlerta] || '#d9d9d9';
}; 