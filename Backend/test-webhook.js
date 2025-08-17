import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Función para enviar webhook a n8n (testing)
const enviarWebhookEvento = async (eventoData) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_TEST_URL;
    
    if (!webhookUrl) {
      console.log('❌ N8N_WEBHOOK_TEST_URL no configurada');
      console.log('💡 Verifica que el archivo .env contenga: N8N_WEBHOOK_TEST_URL=https://429530537538.ngrok-free.app/webhook/test');
      return;
    }
    
         console.log('🧪 Enviando webhook de testing a n8n:', webhookUrl);

    // Asegurar que telegram_id sea null si no existe
    const estudianteConTelegram = {
      ...eventoData.estudiante,
      telegram_id: eventoData.estudiante.telegram_id || null
    };

    const payload = {
      evento: {
        id: eventoData.id,
        titulo: eventoData.titulo,
        fecha: eventoData.fecha,
        hora: eventoData.hora,
        tipo: eventoData.tipo,
        prioridad: eventoData.prioridad,
        agendado: eventoData.agendado,
        status: eventoData.status || 'pendiente',
        descripcion: eventoData.descripcion,
        estudianteId: eventoData.estudianteId,
        derivacionId: eventoData.derivacionId,
        estudiante: estudianteConTelegram,
        derivacion: eventoData.derivacion,
        fecha_creacion: eventoData.fecha_creacion,
        fecha_actualizacion: eventoData.fecha_actualizacion
      },
      metadata: {
        timestamp: new Date().toISOString(),
        action: 'evento_creado_test',
        source: 'DerivApp',
        webhook_version: '1.0',
        environment: 'testing'
      },
      notificacion: {
        tipo: 'nueva_citacion',
        prioridad: eventoData.prioridad,
        requiere_confirmacion: !eventoData.agendado,
        canales: ['telegram']
      }
    };

    console.log('📤 Enviando webhook a:', webhookUrl);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Webhook enviado exitosamente a n8n');
    console.log('📊 Status:', response.status);
  } catch (error) {
    console.error('❌ Error enviando webhook a n8n:', error);
  }
};

// Datos de prueba basados en evento real del módulo de agendamiento
const eventoPrueba = {
  id: 'IcjVpg5mTDx8VH6T51sC',
  titulo: 'Citación de prueba',
  fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
  hora: '14:30',
  tipo: 'seguimiento',
  prioridad: 'media',
  status: 'pendiente',
  agendado: false, // Campo booleano para confirmar asistencia del apoderado vía Telegram (false = pendiente)
  descripcion: 'Prueba de webhook para citación de prueba',
  estudianteId: '6Wi6gYZG1YPYEoR9XyA7',
  derivacionId: '8rV0v3yrztZRn8t1bY21',
  fecha_creacion: new Date('2025-08-09T23:39:36.000Z'),
  fecha_actualizacion: new Date('2025-08-09T23:39:36.000Z'),
  estudiante: {
    id: '6Wi6gYZG1YPYEoR9XyA7',
    nombre: 'Alejandro C',
    curso: '2°A',
    rut: '12345678-9',
    apoderado: 'María González',
    telefono_contacto: '+56912345678',
    email_contacto: 'maria.gonzalez@email.com',
    telegram_id: '8240797657', // Campo agregado para notificaciones automáticas vía Telegram
    estado: 'activo'
  },
  derivacion: {
    motivo: 'Seguimiento académico',
    descripcion: 'Seguimiento del progreso académico del estudiante',
    estado: 'abierta'
  }
};


enviarWebhookEvento(eventoPrueba);


