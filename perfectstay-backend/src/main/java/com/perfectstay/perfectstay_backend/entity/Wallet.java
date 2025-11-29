package com.perfectstay.perfectstay_backend.entity;

import java.math.BigDecimal;

import com.perfectstay.perfectstay_backend.entity.enums.PaymentMethodType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wallet_gateway_mock")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CREDIT_CARD, DEBIT_CARD, GCASH
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType paymentMethodType;

    // ===== MOCK PAYMENT DETAILS =====

    @Column(unique = true)
    private String cardNumber;      

    private String cardHolderName;

    private String expiryDate;

    private String cvv;

    @Column(unique = true)
    private String gcashNumber;      

    // ✅ SAFER MONEY COLUMN
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balance;

    // ========== Getters & Setters ==========

    public Long getId() { return id; }

    public PaymentMethodType getPaymentMethodType() {
        return paymentMethodType;
    }

    public void setPaymentMethodType(PaymentMethodType paymentMethodType) {
        this.paymentMethodType = paymentMethodType;
    }

    public String getCardNumber() { return cardNumber; }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardHolderName() { return cardHolderName; }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    public String getExpiryDate() { return expiryDate; }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvv() { return cvv; }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getGcashNumber() { return gcashNumber; }

    public void setGcashNumber(String gcashNumber) {
        this.gcashNumber = gcashNumber;
    }

    public BigDecimal getBalance() { return balance; }

    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
