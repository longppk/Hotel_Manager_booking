import { baseAxios } from "./axios";

export const getNewProduct = async () => {
  try {
    const res = await baseAxios.get(`home/new-product?pageSize=8`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBestSeller = async (limit?: number) => {
  try {
    const res = await baseAxios.get(`rooms/most-sold`, {
      params: {
        limit,
      },
    });
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
