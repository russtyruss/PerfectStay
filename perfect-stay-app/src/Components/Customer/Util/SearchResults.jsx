import React from "react";
import HotelHorizontalScroll from "./HotelHorizontalScroll";
import styles from "./css/SearchResults.module.css";

const SearchResults = ({ results = [], hasSearched }) => {
  if (!hasSearched) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Search
        <span className={styles.gradient}>
          {" "}results
        </span>
      </h2>

      {results.length === 0 ? (
        <p className={styles.empty}>No hotels found for that city.</p>
      ) : (
        <HotelHorizontalScroll hotels={results} />
      )}
    </section>
  );
};



export default SearchResults;
