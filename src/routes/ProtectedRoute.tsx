import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = Cookies.get("newToken")
  const role = localStorage.getItem("userRole");

  console.log(token)

  if (!token) {
    return <Navigate to="/login" replace />;
  }
 
  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
