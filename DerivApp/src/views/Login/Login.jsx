import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Spin, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, WarningOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkFirebaseConfig, checkAPIConnection } from '../../utils/setupCheck';
import './Login.scss';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configCheck, setConfigCheck] = useState({ firebase: true, api: true });
  const { login, isAuthenticated, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar configuración al cargar
  useEffect(() => {
    const verifySetup = async () => {
      const firebaseOk = checkFirebaseConfig();
      const apiOk = await checkAPIConnection();
      
      setConfigCheck({ firebase: firebaseOk, api: apiOk });
      
      if (!firebaseOk || !apiOk) {
        console.log('⚠️ Configuración incompleta detectada');
      }
    };
    
    verifySetup();
  }, []);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, userProfile, navigate, location]);

  // Manejar envío del formulario
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      
      await login(email, password);
      
      // La redirección se maneja en el useEffect
    } catch (error) {
      // Los errores ya se muestran en el contexto de autenticación
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar errores de validación
  const onFinishFailed = (errorInfo) => {
    console.log('Validación fallida:', errorInfo);
    message.error('Por favor, completa todos los campos requeridos');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Space direction="vertical" align="center" size="large">
              <div className="logo">
                <img 
                  src="/src/assets/images/Logo.png" 
                  alt="DerivApp Logo" 
                  className="logo-image"
                />
              </div>
              <Title level={2} className="login-title">
                Iniciar Sesión
              </Title>
              <Text type="secondary" className="login-subtitle">
                Accede a tu cuenta de DerivApp
              </Text>
            </Space>
          </div>

          {/* Alertas de configuración */}
          {(!configCheck.firebase || !configCheck.api) && (
            <Alert
              message="Configuración Requerida"
              description={
                <div>
                  {!configCheck.firebase && (
                    <div>• Variables de Firebase no configuradas</div>
                  )}
                  {!configCheck.api && (
                    <div>• API backend no disponible</div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Abre la consola del navegador para más detalles
                    </Text>
                  </div>
                </div>
              }
              type="warning"
              icon={<WarningOutlined />}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu correo electrónico'
                },
                {
                  type: 'email',
                  message: 'Por favor ingresa un correo electrónico válido'
                }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu contraseña'
                },
                {
                  min: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                loading={loading}
                block
                className="login-button"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text type="secondary" className="login-help">
              ¿Problemas para iniciar sesión? Contacta al administrador
            </Text>
          </div>
        </Card>
      </div>
      
      {loading && (
        <div className="login-loading-overlay">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Login; 