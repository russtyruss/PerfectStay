package com.perfectstay.perfectstay_backend.dto;

public class BookingDTO {

    private Long id;
    private String checkInDate;
    private String checkOutDate;
    private double totalPrice;
    private String confirmationCode;
    private String bookingStatus;
    private int numberOfNights;
    private int numberOfGuests;

    private RoomDTO room;

    // getters & setters
    public BookingDTO(Long id, String confirmationCode, String checkInDate, String checkOutDate,
                      int numberOfGuests, double totalPrice, String bookingStatus,
                      int numberOfNights, RoomDTO room) {
        this.id = id;
        this.confirmationCode = confirmationCode;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.bookingStatus = bookingStatus;
        this.numberOfNights = numberOfNights;
        this.room = room;
    }

    public BookingDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }

    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getConfirmationCode() { return confirmationCode; }
    public void setConfirmationCode(String confirmationCode) { this.confirmationCode = confirmationCode; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public int getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

    public int getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(int numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public RoomDTO getRoom() { return room; }
    public void setRoom(RoomDTO room) { this.room = room; }
}
