package com.perfectstay.perfectstay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.HotelOwner;

public interface HotelOwnerRepository extends JpaRepository<HotelOwner, Long> {
  
}
