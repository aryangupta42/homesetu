package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long pgListingId;

    @Column(nullable = false)
    private Long studentId;

    private String studentName;
    private String studentCollege;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private Integer cleanlinessScore = 5;
    private Integer foodScore = 5;
    private Integer amenitiesScore = 5;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(Long pgListingId, Long studentId, String studentName, String studentCollege, Integer rating, String comment, Integer cleanlinessScore, Integer foodScore, Integer amenitiesScore) {
        this.pgListingId = pgListingId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCollege = studentCollege;
        this.rating = rating;
        this.comment = comment;
        this.cleanlinessScore = cleanlinessScore;
        this.foodScore = foodScore;
        this.amenitiesScore = amenitiesScore;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPgListingId() { return pgListingId; }
    public void setPgListingId(Long pgListingId) { this.pgListingId = pgListingId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentCollege() { return studentCollege; }
    public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getCleanlinessScore() { return cleanlinessScore; }
    public void setCleanlinessScore(Integer cleanlinessScore) { this.cleanlinessScore = cleanlinessScore; }

    public Integer getFoodScore() { return foodScore; }
    public void setFoodScore(Integer foodScore) { this.foodScore = foodScore; }

    public Integer getAmenitiesScore() { return amenitiesScore; }
    public void setAmenitiesScore(Integer amenitiesScore) { this.amenitiesScore = amenitiesScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
