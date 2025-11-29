import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import React from "react";
import styles from "../css/HotelLocation.module.css";

export default function HotelLocation({ room }) {
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    if (!room?.id) return;

    const fetchHotel = async () => {
      try {
        const hotelId = room.hotelId || room.hotel?.id;
        if (!hotelId) return;

        const response = await api.get(`/hotels/${room.hotelId}/details`);
        setHotel(response.data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      }
    };

    fetchHotel();
  }, [room]);

  if (!hotel) return null; // prevent crashing

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <MapPin className={styles.icon} />
        <h3 className={styles.title}>{hotel.name}</h3>
      </div>

      <p className={styles.subtitle}></p>

      <p className={styles.address}>
        {hotel.address} <br />
        {hotel.city}
      </p>
    </div>
  );
}