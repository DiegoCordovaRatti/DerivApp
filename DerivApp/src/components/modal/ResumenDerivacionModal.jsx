import React from 'react';
import { Modal, Typography, Descriptions, Button, Space, Tag, Divider } from 'antd';
import { FileTextOutlined, UserOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ResumenDerivacionModal = ({ visible, onClose, derivacion, estudiante, onIrAExpedientes }) => {
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'red';
      case 'media': return 'orange';
      case 'baja': return 'green';
      default: return 'blue';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'orange';
      case 'en_proceso': return 'blue';
      case 'completada': return 'green';
      case 'borrador': return 'gray';
      default: return 'blue';
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>Resumen de Derivación</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        {/* Información del Estudiante */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            <UserOutlined style={{ marginRight: '8px' }} />
            Información del Estudiante
          </Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Nombre">{estudiante?.nombre}</Descriptions.Item>
            <Descriptions.Item label="RUT">{estudiante?.rut}</Descriptions.Item>
            <Descriptions.Item label="Curso">{estudiante?.curso}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Tag color={estudiante?.estado === 'activo' ? 'green' : 'red'}>
                {estudiante?.estado}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Información de la Derivación */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            Detalles de la Derivación
          </Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Fecha de Derivación">
              <Space>
                <CalendarOutlined />
                {formatDate(derivacion?.fecha_derivacion)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Caso">
              <Text strong>{derivacion?.tipo_caso}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Motivo">
              <Text>{derivacion?.motivo}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Descripción">
              <Text>{derivacion?.descripcion}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Prioridad">
              <Tag color={getPrioridadColor(derivacion?.prioridad)}>
                {derivacion?.prioridad?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Tag color={getEstadoColor(derivacion?.estado_derivacion)}>
                {derivacion?.estado_derivacion?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            {derivacion?.responsable && (
              <Descriptions.Item label="Responsable">
                <Text>{derivacion?.responsable}</Text>
              </Descriptions.Item>
            )}
            {derivacion?.observaciones && (
              <Descriptions.Item label="Observaciones">
                <Text>{derivacion?.observaciones}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        <Divider />

        {/* Botones de Acción */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space size="large">
            <Button 
              type="primary" 
              onClick={onIrAExpedientes}
              icon={<FileTextOutlined />}
            >
              Ir a Expedientes
            </Button>
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ResumenDerivacionModal; 