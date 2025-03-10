import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Login } from "../types/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { callApi, loginUser } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import routes from "../config/routes";
import { useTranslation } from "react-i18next";


interface Errors {
  [key: string]: string;
}

function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(true);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState<Login>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    let tempErrors: Errors = {};
    tempErrors.email = formValues.email ? "" : "Bạn cần nhập email.";
    tempErrors.password = formValues.password ? "" : "Bạn cần nhập mật khẩu.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setFormValues({
        email: "",
        password: "",
      });
      try {
        const data = await callApi(() => loginUser(formValues));
        dispatch(loginSuccess(data));
        navigate(routes.home);
      } catch (error) {
        toast.error("Đăng nhập thất bại");
      }
    }
  };

  const handleChangeShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wrapper">
      <div className="select-none bg-[url('https://cdn.wallpapersafari.com/77/30/ejxDH4.jpg')] bg-cover bg-center bg-white/80 backdrop-blur-lg mb-[140px] grid md:grid-cols-2 gap-16 items-center relative overflow-hidden p-10 rounded-3xl bg-white text-black">
        <div>
          <h2 className="text-3xl text-[#fff] font-extrabold">{t("nav.login")}</h2>
          <p className="text-sm text-[#fff] drop-shadow-lg mt-3">
          {t("text.loginDescription")}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mt-8">
              <input
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder={t("input.placeholder.email")}
                className={`px-3 py-4 bg-white text-black w-full text-sm border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-[#333] outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              <div className="relative">
                <input
                  type={!isShowPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder={t("input.placeholder.password")}
                  className={`pl-3 py-4 pr-12 bg-white w-full text-sm border rounded-lg ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-[#333] outline-none`}
                />
                <div className="absolute right-3 top-2 p-2 rounded-full hover:bg-[#0000000a] transition-all duration-300">
                  {isShowPassword ? (
                    <FaEyeSlash size={20} onClick={handleChangeShowPassword} />
                  ) : (
                    <FaEye size={20} onClick={handleChangeShowPassword} />
                  )}
                </div>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="text-end mt-2" tabIndex={-1}>
              <button onClick={() => navigate(routes["forgot-pass"])} className="text-[#333] hover:text-underline">{t("button.forgotPassword")} ?</button>
            </div>
            <button
              type="submit"
              className="mt-6 flex items-center justify-center text-sm w-full rounded-lg px-4 py-3 font-semibold bg-[#333] text-white hover:bg-[#222]"
            >
              Login
            </button>
            <p className="pt-4 text-center">
            {t("text.noAccount")}?{" "}
              <Link to={"/signup"} className="text-[blue] hover:underline">
              {t("button.signup")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
