import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Select,
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Modal,
  Form,
  Alert,
  Spin
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
  TeamOutlined,
  CrownOutlined,
  StopOutlined
} from '@ant-design/icons';
import { authService } from '../../../services/authService';
import dayjs from 'dayjs';
import './GestionUsuarios.scss';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [rolesPermisos, setRolesPermisos] = useState(null);
  const [form] = Form.useForm();

  // Cargar roles y permisos disponibles
  useEffect(() => {
    const cargarRolesPermisos = async () => {
      try {
        const response = await authService.obtenerRolesPermisos();
        if (response.success) {
          setRolesPermisos({
            ROLES: response.roles,
            PERMISOS: response.permisos
          });
        }
      } catch (error) {
        console.error('Error al cargar roles:', error);
        // Fallback con roles hardcodeados si hay error
        setRolesPermisos({
          ROLES: {
            ADMIN: 'administrador',
            PSICOLOGO: 'psicologo',
            TRABAJADOR_SOCIAL: 'trabajador_social',
            JEFE_CONVIVENCIA: 'jefe_convivencia',
            DOCENTE: 'docente'
          }
        });
      }
    };
    cargarRolesPermisos();
  }, []);

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      // Por ahora simulamos datos hasta implementar la API
      const usuariosSimulados = [
        {
          id: '1',
          uid: 'admin-123',
          nombre: 'Administrador',
          apellido: 'Sistema',
          email: 'admin@derivappchile.cl',
          rol: 'administrador',
          activo: true,
          fecha_creacion: new Date(),
          ultimo_acceso: new Date()
        }
      ];
      setUsuarios(usuariosSimulados);
    } catch (error) {
      message.error('Error al cargar usuarios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función para obtener el color del rol
  const getRoleColor = (rol) => {
    const roleColors = {
      'administrador': 'purple',
      'psicologo': 'blue',
      'trabajador_social': 'green',
      'jefe_convivencia': 'orange',
      'docente': 'default'
    };
    return roleColors[rol] || 'default';
  };

  // Función para obtener el nombre del rol
  const getRoleLabel = (rol) => {
    const roleLabels = {
      'administrador': 'Administrador',
      'psicologo': 'Psicólogo',
      'trabajador_social': 'Trabajador Social',
      'jefe_convivencia': 'Jefe de Convivencia',
      'docente': 'Docente'
    };
    return roleLabels[rol] || rol;
  };

  // Función para obtener el icono del rol
  const getRoleIcon = (rol) => {
    return rol === 'administrador' ? <CrownOutlined /> : <TeamOutlined />;
  };

  // Crear nuevo usuario
  const handleCrearUsuario = async (values) => {
    try {
      setLoading(true);
      const response = await authService.crearUsuario(values);
      if (response.success) {
        message.success('Usuario creado exitosamente');
        setModalVisible(false);
        form.resetFields();
        cargarUsuarios();
      } else {
        message.error(response.message || 'Error al crear usuario');
      }
    } catch (error) {
      message.error('Error al crear usuario');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Desactivar usuario
  const handleDesactivarUsuario = async (userId) => {
    try {
      const response = await authService.desactivarUsuario(userId);
      if (response.success) {
        message.success('Usuario desactivado exitosamente');
        cargarUsuarios();
      } else {
        message.error('Error al desactivar usuario');
      }
    } catch (error) {
      message.error('Error al desactivar usuario');
      console.error('Error:', error);
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = (
      usuario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesRole = !filterRole || usuario.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  // Columnas de la tabla
  const columns = [
    {
      title: 'Usuario',
      key: 'usuario',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="default" />
          <div>
            <div>
              <Text strong>{record.nombre} {record.apellido}</Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.email}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => (
        <Tag 
          color={getRoleColor(rol)} 
          icon={getRoleIcon(rol)}
        >
          {getRoleLabel(rol)}
        </Tag>
      ),
      filters: rolesPermisos ? Object.keys(rolesPermisos.ROLES).map(key => ({
        text: getRoleLabel(rolesPermisos.ROLES[key]),
        value: rolesPermisos.ROLES[key],
      })) : [],
      onFilter: (value, record) => record.rol === value,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo) => (
        <Tag color={activo ? 'success' : 'error'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.activo === value,
    },
    {
      title: 'Último Acceso',
      dataIndex: 'ultimo_acceso',
      key: 'ultimo_acceso',
      render: (fecha) => {
        if (!fecha) return <Text type="secondary">Nunca</Text>;
        return (
          <Text>
            {dayjs(fecha).format('DD/MM/YYYY HH:mm')}
          </Text>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
            disabled={!record.activo}
          >
            Editar
          </Button>
          {record.activo && (
            <Popconfirm
              title="¿Estás seguro de desactivar este usuario?"
              description="El usuario no podrá acceder al sistema."
              onConfirm={() => handleDesactivarUsuario(record.id)}
              okText="Sí, desactivar"
              cancelText="Cancelar"
            >
              <Button
                type="text"
                danger
                icon={<StopOutlined />}
              >
                Desactivar
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="gestion-usuarios">
      <Card>
        <div className="usuarios-header">
          <Title level={4}>
            <UserOutlined />
            <span>Gestión de Usuarios</span>
          </Title>
          <Text type="secondary">
            Administra los usuarios del sistema, sus roles y permisos
          </Text>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Buscar por nombre o email"
              allowClear
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filtrar por rol"
              allowClear
              style={{ width: '100%' }}
              onChange={setFilterRole}
            >
              {rolesPermisos && Object.entries(rolesPermisos.ROLES).map(([key, value]) => (
                <Option key={value} value={value}>
                  {getRoleLabel(value)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setModalVisible(true);
              }}
              style={{ width: '100%' }}
            >
              Nuevo Usuario
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={usuariosFiltrados}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} de ${total} usuarios`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal para crear/editar usuario */}
      <Modal
        title={
          <Space>
            <UserAddOutlined />
            <span>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCrearUsuario}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input placeholder="Ingresa el nombre" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="apellido"
                label="Apellido"
              >
                <Input placeholder="Ingresa el apellido" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'El email es requerido' },
              { type: 'email', message: 'Formato de email inválido' }
            ]}
          >
            <Input placeholder="usuario@ejemplo.com" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'La contraseña es requerida' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password placeholder="Contraseña temporal" />
            </Form.Item>
          )}

          <Form.Item
            name="rol"
            label="Rol"
            rules={[{ required: true, message: 'El rol es requerido' }]}
          >
            <Select 
              placeholder="Selecciona un rol"
              loading={!rolesPermisos}
              notFoundContent={!rolesPermisos ? "Cargando roles..." : "No hay roles disponibles"}
            >
              {rolesPermisos && Object.entries(rolesPermisos.ROLES).map(([key, value]) => (
                <Option key={value} value={value}>
                  <Space>
                    {getRoleIcon(value)}
                    {getRoleLabel(value)}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="establecimientoId"
            label="Establecimiento"
          >
            <Input placeholder="ID del establecimiento (opcional)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  setEditingUser(null);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? 'Actualizar' : 'Crear Usuario'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;
