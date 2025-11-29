import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function BookingSessionCleaner() {
  const location = useLocation();

  useEffect(() => {
    const protectedRoutes = [
      "/home/checkout-summary",
      "/home/checkout",
      "/home/booking-success",
      "/home/room" 
    ];

    if (!protectedRoutes.includes(location.pathname)) {
      sessionStorage.removeItem("checkoutBooking");
      sessionStorage.removeItem("confirmedBooking");
      sessionStorage.removeItem("checkoutRoom");

      console.log("✅ Booking session cleared:", location.pathname);
    }
  }, [location.pathname]);
  return null;
}
