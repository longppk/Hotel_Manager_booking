import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import { useSelector } from "react-redux";
import { Amenity, GetUserInfoDto } from "../types/types";
import { RootState } from "../redux/store";
import { baseAxios } from "../api/axios";

const { Option } = Select;

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Hàm xử lý dữ liệu submit từ form
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const [amenities, setAmenities] = useState<Amenity[]>([]);

  const fetchAmennities = async () => {
    await baseAxios.get("amentity").then((res) => {
      setAmenities(res.data);
    }).catch((err) => {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch amenities',
      });
    })
  }

  useEffect(() => {
    fetchAmennities();
  }, []);

  const user: GetUserInfoDto | null = useSelector((state: RootState) => state.auth.currentUser);

  const handleSubmit = (values: any) => {
    const selectedAmenityIds = values.amenities || [];
    const totalAmenityPrice = selectedAmenityIds.reduce((total: number, id: number) => {
      const amenity = amenities.find((item) => item.id === id);
      return total + (amenity?.price || 0);
    }, 0);
    const dataToSubmit = {
      ...values,
      totalAmenityPrice,
    };
    onSubmit(dataToSubmit);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Booking Information"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          paymentMethod: "COD",
          fullName: user?.name,
          email: user?.email,
          phoneNumber: user?.phone,
        }}
      >
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter your phone number!" },
            { pattern: /^[0-9]+$/, message: "Phone number must be numeric!" },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        {/* Payment Method */}
        {/* <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: "Please select a payment method!" }]}
        >
          <Select>
            <Option value="COD">COD</Option>
            <Option value="VN_PAY">VN PAY</Option>
          </Select>
        </Form.Item> */}

        {/* Amenities */}
        <Form.Item
          label="Select Amenities"
          name="amenities"
        >
          <Select
            mode="multiple"
            placeholder="Choose additional amenities"
            allowClear
          >
            {amenities.map((amenity) => (
              <Option key={amenity.id} value={amenity.id}>
                {amenity.icon} {amenity.name} ({amenity.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Confirm Booking
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingModal;
