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
import moment, { Moment } from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

interface SensorData {
  Bpm: number;
  SpO2: number;
  Alarm: number;
}

interface OldPerson {
  key: string;
  name: string;
  age: number;
  nurse: string;
  address: string;
  health: string;
  room: string;
  startDate: Moment | null;
  sensor?: string;
  hometown: string;
  medicalHistory: string;
  heartRate: number;
  oxygenLevel: number;
  relativeName: string;
  phoneNumber: string;
  relativeAddress: string;
  relationship: string;
}

interface OldPeopleProps {
  sensor1Data: any;
  showNotification: (conditionCode: number, dataToShow: number | null, namesString: string) => void;
}

const OldPeople: React.FC<OldPeopleProps> = ({ sensor1Data, showNotification }) => {
  const [data, setData] = useState<OldPerson[]>([]);
  const [filteredData, setFilteredData] = useState<OldPerson[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [filterOption, setFilterOption] = useState('Tất cả');
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [healthStatus, setHealthStatus] = useState(''); // State to manage health status
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorData>({ Bpm: 0, SpO2: 0, Alarm: 0 });
  const [prevSensorData, setPrevSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/sensorData');
        setSensorData(response.data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 1000); // Fetch data every 1 second

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const peopleWithNonDefaultSensor = data.filter(
    (person) => person.sensor && person.sensor !== 'default'
  );
  const namesWithNonDefaultSensor = peopleWithNonDefaultSensor.map(
    (person) => person.name
  );
  const uniqueNames = [...new Set(namesWithNonDefaultSensor)];
  const namesString = uniqueNames.join(', ');

  useEffect(() => {
    console.log('run to this')
    const { Bpm, SpO2, Alarm } = sensorData;
    console.log('Alarm', Alarm);
    if (Bpm !== 0 || SpO2 !== 0 || Alarm !== 0) {
      if (
        prevSensorData &&
        JSON.stringify(prevSensorData) === JSON.stringify(sensorData)
      ) {
        return; // Dữ liệu mới giống dữ liệu trước đó, không cần gọi lại showNotification
      }

      if (Bpm < 60 || Bpm > 100 || SpO2 < 90 || Alarm === 1) {
        let conditionCode = 0;
        let dataToShow: number | null = null;

        if (Bpm < 60 && Bpm > 20) {
          conditionCode = 1;
          dataToShow = Bpm;
        } else if (Bpm > 120) {
          conditionCode = 1;
          dataToShow = Bpm;
        } else if (SpO2 < 90 && SpO2 > 20) {
          conditionCode = 2;
          dataToShow = SpO2;
        } else if (Alarm === 1) {
          conditionCode = 3;
        } else if (Bpm > 120) {
          conditionCode = 4;
          dataToShow = Bpm;
        }

        showNotification(conditionCode, dataToShow, namesString);
      }

      setPrevSensorData(sensorData);
    }
  }, [sensorData, prevSensorData, namesString, showNotification]);

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

  const handleEdit = (record: OldPerson) => {
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
          ? parseInt(newData[newData.length - 1].key, 10) + 1
          : 1;
        newData.push({
          ...values,
          key: newKey.toString(),
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

  const handleNavigateToDetail = (record: OldPerson) => {
    navigate(`/old-people/${record.key}`, { state: { record } });
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
      render: (text: string, record: OldPerson) => (
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
      render: (startDate: Moment | null) => {
        if (startDate) {
          return moment(startDate).format('YYYY-MM-DD');
        }
        return '';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: OldPerson) => (
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
          flexDirection: 'column',
          margin: '20px 20px 5px 20px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <h2>Danh Sách Người Cao Tuổi đang lưu trú</h2>
          <div>
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
        </div>
        <Table
          columns={columns}
          dataSource={filteredData.length > 0 ? filteredData : data}
        />
      </div>

      <Modal
        title="Thêm/Sửa Người Cao Tuổi"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={1000}
        bodyStyle={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row gutter={[24, 24]}>
            {/* Column 1: Elderly Information */}
            <Col span={8}>
              <Form.Item
                name="name"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
              <Form.Item
                name="age"
                label="Tuổi"
                rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập tuổi" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item
                name="health"
                label="Sức khỏe"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng sức khỏe!' }]}
              >
                <Select onChange={handleHealthChange} placeholder="Chọn tình trạng sức khỏe">
                  <Option value="Tốt">Tốt</Option>
                  <Option value="Không tốt">Không tốt</Option>
                </Select>
              </Form.Item>
              {healthStatus === 'Không tốt' && (
                <Form.Item
                  name="sensor"
                  label="Thiết bị cảm biến"
                  rules={[{ required: true, message: 'Vui lòng chọn thiết bị cảm biến!' }]}
                >
                  <Select placeholder="Chọn thiết bị cảm biến">
                    <Option value="default">Không Có</Option>
                    <Option value="sensordata1">Thiết bị cảm biến 1</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                name="room"
                label="Phòng"
                rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}
              >
                <Select placeholder="Chọn phòng">
                  {['A', 'B', 'C'].map((block) =>
                    Array.from({ length: 5 }, (_, i) => (
                      <Option key={`${block}${i + 1}`} value={`${block}${i + 1}`}>
                        {`${block}${i + 1}`}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="startDate"
                label="Ngày vào"
                rules={[{ required: true, message: 'Vui lòng chọn ngày vào!' }]}
              >
                <DatePicker onChange={handleDatePickerChange} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="hometown"
                label="Quê quán"
                rules={[{ required: true, message: 'Vui lòng nhập quê quán!' }]}
              >
                <Input placeholder="Nhập quê quán" />
              </Form.Item>
            </Col>

            {/* Column 2: Additional Elderly Info */}
            <Col span={8}>
              <Form.Item
                name="medicalHistory"
                label="Bệnh nền"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin bệnh nền!' }]}
              >
                <Input placeholder="Nhập bệnh nền" />
              </Form.Item>
              <Form.Item
                name="heartRate"
                label="Nhịp tim trung bình"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ số nhịp tim trung bình!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập nhịp tim" />
              </Form.Item>
              <Form.Item
                name="oxygenLevel"
                label="Nồng độ oxi trong máu"
                rules={[{ required: true, message: 'Vui lòng nhập nồng độ oxi trong máu!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập nồng độ oxi" />
              </Form.Item>
              <Form.Item
                name="nurse"
                label="Người điều dưỡng"
                rules={[{ required: true, message: 'Vui lòng nhập tên người điều dưỡng!' }]}
              >
                <Input placeholder="Nhập tên người điều dưỡng" />
              </Form.Item>
            </Col>

            {/* Column 3: Relative Information */}
            <Col span={8}>
              <Form.Item
                name="relativeName"
                label="Tên người thân"
                rules={[{ required: true, message: 'Vui lòng nhập tên người thân!' }]}
              >
                <Input placeholder="Nhập tên người thân" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại của người thân"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của người thân!' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                name="relativeAddress"
                label="Địa chỉ nhà của người thân"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhà của người thân!' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item
                name="relationship"
                label="Mối quan hệ với người cao tuổi"
                rules={[{ required: true, message: 'Vui lòng nhập mối quan hệ với người cao tuổi!' }]}
              >
                <Input placeholder="Nhập mối quan hệ" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default OldPeople;