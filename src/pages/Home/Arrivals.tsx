import { Link } from "react-router-dom";
import Title from "../../components/Title";
import { PaginatedResponse, Product, RoomHotel } from "../../types/types";
import config from "../../config";
import { callApi, getRoomByQuery } from "../../api/axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductItem from "../../components/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination} from "swiper/modules";
import { Emitter } from "../../eventEmitter/EventEmitter";

const Arrivals: React.FC = () => {
  const [allProducts, setAllProducts] = useState<RoomHotel[]>([]);

  const { t } = useTranslation();

  const fetchData = async () => {
    const data: PaginatedResponse<RoomHotel> = await getRoomByQuery({
      size: 5,
      sort: ["createdAt,desc"],
    });
    setAllProducts(data.data);
  };

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
      <div className="py-[64px]">
        <Title className="text-center text-[32px] lg:text-[40px] mb-[64px] uppercase">
          New room
        </Title>
        <Swiper
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="py-3"
          >
            {allProducts?.map((prod) => (
              <SwiperSlide key={prod?.id} >
                <ProductItem product={prod} key={prod?.id} onSuccessfulAddToCart={fetchData}/>
              </SwiperSlide>
            ))}
          </Swiper>
        <div className="text-center mt-[36px] pb-[64px] border-b">
          <Link
            to={config.routes.product}
            className="px-[54px] py-4 border rounded-[62px] w-full lg:w-auto  transition-all duration-300 hover:border-blue-400 "
          >
            {t("button.read-more")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Arrivals;
