import { FormEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { callApi, forgotPass } from "../../api/axios";
import Logo from "../../assets/images/logo.png";
import { notification } from "antd";

function ForgotPassword() {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await callApi(() => forgotPass(input.current?.value || ""))
      .then((data) => {
        notification.success({
          message: "Success",
          description: "Please check your email to reset password!",
        });
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Something went wrong!",
        });
      });
  };
  return (
    <div className=" flex py-10 max-w-xl m-auto  flex-col gap-y-3 items-center shadow-custom mt-20 mb-44 rounded">
      <img className="w-40" src="https://grandtouranehotel.com/images/logo.png" alt="" />
      <h1 className="text-3xl">Forgot Password</h1>
      <p>Please enter your email to continue.</p>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
<input
  ref={input}
  title="Email không hợp lệ"
  required
  placeholder={t("input.placeholder.email")}
  className="outline outline-1 outline-gray-300 focus:outline-primary rounded-lg p-4"
  type="email"
/>


        <button
          type="submit"
          className="py-4 px-2 bg-gray-300 min-w-32 rounded-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
        >
         Continue
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
