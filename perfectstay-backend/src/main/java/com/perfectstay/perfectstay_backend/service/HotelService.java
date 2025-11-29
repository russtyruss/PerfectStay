package com.perfectstay.perfectstay_backend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perfectstay.perfectstay_backend.dto.HotelDetailsDTO;
import com.perfectstay.perfectstay_backend.dto.RecommendedHotelDTO;
import com.perfectstay.perfectstay_backend.dto.RoomDTO;
import com.perfectstay.perfectstay_backend.entity.Hotel;
import com.perfectstay.perfectstay_backend.entity.HotelOwner;
import com.perfectstay.perfectstay_backend.entity.Room;
import com.perfectstay.perfectstay_backend.entity.RoomImage;
import com.perfectstay.perfectstay_backend.repository.BookingRepository;
import com.perfectstay.perfectstay_backend.repository.HotelOwnerRepository;
import com.perfectstay.perfectstay_backend.repository.HotelRepository;
import com.perfectstay.perfectstay_backend.repository.RoomImageRepository;
import com.perfectstay.perfectstay_backend.repository.RoomRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelOwnerRepository hotelOwnerRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    

    public HotelService(HotelRepository hotelRepository,
                    HotelOwnerRepository hotelOwnerRepository, BookingRepository bookingRepository, RoomRepository roomRepository, RoomImageRepository roomImageRepository) {
        this.hotelRepository = hotelRepository;
        this.hotelOwnerRepository = hotelOwnerRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.roomImageRepository = roomImageRepository;
    }


    public List<Hotel> getAll() {
        return hotelRepository.findAll();
    }

    //search hotels
    public List<Hotel> searchHotels(String keyword) {
        return hotelRepository.searchHotels(keyword);
    }

    //gets hotel by id
    public Hotel getById(Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    //i think this is for postman
    public Hotel create(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    //edit hotels
    public Hotel update(Long id, Hotel updatedHotel, Long ownerId) {

        Hotel existingHotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // ✅ OWNER CHECK
        if (!existingHotel.getHotelOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        // ✅ DUPLICATE NAME CHECK
        if (hotelRepository.existsByNameAndIdNot(updatedHotel.getName(), id)) {
            throw new RuntimeException("A hotel with this name already exists");
        }

        // ✅ UPDATE ONLY SAFE FIELDS
        existingHotel.setName(updatedHotel.getName());
        existingHotel.setCity(updatedHotel.getCity());
        existingHotel.setAddress(updatedHotel.getAddress());
        existingHotel.setDescription(updatedHotel.getDescription());
        existingHotel.setImageUrl(updatedHotel.getImageUrl());

        return hotelRepository.save(existingHotel);
    }


    //delete hotels
   @Transactional
    public void deleteHotelSafely(Long hotelId) {

        boolean hasBookings = bookingRepository.hasActiveOrUpcomingBookings(hotelId);

        if (hasBookings) {
            throw new RuntimeException(
                "This hotel still has active or upcoming bookings and cannot be deleted."
            );
        }

        hotelRepository.deleteById(hotelId);
    }


    //display hotels through cheapest rooms
    public List<RecommendedHotelDTO> getRecommendedHotels() {
        List<Hotel> hotels = hotelRepository.findAll();

        return hotels.stream().map(hotel -> {

            // 1. Cheapest room
            Room cheapestRoom = hotel.getRooms().stream()
                    .min(Comparator.comparing(Room::getPricePerNight))
                    .orElse(null);

            // 2. Lowest price
            Double lowestPrice = cheapestRoom != null ? cheapestRoom.getPricePerNight() : null;

            // 3. Cheapest room image
            String cheapestRoomImage = null;
            if (cheapestRoom != null && !cheapestRoom.getImages().isEmpty()) {
                cheapestRoomImage = cheapestRoom.getImages().get(0).getImageUrl();
            }

            // 4. Hotel main image
            List<String> images = List.of(hotel.getImageUrl());

            return new RecommendedHotelDTO(
                    hotel.getId(),
                    hotel.getName(),
                    hotel.getAddress(),
                    images,
                    lowestPrice,
                    cheapestRoomImage
                    , hotel.getCity()
            );
        }).toList();
    }


    //get hotel details
    public HotelDetailsDTO getHotelDetails(Long id) {

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // Sort rooms cheapest → expensive
        List<RoomDTO> rooms = hotel.getRooms().stream()
                .sorted(Comparator.comparing(Room::getPricePerNight))
                .map(room -> {
                    RoomDTO dto = new RoomDTO(
                            room.getId(),
                            room.getRoomType(),
                            room.getPricePerNight(),
                            room.getCapacity(),
                            room.getIsAvailable(),
                            room.getImages().stream()
                                    .map(RoomImage::getImageUrl)
                                    .toList(),
                            room.getHotel().getId(),
                            room.getDescription(),
                            room.getQuantity()
                    );
                    dto.setHotelId(room.getHotel().getId());
                    return dto;
                })
                .toList();

        return new HotelDetailsDTO(
                hotel.getId(),
                hotel.getName(),
                hotel.getDescription(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getImageUrl(),
                rooms
        );
    }


    // creates hotel
    @Transactional
    public Hotel createHotelWithRooms(HotelDetailsDTO dto) {

        if (dto.getHotelOwnerId() == null) {
            throw new IllegalArgumentException("Hotel owner ID is required");
        }

        if (dto.getRooms() == null || dto.getRooms().isEmpty()) {
            throw new IllegalArgumentException("Hotel must have at least one room");
        }

        HotelOwner owner = hotelOwnerRepository.findById(dto.getHotelOwnerId())
                .orElseThrow(() -> new RuntimeException("Hotel owner not found"));

        // ✅ 1. Save HOTEL first
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setDescription(dto.getDescription());
        hotel.setAddress(dto.getAddress());
        hotel.setCity(dto.getCity());
        hotel.setImageUrl(dto.getImageUrl());
        hotel.setHotelOwner(owner);

        Hotel savedHotel = hotelRepository.save(hotel);

        // ✅ 2. Save ROOMS
        for (RoomDTO roomDTO : dto.getRooms()) {

            Room room = new Room();
            room.setRoomType(roomDTO.getRoomType());
            room.setDescription(roomDTO.getDescription());
            room.setCapacity(roomDTO.getCapacity());
            room.setQuantity(roomDTO.getQuantity());
            room.setPricePerNight(roomDTO.getPricePerNight());
            room.setIsAvailable(roomDTO.getIsAvailable());
            room.setHotel(savedHotel);

            Room savedRoom = roomRepository.save(room);

            // ✅ 3. Save ROOM IMAGES
            if (roomDTO.getImages() != null && !roomDTO.getImages().isEmpty()) {
                List<RoomImage> images = roomDTO.getImages().stream().map(url -> {
                    RoomImage image = new RoomImage();
                    image.setImageUrl(url);
                    image.setRoom(savedRoom);
                    return image;
                }).toList();

                roomImageRepository.saveAll(images);
                savedRoom.setImages(images);
            }
        }

        return savedHotel;
    }

    //get all hotels
    public List<HotelDetailsDTO> getAllHotels() {

    List<Hotel> hotels = hotelRepository.findAll();

    return hotels.stream().map(hotel -> {

        // ✅ Sort rooms cheapest → expensive
        List<RoomDTO> rooms = hotel.getRooms().stream()
                .sorted(Comparator.comparing(Room::getPricePerNight))
                .map(room -> {

                    RoomDTO dto = new RoomDTO(
                            room.getId(),
                            room.getRoomType(),
                            room.getPricePerNight(),
                            room.getCapacity(),
                            room.getIsAvailable(),
                            room.getImages().stream()
                                    .map(RoomImage::getImageUrl)
                                    .toList(),
                            room.getHotel().getId(),
                            room.getDescription(),
                            room.getQuantity()
                    );

                    dto.setHotelId(room.getHotel().getId());
                    return dto;

                }).toList();

        return new HotelDetailsDTO(
                hotel.getId(),
                hotel.getName(),
                hotel.getDescription(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getImageUrl(),
                rooms
        );

    }).toList();
}


    //get hotels by owner
    public List<HotelDetailsDTO> getHotelsByOwner(Long ownerId) {

        List<Hotel> hotels = hotelRepository.findByHotelOwnerId(ownerId);

        return hotels.stream().map(hotel -> {

            List<RoomDTO> rooms = hotel.getRooms().stream()
                    .sorted(Comparator.comparing(Room::getPricePerNight))
                    .map(room -> {

                        RoomDTO dto = new RoomDTO(
                                room.getId(),
                                room.getRoomType(),
                                room.getPricePerNight(),
                                room.getCapacity(),
                                room.getIsAvailable(),
                                room.getImages().stream()
                                        .map(RoomImage::getImageUrl)
                                        .toList(),
                                room.getHotel().getId(),
                                room.getDescription(),
                                room.getQuantity()
                        );

                        dto.setHotelId(room.getHotel().getId());
                        return dto;

                    }).toList();

            return new HotelDetailsDTO(
                    hotel.getId(),
                    hotel.getName(),
                    hotel.getDescription(),
                    hotel.getAddress(),
                    hotel.getCity(),
                    hotel.getImageUrl(),
                    rooms
            );

        }).toList();
    }

}
