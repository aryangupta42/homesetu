package com.homesetu.repository;

import com.homesetu.model.RoommateWantedListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoommateWantedRepository extends JpaRepository<RoommateWantedListing, Long> {
    List<RoommateWantedListing> findByIsActiveTrueOrderByCreatedAtDesc();
    List<RoommateWantedListing> findByCityIgnoreCaseAndIsActiveTrue(String city);
}
