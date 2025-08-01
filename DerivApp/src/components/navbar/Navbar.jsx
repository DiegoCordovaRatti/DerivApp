import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Badge, 
  Avatar, 
  Space, 
  Typography,
  Button,
  Drawer,
  List,
  Tag,
  Divider
} from 'antd';
import { 
  BellOutlined, 
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
  CheckCircleFilled
} from '@ant-design/icons';
import logoNavbar from '../../assets/images/logo.png';
import './Navbar.scss';

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Datos mock de notificaciones
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Derivación urgente pendiente',
      message: 'El estudiante Juan Pérez requiere atención inmediata',
      time: 'Hace 5 minutos',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Nueva derivación recibida',
      message: 'María Silva ha sido derivada al equipo psicosocial',
      time: 'Hace 1 hora',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Seguimiento completado',
      message: 'El caso de Carlos Rodríguez ha sido cerrado exitosamente',
      time: 'Hace 2 horas',
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Recordatorio de reunión',
      message: 'Reunión de equipo programada para mañana a las 9:00 AM',
      time: 'Hace 3 horas',
      read: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Actualización de sistema',
      message: 'Nuevas funcionalidades disponibles en DerivApp',
      time: 'Hace 1 día',
      read: true
    }
  ];

  // Configuración de los elementos del menú
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Panel de control',
    },
    {
      key: '/expedientes',
      icon: <FileTextOutlined />,
      label: 'Expedientes',
    },
    {
      key: '/alertas',
      icon: <ExclamationCircleOutlined />,
      label: 'Alertas Tempranas',
    },
    {
      key: '/agenda',
      icon: <CalendarOutlined />,
      label: 'Agendamiento',
    },
    {
      key: '/formulario-derivacion',
      icon: <FileTextOutlined />,
      label: 'Nueva Derivación',
    },
  ];

  const handleMenuClick = (e) => {
    setCurrent(e.key);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <ExclamationCircleFilled style={{ color: '#faad14' }} />;
      case 'success':
        return <CheckCircleFilled style={{ color: '#52c41a' }} />;
      case 'info':
      default:
        return <InfoCircleFilled style={{ color: '#1890ff' }} />;
    }
  };

  const getNotificationTag = (type) => {
    switch (type) {
      case 'urgent':
        return <Tag color="red">Urgente</Tag>;
      case 'warning':
        return <Tag color="orange">Advertencia</Tag>;
      case 'success':
        return <Tag color="green">Completado</Tag>;
      case 'info':
      default:
        return <Tag color="blue">Información</Tag>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Header className="navbar-header">
      <div className="navbar-container">
        {/* Logo y marca */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <div className="logo-container">
              <img src={logoNavbar} alt="DerivApp" className="logo-image" />
              <Text className="logo-text">DerivApp</Text>
            </div>
          </Link>
        </div>

        {/* Navegación central */}
        <div className="navbar-navigation">
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            onClick={handleMenuClick}
            items={menuItems.map(item => ({
              ...item,
              label: <Link to={item.key}>{item.label}</Link>
            }))}
            className="navbar-menu"
          />
        </div>

        {/* Notificaciones y perfil */}
        <div className="navbar-actions">
          <Space size="middle">
            {/* Notificaciones */}
            <Badge count={unreadCount} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="notification-btn"
                onClick={() => setNotificationsOpen(true)}
              />
            </Badge>

            {/* Perfil de usuario */}
            <Link to="/perfil" className="user-profile-link">
              <div className="user-profile">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="user-avatar"
                  size="small"
                />
                <Text className="user-name">María González</Text>
              </div>
            </Link>
          </Space>
        </div>
      </div>

      {/* Drawer de notificaciones */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Notificaciones</Title>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => setNotificationsOpen(false)}
            />
          </div>
        }
        placement="right"
        onClose={() => setNotificationsOpen(false)}
        open={notificationsOpen}
        width={400}
        className="notifications-drawer"
      >
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              style={{ 
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer'
              }}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type)}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ margin: 0 }}>
                      {notification.title}
                    </Text>
                    {getNotificationTag(notification.type)}
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {notification.message}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {notification.time}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        
        <Divider />
        
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Button type="link" size="small">
            Ver todas las notificaciones
          </Button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;