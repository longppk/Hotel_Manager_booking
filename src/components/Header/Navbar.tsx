import Tippy from "@tippyjs/react";
import { FC, useEffect, useRef, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoCartOutline, IoLogOut, IoMenu, IoSettings } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "tippy.js/animations/perspective.css";
import { RootState } from "../../redux/store";
import { GetUserInfoDto } from "../../types/types";
import routes from "../../config/routes";
import { getCartByUser, logoutUser } from "../../api/axios";
import { FaUserCircle } from "react-icons/fa";
import { Emitter } from "../../eventEmitter/EventEmitter";
import { notification } from "antd";

const Navbar: FC = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const user: GetUserInfoDto | null = useSelector(
    (state: RootState) => state.auth.currentUser
  );

  const menuRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCart = async () => {
      // const listCartPay = await getCartByUser(user?.id ?? undefined).catch(e => notification.error({ message: e.message }));
      // setCartCount(listCartPay.cartDetail.length);
    };
    if (user) {
      fetchCart();
    }
    const handleEvent = () => {
      fetchCart();
    };
    Emitter.on("updateCartNumber", handleEvent);
    return () => {
      Emitter.off("updateCartNumber", handleEvent);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    
    <nav className="flex justify-between items-center bg-white lg:px-20 py-4 mx-auto">
      {/* left */}
      <ul className="flex flex-col gap-2">
        <li className="flex *:text-primary md:hidden items-center gap-2 *:cursor-pointer">
          <FaPhone
            size={24}
            className="rounded-full border-2 border-primary p-1"
          />
          <IoMdMail size={24} />
        </li>
        <Tippy
          trigger="click"
          hideOnClick
          placement="bottom-start"
          reference={menuRefMobile}
          animation="perspective"
          interactive
          content={
            <ul className="bg-primary z-50 uppercase *:px-2 *:cursor-pointer *: text-white  overflow-hidden rounded-lg">
              <li className="hover:bg-white hover:text-primary transition-all duration-300 py-2 border-b">
                <Link to={routes.aboutUs}>about us</Link>
              </li>
              <li className="hover:bg-white hover:text-primary transition-all duration-300 py-2 border-b">
                <Link to={routes.product}>room</Link>
              </li>
            </ul>
          }
        >
          <div
            ref={menuRefMobile}
            className="text-white md:hidden bg-primary w-fit py-1 px-2 rounded-lg cursor-pointer hover:bg-primaryHover transition-all duration-300"
          >
            <IoMenu size={24} />
          </div>
        </Tippy>
        <Link to="/" className="hidden md:block">
          <img src="https://grandtouranehotel.com/images/logo.png" alt="" />
        </Link>
      </ul>

      {/* center */}
      <div>
        <Link to="/" className="md:hidden">
          <img src="https://grandtouranehotel.com/images/logo.png" alt="" />
        </Link>
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex flex-col gap-4 items-center lg:flex-row-reverse">
            <ul className="flex gap-4 justify-center items-center *:text-primary">
              <li>
                <Link to={"/"}>
                  <FaFacebook size={20} />
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <FaYoutube size={20} />
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <FaInstagram size={20} />
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <FaTwitter size={20} />
                </Link>
              </li>
              <li>
                <button className="uppercase py-1 px-2 font-bold bg-primary text-white rounded-lg hover:bg-primaryHover transition-all duration-300">
                  book now
                </button>
              </li>
            </ul>
            <div className="flex justify-center gap-4">
              <div className="flex gap-2">
                <FaPhone
                  color="#c0a753"
                  size={24}
                  className="rounded-full border-2 border-primary p-1"
                />
                <a
                  className="hover:text-primary transition-all duration-300"
                  href="tel:+84 236 377 88 88"
                >
                  +84 (0) 236 377 88 88
                </a>
              </div>
              <div className="flex gap-2">
                <IoMdMail color="#c0a753" size={24} />
                <a
                  className="hover:text-primary transition-all duration-300"
                  href="mailto:reservations@grandtouranehotel.com"
                >
                  reservations@grandtouranehotel.com
                </a>
              </div>
            </div>
          </div>
          <ul className="hidden lg:flex uppercase justify-center gap-4">
            <li className="hover:text-primary transition-all duration-300">
              <Link to={routes.aboutUs}>about us</Link>
            </li>
            <li className="hover:text-primary transition-all duration-300">
              <Link to={routes.product}>Room</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* right */}
      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-2 *:cursor-pointer">
          <img
            src="https://grandtouranehotel.com/images/lang/vn.jpg"
            alt="vn"
          />
          <img
            src="https://grandtouranehotel.com/images/lang/en.jpg"
            alt="en"
          />
        </li>
        <li className="flex items-center gap-4">
          <div className="md:hidden">
            <button className="uppercase min-w-28 line-clamp-1 py-1 px-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-all duration-300">
              book now
            </button>
          </div>
          {user && (
            <Link to="/cart" className="relative">
              <IoCartOutline className="w-7 h-7 mt-1" />
              {cartCount > 0 && (
                <div className="transition-all duration-300 w-5 h-5 rounded-full bg-red-600 text-white absolute top-0 text-sm right-[-10px] border border-white text-center">
                  {cartCount}
                </div>
              )}
            </Link>
          )}
          {user ? (
            <div className={"flex items-center gap-x-3"}>
              <Tippy
                maxWidth={""}
                onMount={(instance) => {
                  instance.popper.style.margin = "0 auto";
                }}
                offset={[0, 15]}
                placement="bottom-start"
                arrow={false}
                animation="perspective"
                interactive
                content={
                  <ul
                    className={
                      "shadow-custom bg-white rounded-lg overflow-hidden"
                    }
                  >
                    <li onClick={logoutUser}>
                      <div
                        className={
                          "px-4 cursor-pointer py-2 flex items-center gap-x-3 hover:bg-slate-300 hover:text-white transition-all duration-300"
                        }
                      >
                        <IoLogOut size={18} />
                        <span>Log out</span>
                      </div>
                    </li>

                    <li>
                      <Link
                        className={
                          "px-4 py-2 flex items-center gap-x-3 hover:text-white hover:bg-slate-300 transition-all duration-300"
                        }
                        to={routes.settings}
                      >
                        <IoSettings size={18} />
                        <span>Setting</span>
                      </Link>
                    </li>
                  </ul>
                }
              >
                <div>
                  <FaUserCircle size={24} cursor={"pointer"} />
                </div>
              </Tippy>
              <span className={"font-semibold"}>{user.name}</span>
            </div>
          ) : (
            <div className={"flex gap-x-3"}>
              <Link className={"btn-custom"} to={routes.login}>
                Login
              </Link>
              <Link className={"btn-custom"} to={routes.signup}>
                Sign Up
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
