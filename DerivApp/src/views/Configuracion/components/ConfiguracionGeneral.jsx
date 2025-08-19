import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Typography,
  Alert,
  Divider,
  Row,
  Col,
  message
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  MailOutlined,
  GlobalOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ConfiguracionGeneral = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Configuraciones por defecto
  const [configuraciones, setConfiguraciones] = useState({
    // Configuraciones de la aplicación
    nombreApp: 'DerivApp Chile',
    descripcionApp: 'Sistema de gestión de derivaciones educacionales',
    logoUrl: '',
    
    // Configuraciones de base de datos
    backupAutomatico: true,
    frecuenciaBackup: 'diario',
    retencionBackup: 30,
    
    // Configuraciones de notificaciones
    notificacionesEmail: true,
    notificacionesTelegram: true,
    emailNotificaciones: 'notificaciones@derivappchile.cl',
    
    // Configuraciones de sistema
    mantenimientoProgramado: false,
    modoDesarrollo: false,
    logNivel: 'info',
    
    // Configuraciones de webhooks
    webhookUrl: 'https://429530537538.ngrok-free.app/webhook/agendar',
    webhookTestUrl: 'https://429530537538.ngrok-free.app/webhook/test',
    webhookActivo: true,
    
    // Configuraciones de sesión
    tiempoSesion: 480, // 8 horas en minutos
    recordarSesion: true,
    
    // Configuraciones de seguridad
    intentosMaxLogin: 3,
    bloqueoTemporal: 15, // minutos
    forzarCambioPassword: false
  });

  const handleGuardarConfiguracion = async (values) => {
    setLoading(true);
    try {
      // Simular guardado de configuración
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfiguraciones({ ...configuraciones, ...values });
      message.success('Configuración guardada exitosamente');
    } catch (error) {
      message.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurarDefecto = () => {
    form.setFieldsValue(configuraciones);
    message.info('Valores restaurados');
  };

  return (
    <div className="configuracion-general">
      <Form
        form={form}
        layout="vertical"
        initialValues={configuraciones}
        onFinish={handleGuardarConfiguracion}
      >
        {/* Configuración de la Aplicación */}
        <Card 
          title={
            <Space>
              <GlobalOutlined />
              <span>Configuración de la Aplicación</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="nombreApp"
                label="Nombre de la Aplicación"
              >
                <Input placeholder="DerivApp Chile" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="logoUrl"
                label="URL del Logo"
              >
                <Input placeholder="https://ejemplo.com/logo.png" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="descripcionApp"
            label="Descripción"
          >
            <TextArea 
              rows={3} 
              placeholder="Descripción de la aplicación"
            />
          </Form.Item>
        </Card>

        {/* Configuración de Webhooks */}
        <Card 
          title={
            <Space>
              <DatabaseOutlined />
              <span>Configuración de Webhooks</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Alert
            message="Configuración de n8n"
            description="Estas URLs se utilizan para la integración con n8n y Telegram."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="webhookUrl"
                label="URL Principal del Webhook"
                extra="URL utilizada para enviar eventos en producción"
              >
                <Input placeholder="https://tu-webhook.ngrok.io/webhook/agendar" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="webhookTestUrl"
                label="URL de Testing"
                extra="URL utilizada para pruebas y desarrollo"
              >
                <Input placeholder="https://tu-webhook.ngrok.io/webhook/test" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="webhookActivo"
            label="Webhooks Activos"
            valuePropName="checked"
          >
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card 
          title={
            <Space>
              <BellOutlined />
              <span>Configuración de Notificaciones</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="notificacionesEmail"
                label="Notificaciones por Email"
                valuePropName="checked"
              >
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="notificacionesTelegram"
                label="Notificaciones por Telegram"
                valuePropName="checked"
              >
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="emailNotificaciones"
                label="Email para Notificaciones"
              >
                <Input placeholder="notificaciones@ejemplo.com" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Configuración de Sistema */}
        <Card 
          title={
            <Space>
              <SettingOutlined />
              <span>Configuración del Sistema</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="tiempoSesion"
                label="Tiempo de Sesión (minutos)"
              >
                <Input type="number" min={30} max={1440} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="intentosMaxLogin"
                label="Intentos Máximos de Login"
              >
                <Input type="number" min={1} max={10} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="bloqueoTemporal"
                label="Bloqueo Temporal (minutos)"
              >
                <Input type="number" min={5} max={60} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="recordarSesion"
                label="Recordar Sesión"
                valuePropName="checked"
              >
                <Switch checkedChildren="Sí" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="mantenimientoProgramado"
                label="Modo Mantenimiento"
                valuePropName="checked"
              >
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="modoDesarrollo"
                label="Modo Desarrollo"
                valuePropName="checked"
              >
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="logNivel"
            label="Nivel de Logs"
          >
            <Select>
              <Option value="error">Error</Option>
              <Option value="warn">Warning</Option>
              <Option value="info">Info</Option>
              <Option value="debug">Debug</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Configuración de Backup */}
        <Card 
          title={
            <Space>
              <DatabaseOutlined />
              <span>Configuración de Backup</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="backupAutomatico"
                label="Backup Automático"
                valuePropName="checked"
              >
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="frecuenciaBackup"
                label="Frecuencia de Backup"
              >
                <Select>
                  <Option value="diario">Diario</Option>
                  <Option value="semanal">Semanal</Option>
                  <Option value="mensual">Mensual</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="retencionBackup"
                label="Retención (días)"
              >
                <Input type="number" min={7} max={365} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Botones de acción */}
        <Card>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRestaurarDefecto}
            >
              Restaurar
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Guardar Configuración
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default ConfiguracionGeneral;
