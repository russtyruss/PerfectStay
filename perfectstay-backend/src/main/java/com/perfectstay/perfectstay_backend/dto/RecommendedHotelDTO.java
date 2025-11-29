package com.perfectstay.perfectstay_backend.dto;

import java.util.List;

public class RecommendedHotelDTO {

    private Long hotelId;
    private String name;
    private String location;
    private List<String> images;
    private Double lowestPrice;
    private String cheapestRoomImage; // ADD THIS
    private String city;

    public RecommendedHotelDTO(
            Long hotelId,
            String name,
            String location,
            List<String> images,
            Double lowestPrice,
            String cheapestRoomImage,     // ADD THIS
            String city
    ) {
        this.hotelId = hotelId;
        this.name = name;
        this.location = location;
        this.images = images;
        this.lowestPrice = lowestPrice;
        this.cheapestRoomImage = cheapestRoomImage; // ADD THIS
        this.city = city;
    }

    public Long getHotelId() { return hotelId; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public List<String> getImages() { return images; }
    public Double getLowestPrice() { return lowestPrice; }
    public String getCheapestRoomImage() { return cheapestRoomImage; }
    public String getCity() { return city; }
}
