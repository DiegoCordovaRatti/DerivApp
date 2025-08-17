import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Función para enviar webhook a n8n (copiada del controlador)
const enviarWebhookEvento = async (eventoData) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('❌ N8N_WEBHOOK_URL no configurada');
      console.log('💡 Agrega N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/evento-creado a tu archivo .env');
      return;
    }

    const payload = {
      evento: {
        id: eventoData.id,
        titulo: eventoData.titulo,
        fecha: eventoData.fecha,
        hora: eventoData.hora,
        tipo: eventoData.tipo,
        prioridad: eventoData.prioridad,
        agendado: eventoData.agendado,
        descripcion: eventoData.descripcion,
        estudianteId: eventoData.estudianteId,
        derivacionId: eventoData.derivacionId,
        estudiante: eventoData.estudiante,
        derivacion: eventoData.derivacion
      },
      timestamp: new Date().toISOString(),  
      action: 'evento_creado'
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
    telegram_id: '8240797657',
    estado: 'activo'
  },
  derivacion: {
    motivo: 'Seguimiento académico',
    descripcion: 'Seguimiento del progreso académico del estudiante',
    estado: 'abierta'
  }
};


enviarWebhookEvento(eventoPrueba);


