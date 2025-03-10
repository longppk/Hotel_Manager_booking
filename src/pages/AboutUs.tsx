import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { FaFacebook, FaPhone, FaTwitter, FaUser } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  callApi,
  editReview,
  getReviewsByProductId,
  registerReview,
} from "../api/axios";
import Pagianate from "../components/PagianateNavBar/Paginate";
import StarRating from "../components/StarRating";
import ActiveStarRating from "../components/StarRatingActive";
import routes from "../config/routes";
import { RootState } from "../redux/store";
import { GetUserInfoDto, Review, ReviewRequestDto } from "../types/types";
import { convertLocalDateTimeToDate } from "../utils/helper";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

interface Props {}

function AboutUs(props: Props) {
  const {} = props;
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const formReview = useRef<HTMLFormElement>(null);
  const [page, setPage] = useState<number>(0);
  const textReview = useRef<HTMLTextAreaElement>(null);
  const submitReview = useRef<HTMLButtonElement>(null);
  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );
  const numberOfPage = 5;
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const MySwal = withReactContent(Swal);
  const showEditReview = (
    originReview: string | null,
    originalRating: number | null
  ) => {
    function handleEditRating(rating: number): void {
      if (document.getElementById("swal-input2")) {
        const input = document.getElementById(
          "swal-input2"
        ) as HTMLInputElement;
        input.value = rating.toString();
      }
    }

    return MySwal.fire({
      title: (
        <>
          <p>Edit review</p>
          <ActiveStarRating
            rating={originalRating || 1}
            setRating={handleEditRating}
            className=""
          />
        </>
      ),
      html: '<input id="swal-input2" hidden class="swal2-input"></input>',
      input: "textarea",
      inputValue: originReview,
      inputAttributes: {
        required: "true",
      },
      showCancelButton: true,
      confirmButtonText: "Edit review",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      preConfirm: () => {
        const content = Swal.getInput()?.value;
        const editRating = Swal.getPopup()!.querySelector(
          "#swal-input2"
        ) as HTMLInputElement;

        return { content, editRating: editRating.value };
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReviews = async () => {
      try {
        const result: Review[] = await getReviewsByProductId();
        setReviews(result);
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    };
    fetchReviews();
  }, []);

  const showSwal = () => {
    return Swal.fire({
      title: "Bạn chưa đăng nhập?",
      text: "Hãy đăng nhập để tiếp tục nhé",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng nhập",
    });
  };
  async function handleSubmitReviews(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!textReview.current?.value.trim()) {
      textReview.current?.setCustomValidity(
        "Content must be at least 1 character diff space"
      );
      return;
    }

    if (!user) {
      showSwal().then((value) => {
        if (value.isConfirmed) {
          navigate(routes.login);
        }
      });
      return;
    }

    const data: ReviewRequestDto = {
      productId:
        formReview.current && Number(formReview.current.productId.value),
      userId: formReview.current && Number(formReview.current.userId.value),
      rating: rating,
      content: textReview.current.value,
    };

    await registerReview(data).then((data) => {
      if (data) {
        toast.success("Review successfully!");
        if (textReview.current) {
          textReview.current.value = "";
        }
        setReviews((prev) => [data, ...(prev || [])]);
      }
    });
  }

  return (
    <div className="my-8 mb-[160px] px-4 max-w-7xl mx-auto">
      <div className="flex gap-4 items-center">
        <span className="flex-1 h-1 border-t-2 border-primary"></span>
        <h1 className="uppercase text-primary">about us</h1>
        <span className="flex-1 h-1 border-t-2 border-primary"></span>
      </div>
      <Swiper
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
        className="mt-4"
      >
        <SwiperSlide>
          <img
            src="https://grandtouranehotel.com/uploads/gal/slide_228.jpg"
            alt=""
            className="w-full object-cover h-[250px]"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://grandtouranehotel.com/uploads/gal/slide_229.jpg"
            alt=""
            className="w-full object-cover h-[250px]"
          />
        </SwiperSlide>
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
      <div>
        <h2 className="font-semibold text-xl mb-2">The hotel</h2>
        <p className="*:mt-2 *:block">
          Beautifully located by the My Khe beach, amongst the top six in the
          world, and about 5-minute away from the centre of Danang city, Grand
          Tourane Hotel 5* welcomes all who are looking for the breathtaking –
          ocean view accommodation, finest facilities and warm service.
          <span></span>
          188 contemporary rooms and suites offering a stunning view over My Khe
          beach or the city skyline, from the well-equipped meeting rooms to the
          tennis court, make the hotel a perfect choice for business and
          leisure. Cap a day of exploration with beauty and wellness therapies
          at our hotel spa, savor the delicacies at an all-day dining restaurant
          Bella Vista, or soak up the sun while enjoying at the pool bar to
          experience 5 star services.
          <span></span>
          If you are dreaming of a vacation just a few steps from the beach, but
          still within a distance to all major sights and attractions of the
          Central Vietnam, you can open your eyes. Touch your dream in Grand
          Tourane and enjoy every moment.
        </p>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold text-xl mb-2">Vision</h2>
        <p className="*:mt-2 *:block">
          To establish a 5 star cutting-edge hospitality brand in the area
          through wide range of services, minute care in favor of attracting and
          bringing feeling, satisfaction to customers via theirs senses; by
          having a more nimble and flexible model, that preserves proven
          operating disciplines and standards; harnesses the new sales and
          marketing environments, and focuses on mutually beneficial partner
          relationships.
        </p>
      </div>
      <div>
        <h2 className="text-center font-semibold text-xl mt-6 mb-3">
          Customer feedback
        </h2>
      </div>
      {reviews && (
        <div className="py-8 pt-0">
          <div className="flex justify-between items-center pb-4">
            <div className="flex gap-1 items-center">
              <h3 className=" text-xl">{t("text.allReviews")}</h3>
              <span>({reviews.length})</span>
            </div>
          </div>
          <form
            ref={formReview}
            onSubmit={(e) => handleSubmitReviews(e)}
            className="flex flex-col items-end gap-y-3"
          >
            <input type="text" name="productId" value={1} hidden readOnly />
            <input
              type="text"
              name="avatar"
              value={user?.avatar ?? ""}
              hidden
              readOnly
            />
            <input
              type="text"
              name="userId"
              value={user?.id ?? ""}
              hidden
              readOnly
            />
            <input type="text" name="rating" value={rating} hidden readOnly />

            <textarea
              onChange={(e) => e.target.setCustomValidity("")}
              ref={textReview}
              name="content"
              required
              className="w-full outline p-3 outline-1 rounded-md outline-gray-300 focus:outline-2 focus:outline-gray-500"
            ></textarea>

            <div className="w-full flex justify-between">
              <ActiveStarRating
                rating={rating}
                setRating={setRating}
                className=""
              />
              <button
                ref={submitReview}
                type="submit"
                className="w-fit bg-gray-300 px-4 py-2  rounded-xl hover:bg-primary hover:text-white transition-all duration-500"
              >
                Gửi
              </button>
            </div>
          </form>

          {reviews.length === 0 ? (
            <div className="text-center text-gray-400 mt-3">
              Chưa có bình luận nào.
            </div>
          ) : (
            <div className="flex flex-col gap-y-6 mt-6">
              {reviews
                .slice(page * numberOfPage, page * numberOfPage + numberOfPage)
                .map((review) => (
                  <div key={review.id} className="flex gap-x-4 items-start">
                    <FaUser
                      size={40}
                      className="bg-gray-300 rounded-full p-2"
                    />
                    <div className="flex flex-col gap-y-2">
                      <div className="flex gap-x-3 items-center">
                        <strong>{review.userName}</strong>
                        <span className="text-gray-500">
                          {convertLocalDateTimeToDate(
                            review.updated
                          ).toLocaleDateString()}
                        </span>
                        {review.userId === user?.id && (
                          <FaEdit
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                              showEditReview(
                                review.content,
                                review.rating
                              ).then(async (data) => {
                                if (data.isConfirmed) {
                                  const editReviewData = {
                                    id: review.id,
                                    content: data.value.content,
                                    rating: Number(data.value.editRating),
                                  };

                                  await callApi(() =>
                                    editReview(editReviewData)
                                  ).then((data) => {
                                    if (data) {
                                      toast.success("Cập nhật thành công!");
                                      setReviews(
                                        (prev) =>
                                          prev?.map((r) => {
                                            if (r.id === data.id) {
                                              r.content = data.content;
                                              r.rating = data.rating;
                                            }
                                            return r;
                                          }) ?? []
                                      );
                                    }
                                  });
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                      <StarRating rating={review.rating}></StarRating>
                      <p>{review.content}</p>
                    </div>
                  </div>
                ))}
              <Pagianate
                onPageChange={function (numberPage: number): void {
                  setPage(numberPage);
                }}
                itemsLength={reviews.length}
                numberItemOnPage={5}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AboutUs;
