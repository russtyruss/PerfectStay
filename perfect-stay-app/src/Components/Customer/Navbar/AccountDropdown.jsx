import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './css/AccountDropdown.module.css'

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      {/* Click instead of hover */}
      <span
        onClick={() => setOpen(!open)}
        className={styles.trigger}
      >
        Account ▾
      </span>

      {open && (
        <div className={styles.menu}>
          <Link to="bookings" className={styles.link}>
            My Bookings
          </Link>
          <Link to="profile" className={styles.link}>
            Profile
          </Link>
        </div>
      )}
    </div>
  );
}
