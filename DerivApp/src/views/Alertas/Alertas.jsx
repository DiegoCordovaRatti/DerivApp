import React, { useState, useEffect } from 'react';
import {
  Typography,
  Input,
  Button,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Avatar,
  Collapse,
  Badge,
  Divider,
  Spin,
  message
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons';
import { obtenerAlertas, buscarAlertas } from '../../services/alertaService';
import './Alertas.scss';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Alertas = () => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertasFiltradas, setAlertasFiltradas] = useState([]);

  // Cargar alertas desde el backend
  const cargarAlertas = async () => {
    try {
      setLoading(true);
      const alertasData = await obtenerAlertas();
      setAlertas(alertasData);
      setAlertasFiltradas(alertasData);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      message.error('Error al cargar las alertas');
      // Fallback a datos mock si hay error
      setAlertas([]);
      setAlertasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas();
  }, []);

  // Filtrar alertas cuando cambia el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() === '') {
      setAlertasFiltradas(alertas);
    } else {
      const filtradas = alertas.filter(alerta =>
        alerta.estudiante.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        alerta.estudiante.curso.toLowerCase().includes(searchText.toLowerCase()) ||
        alerta.motivo.toLowerCase().includes(searchText.toLowerCase()) ||
        alerta.descripcion.toLowerCase().includes(searchText.toLowerCase())
      );
      setAlertasFiltradas(filtradas);
    }
  }, [searchText, alertas]);

  // Mock data de alertas (fallback)
  const mockAlertas = [
    {
      id: 1,
      estudiante: {
        nombre: 'María González Pérez',
        curso: '8° Básico B',
        avatar: 'MG'
      },
      prioridad: 'alta',
      fecha: '14 de mayo de 2023',
      motivo: 'Inasistencia',
      descripcion: '15 días de ausencia en el último mes',
      icon: <CalendarOutlined />,
      color: '#ff4d4f'
    },
    {
      id: 2,
      estudiante: {
        nombre: 'Juan Carlos Martínez',
        curso: '2º Medio A',
        avatar: 'JM'
      },
      prioridad: 'alta',
      fecha: '13 de mayo de 2023',
      motivo: 'Incumplimiento académico',
      descripcion: 'No ha entregado ninguna evaluación en el último trimestre',
      icon: <BookOutlined />,
      color: '#ff4d4f'
    },
    {
      id: 3,
      estudiante: {
        nombre: 'Alejandra Silva Rojas',
        curso: '4° Medio B',
        avatar: 'AS'
      },
      prioridad: 'media',
      fecha: '11 de mayo de 2023',
      motivo: 'No asistencia a reunión',
      descripcion: 'No asistió a dos reuniones consecutivas con orientador',
      icon: <CalendarOutlined />,
      color: '#faad14'
    },
    {
      id: 4,
      estudiante: {
        nombre: 'Pedro Navarro Díaz',
        curso: '1° Medio B',
        avatar: 'PN'
      },
      prioridad: 'media',
      fecha: '9 de mayo de 2023',
      motivo: 'Inasistencia',
      descripcion: '8 días de ausencia en el último mes',
      icon: <CalendarOutlined />,
      color: '#faad14'
    },
    {
      id: 5,
      estudiante: {
        nombre: 'Camila Rodríguez Vega',
        curso: '5° Básico A',
        avatar: 'CR'
      },
      prioridad: 'baja',
      fecha: '7 de mayo de 2023',
      motivo: 'Incumplimiento académico',
      descripcion: 'Bajo rendimiento reciente en asignaturas principales',
      icon: <BookOutlined />,
      color: '#52c41a'
    },
    {
      id: 6,
      estudiante: {
        nombre: 'Diego Fernández Castro',
        curso: '3º Básico B',
        avatar: 'DF'
      },
      prioridad: 'baja',
      fecha: '4 de mayo de 2023',
      motivo: 'Inasistencia',
      descripcion: '5 días de ausencia en el último mes',
      icon: <CalendarOutlined />,
      color: '#52c41a'
    }
  ];

  // Contar alertas por prioridad
  const contarAlertasPorPrioridad = () => {
    const alta = alertas.filter(alerta => alerta.prioridad === 'alta').length;
    const media = alertas.filter(alerta => alerta.prioridad === 'media').length;
    const baja = alertas.filter(alerta => alerta.prioridad === 'baja').length;
    return { alta, media, baja };
  };

  const { alta, media, baja } = contarAlertasPorPrioridad();

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'media':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'baja':
        return <InfoCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getPrioridadTag = (prioridad) => {
    const config = {
      alta: { color: '#ff4d4f', text: 'Prioridad Alta' },
      media: { color: '#faad14', text: 'Prioridad Media' },
      baja: { color: '#52c41a', text: 'Prioridad Baja' }
    };
    const configPrioridad = config[prioridad];
    return (
      <Tag color={configPrioridad.color} style={{ fontWeight: '500' }}>
        {configPrioridad.text}
      </Tag>
    );
  };

  // Función para obtener el icono según el tipo de motivo
  const getMotivoIcon = (motivo) => {
    const motivoLower = motivo.toLowerCase();
    if (motivoLower.includes('inasistencia') || motivoLower.includes('ausencia')) {
      return <CalendarOutlined />;
    } else if (motivoLower.includes('académico') || motivoLower.includes('evaluación')) {
      return <BookOutlined />;
    } else if (motivoLower.includes('reunión') || motivoLower.includes('entrevista')) {
      return <UserOutlined />;
    } else {
      return <ExclamationCircleOutlined />;
    }
  };

  // Función para obtener el color según el tipo de motivo
  const getMotivoColor = (motivo) => {
    const motivoLower = motivo.toLowerCase();
    if (motivoLower.includes('inasistencia') || motivoLower.includes('ausencia')) {
      return '#ff4d4f';
    } else if (motivoLower.includes('académico') || motivoLower.includes('evaluación')) {
      return '#faad14';
    } else if (motivoLower.includes('reunión') || motivoLower.includes('entrevista')) {
      return '#1890ff';
    } else {
      return '#52c41a';
    }
  };

  return (
    <div className="alertas-container">
      {/* Header */}
      <div className="alertas-header">
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Alertas de Riesgo de Deserción
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Sistema de monitoreo y seguimiento para prevención de deserción escolar
          </Text>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="alertas-filters">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Buscar por nombre de estudiante..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space size="large">
              <Space>
                <Badge count={alta} color="#ff4d4f">
                  <Tag color="#ff4d4f" style={{ padding: '4px 8px' }}>
                    Alta: {alta}
                  </Tag>
                </Badge>
                <Badge count={media} color="#faad14">
                  <Tag color="#faad14" style={{ padding: '4px 8px' }}>
                    Media: {media}
                  </Tag>
                </Badge>
                <Badge count={baja} color="#52c41a">
                  <Tag color="#52c41a" style={{ padding: '4px 8px' }}>
                    Baja: {baja}
                  </Tag>
                </Badge>
              </Space>
            </Space>
          </Col>
        </Row>
        
        <Row style={{ marginTop: '16px' }}>
          <Col>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setShowFilters(!showFilters)}
              >
                Mostrar filtros
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => {
                  setSearchText('');
                  cargarAlertas();
                }}
              >
                Reiniciar
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
            Cargando alertas...
          </div>
        </div>
      )}

      {/* Lista de alertas */}
      {!loading && (
        <div className="alertas-list">
          <Row gutter={[16, 16]}>
            {alertasFiltradas.map((alerta) => (
              <Col xs={24} md={12} lg={8} key={alerta.id}>
                <Card
                  className={`alerta-card alerta-${alerta.prioridad}`}
                  style={{ 
                    borderLeft: `4px solid ${getMotivoColor(alerta.motivo)}`,
                    marginBottom: '16px'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getPrioridadIcon(alerta.prioridad)}
                      <div>
                        <Text strong style={{ fontSize: '16px', display: 'block' }}>
                          {alerta.estudiante.nombre}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {alerta.estudiante.curso} • {alerta.fecha}
                        </Text>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getPrioridadTag(alerta.prioridad)}
                      <DownOutlined style={{ color: '#999', cursor: 'pointer' }} />
                    </div>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {getMotivoIcon(alerta.motivo)}
                    <Text strong style={{ color: getMotivoColor(alerta.motivo) }}>
                      {alerta.motivo}
                    </Text>
                  </div>
                  
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {alerta.descripcion}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!loading && alertasFiltradas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <InfoCircleOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {alertas.length === 0 
              ? 'No hay alertas disponibles en este momento'
              : 'No se encontraron alertas que coincidan con la búsqueda'
            }
          </Text>
        </div>
      )}
    </div>
  );
};

export default Alertas; 