import React, { useState, useEffect } from "react";
import { notification, Table } from "antd";
import { Bill } from "../../types/types";
import { baseAxios } from "../../api/axios";
import { render } from "@testing-library/react";
import { convertLocalDateTimeToString, convertToDateString } from "../../utils/helper";

const BillContent: React.FC = () => {
  const [hoaDons, setHoaDons] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get(
        `admin/bills`
      );
      const data = response.data;
      setHoaDons(data);
    } catch (error: any) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Bill code",
      dataIndex: "billCode",
      key: "billCode",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: [number, number, number, number, number, number, number]) => convertLocalDateTimeToString(text),
    },
    {
      title: "Customer Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text: number) => text.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={hoaDons}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BillContent;
