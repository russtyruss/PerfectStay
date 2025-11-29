package com.perfectstay.perfectstay_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.Payment;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByBookingId(Long bookingId);
}
