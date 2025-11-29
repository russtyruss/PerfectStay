import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/SearchHotelCard.module.css"

export default function SearchHotelCard({ hotel }) {
  if (!hotel) return null;

  return (
    <Link
      to={`/home/room/${hotel.id || hotel.hotelId}`}
      className={styles.card}
    >
      <img
        src={
          hotel.images?.[0] ||
          hotel.cheapestRoomImage ||
          "https://via.placeholder.com/600x400?text=No+Image"
        }
        alt={hotel.name}
        className={styles.image}
      />

      <div className={styles.content}>
        <h4 className={styles.title}>{hotel.name}</h4>

        <p className={styles.location}>
          {hotel.city || hotel.location}
        </p>

        <span className={styles.price}>
          {hotel.lowestPrice
            ? `₱${hotel.lowestPrice.toLocaleString()} / night`
            : "Price unavailable"}
        </span>
      </div>
    </Link>
  );
}
