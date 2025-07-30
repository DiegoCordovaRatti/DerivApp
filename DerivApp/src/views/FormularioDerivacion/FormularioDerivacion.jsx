import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  Collapse,
  Row,
  Col,
  Divider,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SaveOutlined,
  SendOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import './FormularioDerivacion.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const FormularioDerivacion = () => {
  const [form] = Form.useForm();
  const [activeKeys, setActiveKeys] = useState(['1', '2']); // Datos del estudiante y Motivo expandidos

  const handlePanelChange = (keys) => {
    setActiveKeys(keys);
  };

  const handleGuardarBorrador = () => {
    console.log('Guardar borrador');
  };

  const handleEnviarDerivacion = () => {
    console.log('Enviar derivación');
  };

  return (
    <div className="formulario-derivacion-container">
      <div className="formulario-header">
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Nueva Derivación Psicosocial
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Complete el formulario con la información del estudiante y los detalles de la derivación.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="formulario-derivacion"
        style={{ marginTop: '24px' }}
      >
        <Collapse
          activeKey={activeKeys}
          onChange={handlePanelChange}
          ghost
          size="large"
        >
          {/* Sección 1: Datos del Estudiante */}
          <Panel
            header={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text strong>Datos del Estudiante</Text>
              </Space>
            }
            key="1"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="ID del Estudiante *"
                  name="studentId"
                  rules={[{ required: true, message: 'Por favor ingrese el ID del estudiante' }]}
                >
                  <Input
                    placeholder="ID del estudiante"
                    size="large"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Responsable *"
                  name="responsableId"
                  rules={[{ required: true, message: 'Por favor seleccione el responsable' }]}
                >
                  <Select
                    placeholder="Seleccionar responsable"
                    size="large"
                    showSearch
                    optionFilterProp="children"
                    prefix={<TeamOutlined />}
                  >
                    <Option value="psicologo1">Psicólogo María González</Option>
                    <Option value="psicologo2">Psicólogo Juan Pérez</Option>
                    <Option value="psicologo3">Psicóloga Ana Rodríguez</Option>
                    <Option value="psicologo4">Psicólogo Carlos Silva</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Fecha de Apertura *"
                  name="fechaApertura"
                  rules={[{ required: true, message: 'Por favor seleccione la fecha de apertura' }]}
                >
                  <DatePicker
                    placeholder="Seleccionar fecha"
                    size="large"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Estado *"
                  name="estado"
                  rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
                >
                  <Select
                    placeholder="Seleccionar estado"
                    size="large"
                  >
                    <Option value="pendiente">Pendiente</Option>
                    <Option value="en seguimiento">En Seguimiento</Option>
                    <Option value="cerrado">Cerrado</Option>
                    <Option value="archivado">Archivado</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 2: Motivo de la Derivación */}
          <Panel
            header={
              <Space>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                <Text strong>Motivo de la Derivación</Text>
              </Space>
            }
            key="2"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Motivo *"
                  name="motivo"
                  rules={[
                    { required: true, message: 'Por favor describa el motivo de la derivación' },
                    { min: 5, message: 'El motivo debe tener al menos 5 caracteres' }
                  ]}
                >
                  <TextArea
                    placeholder="Describa el motivo de la derivación"
                    rows={6}
                    showCount
                    maxLength={1000}
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Derivado Por *"
                  name="derivadoPor"
                  rules={[{ required: true, message: 'Por favor ingrese quién deriva el caso' }]}
                >
                  <Input
                    placeholder="Nombre de quien deriva el caso"
                    size="large"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 3: Información Adicional */}
          <Panel
            header={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                <Text strong>Información Adicional</Text>
              </Space>
            }
            key="3"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Prioridad"
                  name="prioridad"
                >
                  <Select
                    placeholder="Seleccionar prioridad"
                    size="large"
                  >
                    <Option value="baja">Baja</Option>
                    <Option value="media">Media</Option>
                    <Option value="alta">Alta</Option>
                    <Option value="urgente">Urgente</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tipo de Caso"
                  name="tipoCaso"
                >
                  <Select
                    placeholder="Seleccionar tipo"
                    size="large"
                  >
                    <Option value="conductual">Conductual</Option>
                    <Option value="emocional">Emocional</Option>
                    <Option value="academico">Académico</Option>
                    <Option value="familiar">Familiar</Option>
                    <Option value="social">Social</Option>
                    <Option value="crisis">Crisis</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Observaciones"
                  name="observaciones"
                >
                  <TextArea
                    placeholder="Agregue observaciones adicionales si es necesario"
                    rows={3}
                    showCount
                    maxLength={500}
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 4: Datos de Contacto */}
          <Panel
            header={
              <Space>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <Text strong>Datos de Contacto</Text>
              </Space>
            }
            key="4"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Teléfono de Contacto"
                  name="telefonoContacto"
                >
                  <Input
                    placeholder="+56 9 1234 5678"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email de Contacto"
                  name="emailContacto"
                >
                  <Input
                    placeholder="contacto@email.com"
                    size="large"
                    type="email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                >
                  <Input
                    placeholder="Dirección del estudiante"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          
        </Collapse>

        <Divider />

        {/* Botones de Acción */}
        <div className="formulario-actions">
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Button
                size="large"
                icon={<SaveOutlined />}
                onClick={handleGuardarBorrador}
                style={{
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Guardar Borrador
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={handleEnviarDerivacion}
                style={{
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Enviar Derivación
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default FormularioDerivacion; 