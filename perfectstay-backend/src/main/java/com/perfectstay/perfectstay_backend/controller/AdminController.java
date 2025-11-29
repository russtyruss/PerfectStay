package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.entity.Admin;
import com.perfectstay.perfectstay_backend.service.UserService;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserService userService;

    //postman test for creating admin
    @PostMapping("/create")
    public Admin createAdmin(@RequestBody Admin admin) {
        return userService.createAdmin(admin);
    }

    //postman test for getting all admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return userService.getAllAdmins();
    }

}
