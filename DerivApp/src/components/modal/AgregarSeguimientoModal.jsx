import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  message
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from '../../utils/dayjs';

const { TextArea } = Input;
const { Option } = Select;

const AgregarSeguimientoModal = ({
  visible,
  onCancel,
  loading,
  form,
  onFinish,
  derivacion
}) => {
  const handleSubmit = async (values) => {
    try {
      // Preparar datos para el backend
      const datosSeguimiento = {
        ...values,
        fecha: values.fecha ? values.fecha.toDate() : new Date(), // Convertir a Date object
        fecha_creacion: new Date()
      };


      await onFinish(datosSeguimiento);
      form.resetFields();
      message.success('Seguimiento agregado correctamente');
    } catch (error) {
      console.error('Error al agregar seguimiento:', error);
      message.error('Error al agregar el seguimiento');
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          <span>Agregar Seguimiento</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          fecha: dayjs(),
          tipo: 'evaluacion',
          responsable: 'Trabajador Social'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="tipo"
              label={
                <span>
                  <FileTextOutlined style={{ marginRight: '4px' }} />
                  Tipo de Seguimiento
                </span>
              }
              rules={[{ required: true, message: 'Selecciona el tipo de seguimiento' }]}
            >
              <Select placeholder="Selecciona el tipo">
                <Option value="evaluacion">Evaluación</Option>
                <Option value="entrevista">Entrevista</Option>
                <Option value="visita_domiciliaria">Visita Domiciliaria</Option>
                <Option value="reunion_apoderado">Reunión con Apoderado</Option>
                <Option value="intervencion">Intervención</Option>
                <Option value="seguimiento">Seguimiento General</Option>
                <Option value="cierre">Cierre de Caso</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="fecha"
              label={
                <span>
                  <CalendarOutlined style={{ marginRight: '4px' }} />
                  Fecha del Seguimiento
                </span>
              }
              rules={[{ required: true, message: 'Selecciona la fecha' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Selecciona fecha"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="responsable"
              label={
                <span>
                  <UserOutlined style={{ marginRight: '4px' }} />
                  Responsable
                </span>
              }
              rules={[{ required: true, message: 'Ingresa el responsable' }]}
            >
              <Input placeholder="Ej: Trabajador Social" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="duracion"
              label="Duración (minutos)"
            >
              <Input placeholder="Ej: 45" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="descripcion"
          label="Descripción del Seguimiento"
          rules={[{ required: true, message: 'Ingresa la descripción del seguimiento' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Describe los detalles del seguimiento realizado..."
          />
        </Form.Item>

        <Form.Item
          name="observaciones"
          label="Observaciones Adicionales"
        >
          <TextArea 
            rows={3} 
            placeholder="Observaciones adicionales o notas importantes..."
          />
        </Form.Item>

        <Form.Item
          name="resultado"
          label="Resultado del Seguimiento"
          rules={[{ required: true, message: 'Selecciona el resultado' }]}
        >
          <Select placeholder="Selecciona el resultado">
            <Option value="positivo">Positivo</Option>
            <Option value="neutro">Neutro</Option>
            <Option value="negativo">Negativo</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              Agregar Seguimiento
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarSeguimientoModal; 