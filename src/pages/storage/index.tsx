import React, { useEffect, useState } from 'react';
import { Table, Tag, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface InventoryItem {
  name: string;
  category: string;
  quantity: number;
  status: string;
}

const Storage: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const navigate = useNavigate();
  const sampleInventoryData: InventoryItem[] = [
    { name: 'Paracetamol', category: 'Thuốc', quantity: 100, status: 'Đầy đủ' },
    { name: 'Máy đo huyết áp', category: 'Thiết bị', quantity: 10, status: 'Đầy đủ' },
    { name: 'Băng gạc', category: 'Dụng cụ', quantity: 50, status: 'Đầy đủ' },
    { name: 'Insulin', category: 'Thuốc', quantity: 5, status: 'Thiếu' },
    { name: 'Nhiệt kế', category: 'Thiết bị', quantity: 2, status: 'Thiếu' },
    { name: 'Aspirin', category: 'Thuốc', quantity: 30, status: 'Đầy đủ' },
    { name: 'Gạc', category: 'Dụng cụ', quantity: 70, status: 'Đầy đủ' },
    { name: 'Ống nghe', category: 'Thiết bị', quantity: 15, status: 'Đầy đủ' },
    { name: 'Antibiotic Ointment', category: 'Thuốc', quantity: 25, status: 'Đầy đủ' },
    { name: 'Kéo', category: 'Dụng cụ', quantity: 8, status: 'Thiếu' },
  ];

  localStorage.setItem('inventoryData', JSON.stringify(sampleInventoryData));
  useEffect(() => {
    const savedData = localStorage.getItem('inventoryData');
    if (savedData) {
      const parsedData: InventoryItem[] = JSON.parse(savedData);
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
        <h2>Danh Sách Thuốc và Dụng Cụ Trong Kho</h2>
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

export default Storage;