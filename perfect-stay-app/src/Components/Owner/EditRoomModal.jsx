import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CSS/EditRoomModal.module.css";
import api from "../../api/axios";

export default function EditRoomModal({ roomId, onClose, onUpdated }) {
  const [room, setRoom] = useState({
    roomType: "",
    description: "",
    capacity: 1,
    quantity: 1,
    pricePerNight: 0,
    isAvailable: true,
    imageUrl: ""   // ✅ NEW FIELD
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then(res => {
        const data = res.data;

          // Normalize images: could be ["url"] or [{imageUrl:"url"}]
        const firstImage = (data.images && data.images.length > 0)
          ? (typeof data.images[0] === "string" ? data.images[0] : data.images[0].imageUrl || "")
          : "";

        setRoom({
          ...data,
          imageUrl: firstImage
        });

        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load room");
        onClose();
      });
      //eslint-disable-next-line
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRoom(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const user = JSON.parse(sessionStorage.getItem("user"));


  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    roomType: room.roomType,
    description: room.description,
    capacity: Number(room.capacity),
    quantity: Number(room.quantity),
    pricePerNight: Number(room.pricePerNight),
    isAvailable: room.isAvailable,
    // <<< send array of strings to match RoomDTO.getImages()
    images: room.imageUrl ? [room.imageUrl] : []
  };

  try {
    await api.put(
      `/rooms/rooms-edit/${roomId}/${user.id}`,
      payload
    );

    alert("Room updated successfully");
    onUpdated();
    onClose();
  } catch (err) {
    console.error("❌ BACKEND ERROR:", err.response?.data || err.message);
    alert("Failed to update room");
  }
  };


  if (loading) return null;

  return createPortal(
    <div className={styles.overlay}>

      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={styles.title}>Edit Room</h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* ✅ IMAGE PREVIEW */}
          {room.imageUrl && (
            <img
              src={room.imageUrl}
              alt="Room"
              className={styles.preview}
            />
          )}

          <input
            name="imageUrl"
            value={room.imageUrl}
            onChange={handleChange}
            placeholder="Room Image URL"
            className={styles.input}
          />

          <input
            name="roomType"
            value={room.roomType}
            onChange={handleChange}
            placeholder="Room Type"
            className={styles.input}
            required
          />

          <textarea
            name="description"
            value={room.description}
            onChange={handleChange}
            placeholder="Description"
            className={styles.textarea}
          />

          <input
            type="number"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            className={styles.input}
            min="1"
          />

          <input
            type="number"
            name="quantity"
            value={room.quantity}
            onChange={handleChange}
            className={styles.input}
            min="1"
          />

          <input
            type="number"
            name="pricePerNight"
            value={room.pricePerNight}
            onChange={handleChange}
            className={styles.input}
            min="0"
          />

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="isAvailable"
              checked={room.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );

}
