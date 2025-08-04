import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  message
} from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  UserAddOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { crearEstudiante } from '../../services/estudianteService';

const { Option } = Select;

const CrearEstudianteModal = ({
  visible,
  onCancel,
  onSuccess,
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleCrearEstudiante = async () => {
    try {
      const values = await form.validateFields();
      
      // Crear el estudiante en la base de datos
      const response = await crearEstudiante(values);
      const nuevoEstudiante = response.estudiante;
      
      message.success(`Estudiante creado exitosamente: ${nuevoEstudiante.nombre}`);
      
      // Limpiar el formulario
      form.resetFields();
      
      // Cerrar el modal y notificar al componente padre
      onSuccess(nuevoEstudiante);
      
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      message.error(error.message || 'Error al crear el estudiante');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined style={{ color: '#1890ff' }} />
          <span>Crear Nuevo Estudiante</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleCrearEstudiante}
          icon={<PlusOutlined />}
          loading={loading}
        >
          Crear Estudiante
        </Button>
      ]}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          estado: 'activo',
          establecimientoId: 'RBD9493'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre Completo *"
              name="nombre"
              rules={[
                { required: true, message: 'Por favor ingrese el nombre del estudiante' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
              ]}
            >
              <Input
                placeholder="Nombre completo del estudiante"
                size="large"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="RUT *"
              name="rut"
              rules={[
                { required: true, message: 'Por favor ingrese el RUT' },
                { 
                  pattern: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 
                  message: 'Formato inválido (ej: 12.345.678-9)' 
                }
              ]}
            >
              <Input
                placeholder="12.345.678-9"
                size="large"
                prefix={<IdcardOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Curso *"
              name="curso"
              rules={[
                { required: true, message: 'Por favor seleccione el curso' }
              ]}
            >
              <Select
                placeholder="Seleccionar curso"
                size="large"
              >
                <Option value="1°A">1°A</Option>
                <Option value="1°B">1°B</Option>
                <Option value="2°A">2°A</Option>
                <Option value="2°B">2°B</Option>
                <Option value="3°A">3°A</Option>
                <Option value="3°B">3°B</Option>
                <Option value="4°A">4°A</Option>
                <Option value="4°B">4°B</Option>
                <Option value="5°A">5°A</Option>
                <Option value="5°B">5°B</Option>
                <Option value="6°A">6°A</Option>
                <Option value="6°B">6°B</Option>
                <Option value="7°A">7°A</Option>
                <Option value="7°B">7°B</Option>
                <Option value="8°A">8°A</Option>
                <Option value="8°B">8°B</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Establecimiento ID *"
              name="establecimientoId"
              rules={[{ required: true, message: 'Por favor ingrese el ID del establecimiento' }]}
            >
              <Input
                placeholder="RBD9493"
                size="large"
                prefix={<HomeOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Estado del Estudiante *"
              name="estado"
              rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
            >
              <Select
                placeholder="Seleccionar estado"
                size="large"
              >
                <Option value="activo">Activo</Option>
                <Option value="egresado">Egresado</Option>
                <Option value="derivado">Derivado</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Teléfono de Contacto"
              name="telefono_contacto"
            >
              <Input
                placeholder="+56 9 1234 5678"
                size="large"
                prefix={<PhoneOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email de Contacto"
              name="email_contacto"
              rules={[
                { type: 'email', message: 'Por favor ingrese un email válido' }
              ]}
            >
              <Input
                placeholder="contacto@email.com"
                size="large"
                type="email"
                prefix={<MailOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre del Apoderado"
              name="apoderado"
            >
              <Input
                placeholder="Nombre del apoderado"
                size="large"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Dirección"
              name="direccion"
            >
              <Input
                placeholder="Dirección del estudiante"
                size="large"
                prefix={<HomeOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CrearEstudianteModal; 