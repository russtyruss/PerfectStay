import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomCard from "./RoomCard";
import api from "../../../api/axios";
import BookingSidebar from "./BookingSidebar";
import styles from './css/Room.module.css';


export default function Room() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestCount, setGuestCount] = useState(1);


  // Fetch hotel + room details from backend
  useEffect(() => {
    api
      .get(`/hotels/${id}/details`)
      .then((res) => {
        setHotel(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Hotel not found");
        setLoading(false);
      });
  }, [id]);

  // Handle guest count change
     // Auto-select first room once hotel loads
  useEffect(() => {
    if (hotel?.rooms?.length > 0) {
      setSelectedRoom(hotel.rooms[0]);
    }
  }, [hotel]);

  useEffect(() => {
    if (selectedRoom) {
      setGuestCount(1); 
    }
  }, [selectedRoom]);

// Handle guest count change
  const handleGuestChange = (e) => {
  let value = Number(e.target.value);

  const min = 1;
  const max = selectedRoom?.capacity || 1;

  if (value < min) value = min;
  if (value > max) value = max;

  setGuestCount(value);
  };


  if (loading) return <p className={styles.loading}>Loading room...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const renderRoomCards = () => {
  return hotel.rooms.map((room) => (
    <RoomCard
      key={room.id}
      id={room.id}
      name={room.roomType}
      image={room.images?.[0]} 
      onClick={() => setSelectedRoom(room)}
      className={`${styles.roomBtn} ${
          selectedRoom?.roomId === room.roomId ? styles.roomBtnActive : ""
        }`}
    />
  ));
};

  return (
    <div className={styles.page}>
      <main className={styles.container}>

        {/* Breadcrumb + Title */}
        <div className={styles.breadcrumbWrapper}>
          <nav className={styles.breadcrumb}>
            Home / <span className={styles.breadcrumbActive}>Hotel Details</span>
          </nav>

          <h1 className={styles.title}>{hotel.name}</h1>
          <p className={styles.address}>{hotel.address}</p>
        </div>

        {/* Hero Image + Price */}
        <section className={styles.heroSection}>
          <div className={styles.heroImageWrapper}>
            <img
              src={selectedRoom?.images?.[0] || hotel.imageUrl}
              alt={selectedRoom?.roomType}
              className={styles.heroImage}
            />

            <div className={styles.priceBadge}>
              ₱{selectedRoom?.pricePerNight} / night
            </div>
          </div>

          {/* Booking Sidebar */}
          <BookingSidebar
            selectedRoom={selectedRoom}
            guestCount={guestCount}
            handleGuestChange={handleGuestChange}
          />
        </section>

        {/* About */}
        <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>About the place</h2>
          <p className={styles.description}>
            {hotel.description || "No description available."}
          </p>
        </section>

        {/* Rooms List */}
        <h2 className={styles.sectionTitle}>Browse All Rooms</h2>
        <div className={styles.roomsGrid}>
          {renderRoomCards()}
        </div>

      </main>
    </div>
  );
}
