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
  ConfigProvider
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserAddOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import './Expedientes.scss';
import dayjs from '../../utils/dayjs';

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

  // Datos mock de derivaciones
  const mockDerivaciones = [
    {
      id: '1',
      estudianteId: '1',
      fecha_derivacion: '2024-01-15',
      motivo: 'Problemas de comportamiento en clase',
      descripcion: 'El estudiante presenta conductas disruptivas durante las clases de matemáticas y ciencias.',
      derivado_por: 'Prof. Ana Silva',
      responsable: 'Psic. María González',
      estado: 'activo',
      prioridad: 'alta',
      observaciones: 'Requiere evaluación psicológica urgente',
      fecha_evaluacion: '2024-01-20',
      resultado: 'Pendiente',
      seguimientos: [
        {
          id: '1',
          fecha: '2024-01-18',
          tipo: 'Entrevista con apoderado',
          descripcion: 'Se realizó entrevista con la madre del estudiante para coordinar apoyo.',
          responsable: 'Psic. María González'
        },
        {
          id: '2',
          fecha: '2024-01-25',
          tipo: 'Evaluación psicológica',
          descripcion: 'Se aplicaron pruebas de evaluación conductual.',
          responsable: 'Psic. María González'
        }
      ]
    },
    {
      id: '2',
      estudianteId: '1',
      fecha_derivacion: '2023-11-10',
      motivo: 'Bajo rendimiento académico',
      descripcion: 'Dificultades significativas en matemáticas y lenguaje.',
      derivado_por: 'Prof. Juan Pérez',
      responsable: 'Psic. Carlos Rodríguez',
      estado: 'cerrado',
      prioridad: 'media',
      observaciones: 'Caso resuelto con mejoras significativas',
      fecha_evaluacion: '2023-11-15',
      resultado: 'Mejorado',
      seguimientos: [
        {
          id: '3',
          fecha: '2023-11-12',
          tipo: 'Evaluación académica',
          descripcion: 'Se identificaron las áreas de dificultad específicas.',
          responsable: 'Psic. Carlos Rodríguez'
        }
      ]
    }
  ];

  // Datos mock de estudiantes
  const mockEstudiantes = [
    {
      id: '1',
      nombre: 'Carlos Méndez Soto',
      rut: '19.345.678-9',
      curso: '8° Básico A',
      estado: 'activo',
      prioridad: 'alta',
      ultimaActualizacion: '2024-01-29',
      establecimiento: 'Liceo San José',
      derivadoPor: 'Prof. Ana Silva',
      responsable: 'Psic. María González',
      telefono: '+56 9 1234 5678',
      email: 'carlos.mendez@email.com',
      direccion: 'Av. Providencia 1234, Santiago'
    },
    {
      id: '2',
      nombre: 'Ana Gómez Pérez',
      rut: '20.123.456-7',
      curso: '5° Básico B',
      estado: 'pendiente',
      prioridad: 'media',
      ultimaActualizacion: '2024-01-22',
      establecimiento: 'Liceo San José',
      derivadoPor: 'Prof. Juan Pérez',
      responsable: 'Psic. Carlos Rodríguez',
      telefono: '+56 9 2345 6789',
      email: 'ana.gomez@email.com',
      direccion: 'Calle Las Condes 567, Santiago'
    },
    {
      id: '3',
      nombre: 'Joaquín Martínez Rojas',
      rut: '19.876.543-2',
      curso: '3° Medio A',
      estado: 'seguimiento',
      prioridad: 'baja',
      ultimaActualizacion: '2024-01-28',
      establecimiento: 'Liceo San José',
      derivadoPor: 'Prof. María López',
      responsable: 'Psic. Ana Fernández',
      telefono: '+56 9 3456 7890',
      email: 'joaquin.martinez@email.com',
      direccion: 'Pasaje Ñuñoa 890, Santiago'
    },
    {
      id: '4',
      nombre: 'Valentina Soto Díaz',
      rut: '20.987.654-3',
      curso: '1° Medio B',
      estado: 'cerrado',
      prioridad: 'baja',
      ultimaActualizacion: '2024-01-15',
      establecimiento: 'Liceo San José',
      derivadoPor: 'Prof. Roberto Herrera',
      responsable: 'Psic. Patricia Fuentes',
      telefono: '+56 9 4567 8901',
      email: 'valentina.soto@email.com',
      direccion: 'Av. Vitacura 2345, Santiago'
    },
    {
      id: '5',
      nombre: 'Matías Fernández Silva',
      rut: '19.456.789-0',
      curso: '6° Básico A',
      estado: 'activo',
      prioridad: 'media',
      ultimaActualizacion: '2024-01-30',
      establecimiento: 'Liceo San José',
      derivadoPor: 'Prof. Carmen Ruiz',
      responsable: 'Psic. Miguel Rojas',
      telefono: '+56 9 5678 9012',
      email: 'matias.fernandez@email.com',
      direccion: 'Calle Lo Barnechea 3456, Santiago'
    }
  ];

  // Funciones para manejar el modal
  const handleVerDetalles = async (estudiante) => {
    setSelectedEstudiante(estudiante);
    setModalVisible(true);
    setModalLoading(true);
    
    // Simular carga de 3 segundos
    setTimeout(() => {
      // Filtrar derivaciones del estudiante
      const derivacionesEstudiante = mockDerivaciones.filter(
        derivacion => derivacion.estudianteId === estudiante.id
      );
      setDerivaciones(derivacionesEstudiante);
      setModalLoading(false);
    }, 3000);
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
    setModalLoading(true);
    // Simular guardado
    setTimeout(() => {
      setEditMode(false);
      setModalLoading(false);
      // Aquí se actualizarían los datos en el backend
    }, 1000);
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

  // Función para calcular el tiempo transcurrido usando Day.js
  const getTiempoTranscurrido = (fecha) => {
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

  // Función para filtrar estudiantes
  const filteredEstudiantes = mockEstudiantes.filter(estudiante =>
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
                        <span>Derivación #{index + 1} - {derivacion.fecha_derivacion}</span>
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
                            {derivacion.fecha_evaluacion}
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
                                  {seguimiento.tipo} - {seguimiento.fecha}
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
          <Col xs={24} md={18}>
            <Input
              placeholder="Buscar por nombre o RUT (ej: 12.345.678-9)"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={6}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              size="large"
              style={{ width: '100%' }}
            >
              Buscar
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