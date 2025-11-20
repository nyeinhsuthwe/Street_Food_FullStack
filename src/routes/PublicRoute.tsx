import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { JSX } from "react";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("newToken");

  if (token) {
  const role = localStorage.getItem("userRole");
  return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
}


  return children;
};
