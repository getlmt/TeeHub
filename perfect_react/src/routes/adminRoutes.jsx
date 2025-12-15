
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../components/admin/AdminLayout"; 

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminCategory = lazy(() => import("../pages/admin/Category"));
const AdminContacts = lazy(() => import("../pages/admin/Contacts"));
const AdminChat = lazy(() => import("../pages/admin/Chat"));
export default [
  {
    path: "/admin",
    element: (
      <PrivateRoute roles={["ROLE_ADMIN"]}>
        <Suspense fallback="...">
          <AdminLayout />   {}
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback="..."><AdminDashboard /></Suspense> },
      { path: "dashboard", element: <Suspense fallback="..."><AdminDashboard /></Suspense> },
      { path: "orders", element: <Suspense fallback="..."><AdminOrders /></Suspense> },
      { path: "products", element: <Suspense fallback="..."><AdminProducts /></Suspense> },
      { path: "users", element: <Suspense fallback="..."><AdminUsers /></Suspense> },
      { path: "category", element: <Suspense fallback="..."><AdminCategory /></Suspense> },
      { path: "contacts", element: <Suspense fallback="..."><AdminContacts /></Suspense> },
      { path: "chat", element: <Suspense fallback="..."><AdminChat /></Suspense> },
    ],
  },
];
