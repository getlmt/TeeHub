import { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import adminRoutes from "./adminRoutes";


import Header from "../components/common/Header";
import Footer from "../components/common/Footer";


const Home = lazy(() => import("../pages/client/Home"));
const Login = lazy(() => import("../pages/client/Login"));
const Products = lazy(() => import("../pages/client/Products"));
const ProductDetail = lazy(() => import("../pages/client/Products/ProductDetail"));
const Cart = lazy(() => import("../pages/client/Cart"));
const Design = lazy(() => import("../pages/client/Design"));
const Contact = lazy(() => import("../pages/client/Contact"));
const UserProfile = lazy(() => import("../pages/client/UserProfile"));
const VirtualTryOn = lazy(() => import("../pages/client/VirtualTryOn"));
const Order = lazy(() => import("../pages/client/Order"));
const OrderHistory = lazy(() => import("../pages/client/OrderHistory"));



const OAuth2RedirectHandler = lazy(() => import("../pages/client/Login/OAuth2RedirectHandler"));


function ClientLayout() {
  const { pathname } = useLocation();
  
  const hideChrome = pathname === "/login";

  return (
    <div className="client-layout">
      {!hideChrome && <Header />}
      <main style={{ minHeight: "60vh" }}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

const MeLayout = () => <Outlet />;
const Forbidden = () => <div style={{ padding: 24 }}>403 — Forbidden</div>;
const NotFound = () => <div style={{ padding: 24 }}>404 — Not Found</div>;

const routes = [
  
  
  {
    path: "/oauth2/redirect",
    element: (
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '20px' }}>Đang xử lý đăng nhập...</div>}>
        <OAuth2RedirectHandler />
      </Suspense>
    ),
  },

  
  {
    path: "/",
    element: (
      <Suspense fallback="...">
        <ClientLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Suspense fallback="..."><Home /></Suspense> },
      { path: "home", element: <Suspense fallback="..."><Home /></Suspense> },
      { path: "products", element: <Suspense fallback="..."><Products /></Suspense> },
      { path: "products/:id", element: <Suspense fallback="..."><ProductDetail /></Suspense> },
      { path: "cart", element: <Suspense fallback="..."><Cart /></Suspense> },
      { path: "design", element: <Suspense fallback="..."><Design /></Suspense> },
      { path: "contact", element: <Suspense fallback="..."><Contact /></Suspense> },
      { path: "virtual-try-on", element: <Suspense fallback="..."><VirtualTryOn /></Suspense> },
      { path: "order", element: <Suspense fallback="..."><Order /></Suspense> },
      { path: "OrderHistory", element: <Suspense fallback="..."><OrderHistory /></Suspense> },
      
      {
        path: "me",
        element: (
          <PrivateRoute roles={["ROLE_USER", "ROLE_ADMIN"]}>
            <MeLayout />
          </PrivateRoute>
        ),
        children: [
          { path: "profile", element: <Suspense fallback="..."><UserProfile /></Suspense> },
        ],
      },

      
      {
        path: "login",
        element: (
          <PublicRoute>
            <Suspense fallback="..."><Login /></Suspense>
          </PublicRoute>
        ),
      },

      { path: "403", element: <Forbidden /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  
  ...adminRoutes,
];

export default routes;