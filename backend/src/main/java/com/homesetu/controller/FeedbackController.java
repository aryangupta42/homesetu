package com.homesetu.controller;

import com.homesetu.model.FeedbackComplaint;
import com.homesetu.service.FeedbackComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackComplaintService service;

    @PostMapping
    public ResponseEntity<FeedbackComplaint> submitFeedback(@RequestBody FeedbackComplaint item) {
        FeedbackComplaint saved = service.submit(item);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<FeedbackComplaint>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        String adminResponse = payload.get("adminResponse");
        return service.updateStatus(id, status, adminResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
