import React from 'react';
import { Card, Statistic } from 'antd';

interface StatisticCardProps {
  title: string;
  value: number | string;
  color?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, color }) => {
  return (
    <Card style={{ border: `2px solid ${color || '#1890ff'}`, margin: '10px' }}>
      <Statistic title={title} value={value} valueStyle={{ color: color || '#1890ff' }} />
    </Card>
  );
};

export default StatisticCard;
