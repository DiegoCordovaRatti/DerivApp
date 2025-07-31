import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Collapse,
  Row,
  Col,
  Divider,
  DatePicker,
  message,
  AutoComplete,
  Modal,
} from 'antd';
import {
  UserOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SaveOutlined,
  SendOutlined,
  TeamOutlined,
  IdcardOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  SearchOutlined,
  PlusOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import './FormularioDerivacion.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const FormularioDerivacion = () => {
  const [form] = Form.useForm();
  const [formEstudiante] = Form.useForm();
  const [activeKeys, setActiveKeys] = useState(['1']); // Datos del estudiante y Motivo expandidos
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mockEstudiantes, setMockEstudiantes] = useState([
    {
      id: "std_001",
      nombre: "María Fernanda González Silva",
      rut: "18.456.789-2",
      curso: "4°A",
      establecimientoId: "RBD9493",
      estado: "activo",
      fecha_creacion: new Date("2024-01-15"),
      fecha_actualizacion: new Date("2024-01-15"),
      // Campos adicionales del formulario
      telefono_contacto: "+56 9 1234 5678",
      email_contacto: "maria.gonzalez@email.com",
      direccion: "Av. Providencia 1234, Providencia, Santiago",
      apoderado: "Juan Carlos González"
    },
    {
      id: "std_002",
      nombre: "Carlos Andrés Pérez Rodríguez",
      rut: "19.234.567-8",
      curso: "3°B",
      establecimientoId: "RBD9493",
      estado: "activo",
      fecha_creacion: new Date("2024-01-20"),
      fecha_actualizacion: new Date("2024-02-10"),
      // Campos adicionales del formulario
      telefono_contacto: "+56 9 2345 6789",
      email_contacto: "carlos.perez@email.com",
      direccion: "Calle Las Condes 567, Las Condes, Santiago",
      apoderado: "Ana María Pérez"
    },
    {
      id: "std_003",
      nombre: "Valentina Sofía Herrera Martínez",
      rut: "20.345.678-9",
      curso: "5°C",
      establecimientoId: "RBD9493",
      estado: "derivado",
      fecha_creacion: new Date("2024-01-10"),
      fecha_actualizacion: new Date("2024-03-05"),
      // Campos adicionales del formulario
      telefono_contacto: "+56 9 3456 7890",
      email_contacto: "valentina.herrera@email.com",
      direccion: "Pasaje Ñuñoa 890, Ñuñoa, Santiago",
      apoderado: "Roberto Herrera"
    },
    {
      id: "std_004",
      nombre: "Diego Alejandro Morales Fuentes",
      rut: "21.456.789-0",
      curso: "2°A",
      establecimientoId: "RBD9493",
      estado: "activo",
      fecha_creacion: new Date("2024-02-01"),
      fecha_actualizacion: new Date("2024-02-01"),
      // Campos adicionales del formulario
      telefono_contacto: "+56 9 4567 8901",
      email_contacto: "diego.morales@email.com",
      direccion: "Av. Vitacura 2345, Vitacura, Santiago",
      apoderado: "Patricia Fuentes"
    },
    {
      id: "std_005",
      nombre: "Isabella Camila Rojas Vargas",
      rut: "22.567.890-1",
      curso: "6°B",
      establecimientoId: "RBD9493",
      estado: "egresado",
      fecha_creacion: new Date("2023-03-15"),
      fecha_actualizacion: new Date("2024-01-30"),
      // Campos adicionales del formulario
      telefono_contacto: "+56 9 5678 9012",
      email_contacto: "isabella.rojas@email.com",
      direccion: "Calle Lo Barnechea 3456, Lo Barnechea, Santiago",
      apoderado: "Miguel Rojas"
    }
  ]);

  // Función para filtrar estudiantes por nombre
  const filtrarEstudiantes = (searchText) => {
    if (!searchText) return [];
    
    return mockEstudiantes
      .filter(estudiante => 
        estudiante.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        estudiante.rut.includes(searchText) ||
        estudiante.curso.toLowerCase().includes(searchText.toLowerCase())
      )
      .map(estudiante => ({
        value: estudiante.id,
        label: (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '4px 0'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#1890ff' }}>
                {estudiante.nombre}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {estudiante.curso} • {estudiante.rut}
              </div>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#999',
              textAlign: 'right'
            }}>
              {estudiante.estado}
            </div>
          </div>
        ),
        estudiante: estudiante
      }));
  };

  // Función para filtrar opciones del autocomplete
  const filterOption = (inputValue, option) => {
    if (!option || !option.estudiante) return false;
    
    const estudiante = option.estudiante;
    const searchTerm = inputValue.toLowerCase();
    
    return (
      estudiante.nombre.toLowerCase().indexOf(searchTerm) !== -1 ||
      estudiante.rut.toLowerCase().indexOf(searchTerm) !== -1 ||
      estudiante.curso.toLowerCase().indexOf(searchTerm) !== -1
    );
  };

  // Función para autocompletar campos cuando se selecciona un estudiante
  const handleEstudianteSelect = (value, option) => {
    const estudianteSeleccionado = option.estudiante;
    
    if (estudianteSeleccionado) {
      form.setFieldsValue({
        nombre: estudianteSeleccionado.nombre,
        rut: estudianteSeleccionado.rut,
        curso: estudianteSeleccionado.curso,
        establecimientoId: estudianteSeleccionado.establecimientoId,
        estado: estudianteSeleccionado.estado,
        telefono_contacto: estudianteSeleccionado.telefono_contacto,
        email_contacto: estudianteSeleccionado.email_contacto,
        apoderado: estudianteSeleccionado.apoderado,
        direccion: estudianteSeleccionado.direccion
      });
      
      message.success(`Estudiante seleccionado: ${estudianteSeleccionado.nombre}`);
    }
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = (value) => {
    if (!value) {
      // Limpiar campos si se borra la búsqueda
      form.setFieldsValue({
        nombre: '',
        rut: '',
        curso: '',
        establecimientoId: '',
        estado: undefined,
        telefono_contacto: '',
        email_contacto: '',
        apoderado: '',
        direccion: ''
      });
    }
  };

  // Función para abrir el modal de crear estudiante
  const showModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setModalVisible(false);
    formEstudiante.resetFields();
  };

  // Función para crear un nuevo estudiante
  const handleCrearEstudiante = async () => {
    try {
      const values = await formEstudiante.validateFields();
      
      // Generar ID único
      const nuevoId = `std_${String(mockEstudiantes.length + 1).padStart(3, '0')}`;
      
      const nuevoEstudiante = {
        id: nuevoId,
        ...values,
        estado: values.estado || 'activo',
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
      };
      
      // Agregar el nuevo estudiante al array
      setMockEstudiantes(prev => [...prev, nuevoEstudiante]);
      
      message.success(`Estudiante creado exitosamente: ${nuevoEstudiante.nombre}`);
      handleCancel();
      
      // Opcional: Seleccionar automáticamente el nuevo estudiante
      form.setFieldsValue({
        estudiante_id: nuevoId,
        nombre: nuevoEstudiante.nombre,
        rut: nuevoEstudiante.rut,
        curso: nuevoEstudiante.curso,
        establecimientoId: nuevoEstudiante.establecimientoId,
        estado: nuevoEstudiante.estado,
        telefono_contacto: nuevoEstudiante.telefono_contacto,
        email_contacto: nuevoEstudiante.email_contacto,
        apoderado: nuevoEstudiante.apoderado,
        direccion: nuevoEstudiante.direccion
      });
      
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      message.error('Error al crear el estudiante');
    }
  };

  const handlePanelChange = (keys) => {
    setActiveKeys(keys);
  };

  const handleGuardarBorrador = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Datos del formulario (borrador):', values);
      message.success('Borrador guardado correctamente');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      message.error('Error al guardar el borrador');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarDerivacion = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Datos del formulario (enviar):', values);
      message.success('Derivación enviada correctamente');
      form.resetFields();
    } catch (error) {
      console.error('Error al enviar derivación:', error);
      message.error('Error al enviar la derivación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-derivacion-container">
      <div className="formulario-header">
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Nueva Derivación Psicosocial
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Complete el formulario con la información del estudiante y los detalles de la derivación.
        </Text>
      </div>

      {/* Nueva sección para crear estudiante */}
      <div style={{ 
        margin: '24px 0', 
        padding: '16px', 
        backgroundColor: '#f6ffed', 
        border: '1px solid #b7eb8f',
        borderRadius: '8px'
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="vertical" size="small">
              <Text strong style={{ color: '#52c41a' }}>
                ¿No encuentra el estudiante en la lista?
              </Text>
              <Text type="secondary">
                Puede crear un nuevo estudiante para continuar con la derivación.
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={showModal}
              size="large"
            >
              Crear Nuevo Estudiante
            </Button>
          </Col>
        </Row>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="formulario-derivacion"
        style={{ marginTop: '24px' }}
        initialValues={{
          estado: 'activo',
          estado_derivacion: 'en_proceso'
        }}
      >
        <Collapse
          activeKey={activeKeys}
          onChange={handlePanelChange}
          ghost
          size="large"
        >
          {/* Sección 1: Datos del Estudiante */}
          <Panel
            header={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text strong>Datos del Estudiante</Text>
              </Space>
            }
            key="1"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Buscar Estudiante *"
                  name="estudiante_id"
                  rules={[{ required: true, message: 'Por favor busque y seleccione un estudiante' }]}
                >
                  <AutoComplete
                    placeholder="Escriba el nombre, RUT o curso del estudiante"
                    size="large"
                    prefix={<SearchOutlined />}
                    options={mockEstudiantes.map(estudiante => ({
                      value: estudiante.id,
                      label: (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '4px 0'
                        }}>
                          <div>
                            <div style={{ fontWeight: '500', color: '#1890ff' }}>
                              {estudiante.nombre}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {estudiante.curso} • {estudiante.rut}
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: '#999',
                            textAlign: 'right'
                          }}>
                            {estudiante.estado}
                          </div>
                        </div>
                      ),
                      estudiante: estudiante
                    }))}
                    onSearch={filtrarEstudiantes}
                    onSelect={handleEstudianteSelect}
                    filterOption={filterOption}
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    onSearchChange={handleSearchChange}
                    notFoundContent="No se encontraron estudiantes"
                    dropdownStyle={{ 
                      maxHeight: '300px',
                      overflow: 'auto'
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre Completo *"
                  name="nombre"
                  rules={[
                    { required: true, message: 'Por favor ingrese el nombre del estudiante' },
                    { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  ]}
                >
                  <Input
                    placeholder="Nombre completo del estudiante"
                    size="large"
                    prefix={<UserOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="RUT *"
                  name="rut"
                  rules={[
                    { required: true, message: 'Por favor ingrese el RUT' },
                    { 
                      pattern: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 
                      message: 'Formato inválido (ej: 12.345.678-9)' 
                    }
                  ]}
                >
                  <Input
                    placeholder="12.345.678-9"
                    size="large"
                    prefix={<IdcardOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Curso *"
                  name="curso"
                  rules={[
                    { required: true, message: 'Por favor ingrese el curso' },
                    { min: 2, message: 'El curso debe tener al menos 2 caracteres' }
                  ]}
                >
                  <Input
                    placeholder="Ej: 3°A, 4°B"
                    size="large"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Establecimiento ID *"
                  name="establecimientoId"
                  rules={[{ required: true, message: 'Por favor ingrese el ID del establecimiento' }]}
                >
                  <Input
                    placeholder="ID del establecimiento"
                    size="large"
                    prefix={<HomeOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Estado del Estudiante *"
                  name="estado"
                  rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
                >
                  <Select
                    placeholder="Seleccionar estado"
                    size="large"
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  >
                    <Option value="activo">Activo</Option>
                    <Option value="egresado">Egresado</Option>
                    <Option value="derivado">Derivado</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 2: Datos de la Derivación */}
          <Panel
            header={
              <Space>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                <Text strong>Datos de la Derivación</Text>
              </Space>
            }
            key="2"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Fecha de Derivación *"
                  name="fecha_derivacion"
                  rules={[{ required: true, message: 'Por favor seleccione la fecha de derivación' }]}
                >
                  <DatePicker
                    placeholder="Seleccionar fecha"
                    size="large"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Estado de la Derivación *"
                  name="estado_derivacion"
                  rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
                >
                  <Select
                    placeholder="Seleccionar estado"
                    size="large"
                  >
                    <Option value="en_proceso">En Proceso</Option>
                    <Option value="en_seguimiento">En Seguimiento</Option>
                    <Option value="cerrado">Cerrado</Option>
                    <Option value="archivado">Archivado</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Motivo de la Derivación *"
                  name="motivo"
                  rules={[
                    { required: true, message: 'Por favor describa el motivo de la derivación' },
                    { min: 10, message: 'El motivo debe tener al menos 10 caracteres' }
                  ]}
                >
                  <TextArea
                    placeholder="Describa detalladamente el motivo de la derivación"
                    rows={6}
                    showCount
                    maxLength={1000}
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Derivado Por *"
                  name="derivado_por"
                  rules={[{ required: true, message: 'Por favor ingrese quién deriva el caso' }]}
                >
                  <Input
                    placeholder="Nombre de quien deriva el caso"
                    size="large"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Responsable Asignado *"
                  name="responsable_id"
                  rules={[{ required: true, message: 'Por favor seleccione el responsable' }]}
                >
                  <Select
                    placeholder="Seleccionar responsable"
                    size="large"
                    showSearch
                    optionFilterProp="children"
                  >
                    <Option value="psicologo1">Psicólogo María González</Option>
                    <Option value="psicologo2">Psicólogo Juan Pérez</Option>
                    <Option value="psicologo3">Psicóloga Ana Rodríguez</Option>
                    <Option value="psicologo4">Psicólogo Carlos Silva</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 3: Información Adicional */}
          <Panel
            header={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                <Text strong>Información Adicional</Text>
              </Space>
            }
            key="3"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Prioridad"
                  name="prioridad"
                >
                  <Select
                    placeholder="Seleccionar prioridad"
                    size="large"
                  >
                    <Option value="baja">Baja</Option>
                    <Option value="media">Media</Option>
                    <Option value="alta">Alta</Option>
                    <Option value="urgente">Urgente</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tipo de Caso"
                  name="tipo_caso"
                >
                  <Select
                    placeholder="Seleccionar tipo"
                    size="large"
                  >
                    <Option value="conductual">Conductual</Option>
                    <Option value="emocional">Emocional</Option>
                    <Option value="academico">Académico</Option>
                    <Option value="familiar">Familiar</Option>
                    <Option value="social">Social</Option>
                    <Option value="higiene">Higiene</Option>
                    <Option value="asistencia">Asistencia</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Observaciones"
                  name="observaciones"
                >
                  <TextArea
                    placeholder="Agregue observaciones adicionales si es necesario"
                    rows={3}
                    showCount
                    maxLength={500}
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Sección 4: Datos de Contacto */}
          <Panel
            header={
              <Space>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <Text strong>Datos de Contacto</Text>
              </Space>
            }
            key="4"
            className="form-panel"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Teléfono de Contacto"
                  name="telefono_contacto"
                >
                  <Input
                    placeholder="+56 9 1234 5678"
                    size="large"
                    prefix={<PhoneOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email de Contacto"
                  name="email_contacto"
                >
                  <Input
                    placeholder="contacto@email.com"
                    size="large"
                    type="email"
                    prefix={<MailOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre del apoderado"
                  name="apoderado"
                >
                  <Input
                    placeholder="Nombre del apoderado"
                    size="large"
                    prefix={<UserOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                >
                  <Input
                    placeholder="Dirección del estudiante"
                    size="large"
                    prefix={<HomeOutlined />}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <Divider />

        {/* Botones de Acción */}
        <div className="formulario-actions">
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Button
                size="large"
                icon={<SaveOutlined />}
                onClick={handleGuardarBorrador}
                loading={loading}
                style={{
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Guardar Borrador
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={handleEnviarDerivacion}
                loading={loading}
                style={{
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Enviar Derivación
              </Button>
            </Col>
          </Row>
        </div>
      </Form>

      {/* Modal para crear nuevo estudiante */}
      <Modal
        title={
          <Space>
            <UserAddOutlined style={{ color: '#1890ff' }} />
            <span>Crear Nuevo Estudiante</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleCrearEstudiante}
            icon={<PlusOutlined />}
          >
            Crear Estudiante
          </Button>
        ]}
        width={800}
        destroyOnClose
      >
        <Form
          form={formEstudiante}
          layout="vertical"
          initialValues={{
            estado: 'activo',
            establecimientoId: 'RBD9493'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombre Completo *"
                name="nombre"
                rules={[
                  { required: true, message: 'Por favor ingrese el nombre del estudiante' },
                  { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                ]}
              >
                <Input
                  placeholder="Nombre completo del estudiante"
                  size="large"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="RUT *"
                name="rut"
                rules={[
                  { required: true, message: 'Por favor ingrese el RUT' },
                  { 
                    pattern: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 
                    message: 'Formato inválido (ej: 12.345.678-9)' 
                  }
                ]}
              >
                <Input
                  placeholder="12.345.678-9"
                  size="large"
                  prefix={<IdcardOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Curso *"
                name="curso"
                rules={[
                  { required: true, message: 'Por favor ingrese el curso' },
                  { min: 2, message: 'El curso debe tener al menos 2 caracteres' }
                ]}
              >
                <Input
                  placeholder="Ej: 3°A, 4°B"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Establecimiento ID *"
                name="establecimientoId"
                rules={[{ required: true, message: 'Por favor ingrese el ID del establecimiento' }]}
              >
                <Input
                  placeholder="RBD9493"
                  size="large"
                  prefix={<HomeOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Estado del Estudiante *"
                name="estado"
                rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
              >
                <Select
                  placeholder="Seleccionar estado"
                  size="large"
                >
                  <Option value="activo">Activo</Option>
                  <Option value="egresado">Egresado</Option>
                  <Option value="derivado">Derivado</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Teléfono de Contacto"
                name="telefono_contacto"
              >
                <Input
                  placeholder="+56 9 1234 5678"
                  size="large"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email de Contacto"
                name="email_contacto"
                rules={[
                  { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}
              >
                <Input
                  placeholder="contacto@email.com"
                  size="large"
                  type="email"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombre del Apoderado"
                name="apoderado"
              >
                <Input
                  placeholder="Nombre del apoderado"
                  size="large"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Dirección"
                name="direccion"
              >
                <Input
                  placeholder="Dirección del estudiante"
                  size="large"
                  prefix={<HomeOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default FormularioDerivacion; 