import React from "react";
import { useState } from "react";
import { Calendar, User } from "lucide-react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from './css/BookingSidebar.module.css';


export default function BookingSidebar({ selectedRoom, guestCount, handleGuestChange}){
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const customerId = user?.id; 

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const getNextDay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};



  const checkAvailability = async () => {
  const roomIdToSend = selectedRoom?.id;

  console.log("Room ID sent →", roomIdToSend);


    if (!checkInDate || !checkOutDate) {
      alert("Please select a check-in and check-out date.");
      return;
    }

    try {
      const response = await api.get("/bookings/check-availability", {
        params: {
          roomId: roomIdToSend,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      });

      const isAvailable = response.data;

      if (!isAvailable) {
        alert("Room not available");
        return;
      }

      // NEW CONFIRMATION PROMPT
      const proceed = window.confirm(
        "Room is available! Do you want to continue to checkout summary?"
      );

      if (!proceed) {
        return; // user clicked NO
      }

    const nights =
      Math.ceil(
        (new Date(checkOutDate) - new Date(checkInDate)) /
        (1000 * 60 * 60 * 24)
      );

    const totalPrice = nights * selectedRoom.pricePerNight;

    sessionStorage.setItem(
      "checkoutBooking",
      JSON.stringify({
        room: {
          id: selectedRoom.id,
          roomType: selectedRoom.roomType,
          pricePerNight: selectedRoom.pricePerNight,
          capacity: selectedRoom.capacity,
          images: selectedRoom.images
        },
        //only dates, customerId, roomId and total price gets stored in database in checkout page
        booking: {
          customerId: customerId,  // ⬅ ADD THIS
          roomId: selectedRoom.id, 
          checkInDate,
          checkOutDate,
          nights,
          guestCount,
          totalPrice
        }
      })
    );

  navigate("/home/checkout-summary");

    } catch (err) {
      console.error("ERROR:", err);
      console.error("RESPONSE:", err.response?.status, err.response?.data);
      alert("Something went wrong. Try again.");
    }
  };




  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Reserve Room</h2>

      <h3 className={styles.sectionTitle}>Lodging Period</h3>

      {/* Check-in */}
      <div className={styles.inputWrapper}>
        <Calendar className={styles.inputIcon} size={18} />
        <input
          type="date"
          value={checkInDate}
          min={today}
          onChange={(e) => {
            setCheckInDate(e.target.value);
            if (checkOutDate && checkOutDate <= e.target.value) {
              const nextDay = new Date(e.target.value);
              nextDay.setDate(nextDay.getDate() + 1);
              setCheckOutDate(nextDay.toISOString().split("T")[0]);
            }
          }}
          className={styles.input}
        />
      </div>

      {/* Check-out */}
      <div className={styles.inputWrapper}>
        <Calendar className={styles.inputIcon} size={18} />
        <input
          type="date"
          value={checkOutDate}
          min={checkInDate ? getNextDay(checkInDate) : tomorrow}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className={styles.input}
        />
      </div>

      {/* Guests */}
      <div className={styles.guestSection}>
        <h3 className={styles.sectionTitle}>Guests</h3>
        <div className={styles.inputWrapper}>
          <User className={styles.inputIcon} size={18} />
          <input
            type="number"
            min="1"
            max={selectedRoom?.capacity || 1}
            value={guestCount}
            onChange={handleGuestChange}
            className={styles.input}
          />
        </div>
      </div>

      <button onClick={checkAvailability} className={styles.checkBtn}>
        CHECK AVAILABILITY
      </button>
    </aside>
  );
}
