package com.homesetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pg_listings")
public class PgListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String tagline;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String locality;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String pincode;

    @Column(columnDefinition = "TEXT")
    private String nearbyColleges;

    private String genderType; // "BOYS", "GIRLS", "COED"

    private Double monthlyRent; // Starting / minimum rent
    private Double securityDeposit;

    private Boolean foodIncluded = false;
    private String foodType; // "Veg Only", "Veg & Non-Veg", "No Meals"

    private Boolean hasAc = false;
    private Boolean hasWifi = true;
    private Boolean hasLaundry = true;
    private Boolean hasAttachedBath = true;
    private Boolean hasCctv = true;
    private Boolean hasPowerBackup = true;
    private Boolean hasGym = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String houseRules;

    private Integer noticePeriodDays = 30;
    private String gateClosingTime = "10:30 PM";

    private Integer totalRooms = 10;
    private Integer availableRooms = 3;

    private Boolean isVerified = false; // "Verified Listings" feature from slides

    private Double rating = 4.0;
    private Integer totalReviews = 0;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String images; // Comma separated URLs

    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    private LocalDateTime createdAt = LocalDateTime.now();

    public PgListing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getNearbyColleges() { return nearbyColleges; }
    public void setNearbyColleges(String nearbyColleges) { this.nearbyColleges = nearbyColleges; }

    public String getGenderType() { return genderType; }
    public void setGenderType(String genderType) { this.genderType = genderType; }

    public Double getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(Double monthlyRent) { this.monthlyRent = monthlyRent; }

    public Double getSecurityDeposit() { return securityDeposit; }
    public void setSecurityDeposit(Double securityDeposit) { this.securityDeposit = securityDeposit; }

    public Boolean getFoodIncluded() { return foodIncluded; }
    public void setFoodIncluded(Boolean foodIncluded) { this.foodIncluded = foodIncluded; }

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }

    public Boolean getHasAc() { return hasAc; }
    public void setHasAc(Boolean hasAc) { this.hasAc = hasAc; }

    public Boolean getHasWifi() { return hasWifi; }
    public void setHasWifi(Boolean hasWifi) { this.hasWifi = hasWifi; }

    public Boolean getHasLaundry() { return hasLaundry; }
    public void setHasLaundry(Boolean hasLaundry) { this.hasLaundry = hasLaundry; }

    public Boolean getHasAttachedBath() { return hasAttachedBath; }
    public void setHasAttachedBath(Boolean hasAttachedBath) { this.hasAttachedBath = hasAttachedBath; }

    public Boolean getHasCctv() { return hasCctv; }
    public void setHasCctv(Boolean hasCctv) { this.hasCctv = hasCctv; }

    public Boolean getHasPowerBackup() { return hasPowerBackup; }
    public void setHasPowerBackup(Boolean hasPowerBackup) { this.hasPowerBackup = hasPowerBackup; }

    public Boolean getHasGym() { return hasGym; }
    public void setHasGym(Boolean hasGym) { this.hasGym = hasGym; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHouseRules() { return houseRules; }
    public void setHouseRules(String houseRules) { this.houseRules = houseRules; }

    public Integer getNoticePeriodDays() { return noticePeriodDays; }
    public void setNoticePeriodDays(Integer noticePeriodDays) { this.noticePeriodDays = noticePeriodDays; }

    public String getGateClosingTime() { return gateClosingTime; }
    public void setGateClosingTime(String gateClosingTime) { this.gateClosingTime = gateClosingTime; }

    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

    public Integer getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(Integer availableRooms) { this.availableRooms = availableRooms; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
