import React from 'react';
import {
  Modal,
  Spin,
  Tabs,
  Card,
  Row,
  Col,
  Avatar,
  Descriptions,
  Space,
  Tag,
  Button,
  Timeline,
  Divider,
  Form,
  Tooltip,
  Collapse
} from 'antd';
import dayjs from '../../utils/dayjs';
import {
  FileTextOutlined,
  HistoryOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  StopOutlined
} from '@ant-design/icons';

const DetallesEstudianteModal = ({
  visible,
  onCancel,
  loading,
  selectedEstudiante,
  derivaciones,
  activeTab,
  onTabChange,
  onEditarDerivacion,
  onAgregarSeguimiento,
  convertirFechaFirestore,
  getEstadoColor,
  getEstadoText,
  getPrioridadText
}) => {
  // Función local para convertir fechas de Firestore usando dayjs
  const convertirFecha = (fecha) => {
    console.log('Convirtiendo fecha:', fecha, 'tipo:', typeof fecha);
    
    if (!fecha) {
      console.log('Fecha es null o undefined');
      return '';
    }
    
    try {
      let date;
      
      // Si es un objeto Timestamp de Firestore
      if (fecha && typeof fecha === 'object' && fecha.seconds) {
        console.log('Es Timestamp con seconds:', fecha.seconds);
        date = dayjs(fecha.seconds * 1000);
      }
      // Si es un objeto Timestamp de Firestore con toDate
      else if (fecha && typeof fecha === 'object' && fecha.toDate) {
        console.log('Es Timestamp con toDate');
        date = dayjs(fecha.toDate());
      }
      // Si es una fecha normal
      else if (fecha instanceof Date) {
        console.log('Es Date object');
        date = dayjs(fecha);
      }
      // Si es un string
      else if (typeof fecha === 'string') {
        console.log('Es string:', fecha);
        // Intentar diferentes formatos de fecha
        if (fecha.includes('T')) {
          // Formato ISO
          date = dayjs(fecha);
        } else if (fecha.includes('-')) {
          // Verificar si es DD-MM-YYYY o YYYY-MM-DD
          const parts = fecha.split('-');
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              // Formato YYYY-MM-DD
              date = dayjs(fecha, 'YYYY-MM-DD');
            } else {
              // Formato DD-MM-YYYY
              date = dayjs(fecha, 'DD-MM-YYYY');
            }
          } else {
            // Intentar parsear como fecha normal
            date = dayjs(fecha);
          }
        } else if (fecha.includes('/')) {
          // Formato DD/MM/YYYY
          date = dayjs(fecha, 'DD/MM/YYYY');
        } else {
          // Intentar parsear como fecha normal
          date = dayjs(fecha);
        }
      }
      // Si es un número (timestamp)
      else if (typeof fecha === 'number') {
        console.log('Es número:', fecha);
        date = dayjs(fecha);
      }
      // Si es un objeto dayjs
      else if (fecha && fecha.$d) {
        console.log('Es objeto dayjs');
        date = fecha;
      }
      else {
        console.log('No se pudo convertir la fecha:', fecha);
        return '';
      }
      
      // Verificar si la fecha es válida
      if (date && date.isValid()) {
        return date.format('DD/MM/YYYY');
      } else {
        console.log('Fecha inválida después de conversión');
        return '';
      }
    } catch (error) {
      console.error('Error al convertir fecha:', fecha, error);
      return '';
    }
  };
  // Componente para el contenido del modal
  const ModalContent = () => {
    if (loading) {
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
                                                 <span>Derivación #{index + 1} - {convertirFecha(derivacion.fecha_derivacion)}</span>
                        <Space>
                          <Tag color={
                            derivacion.estado_derivacion === 'abierta' ? 'green' :
                            derivacion.estado_derivacion === 'cerrada' ? 'red' :
                            getEstadoColor(derivacion.estado)
                          }>
                            {derivacion.estado_derivacion === 'abierta' ? 'ABIERTA' :
                             derivacion.estado_derivacion === 'cerrada' ? 'CERRADA' :
                             getEstadoText(derivacion.estado)}
                          </Tag>
                          <Tag color={
                            derivacion.prioridad === 'alta' ? 'red' : 
                            derivacion.prioridad === 'media' ? 'orange' : 
                            derivacion.prioridad === 'baja' ? 'green' : 
                            'default'
                          }>
                            {getPrioridadText(derivacion.prioridad)}
                          </Tag>
                          {/* Mostrar nivel de alerta calculado */}
                          {derivacion.seguimientos && derivacion.seguimientos.length > 0 && (
                            <Tag color={
                              derivacion.nivelAlerta === 'Alerta crítica' ? '#cf1322' :
                              derivacion.nivelAlerta === 'Alerta alta' ? '#ff4d4f' :
                              derivacion.nivelAlerta === 'Alerta moderada' ? '#faad14' :
                              '#52c41a'
                            }>
                              {derivacion.nivelAlerta || 'Sin alerta'}
                            </Tag>
                          )}
                          <Tooltip title="Editar derivación">
                            <Button 
                              type="text" 
                              icon={<EditOutlined />} 
                              size="small"
                              onClick={() => onEditarDerivacion(derivacion)}
                            />
                          </Tooltip>
                          <Tooltip title="Agregar seguimiento">
                            <Button 
                              type="text" 
                              icon={<PlusOutlined />} 
                              size="small"
                              style={{ color: '#52c41a' }}
                              onClick={() => onAgregarSeguimiento(derivacion)}
                            />
                          </Tooltip>
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
                             {convertirFecha(derivacion.fecha_evaluacion)}
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
                         {console.log('Seguimientos de la derivación:', derivacion.seguimientos)}
                         <Collapse 
                           ghost 
                           defaultActiveKey={[]}
                           style={{ marginTop: '8px' }}
                         >
                           {derivacion.seguimientos.map((seguimiento, seguimientoIndex) => {
                             console.log('Seguimiento individual:', seguimiento);
                             return (
                               <Collapse.Panel
                               key={seguimiento.id}
                               header={
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                   <span style={{ fontWeight: '500' }}>
                                     {seguimiento.tipo} - {convertirFecha(seguimiento.fecha)}
                                   </span>
                                   <Tag size="small" color="blue">
                                     {seguimiento.responsable}
                                   </Tag>
                                 </div>
                               }
                             >
                               <Row gutter={[16, 16]}>
                                 <Col span={12}>
                                   <Descriptions column={1} size="small">
                                     <Descriptions.Item label="Tipo">
                                       {seguimiento.tipo}
                                     </Descriptions.Item>
                                     <Descriptions.Item label="Fecha">
                                       {convertirFecha(seguimiento.fecha)}
                                     </Descriptions.Item>
                                     <Descriptions.Item label="Responsable">
                                       {seguimiento.responsable}
                                     </Descriptions.Item>
                                     <Descriptions.Item label="Duración">
                                       {seguimiento.duracion || 'No especificada'}
                                     </Descriptions.Item>
                                   </Descriptions>
                                 </Col>
                                 <Col span={12}>
                                   <Descriptions column={1} size="small">
                                     <Descriptions.Item label="Descripción">
                                       {seguimiento.descripcion || 'Sin descripción'}
                                     </Descriptions.Item>
                                     <Descriptions.Item label="Observaciones">
                                       {seguimiento.observaciones || 'Sin observaciones'}
                                     </Descriptions.Item>
                                                               <Descriptions.Item label="Resultado">
                            <Tag color={
                              seguimiento.resultado === 'positivo' ? 'green' :
                              seguimiento.resultado === 'negativo' ? 'red' :
                              seguimiento.resultado === 'neutro' ? 'blue' :
                              seguimiento.resultado === 'pendiente' ? 'orange' :
                              'default'
                            }>
                              {seguimiento.resultado ? seguimiento.resultado.toUpperCase() : 'Sin resultado'}
                            </Tag>
                          </Descriptions.Item>
                                   </Descriptions>
                                 </Col>
                               </Row>
                             </Collapse.Panel>
                           );
                         })}
                         </Collapse>
                       </div>
                     )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      }
    ];

    return (
      <Tabs 
        activeKey={activeTab} 
        onChange={onTabChange}
        items={items}
        style={{ marginTop: '16px' }}
      />
    );
  };

  return (
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
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnHidden
      centered
    >
      <ModalContent />
    </Modal>
  );
};

export default DetallesEstudianteModal; 