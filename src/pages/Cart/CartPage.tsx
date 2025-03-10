import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { baseAxios, callApi, deleteCart, getCartByUser, payCart } from "../../api/axios";
import { Emitter as emitter } from "../../eventEmitter/EventEmitter";
import { RootState } from "../../redux/store";
import {
  CartDetail as CD,
  GetCartReponseDto,
  GetUserInfoDto,
} from "../../types/types";


import routes from "../../config/routes";

import BookingModal from "../../components/BookingModal";
import { Table, Checkbox, notification, Button, Image, Spin } from "antd";
import { calculateDays, convertLocalDateToString } from "../../utils/helper";
import Loading from "../../components/Loading/Loading";
// Các import khác vẫn giữ nguyên

function CartPage() {
  const [products, setProducts] = useState<GetCartReponseDto>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      user
        ? setProducts(await callApi(() => getCartByUser(Number(user.id))))
        : setProducts(undefined);
    };
    fetch();
    window.scrollTo(0, 0);
  }, [user]);

  // Cập nhật danh sách hàng được chọn và tính tổng giá
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: CD[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
    const total = selectedRows.reduce((sum, row) => sum + row.room.price * calculateDays(row), 0);
    setTotalPrice(total);
  };

  // Cột cho bảng
  const columns = [
    {
      title: "",
      dataIndex: "room",
      render: (_: any, record: CD) => (
        <Image src={record.room.roomImages[0]?.url} alt={record.room.name} width={150} />
      ),
    },
    {
      title: "Check-in / Check-out",
      dataIndex: "checkInOut",
      render: (_: any, record: CD) =>
        `${convertLocalDateToString(
          record.checkIn
        )} - ${convertLocalDateToString(record.checkOut)}`,
    },
    {
      title: "Total days",
      dataIndex: "totalDays",
      render: (_: any, record: CD) => calculateDays(record),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_: any, record: CD) =>
        `${(record.room.price * calculateDays(record)).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      title: "Action",
      render: (_: any, record: CD) => (
        <Button
        color="danger" variant="outlined"
          onClick={async () => {
            try {
              await callApi(() => deleteCart([record.id]));
              emitter.emit("deletedCard");
              emitter.emit("updateCartNumber");
              setProducts(await callApi(() => getCartByUser(Number(user?.id))));
              setTotalPrice((prev) => prev - record.room.price * calculateDays(record));
            } catch (error: any) {
              notification.error({
                message: "Error",
                description: error.message,
              });
            }
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleBuyProduct = async (data: any) => {
    if (products?.cartDetail.length === 0) return;
    const total = selectedRowKeys.reduce((sum, key) => {
      const product = products?.cartDetail.find((item) => item.id === key);
      return sum + (product?.room.price || 0) * calculateDays(product!);
    }, 0);

    baseAxios.post(`vnpay?amount=${data.totalAmenityPrice + total}`, {
      cartDetailEntities: selectedRowKeys,
      paymentMethod: "VN_PAY",
      userId: user?.id!,
      amenityEntities: data.amenities,
    }).then(async (res) => {
      setIsLoading(true);
      window.location.href = res.data.data.paymentUrl;
      
      emitter.emit("updateCartNumber");
    }).catch((err) => {
      notification.error({
        message: 'Error',
        description: 'Failed to pay',
      });
      setIsLoading(false);
    });
  };

  return (
    <div className="pb-[160px] bg-[#f5f5f5]">
      {isLoading && <Loading />}
      <BookingModal
        onSubmit={(data) => {
          handleBuyProduct(data);
        }}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <div className="wrapper px-5 ">
        <Table
          rowKey={(record) => record.id}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          columns={columns}
          dataSource={products?.cartDetail || []}
          pagination={false}
        />
        <div className="flex justify-between items-center px-8 py-4 mb-4 bg-white">
          <div className="text-center">
          Total Payment: 
            <span className="text-[#EE4D2D]">{totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}</span>
          </div>
          <Button
            onClick={() => {
              if (selectedRowKeys.length === 0) {
                notification.error({
                  message: "Error",
                  description: "Please select a product to book",
                });
                return;
              }
              setIsModalVisible(true);
            }}
            className={`${
              selectedRowKeys.length !== 0
                ? ""
                : "select-none cursor-not-allowed"
            }`}
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
