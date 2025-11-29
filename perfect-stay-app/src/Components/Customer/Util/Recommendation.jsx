import React from 'react';
import HotelCard from './HotelCard';
import styles from './css/Recommendation.module.css';


export default function Recommendation({ hotels = [], loading, error }) {

  const safeHotels = Array.isArray(hotels) ? hotels : [];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Popular{" "}
        <span className={styles.gradient}>Hotels</span>
      </h2>

      {loading && <p className={styles.loading}>Loading hotels...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.grid}>
        {!loading && safeHotels.length === 0 && !error && (
          <p className={styles.empty}>No hotels found.</p>
        )}

        {safeHotels.slice(0, 6).map((hotel, index) => (
          <HotelCard key={hotel.hotelId || index} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}
