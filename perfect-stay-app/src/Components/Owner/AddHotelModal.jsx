import { createPortal } from "react-dom";
import { useState } from "react";
import styles from "./CSS/AddHotelModal.module.css";
import api from "../../api/axios";

export default function AddHotelModal({ ownerId, onClose, onAdded }) {

  const [hotel, setHotel] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    imageUrl: ""
  });

  const [rooms, setRooms] = useState([
    {
      roomType: "",
      description: "",
      capacity: "",
      quantity: "",
      pricePerNight: "",
      isAvailable: true,
      images: [""]
    }
  ]);

  const handleHotelChange = (e) =>
    setHotel({ ...hotel, [e.target.name]: e.target.value });

  const handleRoomChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        roomType: "",
        description: "",
        capacity: "",
        quantity: "",
        pricePerNight: "",
        isAvailable: true,
        images: [""]
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    ...hotel,
    hotelOwnerId: ownerId,
    rooms: rooms.map(r => ({
      ...r,
      capacity: Number(r.capacity),
      quantity: Number(r.quantity),
      pricePerNight: Number(r.pricePerNight),
      images: r.images   // ✅ MUST stay as array of strings
    }))
  };


    try {
      await api.post("/hotels/addHotelWithRooms", payload);
      alert("Hotel and rooms created successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to add hotel");
    }
  };

  if (!document.body) return null;

   return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2 className={styles.title}>Add Hotel & Rooms</h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* HOTEL INFO */}
          <div className={styles.gridTwo}>
            <input
              name="name"
              placeholder="Hotel Name"
              onChange={handleHotelChange}
              required
              className={styles.input}
            />
            <input
              name="city"
              placeholder="City"
              onChange={handleHotelChange}
              required
              className={styles.input}
            />
            <input
              name="address"
              placeholder="Address"
              onChange={handleHotelChange}
              required
              className={styles.input}
            />
          </div>

          <textarea
            name="description"
            placeholder="Hotel Description"
            onChange={handleHotelChange}
            className={styles.textarea}
          />

          <input
            name="imageUrl"
            placeholder="Hotel Image URL"
            onChange={handleHotelChange}
            className={styles.inputFull}
          />

          {/* ROOMS */}
          <h3 className={styles.subTitle}>Rooms</h3>

          {rooms.map((room, index) => (
            <div key={index} className={styles.roomCard}>

              <input
                placeholder="Room Type"
                onChange={e => handleRoomChange(index, "roomType", e.target.value)}
                className={styles.inputFull}
                required
              />

              <textarea
                placeholder="Description"
                onChange={e => handleRoomChange(index, "description", e.target.value)}
                className={styles.textarea}
                required
              />

              <div className={styles.gridThree}>
                <input
                  type="number"
                  placeholder="Capacity"
                  onChange={e => handleRoomChange(index, "capacity", e.target.value)}
                  className={styles.input}
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  onChange={e => handleRoomChange(index, "quantity", e.target.value)}
                  className={styles.input}
                />

                <input
                  type="number"
                  placeholder="Price"
                  onChange={e => handleRoomChange(index, "pricePerNight", e.target.value)}
                  className={styles.input}
                />

                <input
                  placeholder="Room Image URL"
                  onChange={e => handleRoomChange(index, "images", [e.target.value])}
                  className={styles.inputFull}
                />
              </div>

            </div>
          ))}

          <button
            type="button"
            onClick={addRoom}
            className={styles.addRoomBtn}
          >
            + Add another room
          </button>

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
              Save Hotel
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );

}
