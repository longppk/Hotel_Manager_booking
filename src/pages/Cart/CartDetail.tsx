import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { callApi, deleteCart } from "../../api/axios";
import { Emitter as emitter } from "../../eventEmitter/EventEmitter";
import { CartDetail as CD } from "../../types/types";
import { useTranslation } from "react-i18next";

import routes from "../../config/routes";
import { notification } from "antd";
import {calculateDays, convertLocalDateToString } from "../../utils/helper";

interface CartDetailProps {
  getCardReponseDto: CD;
  isChecked?: boolean;
}

const CartDetail = (props: CartDetailProps) => {
  const [quantity, setQuantity] = useState<number>(
    props.getCardReponseDto.quantity
  );
  const [checked, setChecked] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const prevCheckedRef = useRef(checked);
  const prevQuantityRef = useRef(quantity);
  const checkElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEvent = (isCheckAll: boolean) => {
      setChecked(isCheckAll);
    };

    emitter.on("checkAll", handleEvent);

    return () => {
      emitter.off("checkAll", handleEvent);
    };
  }, []);

  useEffect(() => {
    const prevChecked = prevCheckedRef.current;
    const prevQuantity = prevQuantityRef.current;

    if (checked !== prevChecked) {
      // Checked state changed
      const event = checked ? "elementChecked" : "elementUnchecked";
      emitter.emit(event, {
        ...props.getCardReponseDto,
      });
    } else if (quantity !== prevQuantity) {
      if (checked) {
        emitter.emit("elementChecked", {
          ...props.getCardReponseDto,
        });
      }
    }

    prevCheckedRef.current = checked;
    prevQuantityRef.current = quantity;
  }, [checked, quantity]);

  const toggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };


  const handleDelete = () => {
    const deleteProduct = async () => {
      try {
        await callApi(() => deleteCart([props.getCardReponseDto.id]));
        emitter.emit("deletedCard");
        emitter.emit("updateCartNumber");
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    };
    deleteProduct();
  };

  const handleClickImg = () => {
    navigate(`${routes.product}/${props.getCardReponseDto.room.id}`);
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white gap-6 border-y">
      <div className="flex-1 flex">
        <input
          type="checkbox"
          className="mr-4"
          ref={checkElement}
          onChange={toggleCheck}
          checked={checked}
        />
        <div className="flex gap-4">
          <img
            src={
              props.getCardReponseDto.room.roomImages[0]?.url ||
              "https://grandtouranehotel.com/uploads/gal/slide_228.jpg"
            }
            alt=""
            className="w-20 h-20 object-cover"
            onClick={handleClickImg}
          />
          <div className="flex flex-col justify-around">
            <p className="break-all max-h-8 text-ellipsis text-sm leading-4 overflow-hidden line-clamp-2">
              {props.getCardReponseDto.room.name}
            </p>
            {/* <p className="text-sm font-semibold">{t("text.remainQuantity")}: <span className="text-[#003b31]">{props.getCardReponseDto.quantity}</span></p> */}
            <p className="border border-[#EE4D2D] px-1 w-36 text-center text-[#EE4D2D] text-sm">
              {t("text.lie")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-between items-center text-[#888888]">
        <div className="flex gap-4">
          <div className="">{convertLocalDateToString(props.getCardReponseDto.checkIn)}</div>
          <div className="">{convertLocalDateToString(props.getCardReponseDto.checkOut)}</div>
        </div>
        <div className="ml-4">{calculateDays(props.getCardReponseDto)} day</div>
        <div className="flex-1 text-center">
          {(props.getCardReponseDto.room.price * calculateDays(props.getCardReponseDto)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </div>
        <button className="" onClick={handleDelete}>
          <MdDelete size={30} color="red" className="ml-auto" />
        </button>
      </div>
    </div>
  );
};

export default CartDetail;
