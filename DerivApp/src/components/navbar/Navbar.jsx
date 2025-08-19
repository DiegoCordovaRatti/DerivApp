import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Divider,
  Dropdown,
  message
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
  CheckCircleFilled,
  LogoutOutlined,
  SettingOutlined,
  CrownOutlined,
  HomeOutlined,
  SyncOutlined,
  CloseCircleFilled
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { notificacionService } from '../../services/notificacionService';
import logoNavbar from '../../assets/images/logo.png';
import './Navbar.scss';

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(location.pathname);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { userProfile, logout, hasPermission } = useAuth();

  // Cargar notificaciones al montar el componente (solo para roles que no sean docente)
  useEffect(() => {
    if (userProfile && userProfile.rol !== 'docente') {
      cargarNotificaciones();
      // Actualizar notificaciones cada 5 minutos
      const interval = setInterval(cargarNotificaciones, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userProfile]);

  const cargarNotificaciones = async () => {
    if (!userProfile || userProfile.rol === 'docente') return;
    
    setLoadingNotifications(true);
    try {
      const response = await notificacionService.obtenerNotificaciones();
      if (response.success) {
        setNotifications(response.notificaciones);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const marcarNotificacionComoLeida = async (notificacionId) => {
    try {
      await notificacionService.marcarComoLeida(notificacionId);
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificacionId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      message.error('Error al marcar notificación como leída');
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await notificacionService.marcarTodasComoLeidas();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      message.success('Todas las notificaciones han sido marcadas como leídas');
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      message.error('Error al marcar todas las notificaciones como leídas');
    }
  };

  // Configuración de los elementos del menú con verificación de permisos
  const menuItems = userProfile ? [
    hasPermission('dashboard') && {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Panel de control',
    },
    hasPermission('derivaciones', 'crear') && {
      key: '/formulario-derivacion',
      icon: <FileTextOutlined />,
      label: 'Nueva Derivación',
    },
    hasPermission('expedientes', 'ver') && {
      key: '/expedientes',
      icon: <FileTextOutlined />,
      label: 'Expedientes',
    },
    hasPermission('alertas', 'ver') && {
      key: '/alertas',
      icon: <ExclamationCircleOutlined />,
      label: 'Alertas Tempranas',
    },
    hasPermission('agenda', 'ver') && {
      key: '/agenda',
      icon: <CalendarOutlined />,
      label: 'Agendamiento',
    },
  ].filter(Boolean) : []; // Filtrar elementos falsy o retornar array vacío si no hay usuario
  
  // Función para manejar logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      message.error('Error al cerrar sesión');
    }
  };

  // Función para obtener rol badge
  const getRoleBadge = (rol) => {
    // Verificar que rol existe y es una cadena
    if (!rol || typeof rol !== 'string') {
      return (
        <Tag color="default">
          CARGANDO...
        </Tag>
      );
    }
    
    const roleConfig = {
      'administrador': { color: 'purple', icon: <CrownOutlined /> },
      'psicologo': { color: 'blue', icon: null },
      'trabajador_social': { color: 'green', icon: null },
      'jefe_convivencia': { color: 'orange', icon: null },
      'docente': { color: 'default', icon: null }
    };
    
    const config = roleConfig[rol] || roleConfig['docente'];
    return (
      <Tag color={config.color} icon={config.icon}>
        {rol.replace('_', ' ').toUpperCase()}
      </Tag>
    );
  };

  // Menú del dropdown del usuario
  const userMenuItems = userProfile ? [
    {
      key: 'perfil',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => navigate('/perfil')
    },
    hasPermission('configuracion') && {
      key: 'configuracion',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/configuracion')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: handleLogout,
      danger: true
    }
  ].filter(Boolean) : [];

  const handleMenuClick = (e) => {
    setCurrent(e.key);
  };

  const getNotificationIcon = (type, color) => {
    const iconColor = color || getDefaultColor(type);
    
    switch (type) {
      case 'urgent':
        return <ExclamationCircleFilled style={{ color: iconColor }} />;
      case 'warning':
        return <ExclamationCircleFilled style={{ color: iconColor }} />;
      case 'success':
        return <CheckCircleFilled style={{ color: iconColor }} />;
      case 'processing':
        return <SyncOutlined spin style={{ color: iconColor }} />;
      case 'error':
        return <CloseCircleFilled style={{ color: iconColor }} />;
      case 'info':
      default:
        return <InfoCircleFilled style={{ color: iconColor }} />;
    }
  };

  const getDefaultColor = (type) => {
    switch (type) {
      case 'urgent': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'success': return '#52c41a';
      case 'processing': return '#722ed1';
      case 'error': return '#ff4d4f';
      case 'info':
      default: return '#1890ff';
    }
  };

  const getNotificationTag = (type, color, customText) => {
    const tagColor = color || getDefaultColor(type);
    let text = customText;
    
    if (!text) {
      switch (type) {
        case 'urgent': text = 'Crítico'; break;
        case 'warning': text = 'Advertencia'; break;
        case 'success': text = 'Confirmado'; break;
        case 'processing': text = 'En proceso'; break;
        case 'error': text = 'Cancelado'; break;
        case 'info':
        default: text = 'Información'; break;
      }
    }
    
    return <Tag style={{ color: tagColor, borderColor: tagColor, backgroundColor: `${tagColor}15` }}>{text}</Tag>;
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
            {/* Notificaciones - Solo para roles que no sean docente */}
            {userProfile && userProfile.rol !== 'docente' && (
              <Badge count={unreadCount} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="notification-btn"
                  onClick={() => setNotificationsOpen(true)}
                />
              </Badge>
            )}

            {/* Perfil de usuario */}
            {userProfile ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="user-profile" style={{ cursor: 'pointer' }}>
                  <Space>
                    <div className="user-info">
                      <Text className="user-name" strong>
                        {userProfile.nombre} {userProfile.apellido}
                      </Text>
                      <div className="user-role">
                        {getRoleBadge(userProfile.rol)}
                      </div>
                    </div>
                    <Avatar 
                      icon={<UserOutlined />} 
                      className="user-avatar"
                      size="default"
                    />
                  </Space>
                </div>
              </Dropdown>
            ) : (
              <div className="user-profile">
                <Space>
                  <div className="user-info">
                    <Text className="user-name" type="secondary">
                      Cargando...
                    </Text>
                  </div>
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="user-avatar"
                    size="default"
                  />
                </Space>
              </div>
            )}
          </Space>
        </div>
      </div>

      {/* Drawer de notificaciones */}
              <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Title level={4} style={{ margin: 0 }}>
                Notificaciones ({notifications.filter(n => !n.read).length} sin leer)
              </Title>
              <Space>
                {notifications.some(n => !n.read) && (
                  <Button 
                    size="small" 
                    type="text"
                    onClick={marcarTodasComoLeidas}
                    style={{ fontSize: '12px' }}
                  >
                    Marcar todas como leídas
                  </Button>
                )}
                <Button 
                  size="small" 
                  type="text" 
                  icon={<CloseOutlined />} 
                  onClick={() => setNotificationsOpen(false)}
                />
              </Space>
            </div>
          }
        placement="right"
        onClose={() => setNotificationsOpen(false)}
        open={notificationsOpen}
        width={400}
        className="notifications-drawer"
      >
        <List
          loading={loadingNotifications}
          dataSource={notifications}
          locale={{
            emptyText: loadingNotifications ? 'Cargando notificaciones...' : 'No hay notificaciones'
          }}
          renderItem={(notification) => (
            <List.Item 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              style={{ 
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (!notification.read) {
                  marcarNotificacionComoLeida(notification.id);
                }
                // Navegar según el tipo de notificación
                if (notification.categoria === 'alerta') {
                  navigate('/alertas');
                } else if (notification.categoria === 'evento') {
                  navigate('/agenda');
                }
                setNotificationsOpen(false);
              }}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type, notification.color)}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ margin: 0, color: notification.color || getDefaultColor(notification.type) }}>
                      {notification.title}
                    </Text>
                    {getNotificationTag(notification.type, notification.color)}
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {notification.message}
                    </Text>
                    <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {notification.time}
                      </Text>
                      {notification.categoria && (
                        <Tag 
                          size="small" 
                          style={{ 
                            color: notification.color || (notification.categoria === 'alerta' ? '#ff4d4f' : '#52c41a'),
                            borderColor: notification.color || (notification.categoria === 'alerta' ? '#ff4d4f' : '#52c41a'),
                            backgroundColor: `${notification.color || (notification.categoria === 'alerta' ? '#ff4d4f' : '#52c41a')}15`
                          }}
                        >
                          {notification.categoria === 'alerta' ? 'Alerta' : 'Evento'}
                        </Tag>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        
        <Divider />
        
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Space>
              <Button 
                type="link" 
                size="small"
                loading={loadingNotifications}
                onClick={cargarNotificaciones}
              >
                Actualizar
              </Button>
              <Button 
                type="link" 
                size="small"
                onClick={() => {
                  // Navegar a la vista de alertas o crear una vista de notificaciones
                  navigate('/alertas');
                  setNotificationsOpen(false);
                }}
              >
                Ver todas las notificaciones
              </Button>
            </Space>
          </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;