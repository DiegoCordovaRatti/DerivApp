import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Button,
  Divider,
  Avatar,
  Tag,
  List
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  DashboardOutlined,
  BookOutlined,
  HeartOutlined,
  CrownOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Bienvenida.scss';

const { Title, Text, Paragraph } = Typography;

const Bienvenida = () => {
  const { userProfile, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Información sobre la aplicación
  const appInfo = {
    title: 'DerivApp Chile',
    description: 'Sistema integral de gestión de derivaciones educacionales para el apoyo y seguimiento de estudiantes en el ámbito escolar.',
    mission: 'Facilitar la comunicación entre profesionales de la educación, psicólogos y trabajadores sociales para brindar el mejor apoyo a los estudiantes que lo necesitan.'
  };

  // Configuración de roles con sus funcionalidades
  const roleConfig = {
    administrador: {
      title: 'Administrador del Sistema',
      color: 'purple',
      icon: <CrownOutlined />,
      description: 'Tienes control total sobre el sistema y puedes gestionar todos los aspectos de la aplicación.',
      features: [
        { icon: <DashboardOutlined />, text: 'Acceso completo al panel de control', available: true },
        { icon: <UserOutlined />, text: 'Gestión de usuarios y roles', available: true },
        { icon: <FileTextOutlined />, text: 'Gestión completa de expedientes', available: true },
        { icon: <CalendarOutlined />, text: 'Administración de agendas y citas', available: true },
        { icon: <ExclamationCircleOutlined />, text: 'Monitoreo de alertas tempranas', available: true },
        { icon: <SettingOutlined />, text: 'Configuración del sistema', available: true }
      ],
      quickActions: [
        { label: 'Panel de Control', path: '/dashboard', icon: <DashboardOutlined /> },
        { label: 'Gestionar Usuarios', path: '/configuracion', icon: <UserOutlined /> },
        { label: 'Ver Expedientes', path: '/expedientes', icon: <FileTextOutlined /> }
      ]
    },
    psicologo: {
      title: 'Psicólogo',
      color: 'blue',
      icon: <HeartOutlined />,
      description: 'Como psicólogo, tienes acceso completo para gestionar derivaciones, expedientes y seguimiento de estudiantes.',
      features: [
        { icon: <DashboardOutlined />, text: 'Panel de control con estadísticas', available: true },
        { icon: <FileTextOutlined />, text: 'Gestión completa de expedientes', available: true },
        { icon: <BookOutlined />, text: 'Crear y editar derivaciones', available: true },
        { icon: <CalendarOutlined />, text: 'Gestión de agendas y citas', available: true },
        { icon: <ExclamationCircleOutlined />, text: 'Monitoreo de alertas tempranas', available: true },
        { icon: <UserOutlined />, text: 'Gestión de usuarios', available: false }
      ],
      quickActions: [
        { label: 'Panel de Control', path: '/dashboard', icon: <DashboardOutlined /> },
        { label: 'Ver Expedientes', path: '/expedientes', icon: <FileTextOutlined /> },
        { label: 'Agendar Citas', path: '/agenda', icon: <CalendarOutlined /> }
      ]
    },
    trabajador_social: {
      title: 'Trabajador Social',
      color: 'green',
      icon: <TeamOutlined />,
      description: 'Tienes acceso completo para el seguimiento social y apoyo integral de los estudiantes.',
      features: [
        { icon: <DashboardOutlined />, text: 'Panel de control con estadísticas', available: true },
        { icon: <FileTextOutlined />, text: 'Gestión completa de expedientes', available: true },
        { icon: <BookOutlined />, text: 'Crear y editar derivaciones', available: true },
        { icon: <CalendarOutlined />, text: 'Gestión de agendas y citas', available: true },
        { icon: <ExclamationCircleOutlined />, text: 'Monitoreo de alertas tempranas', available: true },
        { icon: <UserOutlined />, text: 'Gestión de usuarios', available: false }
      ],
      quickActions: [
        { label: 'Panel de Control', path: '/dashboard', icon: <DashboardOutlined /> },
        { label: 'Ver Expedientes', path: '/expedientes', icon: <FileTextOutlined /> },
        { label: 'Crear Derivación', path: '/formulario-derivacion', icon: <BookOutlined /> }
      ]
    },
    jefe_convivencia: {
      title: 'Jefe de Convivencia',
      color: 'orange',
      icon: <ExclamationCircleOutlined />,
      description: 'Supervisas la convivencia escolar y tienes acceso completo para gestionar casos y derivaciones.',
      features: [
        { icon: <DashboardOutlined />, text: 'Panel de control con estadísticas', available: true },
        { icon: <FileTextOutlined />, text: 'Gestión completa de expedientes', available: true },
        { icon: <BookOutlined />, text: 'Crear y editar derivaciones', available: true },
        { icon: <CalendarOutlined />, text: 'Gestión de agendas y citas', available: true },
        { icon: <ExclamationCircleOutlined />, text: 'Monitoreo de alertas tempranas', available: true },
        { icon: <UserOutlined />, text: 'Gestión de usuarios', available: false }
      ],
      quickActions: [
        { label: 'Panel de Control', path: '/dashboard', icon: <DashboardOutlined /> },
        { label: 'Alertas Tempranas', path: '/alertas', icon: <ExclamationCircleOutlined /> },
        { label: 'Ver Expedientes', path: '/expedientes', icon: <FileTextOutlined /> }
      ]
    },
    docente: {
      title: 'Docente',
      color: 'default',
      icon: <BookOutlined />,
      description: 'Como docente, puedes crear derivaciones para estudiantes que requieren apoyo especializado y consultar expedientes.',
      features: [
        { icon: <BookOutlined />, text: 'Crear derivaciones para estudiantes', available: true },
        { icon: <FileTextOutlined />, text: 'Consultar expedientes de estudiantes', available: true },
        { icon: <DashboardOutlined />, text: 'Panel de control', available: false },
        { icon: <CalendarOutlined />, text: 'Gestión de agendas', available: false },
        { icon: <ExclamationCircleOutlined />, text: 'Alertas tempranas', available: false },
        { icon: <UserOutlined />, text: 'Gestión de usuarios', available: false }
      ],
      quickActions: [
        { label: 'Crear Derivación', path: '/formulario-derivacion', icon: <BookOutlined /> },
        { label: 'Ver Expedientes', path: '/expedientes', icon: <FileTextOutlined /> },
        { label: 'Mi Perfil', path: '/perfil', icon: <UserOutlined /> }
      ]
    }
  };

  const currentRoleConfig = roleConfig[userProfile?.rol] || roleConfig.docente;

  const handleQuickAction = (path) => {
    navigate(path);
  };

  // Helper para verificar si el usuario puede acceder a una ruta
  const canAccessRoute = (path) => {
    const routePermissions = {
      '/dashboard': 'dashboard',
      '/expedientes': 'expedientes',
      '/agenda': 'agenda',
      '/alertas': 'alertas',
      '/formulario-derivacion': 'derivaciones',
      '/configuracion': 'configuracion',
      '/perfil': null // siempre accesible
    };
    
    const permission = routePermissions[path];
    if (!permission) return true; // Rutas sin permisos específicos
    
    if (permission === 'derivaciones') {
      return hasPermission('derivaciones', 'crear');
    } else if (['expedientes', 'agenda', 'alertas'].includes(permission)) {
      return hasPermission(permission, 'ver');
    } else {
      return hasPermission(permission);
    }
  };

  return (
    <div className="bienvenida-container">
      {/* Header de bienvenida */}
      <div className="bienvenida-header">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={1} style={{ margin: 0, color: '#1f2937' }}>
                  ¡Bienvenido a {appInfo.title}!
                </Title>
                <Text type="secondary" style={{ fontSize: '18px' }}>
                  Hola <Text strong>{userProfile?.nombre} {userProfile?.apellido}</Text>, 
                  es un gusto tenerte en nuestro sistema.
                </Text>
              </div>
              <Paragraph style={{ fontSize: '16px', color: '#4b5563' }}>
                {appInfo.description}
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} lg={8} style={{ textAlign: 'center' }}>
            <div className="welcome-illustration">
              <div className="profile-card">
                <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />
                <div style={{ marginTop: 16 }}>
                  <Tag 
                    color={currentRoleConfig.color} 
                    icon={currentRoleConfig.icon}
                    style={{ fontSize: '14px', padding: '6px 12px' }}
                  >
                    {currentRoleConfig.title}
                  </Tag>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* Información del rol del usuario */}
        <Col xs={24} lg={16}>
          <Card className="role-info-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={3}>
                  <Space>
                    {currentRoleConfig.icon}
                    Tu rol: {currentRoleConfig.title}
                  </Space>
                </Title>
                <Paragraph style={{ fontSize: '16px' }}>
                  {currentRoleConfig.description}
                </Paragraph>
              </div>

              <div>
                <Title level={4}>
                  <BulbOutlined /> ¿Qué puedes hacer en el sistema?
                </Title>
                <List
                  dataSource={currentRoleConfig.features}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        {item.icon}
                        <Text 
                          style={{ 
                            color: item.available ? '#1f2937' : '#9ca3af',
                            textDecoration: item.available ? 'none' : 'line-through'
                          }}
                        >
                          {item.text}
                        </Text>
                        {item.available ? (
                          <CheckCircleOutlined style={{ color: '#10b981' }} />
                        ) : (
                          <Text type="secondary">(No disponible para tu rol)</Text>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Panel de acciones rápidas */}
        <Col xs={24} lg={8}>
          <Card title="Acciones Rápidas" className="quick-actions-card">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {currentRoleConfig.quickActions.map((action, index) => (
                <Button
                  key={index}
                  type="default"
                  size="large"
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.path)}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left',
                    height: 'auto',
                    padding: '12px 16px'
                  }}
                  disabled={!canAccessRoute(action.path)}
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span>{action.label}</span>
                    <ArrowRightOutlined />
                  </Space>
                </Button>
              ))}
            </Space>
          </Card>

          {/* Información adicional */}
          <Card title="Sobre DerivApp" style={{ marginTop: 16 }}>
            <Paragraph style={{ margin: 0 }}>
              {appInfo.mission}
            </Paragraph>
            <Divider />
            <Text type="secondary">
              Si tienes dudas sobre cómo usar el sistema, contacta al administrador.
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Mensaje específico para docentes */}
      {userProfile?.rol === 'docente' && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Alert
              message="Información para Docentes"
              description="Como docente, tu principal función es identificar estudiantes que necesitan apoyo especializado y crear derivaciones. Los profesionales del equipo psicosocial se encargarán del seguimiento posterior."
              type="info"
              showIcon
              icon={<BookOutlined />}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Bienvenida;
