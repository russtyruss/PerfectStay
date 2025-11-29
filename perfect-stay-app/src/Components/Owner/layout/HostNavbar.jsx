import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from './css/HostNavBar.module.css';

const HostNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();      // or removeItem("user")
    window.location.href = "/login";
    navigate("/login", { replace: true });  // prevent back nav
  };
  
  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <header className={styles.header}>
        <div className={styles.navContainer}>
          {/* LOGO */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoBlue}>Perfect</span>
            <span className={styles.logoBlack}>Stay</span>
          </Link>

          {/* NAV + LOGOUT */}
          <nav className={styles.nav}>
            {/* HOME → Owner Dashboard */}
            <Link to="/owner/owner-dashboard" className={styles.navLink}>
              Home
            </Link>

            {/* PROFILE → Customer Profile Route */}
            <Link to="/owner/profile" className={styles.navLink}>
              Profile
            </Link>

            {/* LOGOUT */}
          <button
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              Log out
            </button>

          </nav>

        </div>
      </header>

      {/* ✅ OUTLET FOR DASHBOARD PAGES */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default HostNavBar;
