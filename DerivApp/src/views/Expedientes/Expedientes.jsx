import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Pagination,
  ConfigProvider,
  message,
  Form
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import './Expedientes.scss';
import dayjs from '../../utils/dayjs';
import {
  obtenerEstudiantes,
  obtenerDerivacionesEstudiante,
  actualizarDerivacion,
  crearSeguimiento,
  buscarEstudiantes
} from '../../services/expedienteService';
import { DetallesEstudianteModal, EditarDerivacionModal, AgregarSeguimientoModal } from '../../components/modal';

const { Title, Text } = Typography;

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
  
  // Estados para el modal de editar derivación
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [selectedDerivacion, setSelectedDerivacion] = useState(null);
  const [form] = Form.useForm();
  
  // Estados para el modal de agregar seguimiento
  const [seguimientoModalVisible, setSeguimientoModalVisible] = useState(false);
  const [seguimientoModalLoading, setSeguimientoModalLoading] = useState(false);
  const [selectedDerivacionSeguimiento, setSelectedDerivacionSeguimiento] = useState(null);
  const [seguimientoForm] = Form.useForm();
  
  // Estados para datos del backend
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);

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
      
      // Cargar derivaciones para cada estudiante y calcular prioridad más alta
      const estudiantesConDerivaciones = await Promise.all(
        estudiantesProcesados.map(async (estudiante) => {
          try {
            const derivacionesResponse = await obtenerDerivacionesEstudiante(estudiante.id);
            const derivacionesData = derivacionesResponse.derivaciones || derivacionesResponse;
            const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
            
            return {
              ...estudiante,
              derivaciones: derivacionesProcesadas
            };
          } catch (error) {
            console.error(`Error al cargar derivaciones para estudiante ${estudiante.id}:`, error);
            return {
              ...estudiante,
              derivaciones: []
            };
          }
        })
      );
      
      // Filtrar estudiantes que tengan al menos una derivación (abierta o cerrada)
      const estudiantesConDerivacionesFiltrados = estudiantesConDerivaciones.filter(
        estudiante => estudiante.derivaciones && estudiante.derivaciones.length > 0
      );
      
      // Ordenar estudiantes por prioridad (más alta a más baja)
      const estudiantesOrdenados = ordenarEstudiantesPorPrioridad(estudiantesConDerivacionesFiltrados);
      
      setEstudiantes(estudiantesOrdenados);
      setEstudiantesFiltrados(estudiantesOrdenados);
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
      const estudiantesOrdenados = ordenarEstudiantesPorPrioridad(estudiantes);
      setEstudiantesFiltrados(estudiantesOrdenados);
      return;
    }

    try {
      setLoading(true);
      const response = await buscarEstudiantes(searchText);
      // El backend puede devolver { estudiantes: [...] } o directamente el array
      const estudiantesData = response.estudiantes || response;
      const estudiantesProcesados = procesarEstudiantes(estudiantesData);
      
      // Cargar derivaciones para cada estudiante encontrado
      const estudiantesConDerivaciones = await Promise.all(
        estudiantesProcesados.map(async (estudiante) => {
          try {
            const derivacionesResponse = await obtenerDerivacionesEstudiante(estudiante.id);
            const derivacionesData = derivacionesResponse.derivaciones || derivacionesResponse;
            const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
            
            return {
              ...estudiante,
              derivaciones: derivacionesProcesadas
            };
          } catch (error) {
            console.error(`Error al cargar derivaciones para estudiante ${estudiante.id}:`, error);
            return {
              ...estudiante,
              derivaciones: []
            };
          }
        })
      );
      
      // Filtrar estudiantes que tengan al menos una derivación
      const estudiantesConDerivacionesFiltrados = estudiantesConDerivaciones.filter(
        estudiante => estudiante.derivaciones && estudiante.derivaciones.length > 0
      );
      
      const estudiantesOrdenados = ordenarEstudiantesPorPrioridad(estudiantesConDerivacionesFiltrados);
      setEstudiantesFiltrados(estudiantesOrdenados);
    } catch (error) {
      console.error('Error al buscar estudiantes:', error);
      // Fallback a búsqueda local
      const filtrados = estudiantes.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        estudiante.rut.includes(searchText) ||
        estudiante.curso.toLowerCase().includes(searchText.toLowerCase())
      );
      const filtradosOrdenados = ordenarEstudiantesPorPrioridad(filtrados);
      setEstudiantesFiltrados(filtradosOrdenados);
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
      
      // Actualizar la prioridad del estudiante basada en las derivaciones
      const estudianteConDerivaciones = {
        ...estudiante,
        derivaciones: derivacionesProcesadas
      };
      setSelectedEstudiante(estudianteConDerivaciones);
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
  };

  const handleCerrarEditModal = () => {
    setEditModalVisible(false);
    setSelectedDerivacion(null);
    form.resetFields();
  };

  const handleCerrarSeguimientoModal = () => {
    setSeguimientoModalVisible(false);
    setSelectedDerivacionSeguimiento(null);
    seguimientoForm.resetFields();
  };

  const handleAgregarSeguimiento = (derivacion) => {
    setSelectedDerivacionSeguimiento(derivacion);
    setSeguimientoModalVisible(true);
  };

  const handleGuardarSeguimiento = async (values) => {
    if (!selectedDerivacionSeguimiento) return;
    
    setSeguimientoModalLoading(true);
    try {
      // Agregar seguimiento al backend
      await crearSeguimiento(selectedEstudiante.id, selectedDerivacionSeguimiento.id, values);
      
      // Recargar derivaciones para mostrar el nuevo seguimiento
      const response = await obtenerDerivacionesEstudiante(selectedEstudiante.id);
      const derivacionesData = response.derivaciones || response;
      const derivacionesProcesadas = procesarDerivaciones(derivacionesData);
      setDerivaciones(derivacionesProcesadas);
      
      setSeguimientoModalVisible(false);
      setSelectedDerivacionSeguimiento(null);
      seguimientoForm.resetFields();
      message.success('Seguimiento agregado correctamente');
    } catch (error) {
      console.error('Error al agregar seguimiento:', error);
      message.error('Error al agregar el seguimiento');
    } finally {
      setSeguimientoModalLoading(false);
    }
  };

  const handleEditarDerivacion = (derivacion) => {
    setSelectedDerivacion(derivacion);
    setEditModalVisible(true);
    form.setFieldsValue({
      motivo: derivacion.motivo || '',
      descripcion: derivacion.descripcion || '',
      observaciones: derivacion.observaciones || '',
      prioridad: derivacion.prioridad || 'baja',
      estado: derivacion.estado || 'pendiente',
      fecha_evaluacion: derivacion.fecha_evaluacion ? dayjs(derivacion.fecha_evaluacion) : null,
      resultado: derivacion.resultado || ''
    });
  };

  const handleGuardarCambios = async (values) => {
    if (!selectedDerivacion) return;
    
    setEditModalLoading(true);
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
      
      setEditModalVisible(false);
      setSelectedDerivacion(null);
      form.resetFields();
      message.success('Derivación actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      message.error('Error al actualizar la derivación');
    } finally {
      setEditModalLoading(false);
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
      baja: <ExclamationCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
      sin_prioridad: <ExclamationCircleOutlined style={{ color: '#d9d9d9', fontSize: '16px' }} />
    };
    return iconos[prioridad] || iconos['sin_prioridad']; // Fallback a sin_prioridad si no hay prioridad
  };

  // Función para obtener el texto de prioridad
  const getPrioridadText = (prioridad) => {
    const textos = {
      alta: 'ALTA',
      media: 'MEDIA',
      baja: 'BAJA',
      sin_prioridad: 'SIN PRIORIDAD'
    };
    return textos[prioridad] || 'SIN PRIORIDAD';
  };

  // Función para obtener el valor numérico de prioridad
  const getPrioridadValue = (prioridad) => {
    const valores = {
      alta: 3,
      media: 2,
      baja: 1,
      sin_prioridad: 0
    };
    return valores[prioridad] || 0;
  };

  // Función para ordenar estudiantes por prioridad (más alta a más baja)
  const ordenarEstudiantesPorPrioridad = (estudiantes) => {
    return [...estudiantes].sort((a, b) => {
      const prioridadA = getPrioridadMasAlta(a);
      const prioridadB = getPrioridadMasAlta(b);
      const valorA = getPrioridadValue(prioridadA);
      const valorB = getPrioridadValue(prioridadB);
      
      // Ordenar de mayor a menor (prioridad alta primero)
      return valorB - valorA;
    });
  };

  // Función para obtener la prioridad más alta de las derivaciones activas
  const getPrioridadMasAlta = (estudiante) => {
    // Si el estudiante tiene derivaciones cargadas, calcular la prioridad más alta
    if (estudiante.derivaciones && estudiante.derivaciones.length > 0) {
      // Filtrar derivaciones que no estén cerradas
      const derivacionesActivas = estudiante.derivaciones.filter(
        derivacion => derivacion.estado !== 'cerrado'
      );
      
      if (derivacionesActivas.length > 0) {
        // Mapear prioridades a valores numéricos para comparación
        const prioridadValues = {
          'alta': 3,
          'media': 2,
          'baja': 1
        };
        
        // Encontrar la derivación con prioridad más alta
        const derivacionMasAlta = derivacionesActivas.reduce((prev, current) => {
          const prevValue = prioridadValues[prev.prioridad] || 0;
          const currentValue = prioridadValues[current.prioridad] || 0;
          return currentValue > prevValue ? current : prev;
        });
        
        return derivacionMasAlta.prioridad || 'baja';
      }
    }
    
    // Si no hay derivaciones activas, retornar 'sin_prioridad' para mostrar icono gris
    return 'sin_prioridad';
  };

  // Función para convertir fechas de Firestore
  const convertirFechaFirestore = (fecha) => {
    if (!fecha) return '';
    
    try {
      // Si es un objeto Timestamp de Firestore
      if (fecha && typeof fecha === 'object' && fecha.seconds) {
        const date = new Date(fecha.seconds * 1000);
        return date.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      // Si es un objeto Timestamp de Firestore con nanoseconds
      if (fecha && typeof fecha === 'object' && fecha.toDate) {
        const date = fecha.toDate();
        return date.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      // Si es una fecha normal
      if (fecha instanceof Date) {
        return fecha.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      // Si es un string
      if (typeof fecha === 'string') {
        const date = new Date(fecha);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }
      }
      
      // Si es un número (timestamp)
      if (typeof fecha === 'number') {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      
      return '';
    } catch (error) {
      console.error('Error al convertir fecha:', fecha, error);
      return '';
    }
  };

  // Función para calcular el tiempo transcurrido usando Day.js
  const getTiempoTranscurrido = (fecha) => {
    if (!fecha) return '';
    
    try {
      // Si es un objeto Timestamp de Firestore
      if (fecha && typeof fecha === 'object' && fecha.seconds) {
        return dayjs(fecha.seconds * 1000).fromNow();
      }
      
      // Si es un objeto Timestamp de Firestore con toDate
      if (fecha && typeof fecha === 'object' && fecha.toDate) {
        return dayjs(fecha.toDate()).fromNow();
      }
      
      // Si es una fecha normal
      if (fecha instanceof Date) {
        return dayjs(fecha).fromNow();
      }
      
      // Si es un string
      if (typeof fecha === 'string') {
        return dayjs(fecha).fromNow();
      }
      
      // Si es un número (timestamp)
      if (typeof fecha === 'number') {
        return dayjs(fecha).fromNow();
      }
      
      return '';
    } catch (error) {
      console.error('Error al calcular tiempo transcurrido:', fecha, error);
      return '';
    }
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
      render: (_, record) => {
        // Verificar si tiene derivaciones activas
        const tieneDerivacionesActivas = record.derivaciones && 
          record.derivaciones.some(derivacion => derivacion.estado !== 'cerrado');
        
        if (tieneDerivacionesActivas) {
          return (
            <Tag color="blue">
              Derivado
            </Tag>
          );
        } else {
          return (
            <Tag color="default">
              Sin derivaciones
        </Tag>
          );
        }
      },
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
      render: (_, record) => {
        const prioridadMasAlta = getPrioridadMasAlta(record);
        const tooltipText = prioridadMasAlta === 'sin_prioridad' 
          ? 'Sin derivaciones activas' 
          : `Prioridad más alta: ${prioridadMasAlta}`;
        
        return (
          <Tooltip title={tooltipText}>
            {getPrioridadIcon(prioridadMasAlta)}
        </Tooltip>
        );
      },
      width: 80
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
          <Tooltip title="Ver detalles">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              style={{ color: '#1890ff' }}
            onClick={() => handleVerDetalles(record)}
            />
          </Tooltip>
      ),
      width: 80
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

  return (
    <ConfigProvider>
    <div className="expedientes-container">
      {/* Header */}
      <div className="expedientes-header">
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Estudiantes con derivaciones
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Gestiona los expedientes y seguimientos de los estudiantes que tienen derivaciones registradas.
          </Text>
        </div>
        
      </div>

      {/* Filtros y búsqueda */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Input
              placeholder="Buscar estudiantes con derivaciones por nombre o RUT"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleBuscar}
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
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
               <DetallesEstudianteModal
          visible={modalVisible}
          onCancel={handleCerrarModal}
          loading={modalLoading}
          selectedEstudiante={selectedEstudiante}
          derivaciones={derivaciones}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditarDerivacion={handleEditarDerivacion}
          onAgregarSeguimiento={handleAgregarSeguimiento}
          convertirFechaFirestore={convertirFechaFirestore}
          getEstadoColor={getEstadoColor}
          getEstadoText={getEstadoText}
          getPrioridadText={getPrioridadText}
        />

       {/* Modal de editar derivación */}
       <EditarDerivacionModal
         visible={editModalVisible}
         onCancel={handleCerrarEditModal}
         loading={editModalLoading}
         form={form}
         onFinish={handleGuardarCambios}
       />

       {/* Modal de agregar seguimiento */}
       <AgregarSeguimientoModal
         visible={seguimientoModalVisible}
         onCancel={handleCerrarSeguimientoModal}
         loading={seguimientoModalLoading}
         form={seguimientoForm}
         onFinish={handleGuardarSeguimiento}
         derivacion={selectedDerivacionSeguimiento}
       />
    </div>
      </ConfigProvider>
  );
};

export default Expedientes; 