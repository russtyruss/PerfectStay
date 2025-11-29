import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Edit2,
  KeyRound
} from "lucide-react";
import api from "../../../api/axios";
import ProfilePoints from "./ProfilePoints";

export default function Profile() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    pointsBalance: 0,
  });

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (storedUser) {
      const data = {
        fullName: storedUser.fullName || "",
        phoneNumber: storedUser.phoneNumber || "",
        email: storedUser.email || "",
      };

      setProfile(data);
      setOriginalProfile(data);  // save original copy
    }
    // eslint-disable-next-line
  }, []);


  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put(`/users/update/${storedUser.id}`, {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
      });

      // Merge server returned fields with stored user (preserve any client-only fields)
      const updatedUser = { ...storedUser, ...res.data };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      // Update local profile with returned fields (including pointsBalance if backend includes it)
      setProfile((prev) => ({ ...prev, ...res.data }));

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }

    setLoading(false);
  };

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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl mb-4 shadow-2xl">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Profile</span>
          </h1>
          <p className="text-xl text-gray-600">Manage your account information</p>
        </div>

        {/* MAIN PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200">

          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-12 relative">
            <div className="relative flex flex-col md:flex-row items-center justify-between">

              <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4 md:mb-0">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <div className="md:ml-6 text-white text-center md:text-left">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold mb-2">{profile.fullName}</h2>

                  </div>

                  <p className="text-blue-100 text-lg flex items-center justify-center md:justify-start mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.email}
                  </p>
                </div>
              </div>

              {!editing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-white text-green-600 px-6 py-3 rounded-xl flex items-center shadow-lg hover:bg-green-50 transition-all font-semibold"
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </button>

                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center shadow-lg hover:bg-blue-50 transition-all font-semibold"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PROFILE FORM */}
          <form onSubmit={handleSubmit} className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FULL NAME — full width */}
              <div className="md:col-span-2">
                <label className="block font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-4 border rounded-xl bg-gray-50"
                />
              </div>

              {/* PHONE LEFT, EMAIL RIGHT */}
              <div>
                <label className="block font-bold mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-4 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-4 border rounded-xl bg-gray-100"
                />
              </div>

            </div>

            {editing && (
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setProfile(originalProfile);  // restore original
                    setEditing(false);
                  }}
                  className="flex-1 border-2 border-gray-300 p-4 rounded-xl"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-xl shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>

        </div>

        {/* Points banner */}
        <ProfilePoints/>
        {/* --- PASSWORD MODAL --- */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>

              <label className="block mb-3 font-medium">Current Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-xl mb-4"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />

              <label className="block mb-3 font-medium">New Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-xl mb-6"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 border p-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-xl"
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
