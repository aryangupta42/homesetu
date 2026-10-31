package com.homesetu.repository;

import com.homesetu.model.RoommateConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoommateConnectionRepository extends JpaRepository<RoommateConnection, Long> {
    @Query("SELECT c FROM RoommateConnection c WHERE c.requesterStudentId = :studentId OR c.recipientStudentId = :studentId ORDER BY c.updatedAt DESC")
    List<RoommateConnection> findAllForStudent(Long studentId);

    @Query("SELECT c FROM RoommateConnection c WHERE (c.requesterStudentId = :s1 AND c.recipientStudentId = :s2) OR (c.requesterStudentId = :s2 AND c.recipientStudentId = :s1)")
    Optional<RoommateConnection> findBetweenStudents(Long s1, Long s2);
}

