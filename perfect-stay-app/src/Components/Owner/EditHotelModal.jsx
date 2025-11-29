import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CSS/EditHotelModal.module.css";
import api from "../../api/axios";

export default function EditHotelModal({ hotelId, ownerId, onClose, onUpdated }) {
  const [hotel, setHotel] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/hotels/${hotelId}`)
      .then(res => {
        const data = res.data;

        setHotel({
          name: data.name || "",
          city: data.city || "",
          address: data.address || "",
          description: data.description || "",
          imageUrl: data.imageUrl || ""
        });

        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load hotel");
        onClose();
      });
      // eslint-disable-next-line
  }, [hotelId]);

  const handleChange = (e) => {
    setHotel(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ SUBMIT BUTTON CLICKED");

    try {
      const res = await api.put(
        `/hotels/hotel-edit/${hotelId}?ownerId=${ownerId}`,
        hotel
      );

      console.log("SENT TO BACKEND:", hotel);
      console.log("RESPONSE FROM BACKEND:", res.data);  

      alert("Hotel updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update hotel");
    }
  };

  if (loading) return null;

  return createPortal(
    <div className={styles.overlay}>

      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={styles.title}>Edit Hotel</h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          <input
            autoFocus
            name="name"
            value={hotel.name}
            onChange={handleChange}
            placeholder="Hotel Name"
            className={styles.input}
            required
          />

          <input
            name="city"
            value={hotel.city}
            onChange={handleChange}
            placeholder="City"
            className={styles.input}
            required
          />

          <input
            name="address"
            value={hotel.address}
            onChange={handleChange}
            placeholder="Address"
            className={styles.input}
            required
          />

          <textarea
            name="description"
            value={hotel.description}
            onChange={handleChange}
            placeholder="Description"
            className={styles.textarea}
          />

          <input
            name="imageUrl"
            value={hotel.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className={styles.input}
          />

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
