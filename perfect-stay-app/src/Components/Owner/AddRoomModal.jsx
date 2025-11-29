import { createPortal } from "react-dom";
import { useState } from "react";
import styles from "./CSS/AddRoomModal.module.css";
import api from "../../api/axios";

export default function AddRoomModal({ hotelId, onClose, onAdded }) {
  const [form, setForm] = useState({
    roomType: "",
    description: "",
    capacity: "",
    quantity: "",
    pricePerNight: "",
    isAvailable: true,
    images: [""]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      quantity: Number(form.quantity),
      pricePerNight: Number(form.pricePerNight),
      isAvailable: Boolean(form.isAvailable),
      hotelId
    };

    try {
      await api.post("/rooms/addRoom", payload);
      alert("Room added successfully!");
      onAdded();   // ✅ refresh parent
      onClose();   // ✅ close modal
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    }
  };

return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2 className={styles.title}>Add Room</h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          <input
            name="roomType"
            placeholder="Room Type"
            value={form.roomType}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={styles.textarea}
            required
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            name="pricePerNight"
            type="number"
            placeholder="Price Per Night"
            value={form.pricePerNight}
            onChange={handleChange}
            className={styles.input}
            required
          />

          {/* IMAGES */}
          <div className={styles.imageSection}>
            <p className={styles.imageLabel}>Room Images (URLs)</p>

            {form.images.map((img, index) => (
              <input
                key={index}
                value={img}
                onChange={(e) =>
                  handleImageChange(index, e.target.value)
                }
                placeholder="Image URL"
                className={styles.input}
              />
            ))}

          </div>

          {/* ACTIONS */}
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
              Save Room
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}
