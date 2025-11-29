package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.dto.HotelDetailsDTO;
import com.perfectstay.perfectstay_backend.dto.RecommendedHotelDTO;
import com.perfectstay.perfectstay_backend.entity.Hotel;
import com.perfectstay.perfectstay_backend.service.HotelService;


@RestController
@RequestMapping("/api/hotels")
@CrossOrigin
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
        public List<Hotel> getAll() {
            return hotelService.getAll();
    }

    @GetMapping("/{id}")
        public Hotel getById(@PathVariable Long id) {
            return hotelService.getById(id);
    }

    @PostMapping
    public Hotel create(@RequestBody Hotel hotel) {
        return hotelService.create(hotel);
    }

    //edit hotel
    @PutMapping("/hotel-edit/{id}")
    public Hotel update(
            @PathVariable Long id,
            @RequestParam Long ownerId,
            @RequestBody Hotel hotel
    ) {
        return hotelService.update(id, hotel, ownerId);
    }


    //delete hotels
    @DeleteMapping("delete-hotel/{hotelId}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long hotelId) {

        try {
            hotelService.deleteHotelSafely(hotelId);
            return ResponseEntity.ok("Hotel deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }


    //recommended hotels
    @GetMapping("/recommendations")
        public List<RecommendedHotelDTO> getRecommendations() {
        return hotelService.getRecommendedHotels();
    }

    //get details
    @GetMapping("/{id}/details")
        public HotelDetailsDTO getHotelDetails(@PathVariable Long id) {
            return hotelService.getHotelDetails(id);
    }

    //search hotels
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam("keyword") String keyword) {
        List<Hotel> hotels = hotelService.searchHotels(keyword);
        return ResponseEntity.ok(hotels);
    }


    //add hotels
    @PostMapping("/addHotelWithRooms")
    public ResponseEntity<?> addHotelWithRooms(@RequestBody HotelDetailsDTO dto) {
        try {
            Hotel savedHotel = hotelService.createHotelWithRooms(dto);
            return new ResponseEntity<>(savedHotel, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }

    //get all hotels
    @GetMapping("/all-hotels/{ownerId}")
    public List<HotelDetailsDTO> getAllHotelsByOwner(@PathVariable Long ownerId) {
        return hotelService.getHotelsByOwner(ownerId);
    }





}
