import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Space
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditarDerivacionModal = ({
  visible,
  onCancel,
  loading,
  form,
  onFinish
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          <span>Editar Derivación</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar cambios
            </Button>
            <Button onClick={onCancel}>
              Cancelar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditarDerivacionModal; 