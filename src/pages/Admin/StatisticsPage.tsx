import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Select, notification } from "antd";
import { Month, StatisticData } from "../../types/types";
import StatisticCard from "../../components/StatisticCard";
import RevenueChart from "../../components/RevenueChart";
import BookingTable from "../../components/BookingTable";
import { baseAxios } from "../../api/axios";

const { Title } = Typography;
const { Option } = Select;

const StatisticsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Month>("December");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [data, setData] = useState<StatisticData>();

  const monthMapping: Record<Month, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const fetchData = async () => {
    await baseAxios
      .get(`admin/statistics/${selectedYear}/${monthMapping[selectedMonth]}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Failed to fetch data",
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleMonthChange = (month: Month) => {
    setSelectedMonth(month);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Hotel Statistics</Title>

      {/* Bộ lọc theo tháng */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value as number)}
            style={{ width: "100%" }}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Option key={index} value={new Date().getFullYear() - index}>
                {new Date().getFullYear() - index}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Select
            value={selectedMonth}
            onChange={(value) => handleMonthChange(value as Month)}
            style={{ width: "100%" }}
            virtual={false}
          >
            {Object.keys(monthMapping).map((month) => (
                <Option key={month} value={month}>
                  {month}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>

      {/* Thẻ thống kê */}
      <Row gutter={16}>
        <Col span={8}>
          <StatisticCard
            title="Number of room rentals"
            value={data?.roomsAvailable ?? 0}
            color="#1890ff"
          />
        </Col>
        <Col span={8}>
          <StatisticCard
            title="Guests Currently Staying"
            value={data?.guestsStaying ?? 0}
            color="#faad14"
          />
        </Col>
        <Col span={8}>
          <StatisticCard
            title="Total Revenue"
            value={`${data?.revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      {/* <Row style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Title level={4}>Revenue Overview</Title>
          <RevenueChart month={selectedMonth} />
        </Col>
      </Row> */}

      {/* Bảng đặt phòng */}
      <Row style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Title level={4}>Booking Details</Title>
          <BookingTable year={selectedYear} month={monthMapping[selectedMonth]} />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
