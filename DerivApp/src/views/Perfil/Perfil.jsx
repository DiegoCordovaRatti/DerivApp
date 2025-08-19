import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Tag, 
  Descriptions, 
  Button, 
  Space, 
  Divider,
  Row,
  Col,
  Alert,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  CrownOutlined,
  CalendarOutlined,
  MailOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
import './Perfil.scss';

const { Title, Text } = Typography;

const Perfil = () => {
  const { userProfile, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);

  // Función para obtener el color del rol
  const getRoleColor = (rol) => {
    const roleColors = {
      'administrador': 'purple',
      'psicologo': 'blue',
      'trabajador_social': 'green',
      'jefe_convivencia': 'orange',
      'docente': 'default'
    };
    return roleColors[rol] || 'default';
  };

  // Función para obtener el nombre completo del rol
  const getRoleLabel = (rol) => {
    const roleLabels = {
      'administrador': 'Administrador del Sistema',
      'psicologo': 'Psicólogo',
      'trabajador_social': 'Trabajador Social',
      'jefe_convivencia': 'Jefe de Convivencia',
      'docente': 'Docente'
    };
    return roleLabels[rol] || rol;
  };

  // Función para obtener icono del rol
  const getRoleIcon = (rol) => {
    return rol === 'administrador' ? <CrownOutlined /> : <TeamOutlined />;
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="perfil-loading">
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16 }}>
            Cargando información del perfil...
          </Text>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="perfil-container">
        <Alert
          message="Error al cargar el perfil"
          description="No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <Row gutter={[24, 24]}>
        {/* Columna principal - Información del perfil */}
        <Col xs={24} lg={16}>
          <Card className="perfil-card">
            <div className="perfil-header">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="perfil-avatar"
              />
              <div className="perfil-info">
                <Title level={3} className="perfil-nombre">
                  {userProfile.nombre} {userProfile.apellido}
                </Title>
                <Tag 
                  color={getRoleColor(userProfile.rol)} 
                  icon={getRoleIcon(userProfile.rol)}
                  className="perfil-rol-tag"
                >
                  {getRoleLabel(userProfile.rol)}
                </Tag>
                <div className="perfil-estado">
                  <Tag color={userProfile.activo ? 'success' : 'error'}>
                    {userProfile.activo ? 'Activo' : 'Inactivo'}
                  </Tag>
                </div>
              </div>
              <div className="perfil-actions">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                  disabled={!userProfile.activo}
                >
                  Editar Perfil
                </Button>
              </div>
            </div>

            <Divider />

            <div className="perfil-details">
              <Title level={4}>Información Personal</Title>
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined />
                      <span>Nombre Completo</span>
                    </Space>
                  }
                >
                  {userProfile.nombre} {userProfile.apellido}
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <Space>
                      <MailOutlined />
                      <span>Correo Electrónico</span>
                    </Space>
                  }
                >
                  {userProfile.email}
                </Descriptions.Item>

                <Descriptions.Item 
                  label={
                    <Space>
                      <TeamOutlined />
                      <span>Rol en el Sistema</span>
                    </Space>
                  }
                >
                  <Tag 
                    color={getRoleColor(userProfile.rol)} 
                    icon={getRoleIcon(userProfile.rol)}
                  >
                    {getRoleLabel(userProfile.rol)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>

        {/* Columna secundaria - Información adicional */}
        <Col xs={24} lg={8}>
          {/* Card de permisos */}
          <Card 
            title={
              <Space>
                <SettingOutlined />
                <span>Permisos del Rol</span>
              </Space>
            }
            className="permisos-card"
            size="small"
          >
            <div className="permisos-list">
              {userProfile.permisos && Object.entries(userProfile.permisos).map(([seccion, permisos]) => (
                <div key={seccion} className="permiso-item">
                  <Text strong className="permiso-seccion">
                    {seccion.charAt(0).toUpperCase() + seccion.slice(1)}:
                  </Text>
                  <div className="permiso-acciones">
                    {typeof permisos === 'boolean' ? (
                      <Tag color={permisos ? 'success' : 'error'} size="small">
                        {permisos ? 'Permitido' : 'Denegado'}
                      </Tag>
                    ) : (
                      Object.entries(permisos).map(([accion, permitido]) => (
                        <Tag 
                          key={accion} 
                          color={permitido ? 'success' : 'error'} 
                          size="small"
                        >
                          {accion}
                        </Tag>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card de información adicional */}
          <Card 
            title="Información Adicional" 
            className="info-adicional-card"
            size="small"
            style={{ marginTop: 16 }}
          >
            <div className="info-item">
              <Text type="secondary">ID de Usuario:</Text>
              <Text code>{userProfile.id}</Text>
            </div>
            {userProfile.uid && (
              <div className="info-item">
                <Text type="secondary">Firebase UID:</Text>
                <Text code>{userProfile.uid}</Text>
              </div>
            )}
            {userProfile.establecimientoId && (
              <div className="info-item">
                <Text type="secondary">Establecimiento:</Text>
                <Text code>{userProfile.establecimientoId}</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Perfil; 