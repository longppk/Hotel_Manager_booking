import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';
import { baseAxios } from '../../api/axios';
import { Amenity } from '../../types/types';

const AmenityContent: React.FC = () => {
  const [data, setData] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingColor, setEditingColor] = useState<Amenity | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Amenity[]>([]);
  const [newAmenity, setnewAmenity] = useState<Amenity>({
    id: 0,
    name: '',
    icon: '',
    price: 0,
  });

  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<Amenity[]>('admin/amenities');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error : any) {
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm tìm kiếm trong bảng
  const handleSearch = () => {
    const result = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  // Hàm hiển thị modal thêm màu sắc mới
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddAmenity = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu POST để thêm màu sắc mới
      const response = await baseAxios.post<Amenity>('admin/amenities', newAmenity);
      if (response.data) {
        notification.success({
          message: 'Success',
          description: 'Amenity has been added successfully',
        });
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
      }
    } catch (error:any) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
      setAddModalVisible(false);
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  // Cấu hình bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Amenity) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)} style={{ marginRight: 10 }}>
            Chỉnh sửa
          </Button>
          <Button type="default" danger onClick={() => showDeleteModal(record)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const showDeleteModal = (amenity: Amenity) => {
    Modal.confirm({
      title: 'Confirm',
      content: `Do you want to delete ${amenity.name}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa kích cỡ
          const response = await baseAxios.delete(`admin/amenities/${amenity.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Success',
              description: 'Amenity has been deleted successfully',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== amenity.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete amenity',
          });
        }
      },
    });
  };

  const showEditModal = (color: Amenity) => {
    setEditingColor(color);
    setModalVisible(true);
    form.setFieldsValue({
      ...color,
    });
  };

  const handleOk = async () => {
    if (editingColor) {
      setLoading(true);
      try {
        const response = await baseAxios.put<Amenity>(`admin/amenities`, editingColor);
        if (response.data) {
          notification.success({
            message: 'Success',
            description: 'Amenity has been updated successfully',
          });
          fetchData();
        }
      } catch (error : any) {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2 className='mb-4'>Danh sách Dịch vụ</h2>
      <Input
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button onClick={handleSearch} type="primary" className='mx-4'>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset} type="default">
        Làm mới
      </Button>
      <Button onClick={showAddModal} type="primary" style={{ marginLeft: 10 }}>
        Thêm dịch vụ
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Amenity"
        open ={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input value={editingColor?.name} onChange={(e) => setEditingColor({ ...editingColor!, name: e.target.value })}/>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input value={editingColor?.price} onChange={(e) => setEditingColor({ ...editingColor!, price: Number( e.target.value) })}/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Amenity"
        open ={addModalVisible}
        onOk={handleAddAmenity}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddAmenity}
          form={formAdd}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input
              value={newAmenity.name}
              onChange={(e) => setnewAmenity({ ...newAmenity!, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input
              value={newAmenity.price}
              onChange={(e) => setnewAmenity({ ...newAmenity!, price: Number(e.target.value) })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AmenityContent;
