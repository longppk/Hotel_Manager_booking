import { useEffect, useState } from "react";
import {
  FaBath,
  FaBed,
  FaBeer,
  FaClock,
  FaCoffee,
  FaFacebook,
  FaInfoCircle,
  FaLock,
  FaMugHot,
  FaPhone,
  FaPhoneAlt,
  FaSlidersH,
  FaSnowflake,
  FaTable,
  FaTshirt,
  FaTv,
  FaTwitter,
  FaWifi,
  FaWind,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {useLocation, useParams } from "react-router-dom";
import {
  addToCart,
  getProduct,
} from "../../api/axios";
import ProductItem from "../../components/ProductItem";
import { RootState } from "../../redux/store";
import {
  Product,
  RoomHotel,
} from "../../types/types";
import { Emitter } from "../../eventEmitter/EventEmitter";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoMail } from "react-icons/io5";
import { FaShower } from "react-icons/fa6";
import { notification } from "antd";
import TopSelling from "../Home/TopSelling";

interface Props {}

function ProductDetail(_props: Props) {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  // page use for review
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [data, setData] = useState<RoomHotel>();
  // const [topSelling, setTopSelling] = useState<Product[]>([]);

  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date();

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0);
      const product = await getProduct(Number(id));
      // const topSellingProduct = await getBestSeller();
      setData(product);
      // setTopSelling(topSellingProduct);
    };

    fetchProduct();
  }, [id]);

  const addCart = async () => {
    try {
      console.log(checkIn);
      await addToCart({
        roomId: Number(id),
        userId: Number(user?.id),
        quantity: 1,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      Emitter.emit("updateCartNumber");
      notification.success({
        message: "Success",
        description: "Add to cart successfully!",
      });
    } catch (error: any) {
      if (error.response.status === 403) {
        notification.error({
          message: "Error",
          description: "Something went wrong!",
        });
      }
    }
  };

  function handleAddToCart() {
    addCart();
  }

  return (
    <div className="mb-[124px] mt-8 px-4">
      {data && (
        <div className="wrapper">
          <div className="flex gap-4 items-center">
            <span className="flex-1 h-1 border-t-2 border-primary"></span>
            <h1 className="uppercase text-primary">Superior City View</h1>
            <span className="flex-1 h-1 border-t-2 border-primary"></span>
          </div>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper mt-4"
          >
            {data.roomImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image.url}
                  alt=""
                  className="w-full object-cover h-[250px] md:h-[500px]"
                />
              </SwiperSlide>
            ))}

          </Swiper>
          <div className="my-4 flex justify-center">
            <div className="flex items-center">
              <span className="capitalize">share</span>
              <ul className="flex *:flex  *:cursor-pointer *:gap-4 *:px-4 *:border-r-2">
                <li>
                  <FaFacebook className="text-blue-700" size={20} />
                  <FaTwitter className="text-blue-400" size={20} />
                </li>
                <li>
                  <IoMail className="text-slate-500" size={20} />
                </li>
                <li>
                  <FaPhone className="text-slate-500" size={18} />
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-primary p-2 rounded-lg transition-all duration-300 hover:bg-primaryHover text-white px-4" onClick={handleAddToCart}>
              Book now
            </button>
          </div>
          {/* description */}
          <div className="mt-6">
            <p>
              <strong className="underline text-primary uppercase">
                DESCRIPTION:{" "}
              </strong>{" "}
              {/* Wake up to views of Danang’s stunning skyline from a Superior City
              View room.
              <ul className="list-disc pl-5 grid md:grid-cols-2  text-gray-700 space-y-1">
                <li>Room size: 32m²</li>
                <li>Queen size bed or twin beds</li>
                <li>City view</li>
                <li>Interconnecting room available upon request</li>
              </ul> */}
              {data.description}
            </p>
          </div>

          {/* facilities */}
          <div className="mt-4">
            <p>
              <strong className="underline text-primary uppercase">
                FACILITIES:{" "}
              </strong>{" "}
              <ul className="text-gray-700 grid md:grid-cols-3 gap-2 space-y-1 mt-2">
                <li className="flex gap-2 items-center">
                  <FaShower color="#c0a753" /> Rain Shower
                </li>
                <li className="flex gap-2 items-center">
                  <FaBath color="#c0a753" /> Bathroom Amenities
                </li>
                <li className="flex gap-2 items-center">
                  <FaTable color="#c0a753" /> Work Table
                </li>
                <li className="flex gap-2 items-center">
                  <FaBeer color="#c0a753" /> Minibar
                </li>
                <li className="flex gap-2 items-center">
                  <FaCoffee color="#c0a753" /> Kettle
                </li>
                <li className="flex gap-2 items-center">
                  <FaMugHot color="#c0a753" /> Coffee & Tea Facilities
                </li>
                <li className="flex gap-2 items-center">
                  <FaLock color="#c0a753" /> In-Room Safe
                </li>
                <li className="flex gap-2 items-center">
                  <FaWind color="#c0a753" /> Hairdryer
                </li>
                <li className="flex gap-2 items-center">
                  <FaSnowflake color="#c0a753" /> Air-Conditioning
                </li>
                <li className="flex gap-2 items-center">
                  <FaPhoneAlt color="#c0a753" /> IDD/NDD Telephone
                </li>
                <li className="flex gap-2 items-center">
                  <FaTv color="#c0a753" /> Satellite TV
                </li>
                <li className="flex gap-2 items-center">
                  <FaWifi color="#c0a753" /> Free Wifi
                </li>
                <li className="flex gap-2 items-center">
                  <FaTshirt color="#c0a753" /> Bathrobes
                </li>
                <li className="flex gap-2 items-center">
                  <FaBed color="#c0a753" /> Bedroom
                </li>
                <li className="flex gap-2 items-center">
                  <FaSlidersH color="#c0a753" /> Rubber Slippers
                </li>
                <li className="flex gap-2 items-center">
                  <FaClock color="#c0a753" /> Alarm Clock
                </li>
              </ul>
            </p>
          </div>

          {/* CHECK - IN & OUT POLICIES: */}
          <div className="mt-4">
            <p>
              <strong className="underline text-primary uppercase">
                CHECK - IN & OUT POLICIES:{" "}
              </strong>{" "}
              <div className="space-y-4 text-gray-700 mt-2">
                {/* Check-in and Check-out times */}
                <ul className="space-y-1">
                  <li className="flex gap-2 items-center">
                    <FaClock color="#c0a753" /> Check-in time: after 2:00 pm
                  </li>
                  <li className="flex gap-2 items-center">
                    <FaClock color="#c0a753" /> Check-out time: before 12:00 pm
                  </li>
                </ul>

                {/* Early check-in */}
                <div className="space-y-1">
                  <h4 className="flex gap-2 items-center font-medium">
                    <FaInfoCircle color="#c0a753" /> Early check-in:
                  </h4>
                  <ul className="list-disc pl-5">
                    <li>Before 6:00 am: 100% of the room rate.</li>
                    <li>From 6:00 am to 10:00 am: 50% of the room rate.</li>
                  </ul>
                </div>

                {/* Late check-out */}
                <div className="space-y-1">
                  <h4 className="flex gap-2 items-center font-medium">
                    <FaInfoCircle color="#c0a753" /> Late check-out:
                  </h4>
                  <ul className="list-disc pl-5">
                    <li>Before 6:00 pm: 50% of the room rate.</li>
                    <li>After 6:00 pm: 100% of the room rate.</li>
                  </ul>
                </div>
              </div>
            </p>
          </div>

          {/* CHILDREN & EXTRA BED: */}
          <div className="space-y-2 text-gray-700 mt-4">
            <h4 className="">
              <strong className="underline text-primary uppercase">
                CHILDREN & EXTRA BED:{" "}
              </strong>{" "}
              :
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Children under 6 years old: free breakfast, sharing bed with
                parents.
              </li>
              <li>
                Children from 6 – under 12 years old: charged at 150,000
                VND/child/day for breakfast, sharing bed with parents.
              </li>
              <li>
                Children from 12 years old and older: charged at 700,000
                VND/night for extra bed including breakfast.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Top selling */}
      <div className="!mt-8 wrapper">
        <div className="flex gap-4 items-center">
          <span className="flex-1 h-1 border-t-2 border-primary"></span>
          <h1 className="uppercase text-primary">top selling</h1>
          <span className="flex-1 h-1 border-t-2 border-primary"></span>
        </div>
        <TopSelling />
      </div>
    </div>
  );
}

export default ProductDetail;
