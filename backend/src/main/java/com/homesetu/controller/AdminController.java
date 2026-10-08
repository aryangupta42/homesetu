package com.homesetu.controller;

import com.homesetu.model.User;
import com.homesetu.repository.BookingRequestRepository;
import com.homesetu.repository.PgListingRepository;
import com.homesetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PgListingRepository pgListingRepository;

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", userRepository.findByRole("STUDENT").size());
        stats.put("totalOwners", userRepository.findByRole("OWNER").size());
        stats.put("totalListings", pgListingRepository.count());
        stats.put("verifiedListings", pgListingRepository.findByIsVerifiedTrue().size());
        stats.put("totalBookings", bookingRequestRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
