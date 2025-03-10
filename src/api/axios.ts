import axios, { AxiosError } from "axios";
import { getDispatch } from "../utils/helper";
import { fetchEnd, fetchStart } from "../redux/appSlice";

import {
  Login,
  SignUpInfo,
  Cart,
  CartItem,
  ReviewRequestDto,
  CartRequestDto,
  GetUserInfoDto,
  CartInfo,
  Review,
  Product,
  RoomFilter,
  PaginatedResponse,
  RoomHotel,
} from "../types/types";
import { Dispatch } from "redux";
import { logOutSuccess, loginSuccess, updateUserSuccess } from "../redux/authSlice";
import Swal from "sweetalert2";
import { notification } from "antd";

export const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081/api/v1/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

const dispatch = getDispatch();

const navigate = (href: string) => {
  window.location.href = href;
};

export const currentUser: GetUserInfoDto = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string)
  : null;

export const loginUser = async (loginProp: Login) => {
  try {
    const res: GetUserInfoDto = (await baseAxios.post("auth/login", loginProp))
      .data;
    console.log(res);
    localStorage.setItem("user", JSON.stringify(res));
    dispatch(loginSuccess(res));
    // navigate("/");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logoutUser = async () => {
  try {
    await baseAxios.post("/auth/logout");
    localStorage.removeItem("user");
    dispatch(logOutSuccess());
    navigate("/login");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const forgotPass = async (email: string) => {
  try {
    await baseAxios.get(`/auth/forgot-pass/${email}`);
  } catch (error) {
    throw error;
  }
};

export const resetPass = async (token: string, password: string) => {
  try {
    await baseAxios.get(`/auth/reset-password`, {
      params: { token: token, password: password },
    });
  } catch (error) {
    throw error;
  }
};

export const getCart = async (userId: number): Promise<Cart> => {
  try {
    const res = await baseAxios.get(`carts/${userId}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addCartItem = async (cartId: number, cartItem: CartItem) => {
  try {
    const res = await baseAxios.post(`carts/${cartId}/items`, cartItem);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteCartItem = async (cartItemId: number) => {
  try {
    const res = await baseAxios.delete(`items/${cartItemId}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateCartItem = async (
  cartItemId: number,
  cartItem: CartItem
) => {
  try {
    const res = await baseAxios.post(`items/${cartItemId}`, cartItem);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllProduct = async (
  name: string | null
): Promise<Product[]> => {
  try {
    const res = await baseAxios.get("products", { params: { name } });
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getRoomByQuery = async (
  filter: RoomFilter
): Promise<PaginatedResponse<RoomHotel>> => {
  try {
    const res = await baseAxios.get("rooms", {
      params: { ...filter},
      paramsSerializer: {
        indexes: null,
      },
    });
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProduct = async (id: number) => {
  try {
    const res = await baseAxios.get(`rooms/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getReviewsByProductId = async () => {
  try {
    const res = await baseAxios.get(`review`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerReview = async (review: ReviewRequestDto) => {
  try {
    const res = await baseAxios.post(`review`, review);
    return res.data;
  } catch (error: any) {
    Swal.fire({
      title: "Error",
      text: error.response.data.error,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

export const editReview = async (review: any) => {
  console.log(review);

  try {
    const res = await baseAxios.put(`review`, review);
    return res.data;
  } catch (error: any) {
    Swal.fire({
      title: "Error",
      text: error.response.data.error,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

export const getTopReview = async (limit: number): Promise<Review[] | null> => {
  try {
    const res = await baseAxios.get(`review/top`, { params: { limit } });
    console.log("API response:", res);
    return res.data;
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error.response.data.error || "ok",
    });
  }
  return null;
};

export const addToCart = async (cartRequestDto: CartRequestDto) => {
  console.log(cartRequestDto)
  try {
    const res = await baseAxios.post("carts", cartRequestDto);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCartByUser = async (id?: number) => {
  try {
    const res = await baseAxios.get(`carts/user/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteCart = async (ids: number[]) => {
  try {
    const res = await baseAxios.delete(`carts`, { data: ids });
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const payCart = async (cartList: CartInfo) => {
  try {
    const res = await baseAxios.post(`carts/pay`, cartList);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const callApi = async (callBack: any) => {
  try {
    dispatch(fetchStart());
    const res = await callBack();
    dispatch(fetchEnd());
    return res;
  } catch (error) {
    dispatch(fetchEnd());
    return Promise.reject(error);
  }
};

export const registerNewUser = async (user: SignUpInfo) => {
  try {
    const res = await baseAxios.post("/auth/register", user);
    console.log(res.data)
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUser = async (id: number,user: GetUserInfoDto) => {
  try {
    const res = await baseAxios.put(`/auth/users/${id}`, user);
    dispatch(updateUserSuccess(res.data))
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
