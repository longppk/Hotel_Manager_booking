import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import { Booking } from "../types/types";
import { baseAxios } from "../api/axios";

interface BookingTableProps {
  year: number;
  month: number;
}

const BookingTable: React.FC<BookingTableProps> = ({ year, month }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    baseAxios
      .get<Booking[]>(`admin/statistic/booking/${year}/${month}`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Failed to fetch data",
        });
      });
  }, [year, month]);

  const columns = [
    { title: "Room", dataIndex: "room", key: "room" },
    { title: "Guest", dataIndex: "guest", key: "guest" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return <Table dataSource={bookings} columns={columns} rowKey="id" />;
};

export default BookingTable;
