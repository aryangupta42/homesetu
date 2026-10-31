package com.homesetu.repository;

import com.homesetu.model.RoommateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoommateProfileRepository extends JpaRepository<RoommateProfile, Long> {
    Optional<RoommateProfile> findByStudentId(Long studentId);
    List<RoommateProfile> findByIsActiveTrue();
    List<RoommateProfile> findByCityIgnoreCaseAndIsActiveTrue(String city);
}

