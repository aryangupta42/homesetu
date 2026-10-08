package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_requests")
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentCollege;

    @Column(nullable = false)
    private Long pgListingId;

    private String pgName;
    private String pgCity;
    private String pgLocality;

    @Column(nullable = false)
    private Long ownerId;

    private String roomType;
    private Double monthlyRent;

    private LocalDate moveInDate;
    private Integer durationMonths = 6;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String status = "PENDING"; // "PENDING", "ACCEPTED", "REJECTED", "CANCELLED"

    // IMPORTANT: Confirmation ID generated ONLY after PG owner accepts the request!
    @Column(unique = true)
    private String confirmationId;

    @Column(columnDefinition = "TEXT")
    private String ownerNotes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime actionDate;

    public BookingRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentCollege() { return studentCollege; }
    public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }

    public Long getPgListingId() { return pgListingId; }
    public void setPgListingId(Long pgListingId) { this.pgListingId = pgListingId; }

    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }

    public String getPgCity() { return pgCity; }
    public void setPgCity(String pgCity) { this.pgCity = pgCity; }

    public String getPgLocality() { return pgLocality; }
    public void setPgLocality(String pgLocality) { this.pgLocality = pgLocality; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Double getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(Double monthlyRent) { this.monthlyRent = monthlyRent; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getConfirmationId() { return confirmationId; }
    public void setConfirmationId(String confirmationId) { this.confirmationId = confirmationId; }

    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getActionDate() { return actionDate; }
    public void setActionDate(LocalDateTime actionDate) { this.actionDate = actionDate; }
}
