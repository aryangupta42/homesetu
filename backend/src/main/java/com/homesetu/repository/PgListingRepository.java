package com.homesetu.repository;

import com.homesetu.model.PgListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PgListingRepository extends JpaRepository<PgListing, Long>, JpaSpecificationExecutor<PgListing> {
    List<PgListing> findByOwnerId(Long ownerId);
    List<PgListing> findByCityIgnoreCase(String city);
    List<PgListing> findByIsVerifiedTrue();
}
