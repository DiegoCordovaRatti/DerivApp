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
        descripcion: eventoData.descripcion,
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

// Datos de prueba con información del apoderado
const eventoPrueba = {
  id: 'evento_test_123',
  titulo: 'Seguimiento conductual - PRUEBA',
  fecha: '2024-12-15',
  hora: '19:26',
  tipo: 'intervencion',
  prioridad: 'alta',
  descripcion: 'Seguimiento del comportamiento del estudiante - PRUEBA WEBHOOK',
  estudiante: {
    nombre: 'Alejandro C',
    curso: '2°A',
    rut: '12345678-9',
    apoderado: 'María González',
    telefono_contacto: '+56912345678',
    email_contacto: 'maria.gonzalez@email.com'
  },
  derivacion: {
    motivo: 'Problemas de conducta',
    descripcion: 'Comportamiento disruptivo en clase',
    estado: 'abierta'
  }
};

// Ejecutar prueba
console.log('🧪 Iniciando prueba de webhook...');
console.log('🔧 Configuración actual:');
console.log('   - N8N_WEBHOOK_URL:', process.env.N8N_WEBHOOK_URL || 'NO CONFIGURADA');
console.log('📞 Datos del apoderado incluidos:');
console.log('   - Nombre:', eventoPrueba.estudiante.apoderado);
console.log('   - Teléfono:', eventoPrueba.estudiante.telefono_contacto);
console.log('   - Email:', eventoPrueba.estudiante.email_contacto);

enviarWebhookEvento(eventoPrueba);


