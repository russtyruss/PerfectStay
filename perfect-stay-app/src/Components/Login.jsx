import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CSS/Login.module.css';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Always clear any old session first
      sessionStorage.clear();

      const response = await api.post("/users/login", credentials);
      const user = response.data;

      // Save minimal clean user object
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
        })
      );

      alert("Login successful!");

      // Force redirect with replace so login page is removed from history
      if (user.userType === "CUSTOMER") {
        navigate("/home/customer-dashboard", { replace: true });
      } else if (user.userType === "HOTEL_OWNER") {
        navigate("/owner/owner-dashboard", { replace: true });
      } else {
        sessionStorage.clear();
        alert("Unknown user role");
        navigate("/login", { replace: true });
      }

    } catch (error) {
      sessionStorage.clear();

      if (error.response) {
        const message = error.response.data;

        if (message === "Account does not exist") {
          alert("Account does not exist. Please register first.");
        } 
        else if (message === "Incorrect password") {
          alert("Wrong password! Try again.");
        } 
        else {
          alert(message);
        }
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

return (
  <div className={styles.container}>

    {/* ✅ Back Button */}
    <button
      type="button"
      onClick={() => navigate('/')}
      className={styles.backBtn}
    >
      ← Back
    </button>

    <div className={styles.content}>
      <div className={styles.formWrapper}>

        <h1 className={styles.title}>Login Account</h1>
        <p className={styles.subtitle}>Welcome back to PerfectStay</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.group}>
            <label>Email</label>
            <input
              type="email"
              id="email"
              required
              onChange={handleChange}
            />
          </div>

          <div className={styles.group}>
            <label>Password</label>
            <input
              type="password"
              id="password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>

          <p className={styles.linkText}>
            Don’t have an account? <Link to="/register">Create Account</Link>
          </p>

        </form>

      </div>
    </div>
  </div>
);

}
