package com.homesetu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "room_options")
public class RoomOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long pgListingId;

    @Column(nullable = false)
    private String roomType; // "Single Sharing", "Double Sharing", "Triple Sharing"

    @Column(nullable = false)
    private Double pricePerMonth;

    private Integer totalBeds;
    private Integer availableBeds;
    private Boolean hasBalcony = false;
    private Boolean hasAttachedWashroom = true;

    public RoomOption() {}

    public RoomOption(Long pgListingId, String roomType, Double pricePerMonth, Integer totalBeds, Integer availableBeds, Boolean hasBalcony, Boolean hasAttachedWashroom) {
        this.pgListingId = pgListingId;
        this.roomType = roomType;
        this.pricePerMonth = pricePerMonth;
        this.totalBeds = totalBeds;
        this.availableBeds = availableBeds;
        this.hasBalcony = hasBalcony;
        this.hasAttachedWashroom = hasAttachedWashroom;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPgListingId() { return pgListingId; }
    public void setPgListingId(Long pgListingId) { this.pgListingId = pgListingId; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Double getPricePerMonth() { return pricePerMonth; }
    public void setPricePerMonth(Double pricePerMonth) { this.pricePerMonth = pricePerMonth; }

    public Integer getTotalBeds() { return totalBeds; }
    public void setTotalBeds(Integer totalBeds) { this.totalBeds = totalBeds; }

    public Integer getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(Integer availableBeds) { this.availableBeds = availableBeds; }

    public Boolean getHasBalcony() { return hasBalcony; }
    public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }

    public Boolean getHasAttachedWashroom() { return hasAttachedWashroom; }
    public void setHasAttachedWashroom(Boolean hasAttachedWashroom) { this.hasAttachedWashroom = hasAttachedWashroom; }
}
