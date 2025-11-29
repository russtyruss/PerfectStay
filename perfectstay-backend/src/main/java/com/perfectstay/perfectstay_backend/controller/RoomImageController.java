package com.perfectstay.perfectstay_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfectstay.perfectstay_backend.entity.RoomImage;
import com.perfectstay.perfectstay_backend.service.RoomImageService;

@RestController
@RequestMapping("/api/room-images")
@CrossOrigin
public class RoomImageController {

    private final RoomImageService service;

    public RoomImageController(RoomImageService service) {
        this.service = service;
    }

    @PostMapping("/room/{roomId}")
    public RoomImage create(@PathVariable Long roomId, @RequestBody RoomImage img) {
        return service.create(roomId, img);
    }

    @GetMapping("/room/{roomId}")
    public List<RoomImage> getImages(@PathVariable Long roomId) {
        return service.getImagesByRoom(roomId);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Long id) {
        return service.delete(id);
    }
}
