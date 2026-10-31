-- ==============================================================================
-- HomeSetu Database Setup & Seed Data Script
-- Database: project_db (MySQL 8.0+)
-- Used by Spring Boot Backend & VS Code Database Client
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    college VARCHAR(255),
    student_id VARCHAR(100),
    property_name VARCHAR(255),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. Table: pg_listings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pg_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(150) NOT NULL,
    address TEXT,
    pincode VARCHAR(20),
    nearby_colleges TEXT,
    gender_type VARCHAR(50),
    monthly_rent DOUBLE,
    security_deposit DOUBLE,
    food_included BOOLEAN DEFAULT FALSE,
    food_type VARCHAR(100),
    has_ac BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT TRUE,
    has_laundry BOOLEAN DEFAULT TRUE,
    has_attached_bath BOOLEAN DEFAULT TRUE,
    has_cctv BOOLEAN DEFAULT TRUE,
    has_power_backup BOOLEAN DEFAULT TRUE,
    has_gym BOOLEAN DEFAULT FALSE,
    has_ro_water BOOLEAN DEFAULT TRUE,
    has_lift BOOLEAN DEFAULT FALSE,
    has_biometric BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT TRUE,
    has_geyser BOOLEAN DEFAULT TRUE,
    has_housekeeping BOOLEAN DEFAULT TRUE,
    rating DOUBLE DEFAULT 4.5,
    verified BOOLEAN DEFAULT TRUE,
    total_beds INT DEFAULT 20,
    available_beds INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. Table: feedback_complaints (Grievance Hub)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback_complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pg_id BIGINT,
    pg_name VARCHAR(255),
    submitter_id BIGINT,
    submitter_name VARCHAR(255),
    submitter_email VARCHAR(255),
    submitter_phone VARCHAR(50),
    submitter_role VARCHAR(50) DEFAULT 'STUDENT',
    status VARCHAR(50) DEFAULT 'PENDING',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL
);

-- ------------------------------------------------------------------------------
-- 4. Table: booking_requests
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    confirmation_id VARCHAR(50) NOT NULL UNIQUE,
    pg_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    student_name VARCHAR(255),
    student_phone VARCHAR(50),
    student_email VARCHAR(255),
    room_type VARCHAR(100),
    monthly_rent DOUBLE,
    security_deposit DOUBLE,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- SEED DATA INSERTION
-- ==============================================================================

