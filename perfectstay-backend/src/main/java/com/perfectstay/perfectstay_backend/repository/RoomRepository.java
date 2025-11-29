package com.perfectstay.perfectstay_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
  List<Room> findByHotelId(Long hotelId);
}
