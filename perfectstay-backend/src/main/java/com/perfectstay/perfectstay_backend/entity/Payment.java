package com.perfectstay.perfectstay_backend.entity;
import java.time.LocalDateTime;

import com.perfectstay.perfectstay_backend.entity.enums.PaymentMethodType;
import com.perfectstay.perfectstay_backend.entity.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus; // PAID, FAILED, PENDING, REFUNDED

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    // CREDIT_CARD, DEBIT_CARD, GCASH
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType paymentMethodType; 

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // REFUND FIELDS (transaction-based)
    private String refundTransactionId;

    private LocalDateTime refundedAt;

    @Column
    private Long walletId;



    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public PaymentMethodType getPaymentMethodType() { return paymentMethodType; }
    public void setPaymentMethodType(PaymentMethodType paymentMethodType) { this.paymentMethodType = paymentMethodType; }

    public String getRefundTransactionId() { return refundTransactionId; }
    public void setRefundTransactionId(String refundTransactionId) { this.refundTransactionId = refundTransactionId; }

    public LocalDateTime getRefundedAt() { return refundedAt; }
    public void setRefundedAt(LocalDateTime refundedAt) { this.refundedAt = refundedAt; }

    public Long getWalletId() { return walletId; }
    public void setWalletId(Long walletId) { this.walletId = walletId; }


}
