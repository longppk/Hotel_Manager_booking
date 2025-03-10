import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoomByQuery } from "../../api/axios";
import Paginate from "../../components/PagianateNavBar/Paginate";
import ProductItem from "../../components/ProductItem";
import {
  PaginatedResponse,
  RoomAvailableStatus,
  RoomFilter,
  RoomHotel,
} from "../../types/types";
import SkeletonLoader from "./SkeletonLoader";
import { DatePicker } from 'antd';

function ProductPage() {
  const [allProducts, setAllProducts] = useState<RoomHotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { RangePicker } = DatePicker;

  const { t } = useTranslation();
  const location = useLocation();

  const [checkInDate, setCheckInDate] = useState<string | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<string | undefined>(
    undefined
  );
  const [guests, setGuests] = useState<number | undefined>(undefined);

  // Hàm cập nhật filter
  const applyFilters = () => {
    const params = new URLSearchParams(location.search);

    // Set các tham số filter
    if (checkInDate) {
      params.set("checkIn", checkInDate);
    } else {
      params.delete("checkIn");
    }

    if (checkOutDate) {
      params.set("checkOut", checkOutDate);
    } else {
      params.delete("checkOut");
    }

    if (guests) {
      params.set("capacity", guests.toString());
    } else {
      params.delete("capacity");
    }

    navigate({ search: params.toString() });
  };

  const navigate = useNavigate();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [totalItems, setTotalItems] = useState<number>(0);

  const paginationFilter: RoomFilter = useMemo(() => {
    const getQueryParamAsNumber = (param: string) =>
      queryParams.has(param) ? Number(queryParams.get(param)) : undefined;

    const getQueryParamAsArray = (param: string) =>
      queryParams.has(param) ? queryParams.getAll(param) : undefined;

    return {
      page: getQueryParamAsNumber("page")
        ? getQueryParamAsNumber("page")! - 1
        : undefined,
      size: getQueryParamAsNumber("size"),
      sort: getQueryParamAsArray("sort"),
      capacity: getQueryParamAsNumber("capacity"),
      minPrice: getQueryParamAsNumber("minPrice"),
      maxPrice: getQueryParamAsNumber("maxPrice"),
      roomAvailableStatus: queryParams.has("roomAvailableStatus")
        ? (queryParams.get("roomAvailableStatus") as RoomAvailableStatus)
        : undefined,
      roomTypeName: queryParams.get("roomTypeName") || undefined,
      amenities: getQueryParamAsArray("amenities"),
      createdAtAfter: queryParams.get("createdAtAfter") || undefined,
      checkInDate: queryParams.get("checkIn") || undefined,
      checkOutDate: queryParams.get("checkOut") || undefined,
      updatedAtBefore: queryParams.get("updatedAtBefore") || undefined,
    };
  }, [queryParams]);

  const getAllRoom = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: PaginatedResponse<RoomHotel> = await getRoomByQuery(
        paginationFilter
      );
      setIsLoading(false);
      setAllProducts(data.data);
      setTotalItems(data.pagination.totalItems);
    } catch (err) {
      console.error(err);
    }
  }, [paginationFilter]);

  useEffect(() => {
    getAllRoom();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    
  }, [getAllRoom]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", (newPage + 1).toString());
    navigate({ search: params.toString() });
  };

  return (
    <div className="px-[10%] mb-20 pb-20">
      <div className="flex items-center gap-x-4 py-10">
        <span className="text-gray-400">{t("nav.home")}</span>{" "}
        <FaChevronRight size={12} /> {t("nav.products")}
      </div>
      <div className="flex gap-x-10 flex-col xl:flex-row gap-y-5">
        <div className="w-[247px] border-gray-300 border border-solid rounded-[20px] h-fit ">
          {/* <h3 className="px-4 py-3 pt-6 text-xl cursor-default ">
            {t("sort.title")}
          </h3>
          <ReactSelect
            ref={selectRef}
            className="p-4"
            options={sortOptions}
            defaultValue={sortOption[0]}
            onChange={(option) => option && handleSort(option.value)}
          ></ReactSelect> */}

          <h3 className="px-4 py-3 pt-6 text-xl cursor-default border-t ">
            Filter
          </h3>
          <div className="px-4 pb-4">
          <RangePicker className="mb-4" onChange={(_, info) => {
              setCheckInDate(info[0]);
              setCheckOutDate(info[1]);
          }}/>

            <div className="mb-4">
              <label
                htmlFor="guests"
                className="block text-sm font-medium text-gray-700"
              >
                Guests
              </label>
              <input
                type="number"
                id="guests"
                min="1"
                value={guests || ""}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1 cursor-pointer p-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="1"
              />
            </div>

            {/* Nút áp dụng */}
            <button
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={applyFilters}
            >
              Áp dụng
            </button>
          </div>
        </div>

        <div className="flex-1">
          {!isLoading ? (
            <ul className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-10 auto-rows-max">
              {allProducts.map((prod, index) => (
                <ProductItem product={prod} key={index} onSuccessfulAddToCart={getAllRoom} checkInProps={checkInDate ? new Date(checkInDate) : undefined} checkOutProps={checkOutDate ? new Date(checkOutDate) : undefined} />
              ))}
            </ul>
          ) : (
            <SkeletonLoader />
          )}
          <Paginate
            onPageChange={(pageNumber) => {
              handlePageChange(pageNumber);
            }}
            numberItemOnPage={
              queryParams.has("size") ? Number(queryParams.get("size")) : 10
            }
            itemsLength={totalItems}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
