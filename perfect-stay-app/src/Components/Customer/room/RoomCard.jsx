import React from 'react';
import '../../PerfectStayHome.css';
import styles from './css/RoomCard.module.css';

const RoomCard = ({ id, name, location, image, onClick, className }) => {

    return (
    <div
      onClick={onClick}
      className={`${styles.card} ${className || ""}`}
    >
      {/* Room Image */}
      <img
        src={image || "https://via.placeholder.com/600x400?text=No+Image"}
        alt={name}
        className={styles.image}
      />

      {/* Room Info */}
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
      </div>
    </div>
  );

};

export default RoomCard;
