package com.perfectstay.perfectstay_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer extends User {

    @Column(nullable = false)
    private int pointsBalance = 0; // Reward points (starts at 0)


    // Getters & Setters
    public int getPointsBalance() {
        return pointsBalance;
    }

    public void setPointsBalance(int pointsBalance) {
        this.pointsBalance = pointsBalance;
    }
}
