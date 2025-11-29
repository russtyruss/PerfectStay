import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditHotelModal from "./EditHotelModal";
import EditRoomModal from "./EditRoomModal";
import AddRoomModal from "./AddRoomModal";
import styles from './CSS/OwnerHotelDetails.module.css';
import api from "../../api/axios";

export default function OwnerHotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoomEditModal, setShowRoomEditModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  useEffect(() => {
    if (!user || user.userType !== "HOTEL_OWNER") {
      navigate("/");
      return;
    }

    api.get(`/hotels/all-hotels/${user.id}`)
      .then(res => {
        const foundHotel = res.data.find(h => h.id === Number(id));
        setHotel(foundHotel);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load hotel details");
        setLoading(false);
      });

  }, [id, user, navigate]);

  const handleDeleteHotel = async () => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await api.delete(`/hotels/delete-hotel/${hotel.id}`);
      alert("Hotel deleted successfully");
      navigate(-1);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data); // Shows backend message
      } else {
        alert("Failed to delete hotel");
      }
      console.error(err);
    }
  };

  const refetchHotel = () => {
  api.get(`/hotels/all-hotels/${user.id}`)
    .then(res => {
      const foundHotel = res.data.find(h => h.id === Number(id));
      setHotel(foundHotel);
    })
    .catch(err => console.error(err));
};




  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      await api.delete(`/rooms/delete-room/${roomId}`);

      setHotel(prev => ({
        ...prev,
        rooms: prev.rooms.filter(r => r.id !== roomId)
      }));

      alert("Room deleted");
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data); // backend message
      } else {
        alert("Failed to delete room");
      }
      console.error(err);
    }
  };

    

if (loading) return <p className={styles.page}>Loading...</p>;
  if (!hotel) return <p className={styles.page}>Hotel not found</p>;

  return (
    <div className={styles.page}>

      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div className={styles.card}>
        <img
          src={hotel.imageUrl || "https://via.placeholder.com/600x300"}
          className={styles.hotelImage}
          alt="Hotel"
        />

        <h1 className={styles.title}>{hotel.name}</h1>
        <p className={styles.subText}>{hotel.city}, {hotel.address}</p>
        <p className={styles.description}>{hotel.description}</p>

        <div className={styles.actions}>
          <button onClick={() => setShowEditModal(true)} className={styles.primaryBtn}>
            Edit Hotel
          </button>
          <button onClick={handleDeleteHotel} className={styles.dangerBtn}>
            Delete Hotel
          </button>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Rooms</h2>
        <button onClick={() => setShowAddRoomModal(true)} className={styles.addBtn}>
          + Add Room
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Room Type</th>
              <th>Description</th>
              <th>Cap</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th className="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {hotel.rooms.map(room => {
              const img = room.images?.[0]
                ? typeof room.images[0] === "string"
                  ? room.images[0]
                  : room.images[0].imageUrl
                : "https://via.placeholder.com/80";

              return (
                <tr key={room.id}>
                  <td><img src={img} className={styles.roomImg} alt="Room"/></td>
                  <td><b>{room.roomType}</b></td>
                  <td>{room.description}</td>
                  <td>{room.capacity}</td>
                  <td>{room.quantity}</td>
                  <td>₱{room.pricePerNight}</td>
                  <td>
                    <span className={`${styles.status} ${room.isAvailable ? styles.available : styles.unavailable}`}>
                      {room.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        onClick={() => navigate(`/owner/room-bookings/${room.id}`)}
                        className={styles.smallGreen}
                      >
                        Bookings
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          setShowRoomEditModal(true);
                        }}
                        className={styles.smallBlue}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className={styles.smallRed}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showEditModal &&
        <EditHotelModal
          hotelId={hotel.id}
          ownerId={user.id}
          onClose={() => setShowEditModal(false)}
          onUpdated={refetchHotel}
        />
      }

      {showRoomEditModal &&
        <EditRoomModal
          roomId={selectedRoomId}
          onClose={() => setShowRoomEditModal(false)}
          onUpdated={refetchHotel}
        />
      }

      {showAddRoomModal &&
        <AddRoomModal
          hotelId={hotel.id}
          onClose={() => setShowAddRoomModal(false)}
          onAdded={refetchHotel}
        />
      }

    </div>
  );
}
