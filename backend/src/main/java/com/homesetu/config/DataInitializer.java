package com.homesetu.config;

import com.homesetu.model.*;
import com.homesetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PgListingRepository pgListingRepository;

    @Autowired
    private RoomOptionRepository roomOptionRepository;

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("🌱 Initializing HomeSetu Seed Data matching Presentation...");

        // 1. Users (3 Core Roles: Student, PG Owner, Admin)
        User student = userRepository.save(new User(
                "Rahul Verma",
                "student@homesetu.com",
                "123456",
                "STUDENT",
                "+91 98765 00001",
                "College of Engineering Pune (COEP)",
                "Pune"
        ));

        User rameshOwner = userRepository.save(new User(
                "Ramesh Sharma",
                "owner@homesetu.com",
                "123456",
                "OWNER",
                "+91 91234 56789",
                null,
                "Pune"
        ));

        User sunitaOwner = userRepository.save(new User(
                "Sunita Patil",
                "sunita@homesetu.com",
                "123456",
                "OWNER",
                "+91 92345 67890",
                null,
                "Pune"
        ));

        User adminUser = userRepository.save(new User(
                "HomeSetu Admin",
                "admin@homesetu.com",
                "admin123",
                "ADMIN",
                "+91 99999 88888",
                null,
                "Pune"
        ));

        // 2. PG Listings (from Slide 3 & Slide 4)
        // 2.1 Sunrise PG — Kothrud
        PgListing pg1 = new PgListing();
        pg1.setName("Sunrise PG — Kothrud");
        pg1.setTagline("Student Living near MIT-WPU & COEP with Homely Food");
        pg1.setCity("Pune");
        pg1.setLocality("Kothrud");
        pg1.setAddress("Plot 42, Anand Nagar, Paud Road, Kothrud");
        pg1.setPincode("411038");
        pg1.setNearbyColleges("MIT World Peace University (1.1 km), Cummins College (2.2 km), COEP (4.8 km)");
        pg1.setGenderType("BOYS");
        pg1.setMonthlyRent(7500.0);
        pg1.setSecurityDeposit(15000.0);
        pg1.setFoodIncluded(true);
        pg1.setFoodType("Veg & Non-Veg");
        pg1.setHasAc(true);
        pg1.setHasWifi(true);
        pg1.setHasLaundry(true);
        pg1.setHasAttachedBath(true);
        pg1.setHasCctv(true);
        pg1.setHasPowerBackup(true);
        pg1.setHasGym(false);
        pg1.setDescription("Sunrise PG is tailored for engineering and management students in Kothrud. Fully furnished rooms with high-speed 300 Mbps Wi-Fi, hygienic 3-time meals prepared by professional chefs, and 24/7 security.");
        pg1.setHouseRules("Gate closes at 10:30 PM. No alcohol or smoking on premises. Quiet study hours after 10 PM. Non-resident visitors allowed until 7 PM.");
        pg1.setNoticePeriodDays(30);
        pg1.setGateClosingTime("10:30 PM");
        pg1.setTotalRooms(12);
        pg1.setAvailableRooms(4);
        pg1.setIsVerified(true);
        pg1.setRating(4.3);
        pg1.setTotalReviews(18);
        pg1.setCoverImage("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80");
        pg1.setImages("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
        pg1.setOwnerId(rameshOwner.getId());
        pg1.setOwnerName(rameshOwner.getFullName());
        pg1.setOwnerPhone(rameshOwner.getPhone());
        pg1.setOwnerEmail(rameshOwner.getEmail());
        pg1 = pgListingRepository.save(pg1);

        roomOptionRepository.save(new RoomOption(pg1.getId(), "Single Sharing", 11500.0, 3, 1, true, true));
        roomOptionRepository.save(new RoomOption(pg1.getId(), "Double Sharing", 7500.0, 6, 3, true, true));
        roomOptionRepository.save(new RoomOption(pg1.getId(), "Triple Sharing", 5800.0, 3, 2, false, true));

        // 2.2 Green Nest PG — Baner
        PgListing pg2 = new PgListing();
        pg2.setName("Green Nest PG — Baner");
        pg2.setTagline("Spacious & Serene Stay with In-House Gym & Study Lounge");
        pg2.setCity("Pune");
        pg2.setLocality("Baner");
        pg2.setAddress("Sector 7, Pan Card Club Road, Baner");
        pg2.setPincode("411045");
        pg2.setNearbyColleges("NICMAR University (2.1 km), Pune University (4.0 km), Symbiosis SB Road (5.5 km)");
        pg2.setGenderType("COED");
        pg2.setMonthlyRent(8200.0);
        pg2.setSecurityDeposit(16000.0);
        pg2.setFoodIncluded(true);
        pg2.setFoodType("Veg Only");
        pg2.setHasAc(true);
        pg2.setHasWifi(true);
        pg2.setHasLaundry(true);
        pg2.setHasAttachedBath(true);
        pg2.setHasCctv(true);
        pg2.setHasPowerBackup(true);
        pg2.setHasGym(true);
        pg2.setDescription("Located in the peaceful IT corridor of Baner, Green Nest offers modern furnished student suites with dedicated study desks, ergonomic chairs, RO water dispensers, and daily housekeeping.");
        pg2.setHouseRules("Biometric entry. Gate closes at 11:00 PM. No loud disturbances during exam seasons. ID card mandatory for all visitors.");
        pg2.setNoticePeriodDays(30);
        pg2.setGateClosingTime("11:00 PM");
        pg2.setTotalRooms(16);
        pg2.setAvailableRooms(5);
        pg2.setIsVerified(true);
        pg2.setRating(4.6);
        pg2.setTotalReviews(24);
        pg2.setCoverImage("https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80");
        pg2.setImages("https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
        pg2.setOwnerId(sunitaOwner.getId());
        pg2.setOwnerName(sunitaOwner.getFullName());
        pg2.setOwnerPhone(sunitaOwner.getPhone());
        pg2.setOwnerEmail(sunitaOwner.getEmail());
        pg2 = pgListingRepository.save(pg2);

        roomOptionRepository.save(new RoomOption(pg2.getId(), "Single Sharing", 13000.0, 4, 1, true, true));
        roomOptionRepository.save(new RoomOption(pg2.getId(), "Double Sharing", 8200.0, 8, 4, true, true));
        roomOptionRepository.save(new RoomOption(pg2.getId(), "Triple Sharing", 6500.0, 4, 2, false, true));

        // 2.3 Urban Stay — Viman Nagar
        PgListing pg3 = new PgListing();
        pg3.setName("Urban Stay — Viman Nagar");
        pg3.setTagline("Budget-Friendly, Secure Girls PG Close to Symbiosis Campus");
        pg3.setCity("Pune");
        pg3.setLocality("Viman Nagar");
        pg3.setAddress("Lane 2, Behind Dutta Mandir, Viman Nagar");
        pg3.setPincode("411014");
        pg3.setNearbyColleges("Symbiosis Design / Law / Media (800m), Phoenix Mall (1.2 km)");
        pg3.setGenderType("GIRLS");
        pg3.setMonthlyRent(6800.0);
        pg3.setSecurityDeposit(12000.0);
        pg3.setFoodIncluded(false);
        pg3.setFoodType("No Meals (Modular Kitchen Available)");
        pg3.setHasAc(false);
        pg3.setHasWifi(true);
        pg3.setHasLaundry(true);
        pg3.setHasAttachedBath(true);
        pg3.setHasCctv(true);
        pg3.setHasPowerBackup(true);
        pg3.setHasGym(false);
        pg3.setDescription("A safe, homely haven for female students studying in Viman Nagar. Fully automated laundry, water purifiers, fast Wi-Fi, and 24-hour female warden on premises.");
        pg3.setHouseRules("Strict 10:00 PM entry. Female visitors only permitted inside residential floors. Maintenance issues resolved within 24 hours.");
        pg3.setNoticePeriodDays(30);
        pg3.setGateClosingTime("10:00 PM");
        pg3.setTotalRooms(10);
        pg3.setAvailableRooms(3);
        pg3.setIsVerified(true);
        pg3.setRating(4.1);
        pg3.setTotalReviews(15);
        pg3.setCoverImage("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
        pg3.setImages("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
        pg3.setOwnerId(sunitaOwner.getId());
        pg3.setOwnerName(sunitaOwner.getFullName());
        pg3.setOwnerPhone(sunitaOwner.getPhone());
        pg3.setOwnerEmail(sunitaOwner.getEmail());
        pg3 = pgListingRepository.save(pg3);

        roomOptionRepository.save(new RoomOption(pg3.getId(), "Double Sharing", 8500.0, 5, 2, false, true));
        roomOptionRepository.save(new RoomOption(pg3.getId(), "Triple Sharing", 6800.0, 5, 3, false, true));

        // 2.4 Royal Comfort PG — Koramangala (Bengaluru)
        PgListing pg4 = new PgListing();
        pg4.setName("Royal Comfort PG — Koramangala");
        pg4.setTagline("Prime Location Accommodation Near Christ University");
        pg4.setCity("Bengaluru");
        pg4.setLocality("Koramangala");
        pg4.setAddress("4th Block, 80 Feet Road, Koramangala");
        pg4.setPincode("560034");
        pg4.setNearbyColleges("Christ University (1.4 km), St. John's Medical College (2.2 km)");
        pg4.setGenderType("COED");
        pg4.setMonthlyRent(9500.0);
        pg4.setSecurityDeposit(20000.0);
        pg4.setFoodIncluded(true);
        pg4.setFoodType("Veg & Non-Veg");
        pg4.setHasAc(true);
        pg4.setHasWifi(true);
        pg4.setHasLaundry(true);
        pg4.setHasAttachedBath(true);
        pg4.setHasCctv(true);
        pg4.setHasPowerBackup(true);
        pg4.setHasGym(true);
        pg4.setDescription("Ultra-modern PG living in the heart of Bengaluru's startup & education hub. High-speed fiber internet, rooftop cafe lounge, self-cooking station, and air-conditioned rooms.");
        pg4.setHouseRules("Fingerprint lock access. Gate closing time 11:30 PM. Common areas sanitized daily.");
        pg4.setNoticePeriodDays(30);
        pg4.setGateClosingTime("11:30 PM");
        pg4.setTotalRooms(20);
        pg4.setAvailableRooms(6);
        pg4.setIsVerified(true);
        pg4.setRating(4.7);
        pg4.setTotalReviews(32);
        pg4.setCoverImage("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80");
        pg4.setImages("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80");
        pg4.setOwnerId(rameshOwner.getId());
        pg4.setOwnerName(rameshOwner.getFullName());
        pg4.setOwnerPhone(rameshOwner.getPhone());
        pg4.setOwnerEmail(rameshOwner.getEmail());
        pg4 = pgListingRepository.save(pg4);

        roomOptionRepository.save(new RoomOption(pg4.getId(), "Single Sharing", 15000.0, 5, 2, true, true));
        roomOptionRepository.save(new RoomOption(pg4.getId(), "Double Sharing", 9500.0, 10, 4, true, true));

        // 2.5 Campus Haven — North Campus (Delhi)
        PgListing pg5 = new PgListing();
        pg5.setName("Campus Haven — North Campus");
        pg5.setTagline("Vibrant DU Student Hostel Near SRCC & Hindu College");
        pg5.setCity("Delhi");
        pg5.setLocality("North Campus");
        pg5.setAddress("Kalyan Vihar, Near GTB Nagar Metro");
        pg5.setPincode("110009");
        pg5.setNearbyColleges("Delhi University North Campus, SRCC (1.2 km), Hindu College (1.5 km)");
        pg5.setGenderType("BOYS");
        pg5.setMonthlyRent(8000.0);
        pg5.setSecurityDeposit(16000.0);
        pg5.setFoodIncluded(true);
        pg5.setFoodType("Veg Only");
        pg5.setHasAc(true);
        pg5.setHasWifi(true);
        pg5.setHasLaundry(true);
        pg5.setHasAttachedBath(true);
        pg5.setHasCctv(true);
        pg5.setHasPowerBackup(true);
        pg5.setHasGym(false);
        pg5.setDescription("Conveniently located 5 minutes from GTB Nagar Metro, perfect for Delhi University students. Unlimited Wi-Fi, air conditioned rooms, and authentic North Indian meals.");
        pg5.setHouseRules("Entry allowed until 10:30 PM. No unauthorized overnight guests.");
        pg5.setNoticePeriodDays(30);
        pg5.setGateClosingTime("10:30 PM");
        pg5.setTotalRooms(14);
        pg5.setAvailableRooms(4);
        pg5.setIsVerified(true);
        pg5.setRating(4.5);
        pg5.setTotalReviews(21);
        pg5.setCoverImage("https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80");
        pg5.setImages("https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80");
        pg5.setOwnerId(rameshOwner.getId());
        pg5.setOwnerName(rameshOwner.getFullName());
        pg5.setOwnerPhone(rameshOwner.getPhone());
        pg5.setOwnerEmail(rameshOwner.getEmail());
        pg5 = pgListingRepository.save(pg5);

        roomOptionRepository.save(new RoomOption(pg5.getId(), "Single Sharing", 12500.0, 4, 1, true, true));
        roomOptionRepository.save(new RoomOption(pg5.getId(), "Double Sharing", 8000.0, 10, 3, false, true));

        // 3. Pre-seeded Booking Requests
        // 3.1 Accepted booking for Student with valid Confirmation ID
        BookingRequest b1 = new BookingRequest();
        b1.setStudentId(student.getId());
        b1.setStudentName(student.getFullName());
        b1.setStudentEmail(student.getEmail());
        b1.setStudentPhone(student.getPhone());
        b1.setStudentCollege(student.getCollege());
        b1.setPgListingId(pg1.getId());
        b1.setPgName(pg1.getName());
        b1.setPgCity(pg1.getCity());
        b1.setPgLocality(pg1.getLocality());
        b1.setOwnerId(pg1.getOwnerId());
        b1.setRoomType("Double Sharing");
        b1.setMonthlyRent(7500.0);
        b1.setMoveInDate(LocalDate.now().plusDays(5));
        b1.setDurationMonths(10);
        b1.setMessage("Hello Ramesh Uncle, I am a 2nd year B.Tech student at COEP. Looking for a quiet room with Wi-Fi.");
        b1.setStatus("ACCEPTED");
        b1.setConfirmationId("HS-2026-7842"); // Confirmation ID generated by owner acceptance!
        b1.setOwnerNotes("Booking accepted! Looking forward to welcoming you. Please bring college ID photocopy during check-in.");
        b1.setCreatedAt(LocalDateTime.now().minusDays(3));
        b1.setActionDate(LocalDateTime.now().minusDays(2));
        bookingRequestRepository.save(b1);

        // 3.2 Pending booking for Student at Green Nest PG
        BookingRequest b2 = new BookingRequest();
        b2.setStudentId(student.getId());
        b2.setStudentName(student.getFullName());
        b2.setStudentEmail(student.getEmail());
        b2.setStudentPhone(student.getPhone());
        b2.setStudentCollege(student.getCollege());
        b2.setPgListingId(pg2.getId());
        b2.setPgName(pg2.getName());
        b2.setPgCity(pg2.getCity());
        b2.setPgLocality(pg2.getLocality());
        b2.setOwnerId(pg2.getOwnerId());
        b2.setRoomType("Single Sharing");
        b2.setMonthlyRent(13000.0);
        b2.setMoveInDate(LocalDate.now().plusDays(12));
        b2.setDurationMonths(6);
        b2.setMessage("Checking if AC single room is available starting next week.");
        b2.setStatus("PENDING");
        b2.setConfirmationId(null);
        b2.setCreatedAt(LocalDateTime.now().minusHours(4));
        bookingRequestRepository.save(b2);

        // 4. Pre-seeded Reviews
        reviewRepository.save(new Review(
                pg1.getId(),
                student.getId(),
                student.getFullName(),
                student.getCollege(),
                5,
                "Extremely clean and peaceful place to study. Food tastes just like home. Wi-Fi speed is top notch!",
                5, 5, 5
        ));

        reviewRepository.save(new Review(
                pg1.getId(),
                student.getId(),
                "Priya Sen",
                "MIT World Peace University",
                4,
                "Ramesh uncle is very helpful. Distance to MIT is just a 10 min walk.",
                4, 4, 5
        ));

        System.out.println("✅ HomeSetu Seed Data successfully created!");
    }
}
