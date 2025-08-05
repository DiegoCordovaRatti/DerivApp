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
  Badge,
  Divider,
  Spin,
  message,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select
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
  DownOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BellOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { obtenerAlertas } from '../../services/alertaService';
import { crearEventoDesdeAlerta } from '../../services/eventoService';
import dayjs from 'dayjs';
import './Alertas.scss';


const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Alertas = () => {
  const [searchText, setSearchText] = useState('');
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertasFiltradas, setAlertasFiltradas] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [isModalAgendarVisible, setIsModalAgendarVisible] = useState(false);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
  const [formAgendar] = Form.useForm();
  const navigate = useNavigate();

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

  // Contar alertas por nivel de alerta calculado
  const contarAlertasPorNivel = () => {
    const sinRiesgo = alertas.filter(alerta => alerta.nivelAlerta === 'Sin riesgo / Bajo').length;
    const moderada = alertas.filter(alerta => alerta.nivelAlerta === 'Alerta moderada').length;
    const alta = alertas.filter(alerta => alerta.nivelAlerta === 'Alerta alta').length;
    const critica = alertas.filter(alerta => alerta.nivelAlerta === 'Alerta crítica').length;
    return { sinRiesgo, moderada, alta, critica };
  };

  const { sinRiesgo, moderada, alta, critica } = contarAlertasPorNivel();

  // Función para manejar la expansión de tarjetas
  const toggleCardExpansion = (alertaId) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(alertaId)) {
      newExpandedCards.delete(alertaId);
    } else {
      newExpandedCards.add(alertaId);
    }
    setExpandedCards(newExpandedCards);
  };

  // Función para manejar el botón "Apagar alerta"
  const handleApagarAlerta = (alertaId) => {
    message.info('Función "Apagar alerta" será implementada próximamente');
    // Aquí se implementará la lógica para apagar la alerta
  };

  // Función para manejar el botón "Agendar"
  const handleAgendar = (alerta) => {
    setAlertaSeleccionada(alerta);
    setIsModalAgendarVisible(true);
    formAgendar.resetFields();
  };

  // Función para crear evento desde alerta
  const handleCrearEventoDesdeAlerta = async (values) => {
    try {
      const datosEvento = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        fecha: values.fecha.toDate(),
        hora: values.hora.format('HH:mm'),
        tipo: values.tipo,
        prioridad: values.prioridad,
        status: 'pendiente'
      };

      await crearEventoDesdeAlerta(alertaSeleccionada, datosEvento);
      
      setIsModalAgendarVisible(false);
      formAgendar.resetFields();
      setAlertaSeleccionada(null);
      
      message.success('Evento creado exitosamente desde la alerta');
      
      // Opcional: navegar a la agenda
      setTimeout(() => {
        navigate('/agenda');
      }, 1500);
      
    } catch (error) {
      console.error('Error al crear evento desde alerta:', error);
      message.error('Error al crear el evento');
    }
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

  // Función para obtener el icono del nivel de alerta
  const getNivelAlertaIcon = (nivelAlerta) => {
    switch (nivelAlerta) {
      case 'Sin riesgo / Bajo':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Alerta moderada':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'Alerta alta':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'Alerta crítica':
        return <StopOutlined style={{ color: '#cf1322' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  // Función para obtener el color del nivel de alerta
  const getNivelAlertaColor = (nivelAlerta) => {
    switch (nivelAlerta) {
      case 'Sin riesgo / Bajo':
        return '#52c41a';
      case 'Alerta moderada':
        return '#faad14';
      case 'Alerta alta':
        return '#ff4d4f';
      case 'Alerta crítica':
        return '#cf1322';
      default:
        return '#d9d9d9';
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
                <Badge count={critica} color="#cf1322">
                  <Tag color="#cf1322" style={{ padding: '4px 8px' }}>
                    Crítica: {critica}
                  </Tag>
                </Badge>
                <Badge count={alta} color="#ff4d4f">
                  <Tag color="#ff4d4f" style={{ padding: '4px 8px' }}>
                    Alta: {alta}
                  </Tag>
                </Badge>
                <Badge count={moderada} color="#faad14">
                  <Tag color="#faad14" style={{ padding: '4px 8px' }}>
                    Moderada: {moderada}
                  </Tag>
                </Badge>
                <Badge count={sinRiesgo} color="#52c41a">
                  <Tag color="#52c41a" style={{ padding: '4px 8px' }}>
                    Sin Riesgo: {sinRiesgo}
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
          {/* Referencia de porcentajes de alerta */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #e9ecef'
          }}>
            <Text strong style={{ fontSize: '14px', color: '#495057', marginBottom: '8px', display: 'block' }}>
              📊 Referencia de Niveles de Alerta
            </Text>
            <Row gutter={[16, 8]}>
              <Col xs={12} sm={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#52c41a' 
                  }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Sin riesgo / Bajo: 0-29%
                  </Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#faad14' 
                  }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Alerta moderada: 30-59%
                  </Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ff4d4f' 
                  }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Alerta alta: 60-79%
                  </Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#cf1322' 
                  }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Alerta crítica: 80-100%
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
          
          <Row gutter={[16, 16]}>
            {alertasFiltradas.map((alerta) => (
              <Col xs={24} md={12} lg={8} key={alerta.id}>
                <Card
                  className={`alerta-card ${expandedCards.has(alerta.id) ? 'expanded' : ''}`}
                  style={{ 
                    borderLeft: `4px solid ${getNivelAlertaColor(alerta.nivelAlerta)}`,
                    marginBottom: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '16px' }}
                  onClick={() => toggleCardExpansion(alerta.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getNivelAlertaIcon(alerta.nivelAlerta)}
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
                      <Tag color={getNivelAlertaColor(alerta.nivelAlerta)} style={{ fontWeight: '500' }}>
                        {alerta.nivelAlerta}
                      </Tag>
                      <DownOutlined 
                        style={{ 
                          color: '#999', 
                          cursor: 'pointer',
                          transform: expandedCards.has(alerta.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }} 
                      />
                    </div>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  {/* Factor de alerta calculado */}
                  {alerta.nivelAlerta && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      {alerta.scoreNormalizado !== undefined && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Factor de alerta: {alerta.scoreNormalizado}%
                        </Text>
                      )}
                    </div>
                  )}
                  

                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {getMotivoIcon(alerta.motivo)}
                    <Text strong style={{ color: getMotivoColor(alerta.motivo) }}>
                      {alerta.motivo}
                    </Text>
                  </div>
                  
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {alerta.descripcion}
                  </Text>

                  {/* Contenido expandido */}
                  {expandedCards.has(alerta.id) && (
                    <div style={{ 
                      marginTop: '16px', 
                      paddingTop: '16px', 
                      borderTop: '1px solid #f0f0f0',
                      animation: 'slideDown 0.3s ease-out'
                    }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: '14px', color: '#262626', display: 'block', marginBottom: '8px' }}>
                          Acciones disponibles:
                        </Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button 
                            type="default" 
                            icon={<BellOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApagarAlerta(alerta.id);
                            }}
                            style={{ flex: 1 }}
                          >
                            Apagar alerta
                          </Button>
                          <Button 
                            type="primary" 
                            icon={<ScheduleOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgendar(alerta);
                            }}
                            style={{ flex: 1 }}
                          >
                            Agendar
                          </Button>
                        </div>
                      </Space>
                    </div>
                  )}
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

      {/* Modal para crear evento desde alerta */}
      <Modal
        title={`Crear Evento - ${alertaSeleccionada?.estudiante?.nombre}`}
        open={isModalAgendarVisible}
        onCancel={() => {
          setIsModalAgendarVisible(false);
          setAlertaSeleccionada(null);
          formAgendar.resetFields();
        }}
        footer={null}
        width={600}
      >
        {alertaSeleccionada && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <Text strong>Información de la Alerta:</Text>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">Estudiante: {alertaSeleccionada.estudiante.nombre} ({alertaSeleccionada.estudiante.curso})</Text>
              <br />
              <Text type="secondary">Motivo: {alertaSeleccionada.motivo}</Text>
              <br />
              <Text type="secondary">Nivel de Alerta: {alertaSeleccionada.nivelAlerta}</Text>
            </div>
          </div>
        )}
        
        <Form
          form={formAgendar}
          layout="vertical"
          onFinish={handleCrearEventoDesdeAlerta}
          initialValues={{
            tipo: 'seguimiento',
            prioridad: 'media',
            fecha: dayjs(),
            hora: dayjs()
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="titulo"
                label="Título del Evento"
                rules={[{ required: true, message: 'Por favor ingresa el título' }]}
              >
                <Input placeholder="Ej: Seguimiento de alerta" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tipo"
                label="Tipo de Evento"
                rules={[{ required: true, message: 'Por favor selecciona el tipo' }]}
              >
                <Select>
                  <Option value="seguimiento">Seguimiento</Option>
                  <Option value="evaluacion">Evaluación</Option>
                  <Option value="intervencion">Intervención</Option>
                  <Option value="reunion">Reunión</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fecha"
                label="Fecha"
                rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hora"
                label="Hora"
                rules={[{ required: true, message: 'Por favor selecciona la hora' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="prioridad"
                label="Prioridad"
                rules={[{ required: true, message: 'Por favor selecciona la prioridad' }]}
              >
                <Select>
                  <Option value="baja">Baja</Option>
                  <Option value="media">Media</Option>
                  <Option value="alta">Alta</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
          >
            <TextArea rows={4} placeholder="Descripción detallada del evento..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Crear Evento
              </Button>
              <Button onClick={() => {
                setIsModalAgendarVisible(false);
                setAlertaSeleccionada(null);
                formAgendar.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Alertas; 