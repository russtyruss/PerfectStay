package com.perfectstay.perfectstay_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.perfectstay.perfectstay_backend.entity.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
  @Query("""
      SELECT h FROM Hotel h 
      WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(h.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%'))
  """)
  List<Hotel> searchHotels(@Param("keyword") String keyword);
  List<Hotel> findByHotelOwnerId(Long ownerId);
  boolean existsByNameAndIdNot(String name, Long id);


}
