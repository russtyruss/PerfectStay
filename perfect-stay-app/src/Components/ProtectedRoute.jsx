// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {

  const user = sessionStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/login" replace />;

}
