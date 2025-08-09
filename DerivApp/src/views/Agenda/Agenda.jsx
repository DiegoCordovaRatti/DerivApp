import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Badge, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  List,
  Avatar,
  Tooltip,
  message,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  obtenerEventosTodasDerivaciones, 
  crearEvento, 
  obtenerEventosProximosTodasDerivaciones, 
  obtenerEstadisticasEventosTodasDerivaciones,
  crearEventoDesdeAlerta 
} from '../../services/eventoService';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { obtenerTodasDerivaciones } from '../../services/expedienteService';
import { DetallesEventoModal } from '../../components/modal';
import './Agenda.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [estudiantes, setEstudiantes] = useState([]);
  const [derivaciones, setDerivaciones] = useState([]);
  const [derivacionesFiltradas, setDerivacionesFiltradas] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [estudiantesLoading, setEstudiantesLoading] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalEventoVisible, setModalEventoVisible] = useState(false);

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setEstudiantesLoading(true);
      
      const [eventosData, eventosProximosData, estadisticasData, derivacionesData] = await Promise.all([
        obtenerEventosTodasDerivaciones(),
        obtenerEventosProximosTodasDerivaciones(),
        obtenerEstadisticasEventosTodasDerivaciones(),
        obtenerTodasDerivaciones()
      ]);

      setEvents(eventosData);
      
      // Manejar diferentes formatos de respuesta para eventos próximos
      if (eventosProximosData && eventosProximosData.success && eventosProximosData.eventos) {
        setUpcomingEvents(eventosProximosData.eventos);
      } else if (eventosProximosData && eventosProximosData.eventos) {
        setUpcomingEvents(eventosProximosData.eventos);
      } else if (eventosProximosData && Array.isArray(eventosProximosData)) {
        setUpcomingEvents(eventosProximosData);
      } else {
        setUpcomingEvents([]);
      }
      
      setEstadisticas(estadisticasData);
      setDerivaciones(derivacionesData?.derivaciones || []);
      
      // Extraer estudiantes únicos de las derivaciones
      if (derivacionesData?.derivaciones && Array.isArray(derivacionesData.derivaciones)) {
        const estudiantesUnicos = [];
        const estudiantesRuts = new Set(); // Usar RUT como identificador único
        
        derivacionesData.derivaciones.forEach(derivacion => {
          if (derivacion.estudiante && derivacion.estudiante.rut && !estudiantesRuts.has(derivacion.estudiante.rut)) {
            estudiantesRuts.add(derivacion.estudiante.rut);
            estudiantesUnicos.push(derivacion.estudiante);
          }
        });
        
        setEstudiantes(estudiantesUnicos);
        setDerivaciones(derivacionesData.derivaciones); // Guardar todas las derivaciones con sus IDs
      } else {
        setEstudiantes([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      message.error('Error al cargar los datos de la agenda');
      // En caso de error, establecer arrays vacíos
      setUpcomingEvents([]);
      setEstudiantes([]);
    } finally {
      setLoading(false);
      setEstudiantesLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Limpiar derivaciones filtradas cuando se abre el modal
  useEffect(() => {
    if (isModalVisible) {
      setDerivacionesFiltradas([]);
    }
  }, [isModalVisible]);

  // Colores por tipo de evento
  const getEventColor = (type) => {
    const colors = {
      seguimiento: '#1890ff',
      evaluacion: '#52c41a',
      intervencion: '#fa8c16',
      reunion: '#722ed1'
    };
    return colors[type] || '#d9d9d9';
  };

  // Colores por prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      alta: '#ff4d4f',
      media: '#faad14',
      baja: '#52c41a'
    };
    return colors[priority] || '#d9d9d9';
  };

  // Función para renderizar eventos en el calendario
  const dateCellRender = (value) => {
    const dayEvents = events.filter(event => {
      let eventDate;
      if (event.fecha?.toDate) {
        // Si es un objeto Firestore Timestamp
        eventDate = event.fecha.toDate();
      } else if (event.fecha) {
        // Si es un string de fecha
        eventDate = new Date(event.fecha);
      } else {
        return false;
      }
      return dayjs(eventDate).isSame(value, 'day');
    });



    return (
      <div className="calendar-events">
        {dayEvents.map(event => (
          <div
            key={event.id}
            className="calendar-event"
            style={{ 
              backgroundColor: getEventColor(event.tipo),
              borderLeft: `3px solid ${getPriorityColor(event.prioridad)}`
            }}
            onClick={() => handleEventClick(event)}
          >
            <div className="event-time">
              {(() => {
                let eventDate;
                if (event.fecha?.toDate) {
                  eventDate = event.fecha.toDate();
                } else if (event.fecha) {
                  eventDate = new Date(event.fecha);
                } else {
                  return '--:--';
                }
                return dayjs(eventDate).format('HH:mm');
              })()}
            </div>
            {event.estudiante && (
              <div className="event-student">
                {event.estudiante.nombre} - {event.estudiante.curso}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Manejar clic en evento
  const handleEventClick = (event) => {
    setEventoSeleccionado(event);
    setModalEventoVisible(true);
  };

  // Cerrar modal de evento
  const handleCloseModalEvento = () => {
    setModalEventoVisible(false);
    setEventoSeleccionado(null);
  };

  // Manejar selección de fecha
  const onSelect = (value) => {
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  // Crear nuevo evento
  const handleCreateEvent = async (values) => {
    try {
      if (!values.derivacionId) {
        message.error('Debe seleccionar una derivación para crear el evento');
        return;
      }

      // Obtener información del estudiante de la derivación seleccionada
      const derivacionSeleccionada = derivacionesFiltradas.find(d => d.id === values.derivacionId);
      if (!derivacionSeleccionada || !derivacionSeleccionada.estudiante) {
        message.error('No se pudo obtener la información del estudiante de la derivación');
        return;
      }

      const eventoData = {
        titulo: values.title,
        descripcion: values.description,
        fecha: values.date.toDate(),
        hora: values.time.format('HH:mm'),
        tipo: values.type,
        prioridad: values.priority,
        estudianteId: derivacionSeleccionada.estudianteId, // Usar el ID del estudiante de la derivación
        status: 'pendiente'
      };

      // Usar el estudiante de la derivación seleccionada
      eventoData.estudiante = {
        nombre: derivacionSeleccionada.estudiante.nombre,
        curso: derivacionSeleccionada.estudiante.curso
      };

      const nuevoEvento = await crearEvento(eventoData, values.derivacionId);
      
      // Agregar información completa del estudiante y derivación al evento
      const eventoCompleto = {
        ...nuevoEvento,
        estudiante: {
          nombre: derivacionSeleccionada.estudiante.nombre,
          curso: derivacionSeleccionada.estudiante.curso,
          rut: derivacionSeleccionada.estudiante.rut
        },
        derivacion: {
          motivo: derivacionSeleccionada.motivo,
          descripcion: derivacionSeleccionada.descripcion,
          estado: derivacionSeleccionada.estado
        }
      };
      
      setEvents([...events, eventoCompleto]);
      setIsModalVisible(false);
      form.resetFields();
      setDerivacionesFiltradas([]);
      message.success('Evento creado exitosamente');
      
      // Recargar datos para actualizar estadísticas
      cargarDatos();
    } catch (error) {
      console.error('Error al crear evento:', error);
      message.error('Error al crear el evento');
    }
  };

  // Crear evento desde alerta (cuando viene desde la vista de Alertas)
  const crearEventoDesdeAlertaHandler = async (alerta, datosEvento) => {
    try {
      const evento = await crearEventoDesdeAlerta(alerta, datosEvento);
      setEvents([...events, evento]);
      message.success('Evento creado desde alerta exitosamente');
      cargarDatos();
      return evento;
    } catch (error) {
      console.error('Error al crear evento desde alerta:', error);
      message.error('Error al crear evento desde alerta');
      throw error;
    }
  };

  // Manejar cambio en la selección de estudiante
  const handleEstudianteChange = (estudianteRut) => {
    if (estudianteRut) {
      // Filtrar derivaciones activas del estudiante seleccionado
      const derivacionesDelEstudiante = derivaciones.filter(derivacion => 
        derivacion.estudiante.rut === estudianteRut && 
        derivacion.estado === 'abierta'
      );
      setDerivacionesFiltradas(derivacionesDelEstudiante);
      
      // Limpiar la derivación seleccionada cuando cambia el estudiante
      form.setFieldsValue({
        derivacionId: undefined
      });
    } else {
      // Si no hay estudiante seleccionado, no mostrar derivaciones
      setDerivacionesFiltradas([]);
      form.setFieldsValue({
        derivacionId: undefined
      });
    }
  };

  // Manejar cambio en la selección de derivación
  const handleDerivacionChange = (derivacionId) => {
    // Esta función ya no necesita auto-seleccionar el estudiante
    // ya que ahora el flujo es: estudiante -> derivación
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Cargando agenda...
        </div>
      </div>
    );
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <Title level={2}>
          <CalendarOutlined /> Agenda
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Nuevo Evento
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="Calendario" className="calendar-card">
            <Calendar
              dateCellRender={dateCellRender}
              onSelect={onSelect}
              fullscreen={true}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Próximos Eventos */}
            <Card 
              title={
                <span>
                  <ClockCircleOutlined /> Próximos Eventos
                </span>
              }
              className="upcoming-events-card"
            >
              <List
                dataSource={Array.isArray(upcomingEvents) ? upcomingEvents : []}
                renderItem={event => {
                  const eventDate = event.fecha?.toDate?.() || new Date(event.fecha);
                  return (
                    <List.Item
                      className="event-list-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEventClick(event)}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ backgroundColor: getEventColor(event.tipo) }}
                            icon={<CalendarOutlined />}
                          />
                        }
                        title={
                          <div className="event-list-title">
                            <span>{event.titulo}</span>
                            <Tag color={getPriorityColor(event.prioridad)} size="small">
                              {event.prioridad}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="event-list-description">
                            <div>{dayjs(eventDate).format('DD/MM/YYYY')} - {dayjs(eventDate).format('HH:mm')}</div>
                            {event.estudiante && (
                              <div>
                                <UserOutlined /> {event.estudiante.nombre} ({event.estudiante.curso})
                              </div>
                            )}
                            <div className="event-type">
                              <Tag color={getEventColor(event.tipo)} size="small">
                                {event.tipo}
                              </Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>

            {/* Estadísticas Rápidas */}
            <Card title="Estadísticas" className="stats-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">{estadisticas.total || 0}</div>
                    <div className="stat-label">Total Eventos</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {estadisticas.confirmados || 0}
                    </div>
                    <div className="stat-label">Confirmados</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {estadisticas.altaPrioridad || 0}
                    </div>
                    <div className="stat-label">Alta Prioridad</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {estadisticas.seguimientos || 0}
                    </div>
                    <div className="stat-label">Seguimientos</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Modal para crear evento */}
      <Modal
        title="Nuevo Evento"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setDerivacionesFiltradas([]);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateEvent}
          initialValues={{
            date: selectedDate,
            type: 'seguimiento',
            priority: 'media',
            status: 'pendiente'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Título del Evento"
                rules={[{ required: true, message: 'Por favor ingresa el título' }]}
              >
                <Input placeholder="Ej: Reunión con estudiante" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
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
                name="date"
                label="Fecha"
                rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
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
                name="priority"
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
            <Col span={12}>
              <Form.Item
                name="student"
                label="Estudiante"
                rules={[{ required: true, message: 'Por favor selecciona el estudiante' }]}
              >
                <Select
                  placeholder={estudiantesLoading ? "Cargando estudiantes..." : "Seleccionar estudiante"}
                  allowClear
                  loading={estudiantesLoading}
                  disabled={estudiantesLoading}
                  onChange={handleEstudianteChange}
                >
                  {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
                    estudiantes.map(estudiante => (
                      <Option key={estudiante.rut} value={estudiante.rut}>
                        {estudiante.nombre} ({estudiante.curso})
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      {estudiantesLoading ? "Cargando..." : "No hay estudiantes derivados disponibles"}
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="derivacionId"
            label="Derivación"
            rules={[{ required: true, message: 'Por favor selecciona la derivación' }]}
          >
            <Select
              placeholder={form.getFieldValue('student') ? "Seleccionar derivación" : "Primero selecciona un estudiante"}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={handleDerivacionChange}
              disabled={!form.getFieldValue('student')}
            >
              {Array.isArray(derivacionesFiltradas) && derivacionesFiltradas.length > 0 ? (
                derivacionesFiltradas.map(derivacion => (
                  <Option key={derivacion.id} value={derivacion.id}>
                    {derivacion.motivo}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  {form.getFieldValue('student') ? "No hay derivaciones activas para este estudiante" : "Selecciona un estudiante primero"}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
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
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Detalles de Evento */}
      <DetallesEventoModal
        evento={eventoSeleccionado}
        visible={modalEventoVisible}
        onClose={handleCloseModalEvento}
      />
    </div>
  );
};

export default Agenda; 