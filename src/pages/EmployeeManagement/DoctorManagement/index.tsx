import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Input, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface DoctorData {
  key: string;
  name: string;
  specialization: string;
  room: string;
}

const Doctor: React.FC = () => {
  const [data, setData] = useState<DoctorData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string>('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('doctorsData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleDelete = (key: string) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData);
    localStorage.setItem('doctorsData', JSON.stringify(newData));
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  const handleEdit = (record: DoctorData) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const newData = [...data];
      if (editingKey) {
        const index = newData.findIndex(item => item.key === editingKey);
        newData[index] = { ...values, key: editingKey };
      } else {
        const newKey = newData.length ? (parseInt(newData[newData.length - 1].key, 10) + 1).toString() : '1';
        newData.push({
          ...values,
          key: newKey,
        });
      }
      setData(newData);
      setIsModalVisible(false);
      localStorage.setItem('doctorsData', JSON.stringify(newData));
    });
  };

  const handleNavigateToDetail = (record: DoctorData) => {
    navigate(`/employee-management/doctor/${record.key}`, { state: { record } });
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: DoctorData) => <a onClick={() => handleNavigateToDetail(record)}>{text}</a>,
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 200,
    },
    {
      title: 'Phòng',
      dataIndex: 'room',
      key: 'room',
      width: 200,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: DoctorData) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Sửa</a>
          <a onClick={() => handleDelete(record.key)}>Xóa</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h2>Danh sách bác sĩ</h2>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16, marginRight: 16 }}>
              Thêm bác sĩ
            </Button>
          </div>
        </div>

        <Table columns={columns} dataSource={data} />
      </div>

      <Modal
        title="Thêm/Sửa Thông Tin Bác Sĩ"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="specialization"
                label="Chuyên môn"
                rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="room" label="Phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
                <Select>
                  {['A', 'B', 'C'].map(block =>
                    Array.from({ length: 5 }, (_, i) => (
                      <Option key={`${block}${i + 1}`} value={`${block}${i + 1}`}>
                        {`${block}${i + 1}`}
                      </Option>
                    )),
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Doctor;
