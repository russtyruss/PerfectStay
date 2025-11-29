package com.perfectstay.perfectstay_backend.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "hotel_owners")
public class HotelOwner extends User {

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String businessRegistrationNumber;

    @OneToMany(mappedBy = "hotelOwner")
    @JsonManagedReference
    private List<Hotel> hotels;


    // Getters & Setters
    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessRegistrationNumber() {
        return businessRegistrationNumber;
    }

    public void setBusinessRegistrationNumber(String businessRegistrationNumber) {
        this.businessRegistrationNumber = businessRegistrationNumber;
    }

    public List<Hotel> getHotels() {
        return hotels;
    }
    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }
}
