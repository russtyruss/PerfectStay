package com.perfectstay.perfectstay_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.perfectstay.perfectstay_backend.entity.Room;
import com.perfectstay.perfectstay_backend.entity.RoomImage;
import com.perfectstay.perfectstay_backend.repository.RoomImageRepository;
import com.perfectstay.perfectstay_backend.repository.RoomRepository;

@Service
public class RoomImageService {

    private final RoomImageRepository repo;
    private final RoomRepository roomRepo;

    public RoomImageService(RoomImageRepository repo, RoomRepository roomRepo) {
        this.repo = repo;
        this.roomRepo = roomRepo;
    }

    public RoomImage create(Long roomId, RoomImage img) {
        Room room = roomRepo.findById(roomId).orElse(null);
        img.setRoom(room);
        return repo.save(img);
    }

    public List<RoomImage> getImagesByRoom(Long roomId) {
        return repo.findByRoomId(roomId);
    }


    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
