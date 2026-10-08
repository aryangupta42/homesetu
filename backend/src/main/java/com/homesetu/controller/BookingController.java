package com.homesetu.controller;

import com.homesetu.dto.BookingActionRequest;
import com.homesetu.dto.BookingCreateRequest;
import com.homesetu.model.BookingRequest;
import com.homesetu.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingCreateRequest req) {
        try {
            BookingRequest booking = bookingService.createBooking(req);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/action")
    public ResponseEntity<?> ownerAction(@PathVariable Long id, @RequestBody BookingActionRequest req) {
        try {
            BookingRequest booking = bookingService.processOwnerAction(id, req.getAction(), req.getNote());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BookingRequest>> getStudentBookings(@PathVariable Long studentId) {
        return ResponseEntity.ok(bookingService.getStudentBookings(studentId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<BookingRequest>> getOwnerBookings(@PathVariable Long ownerId) {
        return ResponseEntity.ok(bookingService.getOwnerBookings(ownerId));
    }

    @GetMapping("/confirmation/{confirmationId}")
    public ResponseEntity<?> getByConfirmationId(@PathVariable String confirmationId) {
        return bookingService.getByConfirmationId(confirmationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return bookingService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
