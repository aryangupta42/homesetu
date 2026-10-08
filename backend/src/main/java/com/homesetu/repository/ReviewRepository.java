package com.homesetu.repository;

import com.homesetu.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPgListingIdOrderByCreatedAtDesc(Long pgListingId);
    List<Review> findByStudentId(Long studentId);
}
