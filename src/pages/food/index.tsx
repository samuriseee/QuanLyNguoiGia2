import React, { useEffect, useState } from 'react';
import { Table, Tag, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface FoodItem {
  name: string;
  category: string;
  type: string;
  quantity: number;
  status: string;
}

const Food: React.FC = () => {
  const [data, setData] = useState<FoodItem[]>([]);
  const [filteredData, setFilteredData] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const navigate = useNavigate();
  const sampleFoodData: FoodItem[] = [
    {
      name: 'Rau chân vịt',
      category: 'Tim mạch',
      type: 'Thực phẩm',
      quantity: 50,
      status: 'Đầy đủ',
    },
    {
      name: 'Chuối',
      category: 'Thần kinh',
      type: 'Thực phẩm',
      quantity: 30,
      status: 'Đầy đủ',
    },
    {
      name: 'Sữa chua',
      category: 'Tiêu hoá',
      type: 'Thực phẩm',
      quantity: 20,
      status: 'Đầy đủ',
    },
    {
      name: 'Fish Oil',
      category: 'Tim mạch',
      type: 'Thực phẩm bổ sung',
      quantity: 15,
      status: 'Thiếu',
    },
    {
      name: 'Hạnh nhân',
      category: 'Thần kinh',
      type: 'Thực phẩm',
      quantity: 40,
      status: 'Đầy đủ',
    },
    {
      name: 'Yến mạch',
      category: 'Tiêu hoá',
      type: 'Thực phẩm',
      quantity: 25,
      status: 'Đầy đủ',
    },
    {
      name: 'Vitamin C',
      category: 'Hỗ trợ chung',
      type: 'Thực phẩm bổ sung',
      quantity: 10,
      status: 'Thiếu',
    },
    {
      name: 'Bông cải xanh',
      category: 'Tim mạch',
      type: 'Thực phẩm',
      quantity: 35,
      status: 'Đầy đủ',
    },
    {
      name: 'Việt quất',
      category: 'Thần kinh',
      type: 'Thực phẩm',
      quantity: 20,
      status: 'Đầy đủ',
    },
    {
      name: 'Probiotics',
      category: 'Tiêu hoá',
      type: 'Thực phẩm bổ sung',
      quantity: 5,
      status: 'Thiếu',
    },
  ];

  localStorage.setItem('foodData', JSON.stringify(sampleFoodData));

  useEffect(() => {
    const savedData = localStorage.getItem('foodData');
    if (savedData) {
      const parsedData: FoodItem[] = JSON.parse(savedData);
      setData(parsedData);
      setFilteredData(parsedData);
    }
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === 'Tất cả') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.category === value);
      setFilteredData(filtered);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'category',
      width: 200,
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: 'Số lượng hiện có',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
    },
    {
      title: 'Tình trạng',
      key: 'status',
      dataIndex: 'status',
      width: 150,
      render: (status: string) => (
        <Tag color={status === 'Đầy đủ' ? 'green' : 'red'} key={status}>
          {status}
        </Tag>
      ),
    },
  ];

  const categoryOptions = Array.from(
    new Set(data.map((item) => item.category))
  ).map((category) => (
    <Option key={category} value={category}>
      {category}
    </Option>
  ));

  return (
    <div style={{ margin: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <h2>Danh Sách Thực Phẩm và Thực Phẩm Bổ Sung</h2>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ marginBottom: 16, width: 200 }}>
          <Option value="Tất cả">Hiển thị tất cả</Option>
          {categoryOptions}
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default Food;