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
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.dto.RoomDTO;
import com.perfectstay.perfectstay_backend.entity.Room;
import com.perfectstay.perfectstay_backend.service.RoomService;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    //get list of rooms by hotel id
    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable Long hotelId) {
        return service.getRoomsByHotel(hotelId);
    }

    //get room by id
    @GetMapping("/{id}")
    public Room getById(@PathVariable Long id) {
        return service.getById(id);
    }

    //create rooms through hotel id? wait i think this is post man
    @PostMapping("/hotel/{hotelId}")
    public Room create(@PathVariable Long hotelId, @RequestBody Room room) {
        return service.create(hotelId, room);
    }




    //edit rooms
@PutMapping("/rooms-edit/{roomId}/{ownerId}")
public ResponseEntity<Room> updateRoom(
        @PathVariable Long roomId,
        @PathVariable Long ownerId,
        @RequestBody RoomDTO dto
) {
    Room room = service.updateRoom(roomId, dto, ownerId);
    return ResponseEntity.ok(room);
}



    





    //remove rooms
    @DeleteMapping("delete-room/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {

        try {
            service.deleteRoomSafely(roomId);
            return ResponseEntity.ok("Room deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }


    //add rooms
    @PostMapping("/addRoom")
    public ResponseEntity<Room> addRoom(@RequestBody RoomDTO dto) {
        Room room = service.createRoom(dto);
        return ResponseEntity.ok(room);
    }


}
