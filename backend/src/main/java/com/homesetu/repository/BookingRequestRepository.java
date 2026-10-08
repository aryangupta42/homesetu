package com.homesetu.repository;

import com.homesetu.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<BookingRequest> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<BookingRequest> findByPgListingIdOrderByCreatedAtDesc(Long pgListingId);
    Optional<BookingRequest> findByConfirmationId(String confirmationId);
}
