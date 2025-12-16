package com.perfectstay.perfectstay_backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.perfectstay.perfectstay_backend.dto.PaymentRequest;
import com.perfectstay.perfectstay_backend.entity.Booking;
import com.perfectstay.perfectstay_backend.entity.Payment;
import com.perfectstay.perfectstay_backend.entity.Wallet;
import com.perfectstay.perfectstay_backend.entity.enums.BookingStatus;
import com.perfectstay.perfectstay_backend.entity.enums.PaymentMethodType;
import com.perfectstay.perfectstay_backend.entity.enums.PaymentStatus;
import com.perfectstay.perfectstay_backend.repository.BookingRepository;
import com.perfectstay.perfectstay_backend.repository.PaymentRepository;
import com.perfectstay.perfectstay_backend.repository.WalletRepository;

import jakarta.transaction.Transactional;




@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Payment processPayment(PaymentRequest req) {

        Booking booking = bookingRepository.findById(req.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found")); //Ensures valid bookings only


        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
        throw new RuntimeException("Booking already paid");
        }

        // CASH FLOW
        if (req.getPaymentMethodType() == PaymentMethodType.CASH) {
            booking.setBookingStatus(BookingStatus.PENDING);
            bookingRepository.save(booking);

            Payment payment = new Payment();
            payment.setAmount(req.getAmount());
            payment.setPaymentStatus(PaymentStatus.PENDING);
            payment.setPaymentMethodType(PaymentMethodType.CASH);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setTransactionId(generateTxn()); //generate transaction reference
            payment.setBooking(booking);

            // SAVE FIRST
            Payment savedPayment = paymentRepository.save(payment); //Save and return payment

            // SEND EMAIL RECEIPT
            emailService.sendPaymentReceipt(
                booking.getCustomer().getEmail(),
                savedPayment
            );

            return savedPayment;
        }

        // WALLET VALIDATION
        Wallet wallet;

        if (req.getPaymentMethodType() == PaymentMethodType.GCASH) {
            wallet = walletRepository.findByGcashNumber(req.getGcashNumber())
                .orElseThrow(() -> new RuntimeException("GCash account not found"));
        } else {
            wallet = walletRepository.findByCardNumberAndCvvAndExpiryDate(
                req.getCardNumber(),
                req.getCvv(),
                req.getExpiryDate()
            ).orElseThrow(() -> new RuntimeException("Invalid card credentials"));
        }

        // BALANCE CHECK
        if (wallet.getBalance().compareTo(BigDecimal.valueOf(req.getAmount())) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // DEDUCT WALLET
        wallet.setBalance(
            wallet.getBalance().subtract(BigDecimal.valueOf(req.getAmount()))
        );
        walletRepository.save(wallet);

        // CREATE PAYMENT
        Payment payment = new Payment();
        payment.setAmount(req.getAmount());
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaymentMethodType(req.getPaymentMethodType());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(generateTxn());
        payment.setBooking(booking);
        payment.setWalletId(wallet.getId());

        // CONFIRM BOOKING
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // SAVE PAYMENT
        Payment savedPayment = paymentRepository.save(payment);

        // SEND EMAIL RECEIPT
        emailService.sendPaymentReceipt(
            booking.getCustomer().getEmail(),
            savedPayment
        );

        return savedPayment;
    }



    public String generateTxn() {
    return "REF-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
  }


  }

