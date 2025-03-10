import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Tag, Select } from 'antd';
import axios from 'axios';
import { baseAxios } from '../../api/axios';
import { RoomType } from '../../types/types';


const RoomTypeContent: React.FC = () => {
  const [data, setData] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<RoomType[]>([]);
  const [newRoomType, setNewRoomType] = useState<RoomType>({ id: '', name: ''});

  const [form] = Form.useForm();


  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<RoomType[]>('admin/room-types');
      setData(response.data);
      setFilteredData(response.data); // Lưu dữ liệu vào state
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
      (item) => item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  // Hàm hiển thị modal thêm kích cỡ mới
  const showAddModal = () => {
    setAddModalVisible(true);
  };

  const handleAddRoomType = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu POST để thêm kích cỡ mới
      const response = await baseAxios.post<RoomType>('admin/room-types/register', newRoomType);
      if (response.status === 200) {
        notification.success({
          message: 'Thêm kích cỡ thành công',
          description: 'Kích cỡ mới đã được thêm vào.',
        });
        // Thêm kích cỡ vào danh sách hiện tại
        setData([response.data, ...data]);
        setFilteredData([response.data, ...filteredData]);
        fetchData();
      }
    } catch (error: any) {
      notification.error({
        message: 'Lỗi thêm kích cỡ',
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
      title: 'Tên Loại phòng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: RoomType) => (
        <>
        <Button onClick={() => showEditModal(record)} type="primary" className='mr-2'>
          Sửa
        </Button>
        <Button onClick={() => showDeleteModal(record)} danger>
        Xóa
      </Button></>
      ),
    },
  ];

  const showDeleteModal = (roomType: RoomType) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa loại phòng ${roomType.name}?`,
      async onOk() {
        try {
          // Gửi yêu cầu DELETE để xóa loại phòng
          const response = await baseAxios.delete(`admin/room-types/${roomType.id}`);
          if (response.status === 200) {
            notification.success({
              message: 'Xóa loại phòng thành công',
              description: 'Loại phòng đã được xóa khỏi danh sách.',
            });
            // Cập nhật danh sách sau khi xóa
            const newData = data.filter((item) => item.id !== roomType.id);
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Loại phòng đang được sử dụng',
            description: error.message,
          });
        }
      },
    });
  };

  const showEditModal = (size: RoomType) => {
    setEditingRoomType(size);
    setModalVisible(true);
    form.setFieldsValue({
      ...size
    });
  };

  const handleOk = () => {
    if (!editingRoomType) return;
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          // Gửi yêu cầu PUT để cập nhật thông tin loại phòng
          const response = await baseAxios.put<RoomType>(
            `/admin/room-types/${editingRoomType.id}`,
            values
          );
          if (response.data) {
            notification.success({
              message: 'Cập nhật loại phòng thành công',
              description: 'Thông tin loại phòng đã được cập nhật.',
            });
            // Cập nhật thông tin loại phòng trong danh sách
            const index = data.findIndex((item) => item.id === editingRoomType.id);
            const newData = [...data];
            newData[index] = response.data;
            setData(newData);
            setFilteredData(newData);
          }
        } catch (error: any) {
          notification.error({
            message: 'Lỗi cập nhật loại phòng',
            description: error.message,
          });
        } finally {
          setLoading(false);
          setModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h2 className='mb-4'>Quản lý loại phòng</h2>
      <Input
        placeholder="Tìm kiếm theo tên"
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
        Thêm loại phòng
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa Phòng"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
        >
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm kích cỡ mới */}
      <Modal
        title="Thêm loại phòng"
        visible={addModalVisible}
        onOk={handleAddRoomType}
        onCancel={handleAddCancel}
      >
        <Form
          onFinish={handleAddRoomType}
          initialValues={{
            ten: newRoomType.name,
          }}
        >
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input
              value={newRoomType.name}
              onChange={(e) => setNewRoomType({ ...newRoomType!, name: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomTypeContent;
