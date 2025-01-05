import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Space, Image } from 'antd';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import image1 from '.././assets/unnamed.jpg';

interface HeartRateChartProps {
  data: { date: string; heartRate: number }[];
  avgHeartRate: number;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data, avgHeartRate }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 200]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="heartRate" stroke="#8884d8" />
        <Line type="monotone" dataKey={() => avgHeartRate} stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface OxygenLevelChartProps {
  data: { date: string; oxygenLevel: number }[];
  avgOxygenLevel: number;
}

const OxygenLevelChart: React.FC<OxygenLevelChartProps> = ({ data, avgOxygenLevel }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="oxygenLevel" stroke="#8884d8" />
        <Line type="monotone" dataKey={() => avgOxygenLevel} stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface OldPeopleDetailProps {
  sensor1Data: { Oxy: number };
}

interface OldPersonRecord {
  name: string;
  age: number;
  address: string;
  health: string;
  room: string;
  hometown: string;
  oxygenLevel: number;
  medicalHistory: string;
  phoneNumber: string;
  nurse: string;
  sensor?: string;
  startDate?: string;
}

const OldPeopleDetail: React.FC<OldPeopleDetailProps> = ({ sensor1Data }) => {
  const location = useLocation();
  const { record } = location.state || {};
  const [hehe, setHehe] = useState<OldPersonRecord | null>(null);
  const data = [
    { date: '2024-05-01', heartRate: 75, oxygenLevel: 98 },
    { date: '2024-05-02', heartRate: 77, oxygenLevel: 97 },
    { date: '2024-05-03', heartRate: 78, oxygenLevel: 96 },
    { date: '2024-05-04', heartRate: 76, oxygenLevel: 97 },
    { date: '2024-05-05', heartRate: 80, oxygenLevel: 95 },
    { date: '2024-05-06', heartRate: 79, oxygenLevel: 96 },
    { date: '2024-05-07', heartRate: 82, oxygenLevel: 95 },
    { date: '2024-05-08', heartRate: 81, oxygenLevel: 94 },
    { date: '2024-05-09', heartRate: 79, oxygenLevel: 96 },
    { date: '2024-05-10', heartRate: 77, oxygenLevel: 97 },
    { date: '2024-05-11', heartRate: 76, oxygenLevel: 98 },
    { date: '2024-05-12', heartRate: 75, oxygenLevel: 97 },
    { date: '2024-05-13', heartRate: 74, oxygenLevel: 98 },
    { date: '2024-05-14', heartRate: 73, oxygenLevel: 97 },
    { date: '2024-05-15', heartRate: 72, oxygenLevel: 96 },
  ];

  const [avgHeartRate, setAvgHeartRate] = useState(0);
  const [avgOxygenLevel, setAvgOxygenLevel] = useState(0);

  useEffect(() => {
    const heartRates = data.map(item => item.heartRate);
    const oxygenLevels = data.map(item => item.oxygenLevel);
    const avgHR = heartRates.reduce((acc, curr) => acc + curr, 0) / heartRates.length;
    const avgOL = oxygenLevels.reduce((acc, curr) => acc + curr, 0) / oxygenLevels.length;
    setAvgHeartRate(avgHR);
    setAvgOxygenLevel(avgOL);
    setHehe(record);
  }, [record]);

  if (!hehe) {
    return null;
  }

  return (
    <div
      style={{
        padding: '20px',
        gap: '20px',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card title={`Thông tin chi tiết của ${hehe.name}`} style={{ width: 700 }}>
        <Space direction="vertical" size="large">
          <Image width={100} src={image1} />
          <div>
            <p>
              <strong>Tên người cao tuổi:</strong> {hehe.name}
            </p>
            <p>
              <strong>Tuổi:</strong> {hehe.age}
            </p>
            <p>
              <strong>Địa chỉ nhà:</strong> {hehe.address}
            </p>
            <p style={{ color: hehe.health === 'Không tốt' ? 'red' : 'green' }}>
              <strong>Hiện trạng sức khỏe:</strong> {hehe.health}
            </p>
            <p>
              <strong>Phòng:</strong> {hehe.room}
            </p>
            <p>
              <strong>Quê quán:</strong> {hehe.hometown}
            </p>
            <p>
              <strong>Nồng độ oxy trong máu:</strong> {hehe.oxygenLevel}
            </p>
            <p>
              <strong>Bệnh nền:</strong> {hehe.medicalHistory}
            </p>
            <p>
              <strong>Số điện thoại của người thân: +84</strong> {hehe.phoneNumber}
            </p>
            <p>
              <strong>Người chăm sóc:</strong> {hehe.nurse}
            </p>
            {hehe.sensor === 'sensordata1' && (
              <p style={{ color: sensor1Data.Oxy < 90 ? 'red' : 'green' }}>
                <strong>Nồng độ oxi trong máu hiện tại: {sensor1Data.Oxy.toFixed(2)} SpO2 </strong>
              </p>
            )}
            <p>
              <strong>Ngày vào viện:</strong> {hehe.startDate ? moment(hehe.startDate).format('YYYY-MM-DD') : ''}
            </p>
          </div>
        </Space>
      </Card>

      {hehe.health === 'Không tốt' && (
        <Card className="Haha" style={{ width: 700 }}>
          <div>
            <h2>Biểu đồ nhịp tim trong 15 ngày qua</h2>
            <HeartRateChart data={data} avgHeartRate={avgHeartRate} />
          </div>
          <div>
            <h2>Biểu đồ nồng độ oxy trong máu trong 15 ngày qua</h2>
            <OxygenLevelChart data={data} avgOxygenLevel={avgOxygenLevel} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default OldPeopleDetail;
