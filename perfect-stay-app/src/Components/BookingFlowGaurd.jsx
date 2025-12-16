import { Navigate, Outlet } from "react-router-dom";

export default function BookingFlowGuard() {
  const hasActiveBooking =
    sessionStorage.getItem("checkoutBooking") ||   // booking session
    sessionStorage.getItem("confirmedBooking");   // optional extra flag

  if (!hasActiveBooking) {
    return <Navigate to="/home/customer-dashboard" replace />;
  }

  return <Outlet />;
}
