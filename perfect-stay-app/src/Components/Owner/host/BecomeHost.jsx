import React, { useState } from 'react';
import styles from './BecomeHost.module.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

const BecomeHost = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessRegistrationNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';

    if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';

    if (!formData.businessRegistrationNumber.trim()) {
      newErrors.businessRegistrationNumber = 'Business Registration Number is required';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

  try {
    await api.post('/users/register-hotel-owner', {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      businessName: formData.businessName,
      businessRegistrationNumber: formData.businessRegistrationNumber,
    });

    setSubmitted(true);

    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      businessName: '',
      businessRegistrationNumber: '',
      password: '',
      confirmPassword: '',
    });

    setTimeout(() => setSubmitted(false), 3000);
  } catch (error) {
    if (error.response?.status === 409) {
      setServerError('Email already taken');
    } else {
      setServerError('Something went wrong. Please try again.');
    }
  }

  };

  return (
    <div className={styles.container}>

      {/* ✅ Back Button on Left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles.backBtn}
      >
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.formWrapper}>

          <h1 className={styles.title}>Become a Host</h1>
          <p className={styles.subtitle}>
            Join thousands of hosts and start earning with your property
          </p>

          {submitted && <div className={styles.success}>✓ Registration successful!</div>}
          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <form onSubmit={handleSubmit}>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Business Name</label>
                <input name="businessName" value={formData.businessName} onChange={handleChange} />
                {errors.businessName && <span className={styles.error}>{errors.businessName}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Business Registration No.</label>
                <input
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                />
                {errors.businessRegistrationNumber && (
                  <span className={styles.error}>{errors.businessRegistrationNumber}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create Host Account
            </button>
          </form>

          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
