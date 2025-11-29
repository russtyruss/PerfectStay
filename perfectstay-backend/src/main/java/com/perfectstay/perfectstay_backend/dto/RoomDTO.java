package com.perfectstay.perfectstay_backend.dto;
import java.util.List;

public class RoomDTO {
    private Long id;
    private String roomType;
    private double pricePerNight;
    private int capacity;
    private boolean isAvailable;
    private Long hotelId;
    private String description;
    private int quantity;
    private List<String> images;

    public RoomDTO(Long id, String roomType, double pricePerNight, int capacity,
                   boolean isAvailable, List<String> images, Long hotelId, String description, int quantity) {
        this.id = id;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.capacity = capacity;
        this.isAvailable = isAvailable;
        this.images = images;
        this.hotelId = hotelId;
        this.description = description;
        this.quantity = quantity;
    }

    public RoomDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public void setIsAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
    public boolean getIsAvailable() { return isAvailable; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getImages() { return images; }
    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
