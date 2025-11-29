import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchHotelCard from "./SearchHotelCard";
import styles from "./css/HotelHorizontalScroll.module.css"

export default function HotelHorizontalScroll({ hotels = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.wrapper}>

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        className={`${styles.arrow} ${styles.left}`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* ALL CARDS IN ONE SCROLL ROW */}
      <div
        ref={scrollRef}
        className={styles.scrollRow}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {hotels.map((hotel) => (
          <div
            key={hotel.id || hotel.hotelId}
            className={styles.cardWrapper}
          >
            <SearchHotelCard hotel={hotel} />
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        className={`${styles.arrow} ${styles.right}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
