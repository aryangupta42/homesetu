package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_complaints")
public class FeedbackComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketId;

    @Column(nullable = false)
    private String type; // "COMPLAINT" or "FEEDBACK"

    @Column(nullable = false)
    private String category; // e.g. "Maintenance", "Security", "Food Quality", "Platform Experience", etc.

    private String priority = "MEDIUM"; // "LOW", "MEDIUM", "HIGH", "URGENT"

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private Long pgId;
    private String pgName;

    private Long submitterId;
    private String submitterName;
    private String submitterEmail;
    private String submitterPhone;
    private String submitterRole = "STUDENT"; // "STUDENT", "OWNER", "GUEST"

    private String status = "PENDING"; // "PENDING", "IN_REVIEW", "RESOLVED", "DISMISSED"

    @Column(columnDefinition = "TEXT")
    private String adminResponse;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    public FeedbackComplaint() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getPgId() { return pgId; }
    public void setPgId(Long pgId) { this.pgId = pgId; }

    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }

    public Long getSubmitterId() { return submitterId; }
    public void setSubmitterId(Long submitterId) { this.submitterId = submitterId; }

    public String getSubmitterName() { return submitterName; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }

    public String getSubmitterEmail() { return submitterEmail; }
    public void setSubmitterEmail(String submitterEmail) { this.submitterEmail = submitterEmail; }

    public String getSubmitterPhone() { return submitterPhone; }
    public void setSubmitterPhone(String submitterPhone) { this.submitterPhone = submitterPhone; }

    public String getSubmitterRole() { return submitterRole; }
    public void setSubmitterRole(String submitterRole) { this.submitterRole = submitterRole; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
