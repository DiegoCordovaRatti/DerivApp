import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Typography,
  Space,
  Alert,
  Spin
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import GestionUsuarios from './components/GestionUsuarios';
import ConfiguracionGeneral from './components/ConfiguracionGeneral';
import './Configuracion.scss';

const { Title, Text } = Typography;

const Configuracion = () => {
  const { userProfile, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [loading, setLoading] = useState(false);

  // Solo administradores pueden acceder
  if (!hasRole('administrador')) {
    return (
      <div className="configuracion-container">
        <Alert
          message="Acceso Denegado"
          description="Solo los administradores pueden acceder a la configuración del sistema."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'usuarios',
      label: (
        <Space>
          <UserOutlined />
          <span>Gestión de Usuarios</span>
        </Space>
      ),
      children: <GestionUsuarios />
    },
    {
      key: 'general',
      label: (
        <Space>
          <SettingOutlined />
          <span>Configuración General</span>
        </Space>
      ),
      children: <ConfiguracionGeneral />
    },
    {
      key: 'seguridad',
      label: (
        <Space>
          <SecurityScanOutlined />
          <span>Seguridad</span>
        </Space>
      ),
      children: (
        <Card>
          <Alert
            message="Funcionalidad en Desarrollo"
            description="Las configuraciones de seguridad estarán disponibles próximamente."
            type="info"
            showIcon
          />
        </Card>
      )
    }
  ];

  return (
    <div className="configuracion-container">
      <div className="configuracion-header">
        <Title level={2}>
          <SettingOutlined />
          <span>Configuración del Sistema</span>
        </Title>
        <Text type="secondary">
          Panel de administración para gestionar usuarios y configuraciones del sistema
        </Text>
      </div>

      <Card className="configuracion-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabPosition="top"
        />
      </Card>
    </div>
  );
};

export default Configuracion;
