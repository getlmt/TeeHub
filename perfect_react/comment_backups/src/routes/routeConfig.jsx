import { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import adminRoutes from "./adminRoutes";

// ===== import Header/Footer (client) =====
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

// ===== pages (có thể lazy hoặc import trực tiếp) =====
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

// === 1. IMPORT TRANG XỬ LÝ REDIRECT ===
// Hãy đảm bảo bạn đã tạo file này và đường dẫn trỏ đúng tới nó
const OAuth2RedirectHandler = lazy(() => import("../pages/client/Login/OAuth2RedirectHandler"));

/** Layout client: bọc Header/Footer + nơi render con */
function ClientLayout() {
  const { pathname } = useLocation();
  // Nếu muốn ẩn header/footer ở trang login:
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
  // === 2. ROUTE XỬ LÝ OAUTH2 (THÊM MỚI) ===
  // Đặt ở ngoài cùng để không dính Layout (Header/Footer)
  {
    path: "/oauth2/redirect",
    element: (
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '20px' }}>Đang xử lý đăng nhập...</div>}>
        <OAuth2RedirectHandler />
      </Suspense>
    ),
  },

  // === CÁC ROUTE CHÍNH ===
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
      // user area (cần đăng nhập)
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

      // login là public
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

  // admin routes (giữ nguyên file adminRoutes.jsx của bạn)
  ...adminRoutes,
];

export default routes;