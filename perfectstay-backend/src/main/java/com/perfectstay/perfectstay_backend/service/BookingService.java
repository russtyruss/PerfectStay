package com.perfectstay.perfectstay_backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perfectstay.perfectstay_backend.dto.BookingDTO;
import com.perfectstay.perfectstay_backend.dto.BookingRequest;
import com.perfectstay.perfectstay_backend.dto.RoomDTO;
import com.perfectstay.perfectstay_backend.entity.Booking;
import com.perfectstay.perfectstay_backend.entity.Customer;
import com.perfectstay.perfectstay_backend.entity.Payment;
import com.perfectstay.perfectstay_backend.entity.Room;
import com.perfectstay.perfectstay_backend.entity.Wallet;
import com.perfectstay.perfectstay_backend.entity.enums.BookingStatus;
import com.perfectstay.perfectstay_backend.entity.enums.PaymentStatus;
import com.perfectstay.perfectstay_backend.repository.BookingRepository;
import com.perfectstay.perfectstay_backend.repository.CustomerRepository;
import com.perfectstay.perfectstay_backend.repository.PaymentRepository;
import com.perfectstay.perfectstay_backend.repository.RoomRepository;
import com.perfectstay.perfectstay_backend.repository.WalletRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private PaymentService paymentService;




        //checks room availability
    public boolean isRoomAvailable(Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        int quantity = room.getQuantity();

        // 1️Count overlapping confirmed bookings
        List<Booking> overlapping =
                bookingRepository.findOverlappingBookings(roomId, checkInDate, checkOutDate);

        // 2️Count total confirmed bookings
        int totalConfirmed =
                bookingRepository.countByRoomIdAndBookingStatus(roomId, BookingStatus.CONFIRMED);

        // 3️If only 1 quantity → ANY existing confirmed booking blocks the room
        if (quantity == 1) {
            return totalConfirmed == 0;  // if any booking exists → unavailable
        }

        // 4️If quantity > 1 → allow booking only if overlapping < quantity
        return overlapping.size() < quantity;
    }



    //creates a new booking
    public Booking createBooking(BookingRequest req) {

        if (!isRoomAvailable(req.getRoomId(), req.getCheckInDate(), req.getCheckOutDate())) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Booking booking = new Booking();
        booking.setCheckInDate(req.getCheckInDate());
        booking.setCheckOutDate(req.getCheckOutDate());
        booking.setTotalPrice(req.getTotalPrice());
        booking.setNumberOfguests(req.getNumberOfguests());
        booking.setNumberOfNights(req.getNumberOfNights());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setBookingStatus(BookingStatus.PENDING);


        booking.setCustomer(customer);
        booking.setRoom(room);

        // ⭐ ADD LOYALTY POINTS (SAFE NULL HANDLING)
        int earnedPoints = (int) (req.getTotalPrice() / 100);

        booking.setPointsEarned(earnedPoints);

        Integer current = customer.getPointsBalance();
        if (current == null) current = 0;

        customer.setPointsBalance(current + earnedPoints);
        customerRepository.save(customer);
        // Generate confirmation code HERE (backend)
        booking.setConfirmationCode(generateConfirmationCode());


        return bookingRepository.save(booking);
    }

    //get bookings by customer id
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getCustomer().getId().equals(customerId))
                .toList();
    }

    //booking code generator
    private String generateConfirmationCode() {
        String prefix = "PS";
        String random = UUID.randomUUID()
            .toString()
            .substring(0, 6)
            .toUpperCase();
        return prefix + random;
    }


    //Gets booking with rooms
    private BookingDTO mapToDTO(Booking booking) {
    BookingDTO dto = new BookingDTO();

    dto.setId(booking.getId());
    dto.setCheckInDate(booking.getCheckInDate().toString());
    dto.setCheckOutDate(booking.getCheckOutDate().toString());
    dto.setTotalPrice(booking.getTotalPrice());
    dto.setConfirmationCode(booking.getConfirmationCode());
    dto.setBookingStatus(booking.getBookingStatus().name());
    dto.setNumberOfNights(booking.getNumberOfNights());
    dto.setNumberOfGuests(booking.getNumberOfguests());

    // map room
    RoomDTO r = new RoomDTO();
    r.setId(booking.getRoom().getId());
    r.setRoomType(booking.getRoom().getRoomType());
    r.setPricePerNight(booking.getRoom().getPricePerNight());
    r.setCapacity(booking.getRoom().getCapacity());
    r.setIsAvailable(booking.getRoom().getIsAvailable());
    r.setHotelId(booking.getRoom().getHotel().getId());
    List<String> imageUrls = booking.getRoom().getImages().stream()
            .map(img -> img.getImageUrl())
            .toList();
    r.setImages(imageUrls); 

    dto.setRoom(r);

    return dto;
}

    //get bookings by customer
    public List<Booking> getBookingsWithRoomsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    //get bookings by customer as DTO
    public List<BookingDTO> getBookingDTOsByCustomer(Long customerId) {
    return bookingRepository.findByCustomerId(customerId)
            .stream()
            .map(this::mapToDTO)
            .toList();
}


//find booking thru id
    public List<Booking> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoom_Id(roomId);
    }


    //cancels booking
    @Transactional
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus currentStatus = booking.getBookingStatus();

        if (currentStatus == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Completed bookings cannot be cancelled");
        }

        if (currentStatus == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        if (currentStatus != BookingStatus.PENDING &&
            currentStatus != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Only pending or confirmed bookings can be cancelled");
        }

            // ================= REFUND LOGIC =================

    Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("No payment found for this booking"));

    if (payment.getPaymentStatus() == PaymentStatus.PAID) {

        Wallet wallet = walletRepository.findById(payment.getWalletId())
                .orElseThrow(() -> new RuntimeException("Wallet not found for refund"));

        // ✅ RETURN MONEY
        wallet.setBalance(
                wallet.getBalance().add(
                        BigDecimal.valueOf(payment.getAmount())
                )
        );
        walletRepository.save(wallet);

        // ✅ MARK PAYMENT AS REFUNDED
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundTransactionId(paymentService.generateTxn());
        payment.setRefundedAt(LocalDateTime.now());
        paymentRepository.save(payment);
    }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }


    //mark completed bookings
    @Transactional
    public void markBookingAsCompleted(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus currentStatus = booking.getBookingStatus();

        // ✅ DO NOT TOUCH THESE
        if (currentStatus == BookingStatus.CANCELLED ||
            currentStatus == BookingStatus.COMPLETED) {
            return;
        }

        booking.setBookingStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
    }

    //this is for payment confirmation
    @Transactional
    public void deleteBookingSafely(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            throw new RuntimeException("Confirmed bookings cannot be deleted");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        // ✅ Only allow delete for PENDING (failed or unpaid)
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

}
