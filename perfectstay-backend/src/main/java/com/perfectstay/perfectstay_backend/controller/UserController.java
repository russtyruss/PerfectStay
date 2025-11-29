package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.dto.ChangePasswordRequest;
import com.perfectstay.perfectstay_backend.dto.LoginRequest;
import com.perfectstay.perfectstay_backend.dto.UpdateUserRequest;
import com.perfectstay.perfectstay_backend.entity.Customer;
import com.perfectstay.perfectstay_backend.entity.HotelOwner;
import com.perfectstay.perfectstay_backend.entity.User;
import com.perfectstay.perfectstay_backend.repository.CustomerRepository;
import com.perfectstay.perfectstay_backend.repository.HotelOwnerRepository;
import com.perfectstay.perfectstay_backend.repository.UserRepository;
import com.perfectstay.perfectstay_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private HotelOwnerRepository hotelOwnerRepository;


    // CREATE USER
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    //get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //get user by id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    //login handling with frontend
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        User userByEmail = userRepository.findByEmail(loginRequest.getEmail());

        if (userByEmail == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Account does not exist");
        }

        User user = userRepository.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password");
        }

        return ResponseEntity.ok(user);
    }

    //register handling with frontend
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User userPayload) {

        if (userRepository.existsByEmail(userPayload.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already taken");
        }

        // Create a Customer directly (since Customer extends User)
        Customer customer = new Customer();
        customer.setFullName(userPayload.getFullName());
        customer.setEmail(userPayload.getEmail());
        customer.setPhoneNumber(userPayload.getPhoneNumber());
        customer.setPassword(userPayload.getPassword());
        customer.setUserType("CUSTOMER");
        customer.setPointsBalance(0);

        Customer savedCustomer = customerRepository.save(customer);

        return ResponseEntity.ok(savedCustomer);
    }

    

    @PostMapping("/register-hotel-owner")
    public ResponseEntity<?> registerHotelOwner(@RequestBody HotelOwner ownerPayload) {

        // ✅ Check if email already exists
        if (userRepository.existsByEmail(ownerPayload.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already taken");
        }

        // ✅ Create Hotel Owner
        HotelOwner owner = new HotelOwner();
        owner.setFullName(ownerPayload.getFullName());
        owner.setEmail(ownerPayload.getEmail());
        owner.setPhoneNumber(ownerPayload.getPhoneNumber());
        owner.setPassword(ownerPayload.getPassword());
        owner.setUserType("HOTEL_OWNER");

        // ✅ Hotel owner specific fields
        owner.setBusinessName(ownerPayload.getBusinessName());
        owner.setBusinessRegistrationNumber(ownerPayload.getBusinessRegistrationNumber());

        // ✅ Save
        HotelOwner savedOwner = hotelOwnerRepository.save(owner);

        return ResponseEntity.ok(savedOwner);
    }



    // UPDATE PROFILE
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest dto
    ) {
        User updated = userService.updateProfile(id, dto);

        Customer customer = customerRepository.findById(id).orElse(null);

        return ResponseEntity.ok(new Object() {
            public final Long customerId = updated.getId();
            public final String fullName = updated.getFullName();
            public final String phoneNumber = updated.getPhoneNumber();
            public final String email = updated.getEmail();
            public final Integer pointsBalance = customer != null ? customer.getPointsBalance() : 0;
        });
    }

    // CHANGE PASSWORD
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest dto
    ) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok("Password updated successfully");
    }


    @GetMapping("/points/{userId}")
    public ResponseEntity<?> getCustomerPoints(@PathVariable Long userId) {
        Customer customer = customerRepository.findById(userId)
                .orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        return ResponseEntity.ok(customer.getPointsBalance());
    }



    @PutMapping("/points/redeem/{userId}")
    public ResponseEntity<?> redeemPoints(
            @PathVariable Long userId,
            @RequestParam int pointsToDeduct
    ) {
        Customer customer = customerRepository.findById(userId).orElse(null);

        if (customer == null) {
            return ResponseEntity.status(404).body("Customer not found");
        }

        if (pointsToDeduct <= 0) {
            return ResponseEntity.badRequest().body("Invalid points value");
        }

        if (customer.getPointsBalance() < pointsToDeduct) {
            return ResponseEntity.badRequest().body("Not enough points");
        }

        // Deduct points
        int newBalance = customer.getPointsBalance() - pointsToDeduct;
        customer.setPointsBalance(newBalance);
        customerRepository.save(customer);

        // Send updated balance back
        return ResponseEntity.ok(newBalance);
    }

}


