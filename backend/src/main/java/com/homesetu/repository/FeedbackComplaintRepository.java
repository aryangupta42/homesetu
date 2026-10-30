package com.homesetu.repository;

import com.homesetu.model.FeedbackComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackComplaintRepository extends JpaRepository<FeedbackComplaint, Long> {
    List<FeedbackComplaint> findAllByOrderByCreatedAtDesc();
    List<FeedbackComplaint> findByTypeOrderByCreatedAtDesc(String type);
    List<FeedbackComplaint> findByStatusOrderByCreatedAtDesc(String status);
    Optional<FeedbackComplaint> findByTicketId(String ticketId);
    boolean existsByTicketId(String ticketId);
}