-- 1. Insert Users (Admin, Students, Owners)
INSERT INTO users (id, full_name, email, password, role, phone, college, student_id, property_name, city)
VALUES 
(1, 'Arsh Mittal (Platform Admin)', 'arshm2772@gmail.com', '123456', 'ADMIN', '+91 98765 43210', 'HomeSetu Headquarters', 'ADM-2026-001', 'HomeSetu Platform', 'Delhi NCR'),
(2, 'Aarav Sharma', 'student1@homesetu.demo', 'Student@123', 'STUDENT', '+91 98765 43210', 'ABES Engineering College', 'ABES-2023-CS-104', NULL, 'Ghaziabad'),
(3, 'Archana Verma', 'archana.student@gmail.com', 'Student@123', 'STUDENT', '+91 98765 12345', 'AKGEC Ghaziabad', 'AKG-2024-IT-042', NULL, 'Ghaziabad'),
(4, 'Riya Verma', 'student2@homesetu.demo', 'Student@123', 'STUDENT', '+91 98111 20002', 'AKGEC Ghaziabad', 'AKG-2023-EC-089', NULL, 'Ghaziabad'),
(5, 'Vikram Chauhan', 'owner1@homesetu.demo', 'Owner@123', 'OWNER', '+91 98222 30001', NULL, NULL, 'Chauhan Luxury Residencies', 'Ghaziabad'),
(6, 'Arushi Host', 'arushi@homesetu.demo', 'Owner@123', 'OWNER', '+91 98111 54321', NULL, NULL, 'Arushi PG', 'Ghaziabad')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Insert Top PG Listings
INSERT INTO pg_listings (id, name, tagline, city, locality, address, nearby_colleges, gender_type, monthly_rent, security_deposit, food_included, food_type, has_ac, has_wifi, rating, verified, total_beds, available_beds)
VALUES
(1, 'Arushi PG — Crossings Republik', 'Modern Girls & Co-Ed Stay with 3-Time Hygienic Meals', 'Ghaziabad', 'Crossings Republik', 'Tower C, Crossings Republik, NH-24, Ghaziabad', 'ABES Engineering College (800m), IMS UC (3.5km)', 'GIRLS', 8500, 8500, TRUE, 'Veg & Non-Veg', TRUE, TRUE, 4.8, TRUE, 12, 6),
(2, 'Sunrise PG — Kothrud', 'Peaceful Academic Living for Boys near MIT World Peace Univ', 'Pune', 'Kothrud', 'Plot 44, Paud Road, Ideal Colony, Kothrud, Pune', 'MIT World Peace University (1.1 km), Cummins College (2.2 km)', 'BOYS', 7500, 7500, TRUE, 'Veg Only', TRUE, TRUE, 4.7, TRUE, 18, 4),
(3, 'Green Nest Baner', 'Premium Co-Ed Living near IT Park & Colleges', 'Pune', 'Baner', 'Veerbhadra Nagar, Baner, Pune', 'Symbiosis Lavale Shuttle Point, MIT WPU (4.5 km)', 'COED', 9000, 9000, TRUE, 'Veg & Non-Veg', TRUE, TRUE, 4.9, TRUE, 24, 7),
(4, 'Urban Stay Girls PG — Viman Nagar', 'High-Security AC Rooms for Female Students', 'Pune', 'Viman Nagar', 'Lane 2, Near Symbiosis Campus, Viman Nagar, Pune', 'Symbiosis Centre for Management Studies (SCMS), Pune Univ', 'GIRLS', 10500, 10500, TRUE, 'Veg Only', TRUE, TRUE, 4.9, TRUE, 20, 3),
(5, 'Royal Palms Student Living', 'Spacious AC Rooms with High-Speed WiFi & Power Backup', 'Ghaziabad', 'Crossings Republik', 'Block B, Crossings Republik, Ghaziabad', 'ABES Engineering College, AKGEC', 'BOYS', 8000, 8000, TRUE, 'Veg & Non-Veg', TRUE, TRUE, 4.6, TRUE, 16, 5)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Insert Grievance & Feedback Tickets
INSERT INTO feedback_complaints (id, ticket_id, type, category, priority, subject, description, pg_id, pg_name, submitter_name, submitter_email, submitter_phone, submitter_role, status, admin_response)
VALUES
(1, 'HS-TKT-10826', 'COMPLAINT', 'Wi-Fi & Connectivity', 'HIGH', 'WiFi connectivity dropping on 3rd floor study room', 'Frequent disconnects during online assignments in evening 8-11 PM.', 1, 'Arushi PG — Crossings Republik', 'Archana Verma', 'archana.student@gmail.com', '+91 98765 12345', 'STUDENT', 'PENDING', NULL),
(2, 'HS-TKT-10821', 'COMPLAINT', 'Wi-Fi & Connectivity', 'HIGH', 'WiFi router on 2nd floor disconnecting during online tests', 'The mesh extender loses connection every 20-30 minutes.', 5, 'Royal Palms Student Living', 'Aarav Sharma', 'student1@homesetu.demo', '+91 98765 43210', 'STUDENT', 'PENDING', NULL),
(3, 'HS-TKT-10822', 'COMPLAINT', 'Food & Mess Quality', 'HIGH', 'Dinner serving timing delayed beyond 9:45 PM', 'Dinner was served after 10 PM twice this week causing issues for early morning classes.', 2, 'Sunrise PG — Kothrud', 'Aarav Sharma', 'student1@homesetu.demo', '+91 98765 43210', 'STUDENT', 'IN_REVIEW', 'Mess committee has updated serving schedule to 8:00 PM - 9:30 PM.'),
(4, 'HS-TKT-10824', 'COMPLAINT', 'Deposit & Rent Issues', 'HIGH', 'Security deposit refund pending after vacating on Oct 25', 'Completed 30-day notice period and returned room keys. Owner has delayed processing refund.', 2, 'Sunrise PG — Kothrud', 'Rohan Das', 'rohan.das@gmail.com', '+91 98991 22334', 'STUDENT', 'PENDING', NULL)
ON DUPLICATE KEY UPDATE subject = VALUES(subject);

-- 4. Insert Sample Booking Requests
INSERT INTO booking_requests (id, confirmation_id, pg_id, student_id, student_name, student_phone, student_email, room_type, monthly_rent, security_deposit, status)
VALUES
(1, 'HS-BK-2026-9041', 1, 3, 'Archana Verma', '+91 98765 12345', 'archana.student@gmail.com', 'Double Sharing AC', 8500, 8500, 'CONFIRMED'),
(2, 'HS-BK-2026-8812', 2, 2, 'Aarav Sharma', '+91 98765 43210', 'student1@homesetu.demo', 'Single Room Non-AC', 7500, 7500, 'CONFIRMED')
ON DUPLICATE KEY UPDATE student_name = VALUES(student_name);

-- ------------------------------------------------------------------------------
-- Verification Queries:
-- ------------------------------------------------------------------------------
SELECT 'users' AS table_name, COUNT(*) AS total_rows FROM users
UNION ALL
SELECT 'pg_listings', COUNT(*) FROM pg_listings
UNION ALL
SELECT 'feedback_complaints', COUNT(*) FROM feedback_complaints
UNION ALL
SELECT 'booking_requests', COUNT(*) FROM booking_requests;

