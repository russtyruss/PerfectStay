import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AddHotelModal from "../AddHotelModal";
import api from "../../../api/axios";
import styles from './HostDashboard.module.css'


const HostDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('my-hotels');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);

  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRooms: 0,
  });

  const [user] = useState(() =>
    JSON.parse(sessionStorage.getItem("user"))
  );

  // ✅ SECURITY CHECK
  useEffect(() => {
    if (!user || user.userType !== "HOTEL_OWNER") {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ FETCH OWNER HOTELS
  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    api.get(`/hotels/all-hotels/${user.id}`)
      .then((res) => {
        setHotels(res.data);
        setLoading(false);

        // ✅ AUTO DASHBOARD STATS
        const totalRooms = res.data.reduce(
          (sum, h) => sum + (h.rooms?.length || 0), 0
        );

        setStats({
          totalHotels: res.data.length,
          totalRooms,
        });

      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load owner hotels");
        setLoading(false);
      });

  }, [user?.id]);

  // ✅ REFETCH AFTER ADD
  const refetchHotels = () => {
    api.get(`/hotels/all-hotels/${user.id}`)
      .then(res => setHotels(res.data))
      .catch(err => console.error(err));
  };


  return (
    <>

      <div className={styles["host-dashboard-container"]}>

        {/* HEADER */}
        <header className={styles["dashboard-header"]}>
          <div className={styles["header-left"]}>
            <h1>Welcome, {user?.fullName}</h1>
            <p>Manage your hotel listings and bookings</p>
          </div>

          <div className={styles["header-actions"]}>

          </div>
        </header>

        {/* STATS */}
        <div className={styles["stats-section"]}>
          <div className={styles["stat-card"]}>
            <span>Total Hotels</span>
            <h2>{stats.totalHotels}</h2>
          </div>

          <div className={styles["stat-card"]}>
            <span>Total Rooms</span>
            <h2>{stats.totalRooms}</h2>
          </div>
        </div>

        {/* TABS */}
        <div className={styles["tabs-section"]}>
          <button
            className={`${styles["tab-btn"]} ${
              activeTab === "my-hotels" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("my-hotels")}
          >
            My Hotels
          </button>

            <button
              className={styles["btn-primary-dashboard"]}
              onClick={() => setShowAddHotelModal(true)}
            >
              + Add Hotel
            </button>
        </div>

        {/* CONTENT */}
        <div className={styles["content-section"]}>
          {loading ? (
            <p className="text-center">Loading hotels...</p>
          ) : hotels.length === 0 ? (
            <div className={styles["empty-state"]}>
              <h3>No hotels listed yet</h3>
              <button
                className={styles["btn-primary-dashboard"]}
                onClick={() => setShowAddHotelModal(true)}
              >
                Add Your First Hotel
              </button>
            </div>
          ) : (
            <div className={styles["hotels-grid"]}>
              {hotels.map((hotel) => (
                <div key={hotel.id} className={styles["hotel-card"]}>

                  <img
                    src={hotel.imageUrl || "https://via.placeholder.com/400"}
                    alt={hotel.name}
                  />

                  <div className={styles["hotel-info"]}>
                    <h3>{hotel.name}</h3>
                    <p>
                      {hotel.city}, {hotel.address}
                    </p>

                    <p className={styles.price}>
                      ₱{hotel.rooms?.[0]?.pricePerNight ?? "N/A"} / night
                    </p>

                    <p className={`${styles.status} ${styles[hotel.status?.toLowerCase()]}`}>
                      {hotel.status}
                    </p>

                    <div className={styles["hotel-actions"]}>
                      <button
                        onClick={() => navigate(`/owner/hotel/${hotel.id}`)}
                        className={styles["btn-edit"]}
                      >
                        View
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ ADD HOTEL MODAL */}
      {showAddHotelModal && (
        <AddHotelModal
          ownerId={user.id}
          onClose={() => setShowAddHotelModal(false)}
          onAdded={() => {
            setShowAddHotelModal(false);
            refetchHotels();
          }}
        />
      )}
    </>
  );

};

export default HostDashboard;
