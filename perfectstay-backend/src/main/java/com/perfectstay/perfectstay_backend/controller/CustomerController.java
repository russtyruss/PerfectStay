package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.entity.Customer;
import com.perfectstay.perfectstay_backend.repository.CustomerRepository;
import com.perfectstay.perfectstay_backend.service.UserService;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerRepository customerRepository;

    //postman test for creating customer
    @PostMapping("/create")
    public Customer createCustomer(@RequestBody Customer customer) {
        return userService.createCustomer(customer);
    }

    //postman test for getting all customers
    @GetMapping
    public List<Customer> getCustomers() {
        return userService.getAllCustomers();
    }


}
