import React, { useState } from 'react';
import { Search } from 'lucide-react';
import styles from "./css/RoomSearch.module.css";


export default function RoomSearch({ onSearch }) {
  const [city, setCity] = useState("");
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSearch = () => {
    setError("");

    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    if (onSearch) {
      onSearch({ city });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>

        {/* City Search */}
        <div className={styles.cityWrapper}>
          <label className={styles.label}>City</label>

          <div className={styles.inputWrapper}>
            <Search className={styles.icon} />

            <input
              type="text"
              placeholder="Search City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className={styles.buttonWrapper}>
          <label className={styles.hiddenLabel}>Search</label>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}
