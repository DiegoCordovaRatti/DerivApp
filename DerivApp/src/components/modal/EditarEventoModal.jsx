import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, message, Space } from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { actualizarEvento } from '../../services/eventoService';

const { Option } = Select;
const { TextArea } = Input;

const EditarEventoModal = ({ evento, visible, onClose, onEventoActualizado }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Configurar valores iniciales cuando se abre el modal
  useEffect(() => {
    if (visible && evento) {
      const fechaEvento = evento.fecha?.toDate?.() || new Date(evento.fecha);
      
      form.setFieldsValue({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        tipo: evento.tipo,
        prioridad: evento.prioridad,
        fecha: dayjs(fechaEvento),
        hora: dayjs(fechaEvento),
        status: evento.status
      });
    }
  }, [visible, evento, form]);

  // Resetear formulario cuando se cierra
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    if (!evento.derivacionId) {
      message.error('No se puede actualizar: falta información de derivación');
      return;
    }

    setLoading(true);
    try {
      // Combinar fecha y hora
      const fechaCompleta = values.fecha
        .hour(values.hora.hour())
        .minute(values.hora.minute())
        .toDate();

      const datosEvento = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        tipo: values.tipo,
        prioridad: values.prioridad,
        fecha: fechaCompleta.toISOString(),
        status: values.status,
        estudianteId: evento.estudianteId
      };

      const eventoActualizado = await actualizarEvento(evento.id, datosEvento, evento.derivacionId);
      
      message.success('Evento actualizado exitosamente');
      
      // Notificar al componente padre
      if (onEventoActualizado) {
        onEventoActualizado({
          ...evento,
          ...eventoActualizado,
          fecha: fechaCompleta
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      message.error('Error al actualizar el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <EditOutlined />
          <span>Editar Evento</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <Form.Item
          name="titulo"
          label="Título del Evento"
          rules={[
            { required: true, message: 'El título es obligatorio' },
            { min: 3, message: 'El título debe tener al menos 3 caracteres' }
          ]}
        >
          <Input placeholder="Ingrese el título del evento" />
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
        >
          <TextArea 
            rows={3} 
            placeholder="Descripción del evento (opcional)"
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="tipo"
            label="Tipo de Evento"
            rules={[{ required: true, message: 'Seleccione un tipo' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Seleccione tipo">
              <Option value="seguimiento">Seguimiento</Option>
              <Option value="evaluacion">Evaluación</Option>
              <Option value="intervencion">Intervención</Option>
              <Option value="reunion">Reunión</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="prioridad"
            label="Prioridad"
            rules={[{ required: true, message: 'Seleccione una prioridad' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Seleccione prioridad">
              <Option value="alta">Alta</Option>
              <Option value="media">Media</Option>
              <Option value="baja">Baja</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="fecha"
            label="Fecha"
            rules={[{ required: true, message: 'Seleccione una fecha' }]}
            style={{ flex: 1 }}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Seleccione fecha"
            />
          </Form.Item>

          <Form.Item
            name="hora"
            label="Hora"
            rules={[{ required: true, message: 'Seleccione una hora' }]}
            style={{ flex: 1 }}
          >
            <TimePicker 
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="Seleccione hora"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="status"
          label="Estado"
          rules={[{ required: true, message: 'Seleccione un estado' }]}
        >
          <Select placeholder="Seleccione estado">
            <Option value="pendiente">Pendiente</Option>
            <Option value="en_proceso">En Proceso</Option>
            <Option value="completado">Completado</Option>
            <Option value="cancelado">Cancelado</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<CalendarOutlined />}
            >
              Actualizar Evento
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditarEventoModal;
