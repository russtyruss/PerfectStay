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
    userType: 'CUSTOMER'
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Allow only numbers in phone input
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "phoneNumber" && !/^\d*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone Number must be at least 10 digits";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/users/register', formData);
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      setServerError(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Register to continue</p>

          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.group}>
              <label>Full Name</label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
            </div>

            <div className={styles.group}>
              <label>Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.group}>
              <label>Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
            </div>

            <div className={styles.group}>
              <label>Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
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
