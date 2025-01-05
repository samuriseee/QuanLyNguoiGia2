import type { ColProps } from 'antd/es/col';
import type { FC } from 'react';

import { Badge, Card, Col, List, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E36E7E'];

const wrapperCol: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const HealthChart: FC<{ healthData: any; loading: boolean }> = ({ healthData, loading }) => {
  const [chartData, setChartData] = useState<{ goodHealth: number[]; notGoodHealth: number[] } | null>(null);

  useEffect(() => {
    if (healthData && healthData.length > 0) {
      const months = ['Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'];
      const goodHealth = Array(7).fill(0);
      const notGoodHealth = Array(7).fill(0);

      healthData.forEach((item: any) => {
        const startMonth = new Date(item.startDate).getMonth();
        const monthIndex = (startMonth + 1) % 12; // Align with the `months` array
        if (item.health === 'Tốt') {
          goodHealth[monthIndex]++;
        } else {
          notGoodHealth[monthIndex]++;
        }
      });

      setChartData({ goodHealth, notGoodHealth });
    }
  }, [healthData]);

  const data = chartData
    ? [
        { name: 'Tốt', value: chartData.goodHealth.reduce((a, b) => a + b, 0) },
        { name: 'Không tốt', value: chartData.notGoodHealth.reduce((a, b) => a + b, 0) },
      ]
    : [];

  return (
    <Card className="healthChart" title="Biểu đồ sức khỏe" loading={loading} style={{
        width: '49%',
        marginTop: '10px',
        marginRight: '10px',
    }}>
      <Row gutter={20}>
        <Col {...wrapperCol}>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0];
                    const total = data.map(d => d.value).reduce((a, b) => a + b, 0);
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
              const total = data.map(d => d.value).reduce((a, b) => a + b, 0);
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

export default HealthChart;
