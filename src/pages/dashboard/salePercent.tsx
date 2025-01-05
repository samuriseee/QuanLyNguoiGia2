import type { ColProps } from 'antd/es/col';
import type { FC } from 'react';

import { Badge, Card, Col, List, Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E36E7E', '#8F66DE'];

const wrapperCol: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const NursingHomeAgeChart: FC<{ dataAge: any; loading: boolean }> = ({ dataAge, loading }) => {
  const [ageCounts, setAgeCounts] = useState({
    '<50 tuổi': 1,
    '50-60 tuổi': 2,
    '60-70 tuổi': 3,
    '70-80 tuổi': 4,
    '80-90 tuổi': 5,
  });

  useEffect(() => {
    if (dataAge) {
      const newAgeCounts = { ...ageCounts };
      dataAge.forEach((person: any) => {
        if (person.age < 50) {
          newAgeCounts['<50 tuổi'] += 1;
        } else if (person.age >= 50 && person.age < 60) {
          newAgeCounts['50-60 tuổi'] += 1;
        } else if (person.age >= 60 && person.age < 70) {
          newAgeCounts['60-70 tuổi'] += 1;
        } else if (person.age >= 70 && person.age < 80) {
          newAgeCounts['70-80 tuổi'] += 1;
        } else {
          newAgeCounts['80-90 tuổi'] += 1;
        }
      });

      setAgeCounts(newAgeCounts);
    }
  }, [dataAge]);

  const data = Object.keys(ageCounts).map(key => ({
    name: key,
    // @ts-ignore
    value: ageCounts[key],
  }));

  return (
    <Card
      className="salePercent"
      title="Biểu đồ phân phối tuổi"
      loading={loading}
      style={{
        width: '50%',
        margin: '10px 0',
      }}
    >
      <Row gutter={20}>
        <Col {...wrapperCol}>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active) {
                    const { name, value } = payload[0];
                    const total = data.map(d => d.value).reduce((a, b) => a + b);
                    const percent = ((value / total) * 100).toFixed(2) + '%';

                    return (
                      <span className="customTooltip">
                        {name} : {percent}
                      </span>
                    );
                  }

                  return null;
                }}
              />
              <Pie strokeOpacity={0} data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col {...wrapperCol}>
          <List
            bordered
            dataSource={data}
            renderItem={(item, index) => {
              const total = data.map(d => d.value).reduce((a, b) => a + b);
              const percent = ((item.value / total) * 100).toFixed(2) + '%';

              return (
                <List.Item>
                  <Badge color={COLORS[index % COLORS.length]} />
                  <span>{item.name}</span> | <span>{item.value}</span> <span>{percent}</span>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default NursingHomeAgeChart;
