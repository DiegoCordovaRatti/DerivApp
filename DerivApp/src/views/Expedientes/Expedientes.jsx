import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Pagination,
  Select,
  DatePicker,
  Dropdown,
  Modal,
  Spin,
  Tabs,
  Form,
  Divider,
  Descriptions,
  Timeline,
  ConfigProvider,
  message
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './Expedientes.scss';
import dayjs from '../../utils/dayjs';
import {
  obtenerEstudiantes,
  obtenerDerivacionesEstudiante,
  actualizarDerivacion,
  eliminarDerivacion,
  buscarEstudiantes,
  obtenerEstudiantesPorEstado
} from '../../services/expedienteService';

const { Title, Text } = Typography;
const { Option } = Select;

const Expedientes = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Estados para el modal de detalles
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [derivaciones, setDerivaciones] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  
  // Estados para datos del backend
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [selectedDerivacion, setSelectedDerivacion] = useState(null);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // Función para cargar estudiantes desde el backend
  // Función para procesar datos de estudiantes (convertir fechas de Firestore)
  const procesarEstudiantes = (estudiantes) => {
    return estudiantes.map(estudiante => ({
      ...estudiante,
      fecha_creacion: convertirFechaFirestore(estudiante.fecha_creacion),
      fecha_actualizacion: convertirFechaFirestore(estudiante.fecha_actualizacion),
      ultimaActualizacion: estudiante.fecha_actualizacion || estudiante.fecha_creacion
    }));
  };

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await obtenerEstudiantes();
      // El backend devuelve { estudiantes: [...], total: number }
      const estudiantesData = response.estudiantes || response;
      const estudiantesProcesados = procesarEstudiantes(estudiantesData);
      setEstudiantes(estudiantesProcesados);
      setEstudiantesFiltrados(estudiantesProcesados);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      // En caso de error, mostrar array vacío
      setEstudiantes([]);
      setEstudiantesFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar estudiantes
  const handleBuscar = async () => {
    if (!searchText.trim()) {
      setEstudiantesFiltrados(estudiantes);
      return;
    }

    try {
      setLoading(true);
      const response = await buscarEstudiantes(searchText);
      // El backend puede devolver { estudiantes: [...] } o directamente el array
      const estudiantesData = response.estudiantes || response;
      const estudiantesProcesados = procesarEstudiantes(estudiantesData);
      setEstudiantesFiltrados(estudiantesProcesados);
    } catch (error) {
      console.error('Error al buscar estudiantes:', error);
      // Fallback a búsqueda local
      const filtrados = estudiantes.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        estudiante.rut.includes(searchText) ||
        estudiante.curso.toLowerCase().includes(searchText.toLowerCase())
      );
      setEstudiantesFiltrados(filtrados);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar por estado
  const handleFiltroEstado = async (estado) => {
    setFiltroEstado(estado);
    
    if (!estado) {
      setEstudiantesFiltrados(estudiantes);
      return;
    }

    try {
      setLoading(true);
      const response = await obtenerEstudiantesPorEstado(estado);
      // El backend puede devolver { estudiantes: [...] } o directamente el array
      const estudiantesData = response.estudiantes || response;
      const estudiantesProcesados = procesarEstudiantes(estudiantesData);
      setEstudiantesFiltrados(estudiantesProcesados);
    } catch (error) {
      console.error('Error al filtrar por estado:', error);
      // Fallback a filtro local
      const filtrados = estudiantes.filter(estudiante => estudiante.estado === estado);
      setEstudiantesFiltrados(filtrados);
    } finally {
      setLoading(false);
    }
  };




  // Función para procesar datos de derivaciones (convertir fechas de Firestore)
  const procesarDerivaciones = (derivaciones) => {
    return derivaciones.map(derivacion => ({
      ...derivacion,
      fecha_derivacion: convertirFechaFirestore(derivacion.fecha_derivacion),
      fecha_evaluacion: convertirFechaFirestore(derivacion.fecha_evaluacion),
      fecha_creacion: convertirFechaFirestore(derivacion.fecha_creacion),
      fecha_actualizacion: convertirFechaFirestore(derivacion.fecha_actualizacion),
      seguimientos: derivacion.seguimientos?.map(seguimiento => ({
        ...seguimiento,
        fecha: convertirFechaFirestore(seguimiento.fecha)
      })) || []
    }));
  };

  // Funciones para manejar el modal
  const handleVerDetalles = async (estudiante) => {
    setSelectedEstudiante(estudiante);
    setModalVisible(true);
    setModalLoading(true);
    
    try {
      // Cargar derivaciones del estudiante desde el backend
      const response = await obtenerDerivacionesEstudiante(estudiante.id);
      // El backend puede devolver { derivaciones: [...] } o directamente el array
      const derivacionesData = response.derivaciones || response;
      const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
      setDerivaciones(derivacionesProcesadas);
    } catch (error) {
      console.error('Error al cargar derivaciones:', error);
      // Fallback a array vacío
      setDerivaciones([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
    setSelectedEstudiante(null);
    setDerivaciones([]);
    setActiveTab('1');
    setEditMode(false);
    form.resetFields();
  };

  const handleEditarDerivacion = (derivacion) => {
    setSelectedDerivacion(derivacion);
    setEditMode(true);
    form.setFieldsValue({
      motivo: derivacion.motivo,
      descripcion: derivacion.descripcion,
      observaciones: derivacion.observaciones,
      prioridad: derivacion.prioridad,
      estado: derivacion.estado,
      fecha_evaluacion: derivacion.fecha_evaluacion ? dayjs(derivacion.fecha_evaluacion) : null,
      resultado: derivacion.resultado
    });
  };

  const handleGuardarCambios = async (values) => {
    if (!selectedDerivacion) return;
    
    setModalLoading(true);
    try {
      // Preparar datos para el backend
      const datosActualizados = {
        ...values,
        fecha_evaluacion: values.fecha_evaluacion ? values.fecha_evaluacion.format('YYYY-MM-DD') : null
      };

      // Actualizar derivación en el backend
      await actualizarDerivacion(selectedEstudiante.id, selectedDerivacion.id, datosActualizados);
      
      // Recargar derivaciones
      const response = await obtenerDerivacionesEstudiante(selectedEstudiante.id);
      const derivacionesData = response.derivaciones || response;
      const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
      setDerivaciones(derivacionesProcesadas);
      
      setEditMode(false);
      setSelectedDerivacion(null);
      form.resetFields();
      message.success('Derivación actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      message.error('Error al actualizar la derivación');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEliminarDerivacion = async (derivacion) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta derivación?')) {
      return;
    }

    setModalLoading(true);
    try {
      await eliminarDerivacion(selectedEstudiante.id, derivacion.id);
      
      // Recargar derivaciones
      const response = await obtenerDerivacionesEstudiante(selectedEstudiante.id);
      const derivacionesData = response.derivaciones || response;
      const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
      setDerivaciones(derivacionesProcesadas);
      message.success('Derivación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar derivación:', error);
      message.error('Error al eliminar la derivación');
    } finally {
      setModalLoading(false);
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    const colores = {
      activo: 'green',
      pendiente: 'orange',
      seguimiento: 'blue',
      cerrado: 'default'
    };
    return colores[estado] || 'default';
  };

  // Función para obtener el texto del estado
  const getEstadoText = (estado) => {
    const textos = {
      activo: 'Activo',
      pendiente: 'Pendiente',
      seguimiento: 'Seguimiento',
      cerrado: 'Cerrado'
    };
    return textos[estado] || estado;
  };

  // Función para obtener el icono de prioridad
  const getPrioridadIcon = (prioridad) => {
    const iconos = {
      alta: <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />,
      media: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />,
      baja: <ExclamationCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
    };
    return iconos[prioridad] || null;
  };

  // Función para convertir fechas de Firestore
  const convertirFechaFirestore = (fecha) => {
    if (!fecha) return '';
    
    // Si es un objeto Timestamp de Firestore
    if (fecha && typeof fecha === 'object' && fecha.seconds) {
      return new Date(fecha.seconds * 1000).toLocaleDateString('es-CL');
    }
    
    // Si es una fecha normal
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString('es-CL');
    }
    
    // Si es un string
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleDateString('es-CL');
    }
    
    return '';
  };

  // Función para calcular el tiempo transcurrido usando Day.js
  const getTiempoTranscurrido = (fecha) => {
    if (!fecha) return '';
    
    // Si es un objeto Timestamp de Firestore
    if (fecha && typeof fecha === 'object' && fecha.seconds) {
      return dayjs(fecha.seconds * 1000).fromNow();
    }
    
    return dayjs(fecha).fromNow();
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: 'Estudiante',
      key: 'estudiante',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            style={{ backgroundColor: '#1890ff', marginRight: '12px' }}
          >
            {record.nombre.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              {record.nombre}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.rut}
            </div>
          </div>
        </div>
      ),
      width: 200
    },
    {
      title: 'Curso',
      dataIndex: 'curso',
      key: 'curso',
      width: 120
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) => (
        <Tag color={getEstadoColor(record.estado)}>
          {getEstadoText(record.estado)}
        </Tag>
      ),
      width: 120
    },
    {
      title: 'Última actualización',
      key: 'ultimaActualizacion',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: '4px', color: '#666' }} />
          <span style={{ fontSize: '12px', color: '#666' }}>
            {getTiempoTranscurrido(record.ultimaActualizacion)}
          </span>
        </div>
      ),
      width: 150
    },
    {
      title: 'Prioridad',
      key: 'prioridad',
      render: (_, record) => (
        <Tooltip title={`Prioridad ${record.prioridad}`}>
          {getPrioridadIcon(record.prioridad)}
        </Tooltip>
      ),
      width: 80
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              style={{ color: '#1890ff' }}
              onClick={() => handleVerDetalles(record)}
            />
          </Tooltip>
                     <Dropdown
             menu={{
               items: [
                 {
                   key: 'edit',
                   icon: <EditOutlined />,
                   label: 'Editar expediente'
                 },
                 {
                   key: 'delete',
                   icon: <DeleteOutlined />,
                   label: 'Eliminar expediente',
                   danger: true
                 }
               ]
             }}
             trigger={['click']}
           >
            <Button type="text" size="small">•••</Button>
          </Dropdown>
        </Space>
      ),
      width: 100
    }
  ];

  // Función para filtrar estudiantes (fallback local)
  const filteredEstudiantes = (estudiantesFiltrados || []).filter(estudiante =>
    estudiante.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    estudiante.rut.includes(searchText) ||
    estudiante.curso.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calcular datos de paginación
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEstudiantes = filteredEstudiantes.slice(startIndex, endIndex);

  // Componente para el contenido del modal
  const ModalContent = () => {
    if (modalLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
            Cargando expediente del estudiante...
          </div>
        </div>
      );
    }

    if (!selectedEstudiante) return null;

    const items = [
      {
        key: '1',
        label: (
          <span>
            <FileTextOutlined />
            Información General
          </span>
        ),
        children: (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Card size="small" title="Datos del Estudiante">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Nombre">
                      {selectedEstudiante.nombre}
                    </Descriptions.Item>
                    <Descriptions.Item label="RUT">
                      {selectedEstudiante.rut}
                    </Descriptions.Item>
                    <Descriptions.Item label="Curso">
                      {selectedEstudiante.curso}
                    </Descriptions.Item>
                    <Descriptions.Item label="Establecimiento">
                      {selectedEstudiante.establecimiento}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Información de Contacto">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Teléfono">
                      <PhoneOutlined /> {selectedEstudiante.telefono}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <MailOutlined /> {selectedEstudiante.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dirección">
                      <EnvironmentOutlined /> {selectedEstudiante.direccion}
                    </Descriptions.Item>
                    <Descriptions.Item label="Apoderado">
                      <UserOutlined /> {selectedEstudiante.apoderado || 'No especificado'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </div>
        )
      },
      {
        key: '2',
        label: (
          <span>
            <HistoryOutlined />
            Derivaciones ({derivaciones.length})
          </span>
        ),
        children: (
          <div style={{ padding: '16px 0' }}>
            {derivaciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>No hay derivaciones registradas</div>
              </div>
            ) : (
              <div>
                {derivaciones.map((derivacion, index) => (
                  <Card 
                    key={derivacion.id} 
                    style={{ marginBottom: '16px' }}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Derivación #{index + 1} - {convertirFechaFirestore(derivacion.fecha_derivacion)}</span>
                        <Space>
                          <Tag color={getEstadoColor(derivacion.estado)}>
                            {getEstadoText(derivacion.estado)}
                          </Tag>
                          <Tag color={derivacion.prioridad === 'alta' ? 'red' : derivacion.prioridad === 'media' ? 'orange' : 'green'}>
                            {derivacion.prioridad.toUpperCase()}
                          </Tag>
                          <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEditarDerivacion(derivacion)}
                          />
                          <Button 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            size="small"
                            danger
                            onClick={() => handleEliminarDerivacion(derivacion)}
                          />
                        </Space>
                      </div>
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Motivo">
                            {derivacion.motivo}
                          </Descriptions.Item>
                          <Descriptions.Item label="Descripción">
                            {derivacion.descripcion}
                          </Descriptions.Item>
                          <Descriptions.Item label="Derivado por">
                            {derivacion.derivado_por}
                          </Descriptions.Item>
                          <Descriptions.Item label="Responsable">
                            {derivacion.responsable}
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col span={12}>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Observaciones">
                            {derivacion.observaciones}
                          </Descriptions.Item>
                          <Descriptions.Item label="Fecha evaluación">
                            {convertirFechaFirestore(derivacion.fecha_evaluacion)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Resultado">
                            {derivacion.resultado}
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                    
                    {derivacion.seguimientos && derivacion.seguimientos.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <Divider orientation="left">Seguimientos</Divider>
                        <Timeline>
                          {derivacion.seguimientos.map((seguimiento) => (
                            <Timeline.Item 
                              key={seguimiento.id}
                              dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            >
                              <div>
                                <div style={{ fontWeight: '500' }}>
                                  {seguimiento.tipo} - {convertirFechaFirestore(seguimiento.fecha)}
                                </div>
                                <div style={{ color: '#666', marginTop: '4px' }}>
                                  {seguimiento.descripcion}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                  Responsable: {seguimiento.responsable}
                                </div>
                              </div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        key: '3',
        label: (
          <span>
            <EditOutlined />
            Editar Derivación
          </span>
        ),
        children: (
          <div style={{ padding: '16px 0' }}>
            {editMode ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleGuardarCambios}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="motivo"
                      label="Motivo de derivación"
                      rules={[{ required: true, message: 'Por favor ingrese el motivo' }]}
                    >
                      <Input placeholder="Motivo de la derivación" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="prioridad"
                      label="Prioridad"
                      rules={[{ required: true, message: 'Por favor seleccione la prioridad' }]}
                    >
                      <Select placeholder="Seleccionar prioridad">
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
                  rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
                >
                  <Input.TextArea rows={4} placeholder="Descripción detallada del caso" />
                </Form.Item>
                
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="estado"
                      label="Estado"
                      rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
                    >
                      <Select placeholder="Seleccionar estado">
                        <Option value="activo">Activo</Option>
                        <Option value="pendiente">Pendiente</Option>
                        <Option value="seguimiento">Seguimiento</Option>
                        <Option value="cerrado">Cerrado</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fecha_evaluacion"
                      label="Fecha de evaluación"
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="observaciones"
                  label="Observaciones"
                >
                  <Input.TextArea rows={3} placeholder="Observaciones adicionales" />
                </Form.Item>
                
                <Form.Item
                  name="resultado"
                  label="Resultado"
                >
                  <Select placeholder="Seleccionar resultado">
                    <Option value="Pendiente">Pendiente</Option>
                    <Option value="Mejorado">Mejorado</Option>
                    <Option value="Sin cambios">Sin cambios</Option>
                    <Option value="Empeorado">Empeorado</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={modalLoading}>
                      Guardar cambios
                    </Button>
                    <Button onClick={() => setEditMode(false)}>
                      Cancelar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <EditOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>Selecciona una derivación para editar</div>
              </div>
            )}
          </div>
        )
      }
    ];

    return (
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={items}
        style={{ marginTop: '16px' }}
      />
    );
  };

  return (
    <ConfigProvider>
      <div className="expedientes-container">
      {/* Header */}
      <div className="expedientes-header">
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Estudiantes derivados
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Gestiona los expedientes y seguimientos de los estudiantes derivados al equipo psicosocial.
          </Text>
        </div>
        
      </div>

      {/* Filtros y búsqueda */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Buscar por nombre o RUT (ej: 12.345.678-9)"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleBuscar}
              size="large"
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Filtrar por estado"
              size="large"
              style={{ width: '100%' }}
              allowClear
              value={filtroEstado}
              onChange={handleFiltroEstado}
            >
              <Option value="activo">Activo</Option>
              <Option value="pendiente">Pendiente</Option>
              <Option value="seguimiento">Seguimiento</Option>
              <Option value="cerrado">Cerrado</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              size="large"
              style={{ width: '100%' }}
              onClick={handleBuscar}
            >
              Buscar
            </Button>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              icon={<FilterOutlined />} 
              size="large"
              style={{ width: '100%' }}
              onClick={() => {
                setSearchText('');
                setFiltroEstado(null);
                setEstudiantesFiltrados(estudiantes);
              }}
            >
              Limpiar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabla de estudiantes */}
      <Card>
        <Table
          columns={columns}
          dataSource={paginatedEstudiantes}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
          scroll={{ x: 800 }}
        />

        {/* Paginación personalizada */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '24px',
          padding: '16px 0'
        }}>
          <Text type="secondary">
            Mostrando {paginatedEstudiantes.length} estudiantes
          </Text>
          <Pagination
            current={currentPage}
            total={filteredEstudiantes.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} de ${total}`
            }
          />
        </div>
      </Card>

      {/* Modal de detalles del estudiante */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size={32} 
              style={{ backgroundColor: '#1890ff', marginRight: '12px' }}
            >
              {selectedEstudiante?.nombre?.charAt(0)}
            </Avatar>
            <span>
              Expediente de {selectedEstudiante?.nombre}
            </span>
          </div>
        }
                 open={modalVisible}
         onCancel={handleCerrarModal}
         footer={null}
         width={1000}
         destroyOnHidden
         centered
      >
                 <ModalContent />
       </Modal>
       </div>
     </ConfigProvider>
   );
 };

export default Expedientes; 