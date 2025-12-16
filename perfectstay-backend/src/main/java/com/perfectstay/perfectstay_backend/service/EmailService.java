package com.perfectstay.perfectstay_backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;  
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.perfectstay.perfectstay_backend.entity.Payment;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPaymentReceipt(String toEmail, Payment payment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Payment Receipt - Transaction " + payment.getTransactionId());

        message.setText(
                "Thank you for your payment!\n\n" +
                "Transaction ID: " + payment.getTransactionId() + "\n" +
                "Amount: ₱" + payment.getAmount() + "\n" +
                "Payment Method: " + payment.getPaymentMethodType() + "\n" +
                "Date: " + payment.getPaymentDate() + "\n\n"
        );

        mailSender.send(message);
    }

    public void sendRefundReceipt(String toEmail, Payment payment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Refund Confirmation - Transaction " + payment.getRefundTransactionId());

        message.setText(
                "Your refund has been successfully processed.\n\n" +
                "Original Transaction ID: " + payment.getTransactionId() + "\n" +
                "Refund Transaction ID: " + payment.getRefundTransactionId() + "\n" +
                "Refund Amount: ₱" + payment.getAmount() + "\n" +
                "Refund Date: " + payment.getRefundedAt() + "\n\n" 
        );

        mailSender.send(message);
    }


}

