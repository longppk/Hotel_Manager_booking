import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  notification,
  Tag,
  Select,
} from "antd";
import {
  LoaiSP,
  RoomAvailableStatus,
  RoomDetail,
  RoomType,
} from "../../../types/types";
import { baseAxios } from "../../../api/axios";
import { uploadToCloudinary } from "../../../utils/helper";
import Upload, { RcFile } from "antd/es/upload";

const RoomContent: React.FC = () => {
  const [data, setData] = useState<RoomDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<RoomDetail | null>(null);
  const [newProduct, setNewProduct] = useState<RoomDetail>();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<RoomDetail[]>([]);

  const [loaiPhong, setLoaiPhong] = useState<RoomType[]>([]);

  const [isShowAddDetailModal, setIsShowAddDetailModal] =
    useState<boolean>(false);

  const [isShowUpdateDetailModal, setIsShowUpdateDetailModal] =
    useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get(`admin/rooms`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error: any) {
      notification.error({
        message: "Lỗi tải phòng",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChatLieu = async () => {
    setLoading(true);
    try {
      const response = await baseAxios.get<RoomType[]>("admin/room-types");
      setLoaiPhong(response.data);
    } catch (error: any) {
      notification.error({
        message: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchChatLieu();
  }, []);

  const handleSearch = () => {
    const result = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredData(data);
  };

  const showEditModal = (product: RoomDetail) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  // const handleLoaiSPChaChange = (value: string) => {
  //   if (editingProduct) {
  //     setEditingProduct({ ...editingProduct, loaiSPCha: value });
  //   }
  //   fetchLoaiSpCon(value);
  // };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      if (editingProduct) {
        await baseAxios.put(`admin/rooms/${editingProduct.id}`, {
          name: editingProduct.name,
          description: editingProduct.description,
          roomType: editingProduct.roomType,
          price: editingProduct.price,
          capacity: editingProduct.capacity,
        });
        notification.success({
          message: "Cập nhật sản phẩm thành công",
        });
        fetchProducts();
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi cập nhật sản phẩm",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  const handleAddProduct = () => {
    baseAxios
      .post("/admin/rooms/register", newProduct)
      .then((response) => {
        notification.success({
          message: "Thêm phòng thành công",
        });
        setData([...data, response.data]);
        setFilteredData([...data, response.data]);
        setAddModalVisible(false);
      })
      .catch((error) => {
        notification.error({
          message: "Lỗi thêm phòng",
          description: error.message,
        });
      });

    setIsShowAddDetailModal(true);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      render: (giaGoc: number) => `${giaGoc.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "roomAvailableStatus",
      key: "roomAvailableStatus",
      render: (roomAvailableStatus: RoomAvailableStatus) =>
        roomAvailableStatus === RoomAvailableStatus.OCCUPIED ? (
          <Tag color="red">Đang có khách</Tag>
        ) : (
          <Tag color="green">Đang hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: RoomDetail) => (
        <>
          <Button
            onClick={() => showEditModal(record)}
            type="primary"
            style={{ marginRight: 10 }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)} className="mr-2">
            Xóa
          </Button>
          <Upload
            // listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => handleFileUpload(file, record)}
          >
              <Button icon={<UploadOutlined />} loading={loading}>
                Upload Image
              </Button>
          </Upload>
        </>
      ),
    },
  ];

  const handleFileUpload = async (file: RcFile, roomDetail?: RoomDetail) => {
    setLoading(true);
    const url = await uploadToCloudinary(file, "dnp8wwi3r", "images");
    baseAxios.post(`admin/images/rooms/${roomDetail?.id}`, {url}).then(() => {
      notification.success({
        message: "Upload ảnh thành công",
      });
    }).catch((error) => {
      notification.error({
        message: "Lỗi upload ảnh",
        description: error.message,
      });
    })
    setLoading(false);
  };


  const handleDelete = async (record: RoomDetail) => {
    try {
      await baseAxios.delete(`admin/rooms/${record.id}`);
      notification.success({
        message: "Xóa phòng thành công",
      });
      fetchProducts();
    } catch (error: any) {
      notification.error({
        message: "Lỗi xóa phòng",
        description: error.message,
      });
    } finally {
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  return (
    <div>
      {/* <ChiTietSanPhamModelUpdate
        visible={isShowUpdateDetailModal}
        onClose={() => setIsShowUpdateDetailModal(false)}
        data={editingProduct?.id || ""}
        onSave={() => {}}
      /> */}
      <h2 className="mb-4">Danh sách phòng</h2>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button onClick={handleSearch} type="primary" className="mx-4">
        Tìm kiếm
      </Button>
      <Button onClick={handleReset} type="default" style={{ marginRight: 10 }}>
        Làm mới
      </Button>
      <Button onClick={() => setAddModalVisible(true)} type="primary">
        Thêm phòng
      </Button>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm"
        open={addModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddProduct}
      >
        <Form layout="vertical">
          <Form.Item label="Tên phòng" required>
            <Input
              value={newProduct?.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                } as RoomDetail)
              }
            />
          </Form.Item>
          <Form.Item label="Mô tả" required>
            <Input
              value={newProduct?.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                } as RoomDetail)
              }
            />
          </Form.Item>
          <Form.Item label="Loại phòng" required>
            <Select
              value={newProduct?.roomType}
              onChange={(value) =>
                setNewProduct({ ...newProduct, roomType: value } as RoomDetail)
              }
              virtual={false}
            >
              {loaiPhong.map((cl) => (
                <Select.Option key={cl.id} value={cl.id}>
                  {cl.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Sức chứa" required>
            <Input
              value={newProduct?.capacity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  capacity: Number.parseInt(e.target.value),
                } as RoomDetail)
              }
            />
          </Form.Item>

          <Form.Item label="Giá cho thuê" required>
            <Input
              value={newProduct?.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: Number.parseInt(e.target.value),
                } as RoomDetail)
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm chi tiết sản phẩm */}
      {/* <ChiTietSanPhamModel
        visible={isShowAddDetailModal}
        onClose={() => setIsShowAddDetailModal(false)}
        data={sanPhamChiTiet}
      /> */}

      {/* Modal sửa sản phẩm */}
      <Modal
        title="Cập nhật sản phẩm"
        open={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleSaveProduct}
      >
        {editingProduct && (
          <Form layout="vertical">
            <Form.Item label="Tên phòng" required>
              <Input
                value={editingProduct?.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  } as RoomDetail)
                }
              />
            </Form.Item>
            <Form.Item label="Mô tả" required>
              <Input
                value={editingProduct?.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  } as RoomDetail)
                }
              />
            </Form.Item>
            <Form.Item label="Loại phòng" required>
              <Select
                value={editingProduct?.roomType}
                onChange={(value) =>
                  setEditingProduct({
                    ...editingProduct,
                    roomType: value,
                  } as RoomDetail)
                }
                virtual={false}
              >
                {loaiPhong.map((cl) => (
                  <Select.Option key={cl.id} value={cl.id}>
                    {cl.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Sức chứa" required>
              <Input
                value={editingProduct?.capacity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    capacity: Number.parseInt(e.target.value),
                  } as RoomDetail)
                }
              />
            </Form.Item>

            <Form.Item label="Giá cho thuê" required>
              <Input
                value={editingProduct?.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number.parseInt(e.target.value),
                  } as RoomDetail)
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default RoomContent;
