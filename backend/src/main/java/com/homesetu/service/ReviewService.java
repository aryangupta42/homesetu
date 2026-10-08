package com.homesetu.service;

import com.homesetu.model.PgListing;
import com.homesetu.model.Review;
import com.homesetu.repository.PgListingRepository;
import com.homesetu.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PgListingRepository pgListingRepository;

    @Transactional
    public Review addReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        Review saved = reviewRepository.save(review);

        // Update PG's average rating and totalReviews
        Optional<PgListing> pgOpt = pgListingRepository.findById(review.getPgListingId());
        if (pgOpt.isPresent()) {
            PgListing pg = pgOpt.get();
            List<Review> allReviews = reviewRepository.findByPgListingIdOrderByCreatedAtDesc(pg.getId());
            double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            double rounded = Math.round(avg * 10.0) / 10.0;
            pg.setRating(rounded);
            pg.setTotalReviews(allReviews.size());
            pgListingRepository.save(pg);
        }

        return saved;
    }

    public List<Review> getReviewsForPg(Long pgListingId) {
        return reviewRepository.findByPgListingIdOrderByCreatedAtDesc(pgListingId);
    }
}
