package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.entity.HotelOwner;
import com.perfectstay.perfectstay_backend.service.UserService;

@RestController
@RequestMapping("/api/hotelowners")
@CrossOrigin
public class HotelOwnerController {

    @Autowired
    private UserService userService;

    //postman test for creating hotel owner
    @PostMapping("/create")
    public HotelOwner createHotelOwner(@RequestBody HotelOwner owner) {
        return userService.createHotelOwner(owner);
    }

    //postman test for getting all hotel owners
    @GetMapping
    public List<HotelOwner> getHotelOwners() {
        return userService.getAllHotelOwners();
    }

}
