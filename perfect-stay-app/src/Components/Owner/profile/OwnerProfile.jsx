import React, { useState, useEffect } from "react";
import { User, Mail, Edit2, KeyRound } from "lucide-react";
import styles from './css/OwnerProfile.module.css';
import api from "../../../api/axios";

export default function OwnerProfile() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // ✅ Load from sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
      const data = {
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      };

      setProfile(data);
      setOriginalProfile(data);
    }
  }, []); // ✅ EMPTY dependency array

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put(`/users/update/${storedUser.id}`, {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
      });

      const updatedUser = { ...storedUser, ...res.data };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setProfile({ ...profile, ...res.data });

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }

    setLoading(false);
  };

  // ✅ Change password
  const handlePasswordChange = async () => {
    try {
      await api.put(`/users/change-password/${storedUser.id}`, passwordForm);

      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Invalid current password");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <User color="white" size={40} />
          </div>
          <h1 className={styles.headerTitle}>
            Owner <span className={styles.gradientText}>Profile</span>
          </h1>
          <p className={styles.headerSubtitle}>
            Manage your owner account information
          </p>
        </div>

        {/* CARD */}
        <div className={styles.card}>

          <div className={styles.banner}>
            <div className={styles.bannerLeft}>
              <div className={styles.avatarWrapper}>
                <User size={48} color="#2563eb" />
              </div>

              <div>
                <h2>{profile.fullName}</h2>
                <p className={styles.email}>
                  <Mail size={16} style={{ marginRight: 8 }} />
                  {profile.email}
                </p>
              </div>
            </div>

            {!editing && (
              <div className={styles.actions}>
                <button
                  className={styles.actionBtnGreen}
                  onClick={() => setShowPasswordModal(true)}
                  onChange={(e) => console.log("typing:", e.target.value)}
                >
                  <KeyRound size={16} /> Change Password
                </button>

                <button
                  className={styles.actionBtnBlue}
                  onClick={() => setEditing(true)}
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* FORM */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>

              <div className={styles.full}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  name="fullName"
                  value={profile.fullName}
                  disabled={!editing}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={styles.label}>Phone Number</label>
                <input
                  className={styles.input}
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  disabled={!editing}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  value={profile.email}
                  disabled
                />
              </div>

            </div>

            {editing && (
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setProfile(originalProfile);
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.saveBtn}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* PASSWORD MODAL */}
        {showPasswordModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>

              <h2 className={styles.modalTitle}>Change Password</h2>

              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                className={styles.input}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
              />

              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancel}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>

                <button
                  className={styles.modalSave}
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
