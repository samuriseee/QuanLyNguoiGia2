import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Space, Image } from 'antd';

interface DoctorRecord {
  name: string;
  specialization: string;
  room: string;
  addedDate: string;
}

const DoctorDetail: React.FC = () => {
  const location = useLocation();
  const { record } = location.state || {};
  const [hehe, setHehe] = useState<DoctorRecord | null>(null);

  useEffect(() => {
    setHehe(record);
  }, [record]);

  if (!hehe) {
    return null;
  }

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Card
        title={`Thông tin chi tiết của bác sĩ ${hehe.name}`}
        style={{ width: 650 }}>
        <Space direction="vertical" size="large">
          <Image
            width={200}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            alt="Doctor"
          />
          <div>
            <p>
              <strong>Tên bác sĩ:</strong> {hehe.name}
            </p>
            <p>
              <strong>Chuyên môn:</strong> {hehe.specialization}
            </p>
            <p>
              <strong>Phòng:</strong> {hehe.room}
            </p>
            <p>
              <strong>Ngày thêm:</strong>{' '}
            </p>
            {/* Add more details here if necessary */}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default DoctorDetail;