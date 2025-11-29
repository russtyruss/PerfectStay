import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CSS/Register.module.css'
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userType: 'CUSTOMER'  // important for backend
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/users/register', formData);
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data || 'Registration failed');
    }
  };

  return (
  <div className={styles.container}>
    
    {/* Back Button */}
    <button className={styles.backBtn} onClick={() => navigate('/')}>
      ← Back
    </button>

    <div className={styles.content}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Register to continue</p>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.group}>
            <label>Full Name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Register
          </button>

          <p className={styles.linkText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </div>
    </div>
  </div>
);

}
