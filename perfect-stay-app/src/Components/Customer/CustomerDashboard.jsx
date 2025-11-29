import Recommendation from './Util/Recommendation';
import RoomSearch from './Util/RoomSearch';
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import SearchResults from '../Customer/Util/SearchResults';
import styles from "./CSS/customer-dashboard.module.css"; 

export default function CustomerDashboard() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  //test
    useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    console.log("Session user on dashboard:", savedUser);
  }, []);



  // NEW STATES FOR SEARCH RESULTS
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Load default recommendations ONCE
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await api.get('/hotels/recommendations');
        setHotels(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  // Search override
  const handleSearch = async ({ city }) => {
    setHasSearched(true);

    try {
      const response = await api.get(`/hotels/search?keyword=${encodeURIComponent(city)}`);

      const formatted = response.data.map(hotel => {
        const cheapestRoom = hotel.rooms?.length
          ? hotel.rooms.reduce((a, b) =>
              a.pricePerNight < b.pricePerNight ? a : b
            )
          : null;

        return {
          id: hotel.id,
          name: hotel.name,
          address: hotel.address,
          images: [hotel.imageUrl],
          lowestPrice: cheapestRoom ? cheapestRoom.pricePerNight : null,
          cheapestRoomImage: cheapestRoom?.images?.[0]?.imageUrl || null,
          city: hotel.city
        };
      });

      setSearchResults(formatted);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };


  const HeroSection = () => (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>

        {/* Text */}
        <div>
          <h1 className={styles.heroTitle}>
            Forget Busy Work, <br />
            Start Next <span className={styles.heroGradient}>Vacation</span>
          </h1>

          <p className={styles.heroDescription}>
            We give you everything you need to enjoy your holiday with family.
            It's time to create another memorable moment.
          </p>
        </div>

        {/* Image */}
        <div className={styles.heroImageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            alt="Vacation room"
            className={styles.heroImage}
          />
        </div>

      </div>
    </section>
  );

  return (
    <div className={styles.dashboard}>
      {/* HERO */}
      <HeroSection />

      {/* SEARCH BAR */}
      <div className={styles.searchWrapper}>
        <RoomSearch onSearch={handleSearch} />
      </div>

      {/* SEARCH RESULTS */}
      {hasSearched && (
        <div className={styles.searchResults}>
          <SearchResults results={searchResults} hasSearched={hasSearched} />
        </div>
      )}

      {/* RECOMMENDATIONS */}
      <div className={styles.recommendations}>
        <Recommendation hotels={hotels} loading={loading} error={error} />
      </div>
    </div>
  );

}
