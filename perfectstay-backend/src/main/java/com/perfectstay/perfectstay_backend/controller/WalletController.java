package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.entity.Wallet;
import com.perfectstay.perfectstay_backend.repository.WalletRepository;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletRepository walletRepository;

    public WalletController(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    // CREATE MOCK WALLET (POST)
    @PostMapping
    public ResponseEntity<Wallet> createWallet(@RequestBody Wallet wallet) {
        Wallet savedWallet = walletRepository.save(wallet);
        return new ResponseEntity<>(savedWallet, HttpStatus.CREATED);
    }

    // GET ALL WALLETS
    @GetMapping
    public ResponseEntity<List<Wallet>> getAllWallets() {
        return ResponseEntity.ok(walletRepository.findAll());
    }

    // GET WALLET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Wallet> getWalletById(@PathVariable Long id) {
        return walletRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
