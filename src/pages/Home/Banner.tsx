import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Banner() {
  return (
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
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="https://grandtouranehotel.com/uploads/gal/slide_228.jpg" alt='' className='w-full object-cover h-[500px]' />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://grandtouranehotel.com/uploads/gal/slide_229.jpg" alt='' className='w-full object-cover h-[500px]' />
        </SwiperSlide>
      </Swiper>
      
  );
}

export default Banner;
