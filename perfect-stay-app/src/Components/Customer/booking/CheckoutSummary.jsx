import React, { useEffect, useState } from "react";
import {
  Calendar,
  Home,
  Users,
  DollarSign,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./css/CheckoutSummary.module.css";

export default function CheckoutSummary() {
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);

  const navigate = useNavigate();
  //BOOKING DATA JSON
  useEffect(() => {
    const saved = sessionStorage.getItem("checkoutBooking");

    if (!saved) {
      console.warn("No checkout booking found. Redirecting...");
      navigate("/home");
      return;
    }

    try {
      const data = JSON.parse(saved);

      if (
        !data.room ||
        !data.room.roomType ||
        !data.booking ||
        !data.booking.checkInDate ||
        !data.booking.checkOutDate
      ) {
        console.warn("Invalid booking structure. Redirecting...");
        navigate("/home");
        return;
      }
      console.log("✅ Loaded checkout booking:", data);

      setRoom(data.room);
      setBooking(data.booking);
    } catch (err) {
      console.error("Failed to parse checkoutBooking:", err);
      navigate("/home");
    }
  }, [navigate]);

  //DATE
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  //cancel button
  const handleCancel = () => {
    sessionStorage.removeItem("checkoutBooking");
    sessionStorage.removeItem("confirmedBooking");
    navigate("/home/customer-dashboard");
  };

  const handleBack = () => {
    sessionStorage.removeItem("checkoutBooking");
    sessionStorage.removeItem("confirmedBooking");
    navigate(-1)
  }




  // loading screen
  if (!booking || !room) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              borderBottom: "2px solid #2563eb",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p className={styles.subtitle}>Loading checkout details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Back Button */}
        <button onClick={handleBack} className={styles.backBtn}>
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Checkout{" "}
            <span className={styles.gradientText}>Summary</span>
          </h1>
          <p className={styles.subtitle}>
            Review your details before completing your booking
          </p>
        </div>

        <div className={styles.grid}>

          {/* LEFT SIDE */}
          <div className={styles.leftColumn}>

            {/* Status Card */}
            <div className={`${styles.card} ${styles.statusCard}`}>
              <p className={styles.statusLabel}>Payment Status</p>
              <div className={styles.statusBadge}>
                <Clock size={16} />
                Pending Payment
              </div>
            </div>

            {/* Room Info */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                  <Home size={28} color="white" />
                </div>
                <div className={styles.headerText}>
                  <h2 className={styles.cardTitle}>Room Details</h2>
                  <p className={styles.cardSubtitle}>Your selected room</p>
                </div>
              </div>

              <div className={styles.roomBox}>
                <div className={`${styles.row} ${styles.roomRow}`}>
                  <span className={styles.label}>Room Type</span>
                  <span className={styles.value}>{room.roomType}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Price per Night</span>
                  <span className={`${styles.value} ${styles.price}`}>
                    ₱{room.pricePerNight}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.iconGreen}`}>
                  <Calendar size={28} color="white" />
                </div>
                <div className={styles.headerText}>
                  <h2 className={styles.cardTitle}>Stay Dates</h2>
                  <p className={styles.cardSubtitle}>Check-in & check-out</p>
                </div>
              </div>

              <div className={styles.dateColumn}>
                <div className={`${styles.dateBox} ${styles.checkIn}`}>
                  <p className={styles.dateLabel}>Check-in</p>
                  <p className={styles.dateValue}>
                    {formatDate(booking.checkInDate)}
                  </p>
                </div>

                <div className={`${styles.dateBox} ${styles.checkOut}`}>
                  <p className={styles.dateLabel}>Check-out</p>
                  <p className={styles.dateValue}>
                    {formatDate(booking.checkOutDate)}
                  </p>
                </div>

                <div className={`${styles.dateBox} ${styles.nights}`}>
                  <p className={styles.dateLabel}>Total Nights</p>
                  <p className={styles.dateValue}>{booking.nights}</p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.iconPink}`}>
                  <Users size={28} color="white" />
                </div>
                <div className={styles.headerText}>
                  <h2 className={styles.cardTitle}>Guest Information</h2>
                  <p className={styles.cardSubtitle}>Details for your stay</p>
                </div>
              </div>

              <div className={styles.guestRow}>
                <Users size={20} color="#ea580c" />
                <div>
                  <p className={styles.guestTextSmall}>Number of Guests</p>
                  <p className={styles.guestText}>
                    {booking.guestCount} Guests
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Payment Summary */}
          <div>
            <div className={`${styles.card} ${styles.paymentCard}`}>
              <div className={styles.paymentHeader}>
                <div className={styles.paymentIcon}>
                  <DollarSign size={24} color="white" />
                </div>
                <h3 className={styles.paymentTitle}>Payment Summary</h3>
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Room Rate</span>
                  <span className={styles.summaryValue}>
                    ₱{room.pricePerNight}/night
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Nights</span>
                  <span className={styles.summaryValue}>
                    {booking.nights}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>
                    ₱{booking.totalPrice}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Taxes & Fees</span>
                  <span className={`${styles.summaryValue} ${styles.included}`}>
                    Included
                  </span>
                </div>
              </div>

              <div className={styles.totalBox}>
                <div className={styles.row}>
                  <span className={styles.totalLabel}>Total to Pay</span>
                  <span className={styles.totalPrice}>
                    <span className={styles.currency}>₱</span>
                    {booking.totalPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/home/checkout")}
                className={styles.primaryBtn}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            <Home size={20} />
            Cancel & Return Home
          </button>
        </div>

      </div>
    </div>
  );

}
