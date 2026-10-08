package com.homesetu.dto;

import java.time.LocalDate;

public class BookingCreateRequest {
    private Long studentId;
    private Long pgListingId;
    private String roomType;
    private Double monthlyRent;
    private LocalDate moveInDate;
    private Integer durationMonths = 6;
    private String message;
    private String studentCollege;
    private String studentPhone;

    public BookingCreateRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getPgListingId() { return pgListingId; }
    public void setPgListingId(Long pgListingId) { this.pgListingId = pgListingId; }

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

    public String getStudentCollege() { return studentCollege; }
    public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }
}
