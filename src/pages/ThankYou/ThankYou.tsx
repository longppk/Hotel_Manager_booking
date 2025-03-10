import { Link } from "react-router-dom";
import routes from "../../config/routes";
import CouponCard from "../../components/CouponCard/CouponCard";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { baseAxios } from "../../api/axios";
import { notification } from "antd";

function ThankYou() {
  const { t } = useTranslation();

  // Lấy toàn bộ query string
  const queryString = window.location.search;
  const params = new URLSearchParams(window.location.search);
  const vnpResponseCode = params.get("vnp_ResponseCode");

  useEffect(() => {
    if (vnpResponseCode === "00") {
      baseAxios
        .get(`vnpay/vn-pay-callback${queryString}`)
        .then((response) => {
          console.log("Callback response:", response.data);
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description: "Room has been booked",
          });
        });
    }
  }, [vnpResponseCode, queryString]);

  if (vnpResponseCode !== "00" && vnpResponseCode !== null) {
    return (
      <div className="w-full max-w-[1024px] md:mx-auto  py-20 gap-y-3 mt-6 mb-40 flex gap-4 justify-between items-center relative">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-4xl">Fail 😢</h1>
          <p>Payment failed</p>

          <Link
            to={routes.home}
            className="rounded-xl bg-rgb(0, 136, 84)-300 font-semibold transition-all duration-300 ease-in-out text-black p-4 w-content underline"
          >
            Back to Home ➡
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1024px] md:mx-auto  py-20 gap-y-3 mt-6 mb-40 flex gap-4 justify-between items-center relative">
      <div className="flex flex-col gap-2 flex-1">
        <h1 className="text-4xl">{t("pdf.congratulation")} 🎉</h1>
        <p>{t("pdf.promotion")}</p>

        <Link
          to={routes.home}
          className="rounded-xl bg-rgb(0, 136, 84)-300 font-semibold transition-all duration-300 ease-in-out text-black p-4 w-content underline"
        >
          {t("pdf.backHome")} ➡
        </Link>
      </div>
    </div>
  );
}

export default ThankYou;
