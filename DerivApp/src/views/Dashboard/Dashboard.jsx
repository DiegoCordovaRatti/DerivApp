import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, Row, Col, Typography, Button, Space, List} from 'antd';
import { 
  UserOutlined, 
  BellOutlined, 
  CalendarOutlined, 
  FolderOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  RightOutlined
} from '@ant-design/icons';
import './Dashboard.scss';

const { Title, Text } = Typography;

const Dashboard = () => {
  // Datos simulados para las tarjetas de acceso rápido
  const quickAccessCards = [
    {
      title: 'Estudiantes derivados',
      description: 'Gestionar casos y seguimientos',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      count: 18,
      color: '#1890ff',
      link: '/expedientes'
    },
    {
      title: 'Alertas',
      description: 'Revisar notificaciones importantes',
      icon: <BellOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      count: 3,
      color: '#ff4d4f',
      link: '/alertas'
    },
    {
      title: 'Calendario',
      description: 'Ver y agendar citas',
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      count: 5,
      color: '#52c41a',
      link: '/agenda'
    },
    {
      title: 'Nueva Derivación',
      description: 'Gestión de expedientes',
      icon: <FolderOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1',
      link: '/formulario-derivacion'
    }
  ];

  // Datos simulados para las alertas
  const recentAlerts = [
    {
      type: 'critical',
      title: 'Situación crítica',
      description: 'Descripción de una situación crítica',
      time: 'Hace 0 min',
      color: '#ff4d4f'
    },
    {
      type: 'warning',
      title: 'Situación de riesgo',
      description: 'Descripción de una situación de riesgo',
      time: 'Hace 0 min',
      color: '#faad14'
    },
  ];

  // Datos simulados para los eventos
  const upcomingEvents = [
    {
      title: 'Titulo de asunto',
      date: 'Fecha de asunto',
      time: '00:00',
      location: 'Lugar de asunto',
      buttonText: 'Seguimiento',
      buttonType: 'primary'
    },
    {
      title: 'Titulo de asunto',
      date: 'Fecha de asunto',
      time: '00:00',
      location: 'Lugar de asunto',
      buttonText: 'Seguimiento',
      buttonType: 'primary'
    },
    {
      title: 'Titulo de asunto',
      date: 'Fecha de asunto',
      time: '00:00',
      location: 'Lugar de asunto',
      buttonText: 'Seguimiento',
      buttonType: 'primary'
    },
    {
      title: 'Titulo de asunto',
      date: 'Fecha de asunto',
      time: '00:00',
      location: 'Lugar de asunto',
      buttonText: 'Seguimiento',
      buttonType: 'primary'
    },
    
  ];

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="dashboard-header">
        <div className="header-content">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            Buenas tardes, USUARIO
          </Title>
          <Text style={{ color: 'white', fontSize: '16px' }}>
            Bienvenido/a nuevamente a DerivApp. Tienes 0 alertas pendientes y 0 eventos programados para hoy.
          </Text>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="quick-access-section">
        <Title level={3} style={{ marginBottom: '24px' }}>
          Accesos rápidos
        </Title>
        <Row gutter={[16, 16]}>
          {quickAccessCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Link to={card.link}>
              <Card className="quick-access-card" hoverable>
                <div className="card-content">
                  <div className="card-icon">
                    {card.icon}
                  </div>
                  <div className="card-text">
                    <Title level={5} style={{ margin: '8px 0 4px 0' }}>
                      {card.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {card.description}
                    </Text>
                  </div>
                  {card.count && (
                    <div className="card-count" style={{ color: card.color }}>
                      {card.count}
                    </div>
                  )}
                </div>
              </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Main Content */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Recent Alerts */}
        <Col xs={24} lg={12}>
          <Card 
            title="Alertas recientes" 
            extra={
              <Link to="/alertas">
                <Button type="link" style={{ padding: 0 }}>
                  Ver todas <RightOutlined />
                </Button>
              </Link>
            }
            className="alerts-card"
          >
            <List dataSource={recentAlerts} renderItem={(alert, index) => (
                <List.Item className="alert-item">
                  <div className="alert-content">
                    <div className="alert-icon">
                      <ExclamationCircleOutlined style={{ color: alert.color, fontSize: '16px' }} />
                    </div>
                    <div className="alert-details">
                      <div className="alert-header">
                        <Text strong>{alert.title}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {alert.time}
                        </Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        {alert.description}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} lg={12}>
          <Card 
            title="Próximos eventos" 
            extra={
              <Link to="/calendario">
                <Button type="link" style={{ padding: 0 }}>
                  Ver calendario <RightOutlined />
                </Button>
              </Link>
            }
            className="events-card"
          >
            <List
              dataSource={upcomingEvents}
              renderItem={(event, index) => (
                <List.Item className="event-item">
                  <div className="event-content">
                    <div className="event-details">
                      <div className="event-header">
                        <Text strong>{event.title}</Text>
                        <Button 
                          type={event.buttonType} 
                          size="small"
                          style={{ marginLeft: 'auto' }}
                        >
                          {event.buttonText}
                        </Button>
                      </div>
                      <div className="event-info">
                        <Space size="small">
                          <ClockCircleOutlined style={{ color: '#1890ff' }} />
                          <Text type="secondary">{event.date}</Text>
                          <Text type="secondary">•</Text>
                          <Text type="secondary">{event.time}</Text>
                        </Space>
                        <div style={{ marginTop: '4px' }}>
                          <Space size="small">
                            <EnvironmentOutlined style={{ color: '#52c41a' }} />
                            <Text type="secondary">{event.location}</Text>
                          </Space>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 