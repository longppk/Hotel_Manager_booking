import config from "../config";
import DefaultLayout from "../layouts/DefaultLayout";
import SimpleHeaderLayout from "../layouts/SimpleHeaderLayout";
import AboutUs from "../pages/AboutUs";
import AdminPage from "../pages/Admin/AdminPage";
import CartPage from "../pages/Cart/CartPage";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Home from "../pages/Home/Home";
import KhachHangPage from "../pages/Admin/KhachHangPage";
import LoginPage from "../pages/LoginPage";
import PageNotFound from "../pages/PageNotFound";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import SignUpPage from "../pages/SignUpPage";
import ThankYou from "../pages/ThankYou/ThankYou";
import Settings from "../pages/Settings";

const publicRoutes = [
  { path: config.routes.home, component: Home, layout: DefaultLayout },
  { path: config.routes.login, component: LoginPage, layout: DefaultLayout },
  {
    path: config.routes.signup,
    component: SignUpPage,
    layout: DefaultLayout,
  },
  { path: config.routes.product, component: Product, layout: DefaultLayout },
  { path: config.routes.contact, component: Contact, layout: DefaultLayout },
  { path: config.routes.cart, component: CartPage, layout: DefaultLayout },
  { path: config.routes.thank, component: ThankYou, layout: DefaultLayout },
  { path: config.routes.aboutUs, component: AboutUs, layout: DefaultLayout },
  { path: config.routes.settings, component: Settings, layout: DefaultLayout },
  {
    path: config.routes["forgot-pass"],
    component: ForgotPassword,
    layout: DefaultLayout,
  },
  {
    path: config.routes["reset-pass"],
    component: ResetPassword,
    layout: DefaultLayout,
  },
  {
    path: config.routes["produc-detail"],
    component: ProductDetail,
    layout: DefaultLayout,
  },
  { path: config.routes["page-not-found"], component: PageNotFound },

];

const privateRoutes: any[] = [
  
  { path: config.routes.admin, component: AdminPage },
];

export { publicRoutes, privateRoutes };
