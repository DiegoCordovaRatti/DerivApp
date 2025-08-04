import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, Row, Col, Typography, Button, Space, List, Spin, message
} from 'antd';
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
import { 
  obtenerEstadisticasDashboard, 
  obtenerAlertasRecientes, 
  obtenerEventosProximos 
} from '../../services/dashboardService';
import dayjs from '../../utils/dayjs';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalEstudiantesDerivados: 0,
    derivacionesActivas: 0,
    derivacionesCerradas: 0,
    alertasRecientes: 0,
    alertasCriticas: 0,
    alertasAltas: 0
  });
  const [alertasRecientes, setAlertasRecientes] = useState([]);
  const [eventosProximos, setEventosProximos] = useState([]);

  // Cargar datos del dashboard
  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const statsResponse = await obtenerEstadisticasDashboard();
      if (statsResponse.success) {
        setEstadisticas(statsResponse.estadisticas);
      }

      // Cargar alertas recientes
      const alertasResponse = await obtenerAlertasRecientes();
      if (alertasResponse.success) {
        setAlertasRecientes(alertasResponse.alertas);
      }

      // Cargar eventos próximos
      const eventosResponse = await obtenerEventosProximos();
      if (eventosResponse.success) {
        setEventosProximos(eventosResponse.eventos);
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      message.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Datos dinámicos para las tarjetas de acceso rápido
  const quickAccessCards = [
    {
      title: 'Estudiantes derivados',
      description: 'Gestionar casos y seguimientos',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      count: estadisticas.totalEstudiantesDerivados,
      color: '#1890ff',
      link: '/expedientes'
    },
    {
      title: 'Alertas',
      description: 'Revisar notificaciones importantes',
      icon: <BellOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      count: estadisticas.alertasRecientes,
      color: '#ff4d4f',
      link: '/alertas'
    },
    {
      title: 'Calendario',
      description: 'Ver y agendar citas',
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      count: eventosProximos.length,
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

  // Función para formatear el tiempo transcurrido
  const getTiempoTranscurrido = (fecha) => {
    if (!fecha) return 'Hace un momento';
    return dayjs(fecha).fromNow();
  };

  // Función para obtener el título de la alerta
  const getTituloAlerta = (nivelAlerta) => {
    const titulos = {
      'Alerta crítica': 'Situación crítica',
      'Alerta alta': 'Situación de alto riesgo',
      'Alerta moderada': 'Situación de riesgo moderado',
      'Sin riesgo / Bajo': 'Situación bajo control'
    };
    return titulos[nivelAlerta] || 'Alerta';
  };

  // Función para obtener la descripción de la alerta
  const getDescripcionAlerta = (nivelAlerta, estudiante) => {
    const descripciones = {
      'Alerta crítica': `Alerta crítica detectada para ${estudiante?.nombre || 'el estudiante'}`,
      'Alerta alta': `Alerta alta detectada para ${estudiante?.nombre || 'el estudiante'}`,
      'Alerta moderada': `Alerta moderada detectada para ${estudiante?.nombre || 'el estudiante'}`,
      'Sin riesgo / Bajo': `Situación bajo control para ${estudiante?.nombre || 'el estudiante'}`
    };
    return descripciones[nivelAlerta] || 'Alerta detectada';
  };

  // Función para formatear la fecha del evento
  const formatearFechaEvento = (fecha) => {
    if (!fecha) return 'Fecha no definida';
    return dayjs(fecha).format('DD/MM/YYYY');
  };

  // Función para obtener el texto del botón según el tipo de evento
  const getTextoBoton = (tipo) => {
    const textos = {
      'seguimiento': 'Seguimiento',
      'reunion': 'Reunión',
      'evaluacion': 'Evaluación',
      'visita': 'Visita'
    };
    return textos[tipo] || 'Ver detalles';
  };

  // Función para obtener el tipo de botón según el tipo de evento
  const getTipoBoton = (tipo) => {
    const tipos = {
      'seguimiento': 'primary',
      'reunion': 'default',
      'evaluacion': 'primary',
      'visita': 'primary'
    };
    return tipos[tipo] || 'default';
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#666' }}>
            Cargando dashboard...
          </div>
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div className="dashboard-header">
            <div className="header-content">
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                Buenas tardes, USUARIO
              </Title>
              <Text style={{ color: 'white', fontSize: '16px' }}>
                Bienvenido/a nuevamente a DerivApp. Tienes {estadisticas.alertasRecientes} alertas pendientes y {eventosProximos.length} eventos programados para hoy.
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : alertasRecientes.length > 0 ? (
              <List 
                dataSource={alertasRecientes} 
                renderItem={(alerta, index) => (
                  <List.Item className="alert-item">
                    <div className="alert-content">
                      <div className="alert-icon">
                        <ExclamationCircleOutlined style={{ color: alerta.color, fontSize: '16px' }} />
                      </div>
                      <div className="alert-details">
                        <div className="alert-header">
                          <Text strong>{getTituloAlerta(alerta.nivelAlerta)}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {getTiempoTranscurrido(alerta.fecha)}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          {getDescripcionAlerta(alerta.nivelAlerta, alerta.estudiante)}
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                No hay alertas recientes
              </div>
            )}
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} lg={12}>
          <Card 
            title="Próximos eventos" 
            extra={
              <Link to="/agenda">
                <Button type="link" style={{ padding: 0 }}>
                  Ver calendario <RightOutlined />
                </Button>
              </Link>
            }
            className="events-card"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : eventosProximos.length > 0 ? (
              <List
                dataSource={eventosProximos}
                renderItem={(evento, index) => (
                  <List.Item className="event-item">
                    <div className="event-content">
                      <div className="event-details">
                        <div className="event-header">
                          <Text strong>{evento.titulo}</Text>
                          <Button 
                            type={getTipoBoton(evento.tipo)} 
                            size="small"
                            style={{ marginLeft: 'auto' }}
                          >
                            {getTextoBoton(evento.tipo)}
                          </Button>
                        </div>
                        <div className="event-info">
                          <Space size="small">
                            <ClockCircleOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary">{formatearFechaEvento(evento.fecha)}</Text>
                            <Text type="secondary">•</Text>
                            <Text type="secondary">{evento.hora}</Text>
                          </Space>
                          <div style={{ marginTop: '4px' }}>
                            <Space size="small">
                              <EnvironmentOutlined style={{ color: '#52c41a' }} />
                              <Text type="secondary">{evento.ubicacion}</Text>
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                No hay eventos próximos
              </div>
            )}
          </Card>
        </Col>
      </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard; 