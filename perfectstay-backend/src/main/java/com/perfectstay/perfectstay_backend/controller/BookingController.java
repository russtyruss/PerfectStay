package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.dto.BookingDTO;
import com.perfectstay.perfectstay_backend.dto.BookingRequest;
import com.perfectstay.perfectstay_backend.entity.Booking;
import com.perfectstay.perfectstay_backend.service.BookingService;


@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @DeleteMapping("safe-delete/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBookingSafely(id);
            return ResponseEntity.ok("Booking deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/customer/{customerId}")
    public List<Booking> getCustomerBookings(@PathVariable Long customerId) {
        return bookingService.getBookingsByCustomer(customerId);
    }

    @GetMapping("/check-availability")
    public boolean checkAvailability(
            @RequestParam Long roomId,
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate
    ) {
        return bookingService.isRoomAvailable(
                roomId,
                java.time.LocalDate.parse(checkInDate),
                java.time.LocalDate.parse(checkOutDate)
        );
    }

    @GetMapping("/customer/{customerId}/with-room")
    public List<BookingDTO> getBookingsWithRoom(@PathVariable Long customerId) {
        return bookingService.getBookingDTOsByCustomer(customerId);
    }

    @GetMapping("/room/{roomId}")
    public List<Booking> getBookingsByRoom(@PathVariable Long roomId) {
        return bookingService.getBookingsByRoom(roomId);
    }

        @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }


    @PutMapping("/mark-completed/{bookingId}")
    public ResponseEntity<String> markBookingCompleted(@PathVariable Long bookingId) {
        bookingService.markBookingAsCompleted(bookingId);
        return ResponseEntity.ok("Booking marked as completed");
    }



}
