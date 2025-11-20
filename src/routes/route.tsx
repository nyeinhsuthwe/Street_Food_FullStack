import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutForAdmin from "../layout/LayoutForAdmin";
import LayoutForUser from "../layout/LayoutForUser";
import Home from "../pages/User/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminMenu from "../pages/Admin/AdminMenu";
import CreateCategory from "../pages/Admin/CreateCategory";
import { UserMenu } from "../pages/User/Menu";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { Order } from "../pages/Admin/Order";
import CartPage from "../pages/User/Cart";
import { PublicRoute } from "./PublicRoute";
import History from "../pages/User/History";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <LayoutForAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "menu",
        element: <AdminMenu />,
      },
      {
        path: "create-category",
        element: <CreateCategory />,
      },
      {
        path : "order",
        element : <Order/>
      }
    ],
  },

  {
    path: "/user",
    element:(
      <ProtectedRoute allowedRoles={['user']}>
        <LayoutForUser/> 
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "menu",
        element: <UserMenu />,
      },
      {
        path : "cart",
        element : <CartPage/>
      },
      {
        path : "history",
        element : <History/>
      }
    ],
  },
]);

export default route;
