package com.perfectstay.perfectstay_backend.dto;

import com.perfectstay.perfectstay_backend.entity.enums.PaymentMethodType;

public class PaymentRequest {

    private Long bookingId;
    private double amount;
    private PaymentMethodType paymentMethodType;

    // CARD
    private String cardHolderName;
    private String cardNumber;
    private String expiryDate;
    private String cvv;

    // GCASH
    private String gcashNumber;

    // GETTERS & SETTERS
    public Long getBookingId() {
      return bookingId;
    }

    public void setBookingId(Long bookingId) {
      this.bookingId = bookingId;
    }

    public double getAmount() {
      return amount;
    }

    public void setAmount(double amount) {
      this.amount = amount;
    }

    public PaymentMethodType getPaymentMethodType() {
      return paymentMethodType;
    }

    public void setPaymentMethodType(PaymentMethodType paymentMethodType) {
      this.paymentMethodType = paymentMethodType;
    }

    public String getCardNumber() {
      return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
      this.cardNumber = cardNumber;
    }

    public String getExpiryDate() {
      return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
      this.expiryDate = expiryDate;
    }

    public String getCvv() {
      return cvv;
    }

    public void setCvv(String cvv) {
      this.cvv = cvv;
    }

    public String getGcashNumber() {
      return gcashNumber;
    }

    public void setGcashNumber(String gcashNumber) {
      this.gcashNumber = gcashNumber;
    }

    public String getCardHolderName() {
      return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
      this.cardHolderName = cardHolderName;
    }
}
