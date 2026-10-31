package com.homesetu.controller;

import com.homesetu.model.Review;
import com.homesetu.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping("/pg/{pgId}")
    public ResponseEntity<List<Review>> getReviewsForPg(@PathVariable Long pgId) {
        return ResponseEntity.ok(reviewService.getReviewsForPg(pgId));
    }

    @PostMapping("/{id}/vote-helpful")
    public ResponseEntity<Review> voteHelpful(@PathVariable Long id) {
        Review updated = reviewService.voteHelpful(id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Review> reportReview(@PathVariable Long id) {
        Review updated = reviewService.reportReview(id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
