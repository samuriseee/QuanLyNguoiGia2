import type { FC } from 'react';

import './index.less';

import { useEffect, useState } from 'react';

import Overview from './overview';
import NursingHomeAgeChart from './salePercent';
import TimeLine from './timeLine';
import { Card, Row, Select } from 'antd';
import HealthChart from './healthChart';

const DashBoardPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any[]>([]);
  const [filterDoctorInRoom, setFilterDoctorInRoom] = useState(0);
  const [filterOldPeopleInRoom, setFilterOldPeopleInroom] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('Tất cả');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');

  // mock timer to mimic dashboard data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('oldPeopleData');
    const savedDataDoctor = localStorage.getItem('doctorsData');
    if (savedData) {
      setData(JSON.parse(savedData));
      setDoctor(JSON.parse(savedDataDoctor as any));
    }
  }, []);

  const handleRoomChange = (value: string) => {
    setSelectedRoom(value);
  };

  useEffect(() => {
    if (data && doctor) {
      const filteredOldPeople = data.filter(person => selectedRoom === 'Tất cả' || person.room === selectedRoom);
      const filteredDoctors = doctor.filter(doc => selectedRoom === 'Tất cả' || doc.room === selectedRoom);
      setFilterDoctorInRoom(filteredDoctors.length);
      setFilterOldPeopleInroom(filteredOldPeople.length);
      setFilteredData(filteredOldPeople as any);
    }
  }, [selectedRoom, data, doctor]);

  return (
    <div>
      <Card
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Select defaultValue={1} style={{ width: 120 }} options={[{ value: 1, label: 'Đà Nẵng' }]} />
        <Select
          defaultValue="Tất cả"
          style={{
            width: '120px',
            marginLeft: 10,
          }}
          onChange={handleRoomChange}
          options={[
            { value: 'Tất cả', label: 'Tất cả' },
            { value: 'A1', label: 'A1' },
            { value: 'A2', label: 'A2' },
            { value: 'A3', label: 'A3' },
            { value: 'A4', label: 'A4' },
            { value: 'A5', label: 'A5' },
            { value: 'B1', label: 'B1' },
            { value: 'B2', label: 'B2' },
            { value: 'B3', label: 'B3' },
            { value: 'B4', label: 'B4' },
            { value: 'B5', label: 'B5' },
            { value: 'C1', label: 'C1' },
            { value: 'C2', label: 'C2' },
            { value: 'C3', label: 'C3' },
            { value: 'C4', label: 'C4' },
            { value: 'C5', label: 'C5' },
          ]}
        />
      </Card>
      <Overview
        loading={loading}
        filterDoctorInRoom={filterDoctorInRoom}
        filterOldPeopleInRoom={filterOldPeopleInRoom}
      />
      <Row>
        <HealthChart loading={loading} healthData={filteredData} />
        <NursingHomeAgeChart loading={loading} dataAge={filteredData} />
      </Row>
      {/* <TimeLine loading={loading} /> */}
    </div>
  );
};

export default DashBoardPage;
