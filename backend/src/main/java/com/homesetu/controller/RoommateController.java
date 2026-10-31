package com.homesetu.controller;

import com.homesetu.model.*;
import com.homesetu.service.RoommateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roommates")
public class RoommateController {

    @Autowired
    private RoommateService roommateService;

    @GetMapping("/profile/{studentId}")
    public ResponseEntity<RoommateProfile> getProfile(@PathVariable Long studentId) {
        return roommateService.getProfileByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<RoommateProfile> saveProfile(@RequestBody RoommateProfile profile) {
        return ResponseEntity.ok(roommateService.saveOrUpdateProfile(profile));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false, defaultValue = "All") String city) {
        return ResponseEntity.ok(roommateService.getRecommendedRoommates(studentId, city));
    }

    @PostMapping("/connect")
    public ResponseEntity<RoommateConnection> sendRequest(@RequestBody Map<String, Object> payload) {
        Long requesterId = Long.valueOf(payload.get("requesterStudentId").toString());
        Long recipientId = Long.valueOf(payload.get("recipientStudentId").toString());
        String message = (payload.get("message") != null) ? payload.get("message").toString() : "Hi! Would love to connect as prospective roommates on HomeSetu.";
        return ResponseEntity.ok(roommateService.sendRequest(requesterId, recipientId, message));
    }

    @PutMapping("/connect/{id}/status")
    public ResponseEntity<RoommateConnection> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(roommateService.updateConnectionStatus(id, status));
    }

    @GetMapping("/connections/{studentId}")
    public ResponseEntity<List<RoommateConnection>> getConnections(@PathVariable Long studentId) {
        return ResponseEntity.ok(roommateService.getStudentConnections(studentId));
    }

    @GetMapping("/messages/{connectionId}")
    public ResponseEntity<List<RoommateMessage>> getMessages(@PathVariable Long connectionId) {
        return ResponseEntity.ok(roommateService.getMessages(connectionId));
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload) {
        try {
            Long connectionId = Long.valueOf(payload.get("connectionId").toString());
            Long senderId = Long.valueOf(payload.get("senderStudentId").toString());
            String senderName = payload.get("senderName") != null ? payload.get("senderName").toString() : "Student";
            String text = payload.get("content").toString();
            return ResponseEntity.ok(roommateService.sendMessage(connectionId, senderId, senderName, text));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/find-together")
    public ResponseEntity<List<PgListing>> findTogether(
            @RequestParam(required = false) Double budget1,
            @RequestParam(required = false) Double budget2,
            @RequestParam(required = false, defaultValue = "All") String city) {
        return ResponseEntity.ok(roommateService.findPgTogether(budget1, budget2, city));
    }

    @GetMapping("/wanted")
    public ResponseEntity<List<RoommateWantedListing>> getWanted(@RequestParam(required = false, defaultValue = "All") String city) {
        return ResponseEntity.ok(roommateService.getWantedListings(city));
    }

    @PostMapping("/wanted")
    public ResponseEntity<RoommateWantedListing> postWanted(@RequestBody RoommateWantedListing listing) {
        return ResponseEntity.ok(roommateService.postWantedListing(listing));
    }
}

