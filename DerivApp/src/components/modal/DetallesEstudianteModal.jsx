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
  Divider
} from 'antd';
import {
  FileTextOutlined,
  HistoryOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EditOutlined,
  CheckCircleOutlined
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
  convertirFechaFirestore,
  getEstadoColor,
  getEstadoText,
  getPrioridadText
}) => {
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
                        <span>Derivación #{index + 1} - {convertirFechaFirestore(derivacion.fecha_derivacion)}</span>
                        <Space>
                          <Tag color={getEstadoColor(derivacion.estado)}>
                            {getEstadoText(derivacion.estado)}
                          </Tag>
                          <Tag color={
                            derivacion.prioridad === 'alta' ? 'red' : 
                            derivacion.prioridad === 'media' ? 'orange' : 
                            derivacion.prioridad === 'baja' ? 'green' : 
                            'default'
                          }>
                            {getPrioridadText(derivacion.prioridad)}
                          </Tag>
                          <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => onEditarDerivacion(derivacion)}
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