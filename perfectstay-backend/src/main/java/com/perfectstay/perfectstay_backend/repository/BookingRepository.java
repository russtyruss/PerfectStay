package com.perfectstay.perfectstay_backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.perfectstay.perfectstay_backend.entity.Booking;
import com.perfectstay.perfectstay_backend.entity.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.bookingStatus = 'CONFIRMED' " +
           "AND b.checkInDate < :checkOutDate " +
           "AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );


    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.room.id = :roomId
        AND b.checkOutDate >= CURRENT_DATE
    """)
    boolean hasActiveOrUpcomingBookingsForRoom(@Param("roomId") Long roomId);


    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.room.hotel.id = :hotelId
        AND b.checkOutDate >= CURRENT_DATE
    """)
    boolean hasActiveOrUpcomingBookings(@Param("hotelId") Long hotelId);

    int countByRoomIdAndBookingStatus(Long roomId, BookingStatus bookingStatus);
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByRoom_Id(Long roomId);
}
