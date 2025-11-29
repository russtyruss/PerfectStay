package com.perfectstay.perfectstay_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.perfectstay.perfectstay_backend.dto.ChangePasswordRequest;
import com.perfectstay.perfectstay_backend.dto.UpdateUserRequest;
import com.perfectstay.perfectstay_backend.entity.Admin;
import com.perfectstay.perfectstay_backend.entity.Customer;
import com.perfectstay.perfectstay_backend.entity.HotelOwner;
import com.perfectstay.perfectstay_backend.entity.User;
import com.perfectstay.perfectstay_backend.repository.AdminRepository;
import com.perfectstay.perfectstay_backend.repository.CustomerRepository;
import com.perfectstay.perfectstay_backend.repository.HotelOwnerRepository;
import com.perfectstay.perfectstay_backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private HotelOwnerRepository hotelOwnerRepository;

    
    // CREATE BASE USER
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // CREATE CUSTOMER
    public Customer createCustomer(Customer customer) {
        customer.setUserType("CUSTOMER");
        return customerRepository.save(customer);
    }

    // CREATE ADMIN
    public Admin createAdmin(Admin admin) {
        admin.setUserType("ADMIN");
        return adminRepository.save(admin);
    }

    // CREATE HOTEL OWNER
    public HotelOwner createHotelOwner(HotelOwner owner) {
        owner.setUserType("HOTEL_OWNER");
        return hotelOwnerRepository.save(owner);
    }

    // CHILD GETTERS
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public List<HotelOwner> getAllHotelOwners() {
        return hotelOwnerRepository.findAll();
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    //for login
    public User findByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    //edit profile
    public User updateProfile(Long id, UpdateUserRequest dto) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Check if email already exists for another user
    User existing = userRepository.findByEmail(dto.getEmail());
    if (existing != null && !existing.getId().equals(id)) {
        throw new RuntimeException("Email already taken");
    }

    user.setFullName(dto.getFullName());
    user.setPhoneNumber(dto.getPhoneNumber());
    user.setEmail(dto.getEmail());

    return userRepository.save(user);
}

    //change password
    public void changePassword(Long id, ChangePasswordRequest dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Your passwords are NOT encoded, so direct comparison
        if (!user.getPassword().equals(dto.getCurrentPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }


}
