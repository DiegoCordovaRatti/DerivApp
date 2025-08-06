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
const { TextArea } = Input;

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
              name="fecha_derivacion"
              label="Fecha de Derivación"
              rules={[{ required: true, message: 'Por favor seleccione la fecha de derivación' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Seleccionar fecha"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="estado_derivacion"
              label="Estado de la Derivación"
              rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
            >
              <Select placeholder="Seleccionar estado">
                <Option value="abierta">Abierta</Option>
                <Option value="cerrada">Cerrada</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
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
          <Col span={12}>
            <Form.Item
              name="tipo_caso"
              label="Tipo de Caso"
              rules={[{ required: true, message: 'Por favor seleccione el tipo de caso' }]}
            >
              <Select placeholder="Seleccionar tipo">
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
        </Row>

        <Form.Item
          name="motivo"
          label="Motivo de la Derivación"
          rules={[
            { required: true, message: 'Por favor describa el motivo de la derivación' },
            { min: 10, message: 'El motivo debe tener al menos 10 caracteres' }
          ]}
        >
          <Input
            placeholder="Describa el motivo de la derivación"
            showCount
            maxLength={150}
          />
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción Detallada"
          rules={[{ required: true, message: 'Por favor describa el motivo de la derivación' }]}
        >
          <TextArea
            placeholder="Describa con más detalle la situación del estudiante"
            rows={4}
            showCount
            maxLength={1000}
            style={{ resize: 'vertical' }}
          />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="derivado_por"
              label="Derivado Por"
              rules={[{ required: true, message: 'Por favor ingrese quién deriva el caso' }]}
            >
              <Input
                placeholder="Nombre de quien deriva el caso"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="responsable_id"
              label="Responsable Asignado"
              rules={[{ required: true, message: 'Por favor seleccione el responsable' }]}
            >
              <Select
                placeholder="Seleccionar responsable"
                showSearch
                optionFilterProp="children"
              >
                <Option value="psicologo">Psicólogía</Option>
                <Option value="trabajo_social">Trabajo Social</Option>
                <Option value="jefe_convivencia">Jefe de Convivencia</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="fecha_evaluacion"
              label="Fecha de evaluación"
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Seleccionar fecha"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="resultado"
              label="Resultado"
              rules={[{ required: true, message: 'Por favor seleccione el resultado' }]}
            >
              <Select placeholder="Seleccionar resultado">
                <Option value="positivo">Positivo</Option>
                <Option value="negativo">Negativo</Option>
                <Option value="neutro">Neutro</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="observaciones"
          label="Observaciones"
        >
          <TextArea
            placeholder="Observaciones adicionales"
            rows={3}
            showCount
            maxLength={500}
          />
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