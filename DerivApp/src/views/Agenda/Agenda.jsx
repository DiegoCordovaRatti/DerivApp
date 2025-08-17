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
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleFilled
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
import { DetallesEventoModal, EditarEventoModal } from '../../components/modal';
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
  
  // Estados del modal de edición del evento
  const [editarEventoVisible, setEditarEventoVisible] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setEstudiantesLoading(true);
      

      
      // Cargar datos de forma paralela con mejor manejo de errores
      const [eventosData, eventosProximosData, estadisticasData, estudiantesData, derivacionesData] = await Promise.allSettled([
        obtenerEventosTodasDerivaciones(),
        obtenerEventosProximosTodasDerivaciones(),
        obtenerEstadisticasEventosTodasDerivaciones(),
        obtenerEstudiantes(),
        obtenerTodasDerivaciones()
      ]);

      // Procesar eventos
      if (eventosData.status === 'fulfilled') {

        setEvents(eventosData.value || []);
      } else {
        console.error('❌ Error al cargar eventos:', eventosData.reason);
        setEvents([]);
      }
      
      // Procesar eventos próximos
      if (eventosProximosData.status === 'fulfilled') {
        const proximosData = eventosProximosData.value;
        if (proximosData && proximosData.success && proximosData.eventos) {
          setUpcomingEvents(proximosData.eventos);
        } else if (proximosData && proximosData.eventos) {
          setUpcomingEvents(proximosData.eventos);
        } else if (proximosData && Array.isArray(proximosData)) {
          setUpcomingEvents(proximosData);
        } else {
          setUpcomingEvents([]);
        }

      } else {
        console.error('❌ Error al cargar eventos próximos:', eventosProximosData.reason);
        setUpcomingEvents([]);
      }
      
      // Procesar estadísticas
      if (estadisticasData.status === 'fulfilled') {

        setEstadisticas(estadisticasData.value || {});
      } else {
        console.error('❌ Error al cargar estadísticas:', estadisticasData.reason);
        setEstadisticas({});
      }
      
      // Procesar estudiantes
      if (estudiantesData.status === 'fulfilled') {
        const estudiantes = estudiantesData.value;

        // Manejar diferentes formatos de respuesta
        if (estudiantes && estudiantes.estudiantes) {
          setEstudiantes(Array.isArray(estudiantes.estudiantes) ? estudiantes.estudiantes : []);
        } else if (Array.isArray(estudiantes)) {
          setEstudiantes(estudiantes);
        } else {
          console.warn('⚠️ Formato inesperado de estudiantes:', estudiantes);
          setEstudiantes([]);
        }
      } else {
        console.error('❌ Error al cargar estudiantes:', estudiantesData.reason);
        setEstudiantes([]);
        message.error('Error al cargar estudiantes');
      }
      
      // Procesar derivaciones
      if (derivacionesData.status === 'fulfilled') {
        const derivaciones = derivacionesData.value;

        // Manejar diferentes formatos de respuesta
        if (derivaciones && derivaciones.derivaciones) {
          setDerivaciones(Array.isArray(derivaciones.derivaciones) ? derivaciones.derivaciones : []);
        } else if (Array.isArray(derivaciones)) {
          setDerivaciones(derivaciones);
        } else {
          console.warn('⚠️ Formato inesperado de derivaciones:', derivaciones);
          setDerivaciones([]);
        }
      } else {
        console.error('❌ Error al cargar derivaciones:', derivacionesData.reason);
        setDerivaciones([]);
        message.error('Error al cargar derivaciones');
      }
      
    } catch (error) {
      console.error('💥 Error general al cargar datos:', error);
      message.error('Error al cargar los datos de la agenda');
      // En caso de error, establecer arrays vacíos
      setEvents([]);
      setUpcomingEvents([]);
      setEstadisticas({});
      setEstudiantes([]);
      setDerivaciones([]);
    } finally {
      setLoading(false);
      setEstudiantesLoading(false);

    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
      const eventDate = event.fecha?.toDate?.() || new Date(event.fecha);
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
              borderLeft: `3px solid ${getPriorityColor(event.prioridad)}`,
              position: 'relative'
            }}
            onClick={() => handleEventClick(event)}
          >
            <div className="event-time">
              {dayjs(event.fecha?.toDate?.() || new Date(event.fecha)).format('HH:mm')}
            </div>
            <div className="event-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{event.titulo}</span>
              {event.agendado ? (
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} title="Asistencia confirmada" />
              ) : (
                <ClockCircleFilled style={{ color: '#faad14', fontSize: '12px' }} title="Pendiente de confirmación" />
              )}
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

  // Manejar actualización de evento
  const handleEventoActualizado = (eventoActualizado) => {
    // Actualizar el evento en la lista
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventoActualizado.id ? eventoActualizado : event
      )
    );
    
    // Actualizar eventos próximos si es necesario
    setUpcomingEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventoActualizado.id ? eventoActualizado : event
      )
    );
  };

  // Manejar cambio de estudiante seleccionado
  const handleStudentChange = (estudianteId) => {
    if (estudianteId) {
      // Filtrar derivaciones por el estudiante seleccionado
      const derivacionesDelEstudiante = derivaciones.filter(
        derivacion => derivacion.estudianteId === estudianteId
      );
      setDerivacionesFiltradas(derivacionesDelEstudiante);
    } else {
      // Si no hay estudiante seleccionado, mostrar todas
      setDerivacionesFiltradas([]);
    }
    
    // Limpiar la derivación seleccionada cuando cambia el estudiante
    form.setFieldsValue({ derivacionId: null });
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

      const eventoData = {
        titulo: values.title,
        descripcion: values.description,
        fecha: values.date.toDate(),
        hora: values.time.format('HH:mm'),
        tipo: values.type,
        prioridad: values.priority,
        estudianteId: values.student || null,
        status: 'pendiente',
        agendado: false // Nuevo evento siempre inicia como no agendado
      };

      if (values.student) {
        const estudianteSeleccionado = estudiantes.find(e => e.id === values.student);
        if (estudianteSeleccionado) {
          eventoData.estudiante = {
            nombre: estudianteSeleccionado.nombre,
            curso: estudianteSeleccionado.curso
          };
        }
      }

      const nuevoEvento = await crearEvento(eventoData, values.derivacionId);
      setEvents([...events, nuevoEvento]);
      setIsModalVisible(false);
      form.resetFields();
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



  // Manejar edición de evento
  const handleEditarEvento = (evento) => {
    setEventoAEditar(evento);
    setEditarEventoVisible(true);
    setModalEventoVisible(false); // Cerrar el modal de detalles
  };

  // Manejar eliminación de evento
  const handleEliminarEvento = (eventoId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventoId));
    setUpcomingEvents(prevEvents => prevEvents.filter(event => event.id !== eventoId));
    message.success('Evento eliminado exitosamente');
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
                          <div className="event-list-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{event.titulo}</span>
                              {event.agendado ? (
                                <CheckCircleOutlined style={{ color: '#52c41a' }} title="Asistencia confirmada" />
                              ) : (
                                <ClockCircleFilled style={{ color: '#faad14' }} title="Pendiente de confirmación" />
                              )}
                            </div>
                            <div>
                              <Tag color={getPriorityColor(event.prioridad)} size="small">
                                {event.prioridad}
                              </Tag>
                              <Tag 
                                color={event.agendado ? 'green' : 'orange'} 
                                size="small"
                                style={{ marginLeft: '4px' }}
                              >
                                {event.agendado ? 'Confirmado' : 'Pendiente'}
                              </Tag>
                            </div>
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
                  onChange={handleStudentChange}
                >
                  {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
                    estudiantes.map(estudiante => (
                      <Option key={estudiante.id} value={estudiante.id}>
                        {estudiante.nombre} ({estudiante.curso})
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      {estudiantesLoading ? "Cargando..." : "No hay estudiantes disponibles"}
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
              placeholder="Seleccionar derivación"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Array.isArray(derivacionesFiltradas) && derivacionesFiltradas.length > 0 ? (
                derivacionesFiltradas.map(derivacion => (
                  <Option key={derivacion.id} value={derivacion.id}>
                    {derivacion.motivo} - {derivacion.descripcion}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  {form.getFieldValue('student') ? 'No hay derivaciones para este estudiante' : 'Selecciona un estudiante primero'}
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
        onEventoActualizado={handleEventoActualizado}
        onEditarEvento={handleEditarEvento}
        onEliminarEvento={handleEliminarEvento}
      />

      {/* Modal de Edición de Evento */}
      <EditarEventoModal
        evento={eventoAEditar}
        visible={editarEventoVisible}
        onClose={() => setEditarEventoVisible(false)}
        onEventoActualizado={handleEventoActualizado}
      />
    </div>
  );
};

export default Agenda; 