package com.perfectstay.perfectstay_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.perfectstay.perfectstay_backend.entity.RoomImage;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
  List<RoomImage> findByRoomId(Long roomId);
  @Modifying
    @Transactional
    @Query("DELETE FROM RoomImage ri WHERE ri.room.id = :roomId")
    void deleteByRoomId(@Param("roomId") Long roomId);
}
