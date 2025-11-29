package com.perfectstay.perfectstay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.Customer;



public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
