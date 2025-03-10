import { Link, useLocation } from "react-router-dom";
import { RoomHotel } from "../types/types";
import routes from "../config/routes";
import { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Emitter } from "../eventEmitter/EventEmitter";
import { addToCart } from "../api/axios";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { notification } from "antd";

interface ProductItemProps {
  product?: RoomHotel;
  onSuccessfulAddToCart?: () => void;
  checkInProps?: Date;
  checkOutProps?: Date;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onSuccessfulAddToCart, checkInProps, checkOutProps}) => {
  const [loaded, setLoaded] = useState(false);
  const [isCallApi, setIsCallApi] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date();

  const checkInFinal = checkInProps ? checkInProps : checkInDate;
  const checkOutFinal = checkOutProps ? checkOutProps : checkOutDate;

  function handleAddToCart() {
    if (isCallApi) return;
    const addCart = async () => {
      try {
        setIsCallApi(() => true);
        await addToCart({
          roomId: Number(product?.id),
          userId: Number(currentUser?.id),
          quantity: 1,
          checkIn: checkInFinal,
          checkOut: checkOutFinal,
        });
        Emitter.emit("updateCartNumber");
        notification.success({
          message: "Success",
          description: "Add to cart successfully!",
        });
        onSuccessfulAddToCart && onSuccessfulAddToCart();
        Emitter.emit("updateRoomStatus");
        setIsCallApi(() => false);
      } catch (error: any) {
        if (error.response.status === 403) {
          notification.error({
            message: "Error",
            description: "Something went wrong!",
          });
        }
        setIsCallApi(() => false);
      }
    };
    addCart();
  }

  return (
    <div className="cursor-pointer overflow-hidden shadow p-4 rounded-[20px]">
      <Link
        to={`${routes.product}/${product?.id}?checkIn=${checkInFinal?.toISOString().split("T")[0]}&checkOut=${checkOutFinal?.toISOString().split("T")[0]}`}
        className="overflow-hidden rounded-[20px]"
      >
        <img
          src={
            product?.roomImages[0]?.url ||
            "https://grandtouranehotel.com/uploads/gal/slide_228.jpg"
          }
          loading="lazy"
          alt=""
          onLoad={() => setLoaded(true)}
          className={`rounded-[20px] w-full h-[287px] object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className=" capitalize line-clamp-1">{product?.name}</h3>
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2 capitalize">
           {product?.roomType.name || 'Super room'}
          </div>
          <div
            className="bg-white rounded-full p-2 hover:bg-slate-200 transition-all duration-300"
            onClick={handleAddToCart}
          >
            {isCallApi ? (
              <AiOutlineLoading size={25} className="animate-spin" />
            ) : (
              <CiShoppingCart size={25} />
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className=" font-semibold">{product?.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} /Night</span>
          <span className={` font-semibold capitalize ${product?.roomAvailableStatus.toString().toLowerCase() === "selected" ? "text-red-600" : ""} `}>
           {product?.roomAvailableStatus.toString().toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
