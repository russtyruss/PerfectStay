package com.perfectstay.perfectstay_backend.dto;
import java.util.List;

public class HotelDetailsDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String imageUrl;
    private List<RoomDTO> rooms;
    private Long hotelOwnerId;

    public HotelDetailsDTO(Long id, String name, String description, String address, String city,
                           String imageUrl, List<RoomDTO> rooms) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.city = city;
        this.imageUrl = imageUrl;
        this.rooms = rooms;
    }

    public HotelDetailsDTO(){}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<RoomDTO> getRooms() { return rooms; }
    public void setRooms(List<RoomDTO> rooms) { this.rooms = rooms; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Long getHotelOwnerId() { return hotelOwnerId; }
    public void setHotelOwnerId(Long hotelOwnerId) { this.hotelOwnerId = hotelOwnerId; }













}
