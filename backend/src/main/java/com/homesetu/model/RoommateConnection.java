package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_connections")
public class RoommateConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long requesterStudentId;

    @Column(nullable = false)
    private Long recipientStudentId;

    private String requesterName;
    private String recipientName;
    private String requesterCollege;
    private String recipientCollege;

    private Integer compatibilityScore = 85;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, CANCELLED

    private String initialMessage;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RoommateConnection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRequesterStudentId() { return requesterStudentId; }
    public void setRequesterStudentId(Long requesterStudentId) { this.requesterStudentId = requesterStudentId; }

    public Long getRecipientStudentId() { return recipientStudentId; }
    public void setRecipientStudentId(Long recipientStudentId) { this.recipientStudentId = recipientStudentId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRequesterCollege() { return requesterCollege; }
    public void setRequesterCollege(String requesterCollege) { this.requesterCollege = requesterCollege; }

    public String getRecipientCollege() { return recipientCollege; }
    public void setRecipientCollege(String recipientCollege) { this.recipientCollege = recipientCollege; }

    public Integer getCompatibilityScore() { return compatibilityScore; }
    public void setCompatibilityScore(Integer compatibilityScore) { this.compatibilityScore = compatibilityScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInitialMessage() { return initialMessage; }
    public void setInitialMessage(String initialMessage) { this.initialMessage = initialMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
