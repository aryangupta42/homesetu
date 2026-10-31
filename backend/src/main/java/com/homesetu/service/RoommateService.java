package com.homesetu.service;

import com.homesetu.model.*;
import com.homesetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RoommateService {

    @Autowired
    private RoommateProfileRepository profileRepository;

    @Autowired
    private RoommateConnectionRepository connectionRepository;

    @Autowired
    private RoommateMessageRepository messageRepository;

    @Autowired
    private RoommateWantedRepository wantedRepository;

    @Autowired
    private PgListingRepository pgListingRepository;

    // 1. Get or Create Profile
    public Optional<RoommateProfile> getProfileByStudentId(Long studentId) {
        return profileRepository.findByStudentId(studentId);
    }

    @Transactional
    public RoommateProfile saveOrUpdateProfile(RoommateProfile profile) {
        profile.setUpdatedAt(LocalDateTime.now());
        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(LocalDateTime.now());
        }
        return profileRepository.save(profile);
    }

    // 2. Compatibility Matching Algorithm (Weighted Score 0 - 100)
    public int calculateCompatibility(RoommateProfile p1, RoommateProfile p2) {
        if (p1 == null || p2 == null) return 75;

        int score = 0;

        // College & Location (25 pts)
        if (p1.getCollege() != null && p2.getCollege() != null && 
            p1.getCollege().equalsIgnoreCase(p2.getCollege())) {
            score += 15;
        } else if (p1.getCity() != null && p2.getCity() != null && 
                   p1.getCity().equalsIgnoreCase(p2.getCity())) {
            score += 10;
        }

        // Budget Compatibility (20 pts)
        double minOverlap = Math.max(p1.getBudgetMin(), p2.getBudgetMin());
        double maxOverlap = Math.min(p1.getBudgetMax(), p2.getBudgetMax());
        if (minOverlap <= maxOverlap) {
            score += 20;
        } else if (Math.abs(p1.getBudgetMax() - p2.getBudgetMin()) <= 2000 || 
                   Math.abs(p2.getBudgetMax() - p1.getBudgetMin()) <= 2000) {
            score += 10;
        }

        // Sleep Schedule (15 pts)
        if (p1.getSleepSchedule() != null && p2.getSleepSchedule() != null) {
            if (p1.getSleepSchedule().equals(p2.getSleepSchedule())) {
                score += 15;
            } else if ("FLEXIBLE".equals(p1.getSleepSchedule()) || "FLEXIBLE".equals(p2.getSleepSchedule())) {
                score += 10;
            }
        }

        // Cleanliness Standard (15 pts)
        if (p1.getCleanlinessLevel() != null && p2.getCleanlinessLevel() != null) {
            if (p1.getCleanlinessLevel().equals(p2.getCleanlinessLevel())) {
                score += 15;
            } else {
                score += 8;
            }
        }

        // Food & Dietary Preference (15 pts)
        if (p1.getFoodPreference() != null && p2.getFoodPreference() != null) {
            if (p1.getFoodPreference().equals(p2.getFoodPreference())) {
                score += 15;
            } else if (!"JAIN".equals(p1.getFoodPreference()) && !"JAIN".equals(p2.getFoodPreference())) {
                score += 10;
            }
        }

        // Study Habit & Quiet Hours (10 pts)
        if (p1.getStudyHabit() != null && p2.getStudyHabit() != null) {
            if (p1.getStudyHabit().equals(p2.getStudyHabit())) {
                score += 10;
            } else {
                score += 5;
            }
        }

        return Math.min(100, Math.max(45, score));
    }

    // 3. Recommended Roommates
    public List<Map<String, Object>> getRecommendedRoommates(Long studentId, String city) {
        List<RoommateProfile> allProfiles = (city != null && !city.isEmpty() && !"All".equalsIgnoreCase(city))
                ? profileRepository.findByCityIgnoreCaseAndIsActiveTrue(city)
                : profileRepository.findByIsActiveTrue();

        Optional<RoommateProfile> currentStudentProfileOpt = (studentId != null) 
                ? profileRepository.findByStudentId(studentId) 
                : Optional.empty();

        RoommateProfile myProfile = currentStudentProfileOpt.orElse(null);

        List<Map<String, Object>> results = new ArrayList<>();
        for (RoommateProfile other : allProfiles) {
            if (studentId != null && other.getStudentId().equals(studentId)) {
                continue; // Do not recommend oneself
            }
            int score = (myProfile != null) ? calculateCompatibility(myProfile, other) : 85;

            Map<String, Object> item = new HashMap<>();
            item.put("profile", other);
            item.put("compatibilityScore", score);
            results.add(item);
        }

        // Sort descending by compatibility score
        results.sort((a, b) -> Integer.compare((int) b.get("compatibilityScore"), (int) a.get("compatibilityScore")));
        return results;
    }

    // 4. Connection Requests
    @Transactional
    public RoommateConnection sendRequest(Long requesterId, Long recipientId, String message) {
        Optional<RoommateConnection> existing = connectionRepository.findBetweenStudents(requesterId, recipientId);
        if (existing.isPresent()) {
            RoommateConnection conn = existing.get();
            conn.setStatus("PENDING");
            conn.setRequesterStudentId(requesterId);
            conn.setRecipientStudentId(recipientId);
            conn.setInitialMessage(message);
            conn.setUpdatedAt(LocalDateTime.now());
            return connectionRepository.save(conn);
        }

        RoommateConnection conn = new RoommateConnection();
        conn.setRequesterStudentId(requesterId);
        conn.setRecipientStudentId(recipientId);
        conn.setStatus("PENDING");
        conn.setInitialMessage(message);

        // Fetch names & compatibility
        profileRepository.findByStudentId(requesterId).ifPresent(p -> {
            conn.setRequesterName(p.getFullName());
            conn.setRequesterCollege(p.getCollege());
        });
        profileRepository.findByStudentId(recipientId).ifPresent(p -> {
            conn.setRecipientName(p.getFullName());
            conn.setRecipientCollege(p.getCollege());
        });

        conn.setCompatibilityScore(88);
        return connectionRepository.save(conn);
    }

    @Transactional
    public RoommateConnection updateConnectionStatus(Long connectionId, String status) {
        RoommateConnection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        conn.setStatus(status.toUpperCase());
        conn.setUpdatedAt(LocalDateTime.now());
        return connectionRepository.save(conn);
    }

    public List<RoommateConnection> getStudentConnections(Long studentId) {
        return connectionRepository.findAllForStudent(studentId);
    }

    // 5. Private 1-to-1 Chat (Allowed strictly if ACCEPTED)
    @Transactional
    public RoommateMessage sendMessage(Long connectionId, Long senderId, String senderName, String text) {
        RoommateConnection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!"ACCEPTED".equalsIgnoreCase(conn.getStatus())) {
            throw new IllegalStateException("Private chat is enabled only after mutual connection acceptance.");
        }

        RoommateMessage msg = new RoommateMessage(connectionId, senderId, senderName, text);
        return messageRepository.save(msg);
    }

    public List<RoommateMessage> getMessages(Long connectionId) {
        return messageRepository.findByConnectionIdOrderBySentAtAsc(connectionId);
    }

    // 6. Find PG Together (Combined Budget Discovery)
    public List<PgListing> findPgTogether(Double budget1, Double budget2, String city) {
        double combinedBudget = (budget1 != null ? budget1 : 7000.0) + (budget2 != null ? budget2 : 7000.0);
        List<PgListing> all = pgListingRepository.findAll();
        List<PgListing> matches = new ArrayList<>();

        for (PgListing pg : all) {
            if (city != null && !city.isEmpty() && !"All".equalsIgnoreCase(city)) {
                if (!city.equalsIgnoreCase(pg.getCity())) continue;
            }
            // Room where double sharing rent per person is within budget
            if (pg.getMonthlyRent() != null && pg.getMonthlyRent() * 2 <= combinedBudget * 1.15) {
                matches.add(pg);
            }
        }
        return matches;
    }

    // 7. Roommate Wanted Listings (Vacant beds)
    public List<RoommateWantedListing> getWantedListings(String city) {
        if (city != null && !city.isEmpty() && !"All".equalsIgnoreCase(city)) {
            return wantedRepository.findByCityIgnoreCaseAndIsActiveTrue(city);
        }
        return wantedRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public RoommateWantedListing postWantedListing(RoommateWantedListing listing) {
        listing.setCreatedAt(LocalDateTime.now());
        listing.setIsActive(true);
        return wantedRepository.save(listing);
    }
}
