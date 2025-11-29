package com.perfectstay.perfectstay_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perfectstay.perfectstay_backend.dto.RoomDTO;
import com.perfectstay.perfectstay_backend.entity.Hotel;
import com.perfectstay.perfectstay_backend.entity.Room;
import com.perfectstay.perfectstay_backend.entity.RoomImage;
import com.perfectstay.perfectstay_backend.repository.BookingRepository;
import com.perfectstay.perfectstay_backend.repository.HotelRepository;
import com.perfectstay.perfectstay_backend.repository.RoomImageRepository;
import com.perfectstay.perfectstay_backend.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final RoomImageRepository roomImageRepository;
    private final BookingRepository bookingRepository;


    public RoomService(RoomRepository roomRepository,
                    HotelRepository hotelRepository,
                    RoomImageRepository roomImageRepository, BookingRepository bookingRepository) {

        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.roomImageRepository = roomImageRepository;
        this.bookingRepository = bookingRepository;
    }


    //get list of rooms by hotel id
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    //get room by id
    public Room getById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    //idk actually postmannn
    public Room create(Long hotelId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    //edit room
@Transactional
public Room updateRoom(Long roomId, RoomDTO dto, Long ownerId) {

    Room existingRoom = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

    if (!existingRoom.getHotel().getHotelOwner().getId().equals(ownerId)) {
        throw new RuntimeException("Unauthorized");
    }

    existingRoom.setRoomType(dto.getRoomType());
    existingRoom.setDescription(dto.getDescription());
    existingRoom.setCapacity(dto.getCapacity());
    existingRoom.setQuantity(dto.getQuantity());
    existingRoom.setPricePerNight(dto.getPricePerNight());
    existingRoom.setIsAvailable(dto.getIsAvailable());

    // ✅ SAFE IMAGE REPLACEMENT — THIS IS THE FIX
    existingRoom.getImages().clear();

    if (dto.getImages() != null && !dto.getImages().isEmpty()) {
        for (String url : dto.getImages()) {
            RoomImage img = new RoomImage();
            img.setImageUrl(url);
            img.setRoom(existingRoom);
            existingRoom.getImages().add(img);
        }
    }

    return roomRepository.save(existingRoom);
}




//deleteRoom
   @Transactional
    public void deleteRoomSafely(Long roomId) {

        boolean hasBookings =
            bookingRepository.hasActiveOrUpcomingBookingsForRoom(roomId);

        if (hasBookings) {
            throw new RuntimeException(
                "This room still has active or upcoming bookings and cannot be deleted."
            );
        }

        roomRepository.deleteById(roomId);
    }

    //add room sa hotel owner
    public Room createRoom(RoomDTO dto) {

        if (dto.getHotelId() == null) {
            throw new IllegalArgumentException("Hotel ID is required");
        }

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = new Room();
        room.setRoomType(dto.getRoomType());
        room.setPricePerNight(dto.getPricePerNight());
        room.setCapacity(dto.getCapacity());
        room.setIsAvailable(dto.getIsAvailable());
        room.setDescription(dto.getDescription());   // ✅ FIX
        room.setQuantity(dto.getQuantity());         // ✅ FIX
        room.setHotel(hotel);

        // ✅ Save room first
        Room savedRoom = roomRepository.save(room);

        // ✅ Save images
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<RoomImage> images = dto.getImages().stream().map(url -> {
                RoomImage image = new RoomImage();
                image.setImageUrl(url);
                image.setRoom(savedRoom);
                return image;
            }).toList();

            roomImageRepository.saveAll(images);
            savedRoom.setImages(images);
        }

        return savedRoom;
    }

}
