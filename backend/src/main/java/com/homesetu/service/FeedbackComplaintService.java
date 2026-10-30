package com.homesetu.service;

import com.homesetu.model.FeedbackComplaint;
import com.homesetu.repository.FeedbackComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class FeedbackComplaintService {

    @Autowired
    private FeedbackComplaintRepository repository;

    public FeedbackComplaint submit(FeedbackComplaint item) {
        if (item.getTicketId() == null || item.getTicketId().trim().isEmpty()) {
            item.setTicketId("HS-TKT-" + (10000 + new Random().nextInt(90000)));
        }
        if (item.getStatus() == null || item.getStatus().trim().isEmpty()) {
            item.setStatus("PENDING");
        }
        if (item.getCreatedAt() == null) {
            item.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(item);
    }

    public List<FeedbackComplaint> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<FeedbackComplaint> getById(Long id) {
        return repository.findById(id);
    }

    public Optional<FeedbackComplaint> updateStatus(Long id, String status, String adminResponse) {
        return repository.findById(id).map(item -> {
            if (status != null && !status.trim().isEmpty()) {
                item.setStatus(status.toUpperCase());
                if ("RESOLVED".equalsIgnoreCase(status) || "DISMISSED".equalsIgnoreCase(status)) {
                    item.setResolvedAt(LocalDateTime.now());
                }
            }
            if (adminResponse != null) {
                item.setAdminResponse(adminResponse);
            }
            return repository.save(item);
        });
    }
}
