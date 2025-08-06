import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Avatar, Divider } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  TeamOutlined,
  BookOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DetallesEventoModal = ({ evento, visible, onClose }) => {
  if (!evento) return null;

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

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no definida';
    const eventDate = fecha?.toDate?.() || new Date(fecha);
    return dayjs(eventDate).format('DD/MM/YYYY');
  };

  // Formatear hora
  const formatearHora = (fecha) => {
    if (!fecha) return '';
    const eventDate = fecha?.toDate?.() || new Date(fecha);
    return dayjs(eventDate).format('HH:mm');
  };

  const statusMapping = {
    'completado': 'Completado',
    'en_proceso': 'En Proceso',
    'cancelado': 'Cancelado'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado': return 'green';
      case 'en_proceso': return 'blue';
      case 'cancelado': return 'red';
      default: return 'default';
    }
  };

  return (
    <Modal
      title={
        <Space>
          <Avatar 
            style={{ backgroundColor: getEventColor(evento.tipo) }}
            icon={<CalendarOutlined />}
          />
          <span>Detalles del Evento</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        {/* Información principal */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {evento.titulo}
          </Title>
          
          <Space size="large" style={{ marginBottom: '16px' }}>
            <Tag color={getEventColor(evento.tipo)} size="large">
              {evento.tipo?.toUpperCase()}
            </Tag>
            <Tag color={getPriorityColor(evento.prioridad)} size="large">
              {evento.prioridad?.toUpperCase()}
            </Tag>
            <Tag color={getStatusColor(evento.status)} size="large">
              {statusMapping[evento.status] || evento.status}
            </Tag>
          </Space>
        </div>

        <Divider />

        {/* Descripción */}
        {evento.descripcion && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={5}>
              <BookOutlined /> Descripción
            </Title>
            <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {evento.descripcion}
            </Text>
          </div>
        )}

        {/* Información de fecha y hora */}
        <Descriptions title="Información Temporal" bordered size="small" style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="Fecha" span={2}>
            <Space>
              <CalendarOutlined />
              {formatearFecha(evento.fecha)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Hora" span={2}>
            <Space>
              <ClockCircleOutlined />
              {formatearHora(evento.fecha)}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        {/* Información del estudiante */}
        {evento.estudiante && (
          <Descriptions title="Información del Estudiante" bordered size="small" style={{ marginBottom: '24px' }}>
            <Descriptions.Item label="Nombre" span={2}>
              <Space>
                <UserOutlined />
                {evento.estudiante.nombre}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Curso" span={2}>
              <Space>
                <TeamOutlined />
                {evento.estudiante.curso}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* Información de derivación */}
        {evento.derivacion && (
          <Descriptions title="Información de Derivación" bordered size="small" style={{ marginBottom: '24px' }}>
            <Descriptions.Item label="Motivo" span={2}>
              {evento.derivacion.motivo}
            </Descriptions.Item>
            {evento.derivacion.descripcion && (
              <Descriptions.Item label="Descripción" span={2}>
                {evento.derivacion.descripcion}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {/* Información de alerta */}
        {evento.nivelAlerta && (
          <Descriptions title="Información de Alerta" bordered size="small">
            <Descriptions.Item label="Nivel de Alerta" span={2}>
              <Space>
                <ExclamationCircleOutlined style={{ color: getPriorityColor(evento.prioridad) }} />
                <Tag color={getPriorityColor(evento.prioridad)}>
                  {evento.nivelAlerta}
                </Tag>
              </Space>
            </Descriptions.Item>
            {evento.scoreNormalizado && (
              <Descriptions.Item label="Factor de Alerta" span={2}>
                {Math.round(evento.scoreNormalizado * 100)}%
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {/* Información adicional */}
        {(evento.ubicacion || evento.duracion || evento.responsable) && (
          <>
            <Divider />
            <Descriptions title="Información Adicional" bordered size="small">
              {evento.ubicacion && (
                <Descriptions.Item label="Ubicación" span={2}>
                  {evento.ubicacion}
                </Descriptions.Item>
              )}
              {evento.duracion && (
                <Descriptions.Item label="Duración" span={2}>
                  {evento.duracion} minutos
                </Descriptions.Item>
              )}
              {evento.responsable && (
                <Descriptions.Item label="Responsable" span={2}>
                  {evento.responsable}
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DetallesEventoModal; 