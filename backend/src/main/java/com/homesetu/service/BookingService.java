package com.homesetu.service;

import com.homesetu.dto.BookingCreateRequest;
import com.homesetu.model.BookingRequest;
import com.homesetu.model.PgListing;
import com.homesetu.model.RoomOption;
import com.homesetu.model.User;
import com.homesetu.repository.BookingRequestRepository;
import com.homesetu.repository.PgListingRepository;
import com.homesetu.repository.RoomOptionRepository;
import com.homesetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private PgListingRepository pgListingRepository;

    @Autowired
    private RoomOptionRepository roomOptionRepository;

    @Autowired
    private UserRepository userRepository;

    public BookingRequest createBooking(BookingCreateRequest req) {
        Optional<PgListing> pgOpt = pgListingRepository.findById(req.getPgListingId());
        if (pgOpt.isEmpty()) {
            throw new RuntimeException("PG Listing not found!");
        }

        PgListing pg = pgOpt.get();
        User student = userRepository.findById(req.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found!"));

        BookingRequest booking = new BookingRequest();
        booking.setStudentId(student.getId());
        booking.setStudentName(student.getFullName());
        booking.setStudentEmail(student.getEmail());
        booking.setStudentPhone(req.getStudentPhone() != null ? req.getStudentPhone() : student.getPhone());
        booking.setStudentCollege(req.getStudentCollege() != null ? req.getStudentCollege() : student.getCollege());

        booking.setPgListingId(pg.getId());
        booking.setPgName(pg.getName());
        booking.setPgCity(pg.getCity());
        booking.setPgLocality(pg.getLocality());
        booking.setOwnerId(pg.getOwnerId());

        booking.setRoomType(req.getRoomType() != null ? req.getRoomType() : "Standard Room");
        booking.setMonthlyRent(req.getMonthlyRent() != null ? req.getMonthlyRent() : pg.getMonthlyRent());
        booking.setMoveInDate(req.getMoveInDate());
        booking.setDurationMonths(req.getDurationMonths() != null ? req.getDurationMonths() : 6);
        booking.setMessage(req.getMessage());

        // Note: Starts strictly as PENDING. Confirmation ID is NULL until owner approval.
        booking.setStatus("PENDING");
        booking.setConfirmationId(null);
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRequestRepository.save(booking);
    }

    @Transactional
    public BookingRequest processOwnerAction(Long bookingId, String action, String note) {
        BookingRequest booking = bookingRequestRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking request not found!"));

        booking.setOwnerNotes(note);
        booking.setActionDate(LocalDateTime.now());

        if ("ACCEPT".equalsIgnoreCase(action)) {
            booking.setStatus("ACCEPTED");

            // Generate unique Confirmation ID as per slide requirements!
            String confirmationId = generateUniqueConfirmationId();
            booking.setConfirmationId(confirmationId);

            // Update room availability
            Optional<PgListing> pgOpt = pgListingRepository.findById(booking.getPgListingId());
            if (pgOpt.isPresent()) {
                PgListing pg = pgOpt.get();
                if (pg.getAvailableRooms() != null && pg.getAvailableRooms() > 0) {
                    pg.setAvailableRooms(pg.getAvailableRooms() - 1);
                    pgListingRepository.save(pg);
                }
            }

            // Decrement bed in specific room option if exists
            List<RoomOption> rooms = roomOptionRepository.findByPgListingId(booking.getPgListingId());
            for (RoomOption ro : rooms) {
                if (ro.getRoomType().equalsIgnoreCase(booking.getRoomType())) {
                    if (ro.getAvailableBeds() != null && ro.getAvailableBeds() > 0) {
                        ro.setAvailableBeds(ro.getAvailableBeds() - 1);
                        roomOptionRepository.save(ro);
                    }
                    break;
                }
            }
        } else if ("REJECT".equalsIgnoreCase(action)) {
            booking.setStatus("REJECTED");
        }

        return bookingRequestRepository.save(booking);
    }

    private String generateUniqueConfirmationId() {
        int year = LocalDateTime.now().getYear();
        Random random = new Random();
        String id;
        do {
            int code = 1000 + random.nextInt(9000);
            id = "HS-" + year + "-" + code;
        } while (bookingRequestRepository.findByConfirmationId(id).isPresent());
        return id;
    }

    public List<BookingRequest> getStudentBookings(Long studentId) {
        return bookingRequestRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<BookingRequest> getOwnerBookings(Long ownerId) {
        return bookingRequestRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Optional<BookingRequest> getByConfirmationId(String confirmationId) {
        return bookingRequestRepository.findByConfirmationId(confirmationId);
    }

    public Optional<BookingRequest> getById(Long id) {
        return bookingRequestRepository.findById(id);
    }
}
