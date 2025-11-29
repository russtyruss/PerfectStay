package com.perfectstay.perfectstay_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.perfectstay.perfectstay_backend.entity.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
      Optional<Wallet> findByCardNumberAndCvvAndExpiryDate(
        String cardNumber, String cvv, String expiryDate
    );

    Optional<Wallet> findByGcashNumber(String gcashNumber);
    Optional<Wallet> findByCardNumber(String cardNumber);

}
