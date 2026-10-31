package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_profiles")
public class RoommateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long studentId;

    private String fullName;
    private String email;
    private String phone;
    private String college;
    private String course;
    private String academicYear;
    private String city;
    private String preferredLocality;

    private Double budgetMin = 5000.0;
    private Double budgetMax = 9000.0;
    private String targetMoveInDate;
    private String roomSharingPreference = "DOUBLE_SHARING"; // SINGLE, DOUBLE_SHARING, TRIPLE_SHARING, ANY
    private String gender = "ANY"; // MALE, FEMALE, ANY

    // Lifestyle attributes
    private String sleepSchedule = "FLEXIBLE"; // EARLY_BIRD (sleep by 10 PM), NIGHT_OWL (after 1 AM), FLEXIBLE
    private String cleanlinessLevel = "HIGH"; // HIGH (Daily neat freak), MODERATE, RELAXED
    private String studyHabit = "SILENT_ROOM"; // SILENT_ROOM, LIBRARY_FOCUSED, GROUP_STUDY
    private String foodPreference = "VEG_ONLY"; // VEG_ONLY, NON_VEG_OK, JAIN
    private String smokingHabit = "STRICTLY_NO"; // STRICTLY_NO, OCCASIONAL, OPEN
    private String guestPolicy = "STUDY_BUDDIES_ONLY"; // NO_OUTSIDE_GUESTS, STUDY_BUDDIES_ONLY, FRIENDS_WELCOME

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;
    private Boolean isVerifiedStudent = true;
    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RoommateProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPreferredLocality() { return preferredLocality; }
    public void setPreferredLocality(String preferredLocality) { this.preferredLocality = preferredLocality; }

    public Double getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Double budgetMin) { this.budgetMin = budgetMin; }

    public Double getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Double budgetMax) { this.budgetMax = budgetMax; }

    public String getTargetMoveInDate() { return targetMoveInDate; }
    public void setTargetMoveInDate(String targetMoveInDate) { this.targetMoveInDate = targetMoveInDate; }

    public String getRoomSharingPreference() { return roomSharingPreference; }
    public void setRoomSharingPreference(String roomSharingPreference) { this.roomSharingPreference = roomSharingPreference; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getSleepSchedule() { return sleepSchedule; }
    public void setSleepSchedule(String sleepSchedule) { this.sleepSchedule = sleepSchedule; }

    public String getCleanlinessLevel() { return cleanlinessLevel; }
    public void setCleanlinessLevel(String cleanlinessLevel) { this.cleanlinessLevel = cleanlinessLevel; }

    public String getStudyHabit() { return studyHabit; }
    public void setStudyHabit(String studyHabit) { this.studyHabit = studyHabit; }

    public String getFoodPreference() { return foodPreference; }
    public void setFoodPreference(String foodPreference) { this.foodPreference = foodPreference; }

    public String getSmokingHabit() { return smokingHabit; }
    public void setSmokingHabit(String smokingHabit) { this.smokingHabit = smokingHabit; }

    public String getGuestPolicy() { return guestPolicy; }
    public void setGuestPolicy(String guestPolicy) { this.guestPolicy = guestPolicy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Boolean getIsVerifiedStudent() { return isVerifiedStudent; }
    public void setIsVerifiedStudent(Boolean isVerifiedStudent) { this.isVerifiedStudent = isVerifiedStudent; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

