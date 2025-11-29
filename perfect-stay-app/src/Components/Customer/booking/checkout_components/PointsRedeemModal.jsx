import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import api from "../../../../api/axios";
import styles from '../css/PointsRedeemModal.module.css'

export default function PointsRedeemModal({
    isOpen,
    onClose,
    onConfirm,
    totalPrice
}) {

    const user = JSON.parse(sessionStorage.getItem("user"));

    const [points, setPoints] = useState(null);
    const [selectedReward, setSelectedReward] = useState(null);
    const [previewPrice, setPreviewPrice] = useState(totalPrice);

    useEffect(() => {
        async function fetchPoints() {
            try {
                const response = await api.get(`/users/points/${user.id}`);
                setPoints(response.data);
            } catch (err) {
                console.error("Failed to load points", err);
            }
        }
        if (user) fetchPoints();
        // eslint-disable-next-line
    }, [isOpen]);

    if (!isOpen) return null;

    const rewards = [
        { points: 500, discount: 10 },
        { points: 700, discount: 20 },
        { points: 1000, discount: 50 }
    ];

    const handleSelect = (reward) => {
        setSelectedReward(reward);

        // compute preview
        const discountAmount = (totalPrice * reward.discount) / 100;
        const newPrice = totalPrice - discountAmount;
        setPreviewPrice(newPrice);
    };

    const handleConfirm = async () => {
        if (!selectedReward) return;

        try {
            // Deduct points in backend
            const res = await api.put(
                `/users/points/redeem/${user.id}?pointsToDeduct=${selectedReward.points}`
            );

            // update points instantly in modal
            setPoints(res.data);

            // compute FINAL discounted price
            const discountAmount =
                (totalPrice * selectedReward.discount) / 100;
            const finalPrice = totalPrice - discountAmount;

            // send back to parent
            onConfirm(finalPrice);

            onClose();
        } catch (err) {
            console.error("Redeem error:", err);
        }
    };

return createPortal(
  <div className={styles.overlay}>
    <div className={styles.modal}>

      <button className={styles.closeBtn} onClick={onClose}>
        <X size={22} />
      </button>

      <h2 className={styles.title}>Redeem Points</h2>

      <p className={styles.total}>Total: ₱{totalPrice}</p>

      <p className={styles.discounted}>Discounted: ₱{previewPrice}</p>

      <p className={styles.points}>{points} pts available</p>

      <div className={styles.rewardList}>
        {rewards.map((reward) => (
          <button
            key={reward.points}
            disabled={points < reward.points}
            onClick={() => handleSelect(reward)}
            className={`${styles.rewardBtn}
              ${
                selectedReward?.points === reward.points
                  ? styles.selected
                  : points >= reward.points
                  ? styles.available
                  : styles.disabled
              }
            `}
          >
            {reward.points} pts → {reward.discount}% OFF
          </button>
        ))}
      </div>

      <button
        disabled={!selectedReward}
        onClick={handleConfirm}
        className={`${styles.confirmBtn}
          ${selectedReward ? styles.confirmActive : styles.confirmDisabled}
        `}
      >
        CONFIRM
      </button>

    </div>
  </div>,
  document.body
);

}
