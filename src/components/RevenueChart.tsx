import React from 'react';
import { Line } from '@ant-design/plots';
import { Month } from '../types/types';

interface RevenueChartProps {
  month: Month;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ month }) => {
  // Đảm bảo tất cả các tháng đều có mặt trong `data`
  const data: Record<Month, { day: string; revenue: number }[]> = {
    January: [
      { day: '1', revenue: 300 },
      { day: '10', revenue: 400 },
      { day: '20', revenue: 300 },
      { day: '30', revenue: 600 },
    ],
    February: [
      { day: '1', revenue: 500 },
      { day: '10', revenue: 700 },
      { day: '20', revenue: 200 },
      { day: '28', revenue: 900 },
    ],
    March: [], // Thêm tháng với dữ liệu trống
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: [],
  };

  const config = {
    data: data[month], // TypeScript giờ có thể đảm bảo `month` luôn hợp lệ
    xField: 'day',
    yField: 'revenue',
    color: '#52c41a',
    smooth: true,
    point: {
      size: 5,
      shape: 'circle',
    },
  };

  return <Line {...config} />;
};

export default RevenueChart;
