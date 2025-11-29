import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import AccountDropdown from "./AccountDropdown";
import styles from './css/Home.module.css'

export default function Home() {

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };


return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.navContainer}>

          {/* Logo */}
          <div className={styles.logo}>
            <span className={styles.logoBlue}>Perfect</span>
            <span className={styles.logoBlack}>Stay</span>
          </div>

          {/* Nav Links */}
          <nav className={styles.nav}>
            <Link 
              to="customer-dashboard" 
              className={styles.navLink}
            >
              Home
            </Link>

            <div className={styles.navLink}>
              <AccountDropdown />
            </div>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Log out
          </button>
        </div>
      </header>

      {/* Routed Pages */}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
