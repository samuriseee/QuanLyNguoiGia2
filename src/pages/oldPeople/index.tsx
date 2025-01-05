import React, { useState, useEffect } from 'react';
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface OldPersonData {
  key: string;
  name: string;
  age: number;
  nurse: string;
  address: string;
  health: string;
  room: string;
  startDate: string;
  hometown: string;
  medicalHistory: string;
  heartRate: number;
  oxygenLevel: number;
  relativeName: string;
  phoneNumber: string;
  relativeAddress: string;
  relationship: string;
  sensor?: string;
}

interface OldPeopleProps {

}

const OldPeople: React.FC<OldPeopleProps> = () => {
  const [data, setData] = useState<OldPersonData[]>([]);
  const [filteredData, setFilteredData] = useState<OldPersonData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string>('');
  const [form] = Form.useForm();
  const [filterOption, setFilterOption] = useState('Tất cả');
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>(''); // State to manage health status
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('oldPeopleData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleDelete = (key: string) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    localStorage.setItem('oldPeopleData', JSON.stringify(newData));
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  const handleEdit = (record: OldPersonData) => {
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
    });
    setEditingKey(record.key);
    setStartDate(record.startDate ? moment(record.startDate) : null);
    setIsModalVisible(true);
    setHealthStatus(record.health); // Update health status when editing
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      const date = startDate || values.startDate;
      if (editingKey) {
        const index = newData.findIndex((item) => item.key === editingKey);
        newData[index] = { ...values, key: editingKey, startDate: date };
      } else {
        const newKey = newData.length
          ? (parseInt(newData[newData.length - 1].key, 10) + 1).toString()
          : '1';
        newData.push({
          ...values,
          key: newKey,
          startDate: date,
        });
      }
      setData(newData);
      setIsModalVisible(false);
      localStorage.setItem('oldPeopleData', JSON.stringify(newData));
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterOption(value);
    if (value === 'Tất cả') {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) => item.health === value);
      setFilteredData(filtered);
    }
  };

  const handleDatePickerChange = (date: any) => {
    setStartDate(date);
  };

  const handleNavigateToDetail = (record: OldPersonData) => {
    navigate(`/oldpeople/${record.key}`, { state: { record } });
  };

  const handleHealthChange = (value: string) => {
    setHealthStatus(value); // Update health status state
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: OldPersonData) => (
        <a onClick={() => handleNavigateToDetail(record)}>{text}</a>
      ),
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Điều Dưỡng Chăm Sóc',
      dataIndex: 'nurse',
      key: 'nurse',
      width: 200,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 400,
    },
    {
      title: 'Sức khỏe',
      key: 'health',
      dataIndex: 'health',
      width: 100,
      render: (health: string) => (
        <Tag color={health === 'Tốt' ? 'success' : 'volcano'} key={health}>
          {health}
        </Tag>
      ),
    },
    {
      title: 'Phòng',
      key: 'room',
      dataIndex: 'room',
      width: 200,
    },
    {
      title: 'Ngày vào',
      key: 'startDate',
      dataIndex: 'startDate',
      render: (startDate: string) => {
        if (startDate) {
          return moment(startDate).format('YYYY-MM-DD');
        }
        return '';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: OldPersonData) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Sửa</a>
          <a onClick={() => handleDelete(record.key)}>Xóa</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 20px 5px 20px',
        }}>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: 16, marginRight: 16 }}>
          Thêm người cao tuổi
        </Button>
        <Select
          value={filterOption}
          onChange={handleFilterChange}
          style={{ marginBottom: 16, width: 200 }}>
          <Option value="Tất cả">Hiển thị tất cả</Option>
          <Option value="Tốt">Lọc sức khỏe tốt</Option>
          <Option value="Không tốt">Lọc sức khỏe không tốt</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData.length > 0 ? filteredData : data}
      />

      <Modal
        title="Thêm/Sửa Người Cao Tuổi"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={1000}>
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row gutter={16}>
            {/* Cột 1: Thông tin của người cao tuổi */}
            <Col span={8}>
              <Form.Item
                name="name"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="age"
                label="Tuổi"
                rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="health"
                label="Sức khỏe"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tình trạng sức khỏe!',
                  },
                ]}>
                <Select onChange={handleHealthChange}>
                  <Option value="Tốt">Tốt</Option>
                  <Option value="Không tốt">Không tốt</Option>
                </Select>
              </Form.Item>
              {healthStatus === 'Không tốt' && (
                <Form.Item
                  name="sensor"
                  label="Thiết bị cảm biến"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thiết bị cảm biến!',
                    },
                  ]}>
                  <Select>
                    <Option value="default">Không Có</Option>
                    <Option value="sensordata1">Thiết bị cảm biến 1</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                name="room"
                label="Phòng"
                rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
                <Select>
                  {['A', 'B', 'C'].map((block) =>
                    Array.from({ length: 5 }, (_, i) => (
                      <Option
                        key={`${block}${i + 1}`}
                        value={`${block}${i + 1}`}>
                        {`${block}${i + 1}`}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="startDate"
                label="Ngày vào"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày vào!' },
                ]}>
                <DatePicker onChange={handleDatePickerChange} />
              </Form.Item>
              <Form.Item
                name="hometown"
                label="Quê quán"
                rules={[
                  { required: true, message: 'Vui lòng nhập quê quán!' },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            {/* Cột 2: Thông tin bổ sung về người cao tuổi */}
            <Col span={8}>
              <Form.Item
                name="medicalHistory"
                label="Bệnh nền"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập thông tin bệnh nền!',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="heartRate"
                label="Nhịp tim trung bình"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập chỉ số nhịp tim trung bình!',
                  },
                ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="oxygenLevel"
                label="Nồng độ oxi trong máu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập nồng độ oxi trong máu!',
                  },
                ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="nurse"
                label="Người điều dưỡng"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên người điều dưỡng!',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            {/* Cột 3: Thông tin của người thân */}
            <Col span={8}>
              <Form.Item
                name="relativeName"
                label="Tên người thân"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên người thân!' },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại của người thân"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại của người thân!',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="relativeAddress"
                label="Địa chỉ nhà của người thân"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập địa chỉ nhà của người thân!',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="relationship"
                label="Mối quan hệ với người cao tuổi"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mối quan hệ với người cao tuổi!',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default OldPeople;