package com.perfectstay.perfectstay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perfectstay.perfectstay_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByEmail(String email);
  User findByEmail(String email);
  User findByEmailAndPassword(String email, String password);

}
