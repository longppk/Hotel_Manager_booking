import { Link } from "react-router-dom";
import Title from "../../components/Title";
import {RoomHotel } from "../../types/types"; // import Product from types.ts
import config from "../../config";
import { useEffect, useState } from "react";
import { getBestSeller } from "../../api/homeApi";
import { useTranslation } from "react-i18next";
import ProductItem from "../../components/ProductItem";
import { Emitter } from "../../eventEmitter/EventEmitter";

const TopSelling: React.FC = () => {
  const [allProducts, setAllProducts] = useState<RoomHotel[]>([]);
console.log(allProducts);

const fetchData = async () => {
  const data: RoomHotel[] = await getBestSeller();
  
  setAllProducts(data);
};

  const { t } = useTranslation();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Đăng ký sự kiện
    Emitter.on("updateRoomStatus", fetchData);

    // Cleanup khi unmount
    return () => {
      Emitter.off("updateCartNumber", fetchData);
    };
  }, []);

  return (
    <div className="wrapper">
      <Title className="text-center text-[32px] lg:text-[40px] mb-[64px] uppercase">
        best booking room
      </Title>

      <ul className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {allProducts?.map((prod, index) => (
          <ProductItem product={prod} key={index} onSuccessfulAddToCart={fetchData}/>
        ))}
      </ul>
      <div className="text-center my-[36px]">
        <Link
          to={config.routes.product}
          className="px-[54px] py-4 border rounded-[62px] w-full lg:w-auto  transition-all duration-300 hover:border-blue-400 "
        >
          {t("button.read-more")}
        </Link>
      </div>
    </div>
  );
};

export default TopSelling;
