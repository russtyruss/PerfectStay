import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from './CSS/OwnerRoomBookings.module.css';
import api from "../../api/axios";

export default function OwnerRoomBookings() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/room/${roomId}`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load bookings");
        setLoading(false);
      });
  }, [roomId]);

  // ✅ Calculate number of nights
  const calculateNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate - inDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) return <p className={styles.loading}>Loading bookings...</p>;

  return (
    <div className={styles.page}>

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Back
      </button>

      <h2 className={styles.title}>Room Bookings</h2>

      {bookings.length === 0 ? (
        <p className={styles.empty}>No bookings yet.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Confirmation Code</th>
                <th>Guest Name</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>

                  <td className={styles.code}>
                    {b.confirmationCode}
                  </td>

                  <td>
                    {b.customer?.fullName || "N/A"}
                  </td>

                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>

                  <td className={styles.nights}>
                    {calculateNights(b.checkInDate, b.checkOutDate)}
                  </td>

                  <td className={styles.price}>
                    ₱{b.totalPrice}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        b.bookingStatus === "CONFIRMED"
                          ? styles.confirmed
                          : b.bookingStatus === "CANCELLED"
                          ? styles.cancelled
                          : styles.pending
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
