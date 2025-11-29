package com.perfectstay.perfectstay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
 

}
