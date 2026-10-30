package com.homesetu.config;

import com.homesetu.model.*;
import com.homesetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

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

    @Autowired
    private com.homesetu.repository.FeedbackComplaintRepository feedbackComplaintRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🌱 [HomeSetu] Checking and Seeding Demo Data (5 Students, 5 Owners, 1 Admin & 25 PGs)...");

        // ---------------------------------------------------------
        // 1. ADMIN ACCOUNTS
        // ---------------------------------------------------------
        User admin1 = seedUser(
                "HomeSetu Platform Admin",
                "admin@homesetu.demo",
                "Admin@123",
                "ADMIN",
                "+91 99999 00000",
                "HomeSetu Headquarters",
                "ADM-2026-001",
                "HomeSetu Platform",
                "Delhi NCR"
        );

        seedUser(
                "HomeSetu Admin (Backup)",
                "admin@homesetu.com",
                "admin123",
                "ADMIN",
                "+91 99999 88888",
                "HomeSetu Admin Center",
                "ADM-2026-002",
                "HomeSetu Platform",
                "Pune"
        );

        // ---------------------------------------------------------
        // 2. 5 PRE-REGISTERED STUDENT DEMO ACCOUNTS
        // ---------------------------------------------------------
        User student1 = seedUser(
                "Aarav Sharma",
                "student1@homesetu.demo",
                "Student@123",
                "STUDENT",
                "+91 98111 20001",
                "ABES Engineering College, Ghaziabad",
                "ABES-2023-CS-042",
                null,
                "Ghaziabad"
        );

        User student2 = seedUser(
                "Riya Verma",
                "student2@homesetu.demo",
                "Student@123",
                "STUDENT",
                "+91 98111 20002",
                "AKGEC (Ajay Kumar Garg Engg College), Ghaziabad",
                "AKG-2023-IT-089",
                null,
                "Ghaziabad"
        );

        User student3 = seedUser(
                "Kabir Mehta",
                "student3@homesetu.demo",
                "Student@123",
                "STUDENT",
                "+91 98111 20003",
                "KIET Group of Institutions, Ghaziabad",
                "KIET-2024-ECE-115",
                null,
                "Ghaziabad"
        );

        User student4 = seedUser(
                "Ananya Gupta",
                "student4@homesetu.demo",
                "Student@123",
                "STUDENT",
                "+91 98111 20004",
                "Galgotias University, Greater Noida",
                "GU-2023-BBA-204",
                null,
                "Greater Noida"
        );

        User student5 = seedUser(
                "Rohan Malhotra",
                "student5@homesetu.demo",
                "Student@123",
                "STUDENT",
                "+91 98111 20005",
                "IMS Ghaziabad (University Courses Campus)",
                "IMS-2024-BCA-067",
                null,
                "Ghaziabad"
        );

        // Also preserve legacy student if present
        seedUser(
                "Rahul Verma",
                "student@homesetu.com",
                "123456",
                "STUDENT",
                "+91 98765 00001",
                "College of Engineering Pune (COEP)",
                "COEP-2023-ME-011",
                null,
                "Pune"
        );

        // ---------------------------------------------------------
        // 3. 5 PRE-REGISTERED PG OWNER DEMO ACCOUNTS
        // ---------------------------------------------------------
        User owner1 = seedUser(
                "Vikram Chauhan",
                "owner1@homesetu.demo",
                "Owner@123",
                "OWNER",
                "+91 98222 30001",
                null,
                null,
                "Chauhan Luxury Residencies",
                "Ghaziabad"
        );

        User owner2 = seedUser(
                "Sunil Aggarwal",
                "owner2@homesetu.demo",
                "Owner@123",
                "OWNER",
                "+91 98222 30002",
                null,
                null,
                "Aggarwal PG Homes & Hostels",
                "Ghaziabad"
        );

        User owner3 = seedUser(
                "Rajesh Tyagi",
                "owner3@homesetu.demo",
                "Owner@123",
                "OWNER",
                "+91 98222 30003",
                null,
                null,
                "Tyagi Student Accommodations",
                "Ghaziabad"
        );

        User owner4 = seedUser(
                "Deepak Singhal",
                "owner4@homesetu.demo",
                "Owner@123",
                "OWNER",
                "+91 98222 30004",
                null,
                null,
                "Singhal Comfort Living",
                "Ghaziabad"
        );

        User owner5 = seedUser(
                "Pooja Sharma",
                "owner5@homesetu.demo",
                "Owner@123",
                "OWNER",
                "+91 98222 30005",
                null,
                null,
                "Sharma Executive Living",
                "Noida"
        );

        // Preserve legacy owners if needed
        seedUser(
                "Ramesh Sharma",
                "owner@homesetu.com",
                "123456",
                "OWNER",
                "+91 91234 56789",
                null,
                null,
                "Sunrise Accommodations",
                "Pune"
        );

        // ---------------------------------------------------------
        // 4. MINIMUM 25 PG LISTINGS (5 LISTINGS PER OWNER)
        // ---------------------------------------------------------
        System.out.println("🏡 Seeding 25 PG Listings across 5 Demo Owners (Ghaziabad, ABES Area, Indirapuram, Noida)...");

        // OWNER 1: Vikram Chauhan (5 PGs in Crossings Republik & near ABES EC)
        seedPgWithRooms(
                "Chauhan Residency — Crossings Republik",
                "Premium Student Living with Homely Meals near ABES Campus",
                "Ghaziabad",
                "Crossings Republik",
                "Tower B-4, Paramount Symphony, Crossings Republik, Ghaziabad",
                "201016",
                "ABES Engineering College (1.8 km), IMS Ghaziabad (3.2 km)",
                "BOYS",
                7500.0,
                15000.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, false,
                "Chauhan Residency provides fully furnished, air-conditioned rooms tailored for engineering and management students. Located in a secure gated township with 24/7 security, high-speed 300 Mbps Wi-Fi, and nutritious 3-time meals.",
                "Gate closing at 10:30 PM. Strict no-smoking policy. Quiet study hours after 10 PM. Visitors allowed in lounge only until 7 PM.",
                30,
                "10:30 PM",
                14,
                4,
                true,
                4.7,
                24,
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                owner1
        );

        seedPgWithRooms(
                "Shree Balaji Luxury Boys PG — Near ABES EC",
                "Walking Distance to ABES Engineering College with 24/7 Power Backup",
                "Ghaziabad",
                "Crossings Republik",
                "Plot 18, Block C, Crossing Republic Road, Near ABES EC, Ghaziabad",
                "201009",
                "ABES Engineering College (500m walking distance), ABES IT (1.2 km)",
                "BOYS",
                8000.0,
                16000.0,
                true,
                "Pure Veg",
                true, true, true, true, true, true, true,
                "Located within 5 minutes walking distance from ABES Engineering College. Features spacious rooms, individual wooden wardrobes, study tables, in-house gym and rooftop cafeteria.",
                "Biometric entry required after 10 PM. No loud music during exams. Pure vegetarian kitchen only.",
                30,
                "10:15 PM",
                18,
                5,
                true,
                4.8,
                31,
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                owner1
        );

        seedPgWithRooms(
                "Green View Executive Co-ed PG — Panchsheel Wellington",
                "Modern High-Rise Living with Pool & Study Lounge in Crossings Republik",
                "Ghaziabad",
                "Crossings Republik",
                "Flat 102, Panchsheel Wellington, Crossings Republik, Ghaziabad",
                "201016",
                "ABES Engineering College (2.0 km), IMS Engineering College (4.0 km)",
                "COED",
                6800.0,
                13600.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Peaceful student accommodation inside a premium high-rise society. Separate wings for boys and girls, 24-hr security, society gym, daily housekeeping, and attached balconies.",
                "Society security protocol applies. Gate closes at 10:30 PM. Cleanliness must be maintained in shared areas.",
                30,
                "10:30 PM",
                12,
                3,
                true,
                4.5,
                19,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                owner1
        );

        seedPgWithRooms(
                "Campus View Student PG — Lal Kuan, NH-24",
                "Affordable Budget Stay with High-Speed Wi-Fi near ABES Campus",
                "Ghaziabad",
                "Lal Kuan",
                "Sector 1, Lal Kuan, Near ABES Campus, NH-24, Ghaziabad",
                "201009",
                "ABES Engineering College (800m), AKGEC (4.5 km)",
                "BOYS",
                6000.0,
                12000.0,
                true,
                "Veg Only",
                false, true, true, true, true, true, false,
                "High-value budget accommodation for focused engineering scholars. Includes 3 meals daily, RO drinking water, power backup, and quiet study room.",
                "Strict curfew at 10:00 PM. No unauthorized guests allowed overnight.",
                30,
                "10:00 PM",
                15,
                6,
                true,
                4.3,
                16,
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                owner1
        );

        seedPgWithRooms(
                "Palm Residency Girls PG — Crossings Republik",
                "Ultra-Safe Girls PG with CCTV, Biometric Access & In-House Warden",
                "Ghaziabad",
                "Crossings Republik",
                "GH-07, Crossings Republik Boulevard, Ghaziabad",
                "201016",
                "ABES Engineering College (1.9 km), IMS Ghaziabad (3.0 km)",
                "GIRLS",
                8500.0,
                17000.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, false,
                "Dedicated all-girls stay with round-the-clock female warden, digital entry logs, hygienic homely food, regular linen change, and serene library study spaces.",
                "Gate closes at 10:00 PM strictly. Parents intimation required for late passes.",
                30,
                "10:00 PM",
                16,
                4,
                true,
                4.9,
                42,
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                owner1
        );

        // OWNER 2: Sunil Aggarwal (5 PGs in Indirapuram & Shipra Sun City)
        seedPgWithRooms(
                "Aggarwal Premium Boys PG — Niti Khand 1, Indirapuram",
                "Luxury Boys Living with Daily Housekeeping & AC near Metro Link",
                "Ghaziabad",
                "Indirapuram",
                "Plot 214, Niti Khand 1, Indirapuram, Ghaziabad",
                "201014",
                "Jaipuria Institute of Management (1.5 km), ABES EC (6.0 km), JSS Noida (4.5 km)",
                "BOYS",
                8500.0,
                17000.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Modern air-conditioned boys PG with double spring beds, ergonomic work desks, 300 Mbps fiber internet, and fresh North Indian buffet meals.",
                "Gate closing at 10:30 PM. No smoking or alcohol allowed on premises.",
                30,
                "10:30 PM",
                20,
                6,
                true,
                4.6,
                27,
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                owner2
        );

        seedPgWithRooms(
                "Kundan Residency Girls PG — Ahinsa Khand, Indirapuram",
                "Serene, Safe Girls Stay inside Shipra Sun City with Kitchenette",
                "Ghaziabad",
                "Indirapuram",
                "Flat 402, Shipra Sun City, Ahinsa Khand 1, Indirapuram, Ghaziabad",
                "201014",
                "IMS Ghaziabad (5 km), ABES EC (6.5 km), Noida Sec 62 (2.5 km)",
                "GIRLS",
                9200.0,
                18400.0,
                true,
                "Pure Veg",
                true, true, true, true, true, true, false,
                "Prime residential accommodation for girl students and interns. 24x7 gated society security, power backup, CCTV monitoring, and delicious diet-conscious meals.",
                "Entry register mandatory. Gate closes at 10:30 PM.",
                30,
                "10:30 PM",
                14,
                3,
                true,
                4.8,
                38,
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                owner2
        );

        seedPgWithRooms(
                "Royal Comfort Stays — Vaibhav Khand, Indirapuram",
                "Spacious Co-ed PG near Swarna Jayanti Park with Gym Access",
                "Ghaziabad",
                "Indirapuram",
                "58-A, Vaibhav Khand, Near Swarna Jayanti Park, Indirapuram",
                "201014",
                "JSS Noida (3.2 km), ABES Engineering College (7 km)",
                "COED",
                7800.0,
                15600.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Walking distance to Swarna Jayanti Park. Ideal for students who value fitness and calm environment. Includes laundry service and weekend special lunches.",
                "Gate closing at 11:00 PM. Clean environment policy.",
                30,
                "11:00 PM",
                16,
                4,
                true,
                4.4,
                22,
                "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80",
                owner2
        );

        seedPgWithRooms(
                "Indirapuram Student Haven — Gyan Khand 2",
                "Budget-Friendly Boys PG with Study Tables & 300 Mbps Internet",
                "Ghaziabad",
                "Indirapuram",
                "Plot 88, Gyan Khand 2, Indirapuram, Ghaziabad",
                "201014",
                "ABES EC (6.8 km), Noida Sector 62 Metros (3 km)",
                "BOYS",
                7200.0,
                14400.0,
                true,
                "Veg Only",
                false, true, true, true, true, true, false,
                "Value accommodation featuring attached washrooms, large study desks, clean water purifiers, and regular housekeeping.",
                "Gate closes at 10:15 PM. Keep common areas quiet.",
                30,
                "10:15 PM",
                12,
                4,
                true,
                4.2,
                14,
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                owner2
        );

        seedPgWithRooms(
                "Elite Girls Living — Nyay Khand 1, Indirapuram",
                "Boutique Girls Stay with Modern Decor, Security & Home-Cooked Food",
                "Ghaziabad",
                "Indirapuram",
                "Street 4, Nyay Khand 1, Indirapuram, Ghaziabad",
                "201014",
                "Institute of Management Studies (4 km), ABES EC (7 km)",
                "GIRLS",
                8900.0,
                17800.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, false,
                "Elegant living spaces with premium bedding, AC, geysers, refrigerator access, and 24-hour guard on duty.",
                "Curfew time is 10:00 PM. No outside male visitors beyond reception.",
                30,
                "10:00 PM",
                10,
                2,
                true,
                4.7,
                29,
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
                owner2
        );

        // OWNER 3: Rajesh Tyagi (5 PGs Opposite ABES Gate & Lal Kuan)
        seedPgWithRooms(
                "Tyagi Boys Residency — Opposite ABES College Gate 2",
                "Literally 200 Meters from ABES Engineering College Campus Gate 2",
                "Ghaziabad",
                "Lal Kuan",
                "G.T. Road, NH-09, Lal Kuan, Opposite ABES EC Gate 2, Ghaziabad",
                "201009",
                "ABES Engineering College (200m), ABES IT (800m)",
                "BOYS",
                7000.0,
                14000.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "The most convenient location for ABES engineering students! Zero commute costs. Enjoy fresh hot meals served three times daily, high-speed Wi-Fi, and 100% power backup.",
                "Gate closing at 10:15 PM. Keep college ID card with you.",
                30,
                "10:15 PM",
                25,
                7,
                true,
                4.8,
                53,
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                owner3
        );

        seedPgWithRooms(
                "Maa Annapurna Student PG — New Vijay Nagar, NH-09",
                "Homely Unlimited Buffet Meals for Students near ABES & IMS",
                "Ghaziabad",
                "Vijay Nagar",
                "Sector 9, New Vijay Nagar, Near NH-09, Ghaziabad",
                "201009",
                "ABES Engineering College (1.2 km), IMS UC Campus (2.5 km)",
                "BOYS",
                5500.0,
                11000.0,
                true,
                "Pure Veg",
                false, true, true, true, true, true, false,
                "Renowned across college students for outstanding North Indian home-style food. Super affordable rent with essential amenities including RO water, Wi-Fi, and study lamps.",
                "Gate closing at 10:00 PM. Dining hall timings strictly followed.",
                30,
                "10:00 PM",
                15,
                3,
                true,
                4.5,
                33,
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                owner3
        );

        seedPgWithRooms(
                "Om Sai Girls PG — Dundahera, Near ABES EC",
                "Safe & Secure Girls Accommodation just 600m from ABES Campus",
                "Ghaziabad",
                "Dundahera",
                "Main Market, Dundahera, NH-09, Near ABES EC, Ghaziabad",
                "201009",
                "ABES Engineering College (600m), IMS Engineering (3 km)",
                "GIRLS",
                7800.0,
                15600.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "Safe student residence with in-house warden, biometric thumb entry, study hall, geysers, and regular room cleaning. Perfect for female engineers.",
                "Curfew time is 10:00 PM sharp. Intimation required for weekend trips.",
                30,
                "10:00 PM",
                14,
                4,
                true,
                4.7,
                26,
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                owner3
        );

        seedPgWithRooms(
                "Shivalik Scholar Living — Shahpur Bamheta, NH-24",
                "Modern Co-ed Residence with Balconies and Green Campus Views",
                "Ghaziabad",
                "NH-24 Bypass",
                "Sector 12, Shahpur Bamheta, Near Diamond Palace, Ghaziabad",
                "201009",
                "ABES Engineering College (1.5 km), Columbia Asia Hospital (2.0 km)",
                "COED",
                6500.0,
                13000.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, false,
                "Bright, airy rooms with attached balconies, study desks, Wi-Fi 6 connectivity, and regular hot water.",
                "Gate closing at 10:30 PM. Maintain peace during late night hours.",
                30,
                "10:30 PM",
                16,
                5,
                true,
                4.4,
                21,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                owner3
        );

        seedPgWithRooms(
                "Aryavart Student Residency — Lal Kuan Industrial Area",
                "Budget Boys PG with Dedicated Silent Study Library & Wi-Fi",
                "Ghaziabad",
                "Lal Kuan",
                "Plot 5, Industrial Area, Lal Kuan, G.T. Road, Ghaziabad",
                "201009",
                "ABES Engineering College (1.0 km), IMS Ghaziabad (2.0 km)",
                "BOYS",
                6200.0,
                12400.0,
                true,
                "Veg Only",
                false, true, true, true, true, true, false,
                "Tailored for competitive exam aspirants and engineering students. Silent library space, high-speed internet, and hearty meals.",
                "Gate closing at 10:00 PM. Alcohol and smoking completely forbidden.",
                30,
                "10:00 PM",
                18,
                6,
                true,
                4.3,
                18,
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                owner3
        );

        // OWNER 4: Deepak Singhal (5 PGs in Raj Nagar Extension & Meerut Road / KIET)
        seedPgWithRooms(
                "Singhal Harmony Homes — KDP Grand Savanna, Raj Nagar Ext",
                "Gated Township Society Living with Swimming Pool & Power Backup",
                "Ghaziabad",
                "Raj Nagar Extension",
                "KDP Grand Savanna, Raj Nagar Extension, Ghaziabad",
                "201017",
                "AKGEC (3.5 km), KIET Group of Institutions (6.0 km), IMT Ghaziabad (5 km)",
                "BOYS",
                7400.0,
                14800.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Experience top-tier security and amenities in Raj Nagar Extension. Includes 3-time meals, club access, fast broadband, and spacious parking.",
                "Society gate closing at 10:30 PM. Valid student ID required for township entry.",
                30,
                "10:30 PM",
                20,
                5,
                true,
                4.6,
                30,
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                owner4
        );

        seedPgWithRooms(
                "Raj Nagar Scholar Villa — Officer's City 2, Raj Nagar Ext",
                "Luxury Co-ed Apartments for Scholars with High-Speed Fiber",
                "Ghaziabad",
                "Raj Nagar Extension",
                "Tower C, Officer's City 2, Raj Nagar Extension, Ghaziabad",
                "201017",
                "AKGEC (4.0 km), HRIT Ghaziabad (4.5 km)",
                "COED",
                8000.0,
                16000.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "Fully furnished 3BHK flats with individual room keys, attached bathrooms, modular kitchen access, and daily cleaning staff.",
                "Gate closing at 10:30 PM. Respect co-residents' privacy.",
                30,
                "10:30 PM",
                14,
                4,
                true,
                4.5,
                23,
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                owner4
        );

        seedPgWithRooms(
                "Pari Girls Executive PG — VVIP Addresses, Raj Nagar Ext",
                "Premium High-Security Girls PG with Biometric & Society Amenities",
                "Ghaziabad",
                "Raj Nagar Extension",
                "Flat 604, VVIP Addresses, Raj Nagar Extension, Ghaziabad",
                "201017",
                "AKGEC (3.8 km), IMT Ghaziabad (4.5 km)",
                "GIRLS",
                8600.0,
                17200.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, true,
                "Stay in one of the most prestigious addresses in Ghaziabad. Complete safety, healthy nutritious food, gym, laundry, and peaceful environment.",
                "Curfew time is 10:00 PM. Female visitors allowed during daytime.",
                30,
                "10:00 PM",
                12,
                3,
                true,
                4.9,
                40,
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                owner4
        );

        seedPgWithRooms(
                "Green Meadows Student Stay — Meerut Road, Near KIET",
                "Close to KIET Group of Institutions with Lush Green Surroundings",
                "Ghaziabad",
                "Meerut Road",
                "KM Stone 13, Delhi-Meerut Road, Near Muradnagar / KIET, Ghaziabad",
                "201206",
                "KIET Group of Institutions (800m), RKGIT (4 km)",
                "BOYS",
                6800.0,
                13600.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, false,
                "Conveniently situated near KIET campus. Fresh open air, quiet study rooms, wholesome food, and round-the-clock power backup.",
                "Gate closing at 10:00 PM. No loud celebrations after 10 PM.",
                30,
                "10:00 PM",
                16,
                5,
                true,
                4.4,
                25,
                "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80",
                owner4
        );

        seedPgWithRooms(
                "Krishna Comfort PG — Sector 23, Sanjay Nagar",
                "Well-Established Boys PG near AKGEC & Main Market Areas",
                "Ghaziabad",
                "Sanjay Nagar",
                "Sector 23, Sanjay Nagar, Near Combined Hospital, Ghaziabad",
                "201002",
                "AKGEC (2.2 km), IMT Ghaziabad (3.0 km)",
                "BOYS",
                7000.0,
                14000.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "Near all shopping conveniences and coaching hubs. Daily housekeeping, attached washrooms, and hygienic 3-time meal facility.",
                "Gate closing at 10:15 PM.",
                30,
                "10:15 PM",
                14,
                4,
                true,
                4.3,
                17,
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                owner4
        );

        // OWNER 5: Pooja Sharma (5 PGs in Noida Sector 62 & Greater Noida)
        seedPgWithRooms(
                "Sharma Executive Girls PG — Sector 62, Noida",
                "Walking Distance to JSS Academy & JIIT with In-House Cook & Security",
                "Noida",
                "Sector 62",
                "B-Block, Near Fortis Hospital, Sector 62, Noida",
                "201301",
                "JSS Academy of Technical Education (800m), JIIT Sector 62 (1.2 km)",
                "GIRLS",
                9500.0,
                19000.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Upscale accommodation designed for engineering students and IT interns. High-speed 300 Mbps Wi-Fi, fully furnished AC rooms, washing machines, and warm meals.",
                "Gate closes at 10:30 PM. Visitors allowed in designated meeting area.",
                30,
                "10:30 PM",
                16,
                3,
                true,
                4.9,
                47,
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
                owner5
        );

        seedPgWithRooms(
                "Sector 62 Tech-Hub Boys PG — Block C, Noida",
                "Modern Boys Living Near Electronic City Metro & JSS College",
                "Noida",
                "Sector 62",
                "C-28, Sector 62, Near Electronic City Metro Station, Noida",
                "201301",
                "JSS Academy (1 km), JIIT Sector 62 (1.5 km), ABES EC (6.5 km)",
                "BOYS",
                8800.0,
                17600.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Prime location right next to Sector 62 metro station. High speed internet, gym, power backup, study desks, and hygienic buffet meals.",
                "Gate closes at 10:45 PM. Clean study hours enforced.",
                30,
                "10:45 PM",
                20,
                5,
                true,
                4.7,
                35,
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                owner5
        );

        seedPgWithRooms(
                "Knowledge Park Scholar Living — Greater Noida",
                "Campus Living Near Galgotias University & Sharda University",
                "Greater Noida",
                "Knowledge Park",
                "Plot 14, Knowledge Park III, Greater Noida",
                "201310",
                "Galgotias University (1.5 km), Sharda University (2.0 km), GL Bajaj (1.0 km)",
                "COED",
                8200.0,
                16400.0,
                true,
                "Veg & Non-Veg",
                true, true, true, true, true, true, true,
                "Ideal hub for Greater Noida students. Includes cafeteria, gym, indoor table tennis, spacious beds, and college commute shuttle assistance.",
                "Gate closes at 10:30 PM. College ID verification mandatory at entry.",
                30,
                "10:30 PM",
                24,
                8,
                true,
                4.6,
                32,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                owner5
        );

        seedPgWithRooms(
                "Metro View Student Stay — Sector 63, Noida",
                "Budget Living Near Sector 63 Metro & Major Engineering Institutes",
                "Noida",
                "Sector 63",
                "A-Block, Near Sector 63 Metro Station, Noida",
                "201301",
                "JSS Noida (2.0 km), ABES Engineering College (7.0 km)",
                "BOYS",
                8000.0,
                16000.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "Clean, comfortable rooms with attached washrooms, geysers, Wi-Fi, and 3 fresh daily meals.",
                "Gate closing at 10:15 PM.",
                30,
                "10:15 PM",
                16,
                4,
                true,
                4.4,
                19,
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                owner5
        );

        seedPgWithRooms(
                "Pratibha Girls Residency — Pari Chowk, Greater Noida",
                "Safe, Modern Girls PG Near Pari Chowk with Warden & Healthy Food",
                "Greater Noida",
                "Pari Chowk",
                "Alpha 1, Commercial Belt, Near Pari Chowk, Greater Noida",
                "201310",
                "Sharda University (1.8 km), Bennett University (5.0 km), Galgotias (3.0 km)",
                "GIRLS",
                9000.0,
                18000.0,
                true,
                "Veg Only",
                true, true, true, true, true, true, false,
                "A premier stay for female scholars in Greater Noida. Biometric security, 24/7 warden, daily nutritious menu, and peaceful environment.",
                "Strict curfew at 10:00 PM. Parents contact details kept on record.",
                30,
                "10:00 PM",
                18,
                4,
                true,
                4.8,
                39,
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                owner5
        );

        // ---------------------------------------------------------
        // 5. SEED INITIAL BOOKING REQUESTS
        // ---------------------------------------------------------
        seedInitialBookings(student1, student2, student3, owner1, owner3);

        System.out.println("✅ [HomeSetu] Successfully Seeded 5 Students, 5 Owners, 1 Admin & 25 PG Listings!");
    }

    private User seedUser(String fullName, String email, String password, String role, String phone,
                          String college, String studentId, String propertyName, String city) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User u = existing.get();
            u.setFullName(fullName);
            u.setPassword(password);
            u.setRole(role);
            u.setPhone(phone);
            u.setCollege(college);
            u.setStudentId(studentId);
            u.setPropertyName(propertyName);
            u.setCity(city);
            return userRepository.save(u);
        }

        User newUser = new User(fullName, email, password, role, phone, college, studentId, propertyName, city);
        return userRepository.save(newUser);
    }

    private PgListing seedPgWithRooms(
            String name, String tagline, String city, String locality, String address, String pincode,
            String nearbyColleges, String genderType, Double monthlyRent, Double securityDeposit,
            Boolean foodIncluded, String foodType, Boolean hasAc, Boolean hasWifi, Boolean hasLaundry,
            Boolean hasAttachedBath, Boolean hasCctv, Boolean hasPowerBackup, Boolean hasGym,
            String description, String houseRules, Integer noticePeriodDays, String gateClosingTime,
            Integer totalRooms, Integer availableRooms, Boolean isVerified, Double rating, Integer totalReviews,
            String coverImage, String images, User owner
    ) {
        PgListing pg;
        Optional<PgListing> existing = pgListingRepository.findByName(name);
        if (existing.isPresent()) {
            pg = existing.get();
        } else {
            pg = new PgListing();
        }

        pg.setName(name);
        pg.setTagline(tagline);
        pg.setCity(city);
        pg.setLocality(locality);
        pg.setAddress(address);
        pg.setPincode(pincode);
        pg.setNearbyColleges(nearbyColleges);
        pg.setGenderType(genderType);
        pg.setMonthlyRent(monthlyRent);
        pg.setSecurityDeposit(securityDeposit);
        pg.setFoodIncluded(foodIncluded);
        pg.setFoodType(foodType);
        pg.setHasAc(hasAc);
        pg.setHasWifi(hasWifi);
        pg.setHasLaundry(hasLaundry);
        pg.setHasAttachedBath(hasAttachedBath);
        pg.setHasCctv(hasCctv);
        pg.setHasPowerBackup(hasPowerBackup);
        pg.setHasGym(hasGym);
        pg.setDescription(description);
        pg.setHouseRules(houseRules);
        pg.setNoticePeriodDays(noticePeriodDays);
        pg.setGateClosingTime(gateClosingTime);
        pg.setTotalRooms(totalRooms);
        pg.setAvailableRooms(availableRooms);
        pg.setIsVerified(isVerified);
        pg.setRating(rating);
        pg.setTotalReviews(totalReviews);
        pg.setCoverImage(coverImage);
        pg.setImages(images);

        if (owner != null) {
            pg.setOwnerId(owner.getId());
            pg.setOwnerName(owner.getFullName());
            pg.setOwnerPhone(owner.getPhone());
            pg.setOwnerEmail(owner.getEmail());
        }

        pg = pgListingRepository.save(pg);

        // Seed room options if not already seeded for this PG
        if (roomOptionRepository.findByPgListingId(pg.getId()).isEmpty()) {
            roomOptionRepository.save(new RoomOption(pg.getId(), "Single Sharing", monthlyRent + 3500, 4, 1, true, true));
            roomOptionRepository.save(new RoomOption(pg.getId(), "Double Sharing", monthlyRent, 8, 3, true, true));
            roomOptionRepository.save(new RoomOption(pg.getId(), "Triple Sharing", Math.max(monthlyRent - 1500, 4500.0), 6, 2, false, true));
        }

        return pg;
    }

    private void seedInitialBookings(User student1, User student2, User student3, User owner1, User owner3) {
        if (!bookingRequestRepository.existsByConfirmationId("HS-2026-7842")) {
            BookingRequest b1 = new BookingRequest();
            b1.setStudentId(student1.getId());
            b1.setStudentName(student1.getFullName());
            b1.setStudentEmail(student1.getEmail());
            b1.setStudentPhone(student1.getPhone());
            b1.setStudentCollege(student1.getCollege());
            b1.setOwnerId(owner1.getId());
            b1.setPgListingId(1L);
            b1.setPgName("Chauhan Residency — Crossings Republik");
            b1.setPgCity("Ghaziabad");
            b1.setPgLocality("Crossings Republik");
            b1.setRoomType("Double Sharing");
            b1.setMonthlyRent(7500.0);
            b1.setMoveInDate(LocalDate.now().plusDays(5));
            b1.setDurationMonths(10);
            b1.setStatus("CONFIRMED");
            b1.setConfirmationId("HS-2026-7842");
            b1.setOwnerNotes("Verified 2nd year CS student at ABES EC. Room 204 allocated.");
            b1.setActionDate(LocalDateTime.now().minusDays(1));
            b1.setMessage("Looking for quiet room with AC near ABES Engineering College campus.");
            bookingRequestRepository.save(b1);
        }

        if (!bookingRequestRepository.existsByConfirmationId("HS-2026-9104")) {
            BookingRequest b2 = new BookingRequest();
            b2.setStudentId(student2.getId());
            b2.setStudentName(student2.getFullName());
            b2.setStudentEmail(student2.getEmail());
            b2.setStudentPhone(student2.getPhone());
            b2.setStudentCollege(student2.getCollege());
            b2.setOwnerId(owner3.getId());
            b2.setPgListingId(11L);
            b2.setPgName("Tyagi Boys Residency — Opposite ABES College Gate 2");
            b2.setPgCity("Ghaziabad");
            b2.setPgLocality("Lal Kuan");
            b2.setRoomType("Single Sharing");
            b2.setMonthlyRent(10500.0);
            b2.setMoveInDate(LocalDate.now().plusDays(2));
            b2.setDurationMonths(12);
            b2.setStatus("CONFIRMED");
            b2.setConfirmationId("HS-2026-9104");
            b2.setOwnerNotes("Hostel fee receipt confirmed. Key handed over at reception.");
            b2.setActionDate(LocalDateTime.now().minusHours(6));
            b2.setMessage("Need single room with attached washroom opposite college gate.");
            bookingRequestRepository.save(b2);
        }

        // Pending Request for Owner 1 to review live in Owner Dashboard
        Optional<BookingRequest> pendingCheck = bookingRequestRepository.findByStudentIdOrderByCreatedAtDesc(student3.getId())
                .stream().filter(b -> "PENDING".equals(b.getStatus())).findFirst();
        if (pendingCheck.isEmpty()) {
            BookingRequest b3 = new BookingRequest();
            b3.setStudentId(student3.getId());
            b3.setStudentName(student3.getFullName());
            b3.setStudentEmail(student3.getEmail());
            b3.setStudentPhone(student3.getPhone());
            b3.setStudentCollege(student3.getCollege());
            b3.setOwnerId(owner1.getId());
            b3.setPgListingId(2L);
            b3.setPgName("Shree Balaji Luxury Boys PG — Near ABES EC");
            b3.setPgCity("Ghaziabad");
            b3.setPgLocality("Crossings Republik");
            b3.setRoomType("Double Sharing");
            b3.setMonthlyRent(8000.0);
            b3.setMoveInDate(LocalDate.now().plusDays(7));
            b3.setDurationMonths(6);
            b3.setStatus("PENDING");
            b3.setMessage("Can I inspect the room this Saturday before move in? Need pure veg meals.");
            bookingRequestRepository.save(b3);
        }

        // ---------------------------------------------------------
        // 5. GRIEVANCES & FEEDBACK SEEDING (Admin Oversight Hub)
        // ---------------------------------------------------------
        if (feedbackComplaintRepository.count() == 0) {
            com.homesetu.model.FeedbackComplaint fc1 = new com.homesetu.model.FeedbackComplaint();
            fc1.setTicketId("HS-TKT-10821");
            fc1.setType("COMPLAINT");
            fc1.setCategory("Maintenance & WiFi");
            fc1.setPriority("URGENT");
            fc1.setSubject("WiFi router on 2nd floor disconnecting intermittently during online college tests");
            fc1.setDescription("The mesh extender on 2nd floor loses connection every 20-30 minutes. Multiple ABES students taking hackathons and online submissions face disconnection. Please inspect the access point router.");
            fc1.setPgId(1L);
            fc1.setPgName("Royal Palms Student Living — Crossings Republik");
            fc1.setSubmitterId(student1.getId());
            fc1.setSubmitterName(student1.getFullName());
            fc1.setSubmitterEmail(student1.getEmail());
            fc1.setSubmitterPhone(student1.getPhone());
            fc1.setSubmitterRole("STUDENT");
            fc1.setStatus("PENDING");
            feedbackComplaintRepository.save(fc1);

            com.homesetu.model.FeedbackComplaint fc2 = new com.homesetu.model.FeedbackComplaint();
            fc2.setTicketId("HS-TKT-10822");
            fc2.setType("COMPLAINT");
            fc2.setCategory("Food & Mess Quality");
            fc2.setPriority("HIGH");
            fc2.setSubject("Request to improve evening dinner menu variety and fruit options");
            fc2.setDescription("Dinner menu has been repeating same curry 3 days a week. Request the mess supervisor to provide fresh fruits or curd on weekdays.");
            fc2.setPgId(3L);
            fc2.setPgName("Green View Executive Co-ed PG — Panchsheel Wellington");
            fc2.setSubmitterId(student2.getId());
            fc2.setSubmitterName(student2.getFullName());
            fc2.setSubmitterEmail(student2.getEmail());
            fc2.setSubmitterPhone(student2.getPhone());
            fc2.setSubmitterRole("STUDENT");
            fc2.setStatus("IN_REVIEW");
            fc2.setAdminResponse("HomeSetu Grievance Officer contacted PG Owner Vikram Chauhan. Kitchen supervisor has revised weekly dinner rotation with seasonal fruits on Tue/Thu.");
            feedbackComplaintRepository.save(fc2);

            com.homesetu.model.FeedbackComplaint fc3 = new com.homesetu.model.FeedbackComplaint();
            fc3.setTicketId("HS-TKT-10823");
            fc3.setType("FEEDBACK");
            fc3.setCategory("Platform Experience");
            fc3.setPriority("MEDIUM");
            fc3.setSubject("Great verification workflow! Would love automated monthly rent collection receipts");
            fc3.setDescription("The verification process was smooth. It would be awesome if owners could generate standard PDF rent receipts automatically for students claiming HRA/college reimbursement.");
            fc3.setPgId(1L);
            fc3.setPgName("Royal Palms Student Living — Crossings Republik");
            fc3.setSubmitterId(owner1.getId());
            fc3.setSubmitterName(owner1.getFullName());
            fc3.setSubmitterEmail(owner1.getEmail());
            fc3.setSubmitterPhone(owner1.getPhone());
            fc3.setSubmitterRole("OWNER");
            fc3.setStatus("RESOLVED");
            fc3.setAdminResponse("Feature request approved and logged into HomeSetu v2.2 roadmap. Thank you Vikram ji for partnering with us!");
            feedbackComplaintRepository.save(fc3);
        }
    }
}
