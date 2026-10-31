package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_wanted_listings")
public class RoommateWantedListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long postedByStudentId;

    private String studentName;
    private String studentCollege;
    private String studentPhone;
    private String studentEmail;

    private String pgName;
    private Long pgListingId;
    private String locality;
    private String city;

    private String roomType = "Double Sharing";
    private Integer vacantBeds = 1;
    private Double rentPerPerson;
    private Double depositPerPerson;

    private String availableFrom;
    private String genderPreference = "ANY"; // BOYS_ONLY, GIRLS_ONLY, ANY

    @Column(columnDefinition = "TEXT")
    private String roomDescription;

    private String preferredHabits;

    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public RoommateWantedListing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPostedByStudentId() { return postedByStudentId; }
    public void setPostedByStudentId(Long postedByStudentId) { this.postedByStudentId = postedByStudentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentCollege() { return studentCollege; }
    public void setStudentCollege(String studentCollege) { this.studentCollege = studentCollege; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }

    public Long getPgListingId() { return pgListingId; }
    public void setPgListingId(Long pgListingId) { this.pgListingId = pgListingId; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Integer getVacantBeds() { return vacantBeds; }
    public void setVacantBeds(Integer vacantBeds) { this.vacantBeds = vacantBeds; }

    public Double getRentPerPerson() { return rentPerPerson; }
    public void setRentPerPerson(Double rentPerPerson) { this.rentPerPerson = rentPerPerson; }

    public Double getDepositPerPerson() { return depositPerPerson; }
    public void setDepositPerPerson(Double depositPerPerson) { this.depositPerPerson = depositPerPerson; }

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }

    public String getGenderPreference() { return genderPreference; }
    public void setGenderPreference(String genderPreference) { this.genderPreference = genderPreference; }

    public String getRoomDescription() { return roomDescription; }
    public void setRoomDescription(String roomDescription) { this.roomDescription = roomDescription; }

    public String getPreferredHabits() { return preferredHabits; }
    public void setPreferredHabits(String preferredHabits) { this.preferredHabits = preferredHabits; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

