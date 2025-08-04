import React, { useState } from 'react';
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
  message
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
import './Agenda.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Agenda = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Reunión con estudiante1',
      description: 'Seguimiento de derivación psicosocial',
      date: dayjs('2024-01-15'),
      time: dayjs('2024-01-15 09:00'),
      type: 'seguimiento',
      priority: 'alta',
      student: 'estudiante1',
      course: '7°A',
      status: 'confirmado'
    },
    {
      id: 2,
      title: 'Evaluación estudiante2',
      description: 'Evaluación inicial de caso',
      date: dayjs('2024-01-15'),
      time: dayjs('2024-01-15 14:30'),
      type: 'evaluacion',
      priority: 'media',
      student: 'estudiante2',
      course: '5°B',
      status: 'pendiente'
    },
    {
      id: 3,
      title: 'Intervención estudiante3',
      description: 'Intervención con familia',
      date: dayjs('2024-01-16'),
      time: dayjs('2024-01-16 10:00'),
      type: 'intervencion',
      priority: 'alta',
      student: 'estudiante3',
      course: '8°A',
      status: 'confirmado'
    },
    {
      id: 4,
      title: 'Seguimiento estudiante4',
      description: 'Control de progreso',
      date: dayjs('2024-01-17'),
      time: dayjs('2024-01-17 11:00'),
      type: 'seguimiento',
      priority: 'baja',
      student: 'estudiante4',
      course: '6°A',
      status: 'confirmado'
    },
    {
      id: 5,
      title: 'Reunión equipo convivencia',
      description: 'Coordinación semanal',
      date: dayjs('2024-01-18'),
      time: dayjs('2024-01-18 08:00'),
      type: 'reunion',
      priority: 'media',
      student: null,
      course: null,
      status: 'confirmado'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

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
    const dayEvents = events.filter(event => 
      event.date.isSame(value, 'day')
    );

    return (
      <div className="calendar-events">
        {dayEvents.map(event => (
          <div
            key={event.id}
            className="calendar-event"
            style={{ 
              backgroundColor: getEventColor(event.type),
              borderLeft: `3px solid ${getPriorityColor(event.priority)}`
            }}
            onClick={() => handleEventClick(event)}
          >
            <div className="event-time">
              {event.time.format('HH:mm')}
            </div>
            <div className="event-title">
              {event.title}
            </div>
            {event.student && (
              <div className="event-student">
                {event.student} - {event.course}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Manejar clic en evento
  const handleEventClick = (event) => {
    Modal.info({
      title: event.title,
      content: (
        <div>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Fecha:</strong> {event.date.format('DD/MM/YYYY')}</p>
          <p><strong>Hora:</strong> {event.time.format('HH:mm')}</p>
          <p><strong>Tipo:</strong> 
            <Tag color={getEventColor(event.type)} style={{ marginLeft: 8 }}>
              {event.type.toUpperCase()}
            </Tag>
          </p>
          <p><strong>Prioridad:</strong> 
            <Tag color={getPriorityColor(event.priority)} style={{ marginLeft: 8 }}>
              {event.priority.toUpperCase()}
            </Tag>
          </p>
          {event.student && (
            <p><strong>Estudiante:</strong> {event.student} ({event.course})</p>
          )}
          <p><strong>Estado:</strong> 
            <Tag color={event.status === 'confirmado' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
              {event.status.toUpperCase()}
            </Tag>
          </p>
        </div>
      ),
      width: 500,
    });
  };

  // Manejar selección de fecha
  const onSelect = (value) => {
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  // Crear nuevo evento
  const handleCreateEvent = async (values) => {
    const newEvent = {
      id: events.length + 1,
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time,
      type: values.type,
      priority: values.priority,
      student: values.student || null,
      course: values.course || null,
      status: 'pendiente'
    };

    setEvents([...events, newEvent]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Evento creado exitosamente');
  };

  // Obtener eventos del día seleccionado
  const getDayEvents = (date) => {
    return events.filter(event => event.date.isSame(date, 'day'));
  };

  // Obtener eventos próximos (próximos 7 días)
  const getUpcomingEvents = () => {
    const today = dayjs();
    const nextWeek = today.add(7, 'day');
    return events
      .filter(event => event.date.isAfter(today) && event.date.isBefore(nextWeek))
      .sort((a, b) => a.date.diff(b.date))
      .slice(0, 5);
  };

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
                dataSource={getUpcomingEvents()}
                renderItem={event => (
                  <List.Item
                    className="event-list-item"
                    onClick={() => handleEventClick(event)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ backgroundColor: getEventColor(event.type) }}
                          icon={<CalendarOutlined />}
                        />
                      }
                      title={
                        <div className="event-list-title">
                          <span>{event.title}</span>
                          <Tag color={getPriorityColor(event.priority)} size="small">
                            {event.priority}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="event-list-description">
                          <div>{event.date.format('DD/MM/YYYY')} - {event.time.format('HH:mm')}</div>
                          {event.student && (
                            <div>
                              <UserOutlined /> {event.student} ({event.course})
                            </div>
                          )}
                          <div className="event-type">
                            <Tag color={getEventColor(event.type)} size="small">
                              {event.type}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Estadísticas Rápidas */}
            <Card title="Estadísticas" className="stats-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">{events.length}</div>
                    <div className="stat-label">Total Eventos</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {events.filter(e => e.status === 'confirmado').length}
                    </div>
                    <div className="stat-label">Confirmados</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {events.filter(e => e.priority === 'alta').length}
                    </div>
                    <div className="stat-label">Alta Prioridad</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-number">
                      {events.filter(e => e.type === 'seguimiento').length}
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
                label="Estudiante (Opcional)"
              >
                <Select
                  placeholder="Seleccionar estudiante"
                  allowClear
                >
                  <Option value="estudiante1">estudiante1 (7°A)</Option>
                  <Option value="estudiante2">estudiante2 (5°B)</Option>
                  <Option value="estudiante3">estudiante3 (8°A)</Option>
                  <Option value="estudiante4">estudiante4 (6°A)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
    </div>
  );
};

export default Agenda; 