-- ==============================================================================
-- HomeSetu IBM Db2 Schema & Seed Data Script
-- Schema: DB2INST1 | Database: TESTDB
-- Run in VS Code IBM Db2 Developer Extension (SQL Editor)
-- ==============================================================================

SET SCHEMA DB2INST1;

-- ------------------------------------------------------------------------------
-- 1. Table: USERS
-- ------------------------------------------------------------------------------
CREATE TABLE USERS (
    ID BIGINT NOT NULL PRIMARY KEY,
    FULL_NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    ROLE VARCHAR(50) NOT NULL,
    PHONE VARCHAR(50),
    COLLEGE VARCHAR(255),
    STUDENT_ID VARCHAR(100),
    PROPERTY_NAME VARCHAR(255),
    CITY VARCHAR(100),
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. Table: PG_LISTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE PG_LISTINGS (
    ID BIGINT NOT NULL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    TAGLINE VARCHAR(255),
    CITY VARCHAR(100) NOT NULL,
    LOCALITY VARCHAR(150) NOT NULL,
    ADDRESS VARCHAR(1000),
    PINCODE VARCHAR(20),
    NEARBY_COLLEGES VARCHAR(1000),
    GENDER_TYPE VARCHAR(50),
    MONTHLY_RENT DOUBLE,
    SECURITY_DEPOSIT DOUBLE,
    FOOD_INCLUDED BOOLEAN DEFAULT FALSE,
    FOOD_TYPE VARCHAR(100),
    HAS_AC BOOLEAN DEFAULT FALSE,
    HAS_WIFI BOOLEAN DEFAULT TRUE,
    HAS_LAUNDRY BOOLEAN DEFAULT TRUE,
    HAS_ATTACHED_BATH BOOLEAN DEFAULT TRUE,
    HAS_CCTV BOOLEAN DEFAULT TRUE,
    HAS_POWER_BACKUP BOOLEAN DEFAULT TRUE,
    RATING DOUBLE DEFAULT 4.8,
    VERIFIED BOOLEAN DEFAULT TRUE,
    TOTAL_BEDS INT DEFAULT 20,
    AVAILABLE_BEDS INT DEFAULT 5,
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. Table: FEEDBACK_COMPLAINTS (Grievance Hub)
-- ------------------------------------------------------------------------------
CREATE TABLE FEEDBACK_COMPLAINTS (
    ID BIGINT NOT NULL PRIMARY KEY,
    TICKET_ID VARCHAR(50) NOT NULL UNIQUE,
    TYPE VARCHAR(50) NOT NULL,
    CATEGORY VARCHAR(100) NOT NULL,
    PRIORITY VARCHAR(50) DEFAULT 'MEDIUM',
    SUBJECT VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(2000) NOT NULL,
    PG_ID BIGINT,
    PG_NAME VARCHAR(255),
    SUBMITTER_NAME VARCHAR(255),
    SUBMITTER_EMAIL VARCHAR(255),
    SUBMITTER_PHONE VARCHAR(50),
    SUBMITTER_ROLE VARCHAR(50) DEFAULT 'STUDENT',
    STATUS VARCHAR(50) DEFAULT 'PENDING',
    ADMIN_RESPONSE VARCHAR(2000),
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. Table: BOOKING_REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE BOOKING_REQUESTS (
    ID BIGINT NOT NULL PRIMARY KEY,
    CONFIRMATION_ID VARCHAR(50) NOT NULL UNIQUE,
    PG_ID BIGINT NOT NULL,
    STUDENT_ID BIGINT NOT NULL,
    STUDENT_NAME VARCHAR(255),
    STUDENT_PHONE VARCHAR(50),
    STUDENT_EMAIL VARCHAR(255),
    ROOM_TYPE VARCHAR(100),
    MONTHLY_RENT DOUBLE,
    SECURITY_DEPOSIT DOUBLE,
    STATUS VARCHAR(50) DEFAULT 'CONFIRMED',
    BOOKING_DATE TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- ==============================================================================
-- SEED DATA INSERTION
-- ==============================================================================

-- 1. Insert Users (Admin Arsh Mittal, Demo Students, PG Owners)
INSERT INTO USERS (ID, FULL_NAME, EMAIL, PASSWORD, ROLE, PHONE, COLLEGE, STUDENT_ID, PROPERTY_NAME, CITY)
VALUES 
(1, 'Arsh Mittal (Platform Admin)', 'arshm2772@gmail.com', '123456', 'ADMIN', '+91 98765 43210', 'HomeSetu Headquarters', 'ADM-2026-001', 'HomeSetu Platform', 'Delhi NCR'),
(2, 'Aarav Sharma', 'student1@homesetu.demo', 'Student@123', 'STUDENT', '+91 98765 43210', 'ABES Engineering College', 'ABES-2023-CS-104', NULL, 'Ghaziabad'),
(3, 'Archana Verma', 'archana.student@gmail.com', 'Student@123', 'STUDENT', '+91 98765 12345', 'AKGEC Ghaziabad', 'AKG-2024-IT-042', NULL, 'Ghaziabad'),
(4, 'Riya Verma', 'student2@homesetu.demo', 'Student@123', 'STUDENT', '+91 98111 20002', 'AKGEC Ghaziabad', 'AKG-2023-EC-089', NULL, 'Ghaziabad'),
(5, 'Arushi Host', 'arushi@homesetu.demo', 'Owner@123', 'OWNER', '+91 98111 54321', NULL, NULL, 'Arushi PG', 'Ghaziabad');

-- 2. Insert Top PG Listings
INSERT INTO PG_LISTINGS (ID, NAME, TAGLINE, CITY, LOCALITY, ADDRESS, NEARBY_COLLEGES, GENDER_TYPE, MONTHLY_RENT, SECURITY_DEPOSIT, FOOD_INCLUDED, FOOD_TYPE, HAS_AC, HAS_WIFI, RATING, VERIFIED, TOTAL_BEDS, AVAILABLE_BEDS)
VALUES
(1, 'Arushi PG — Crossings Republik', 'Modern Girls & Co-Ed Stay with 3-Time Hygienic Meals', 'Ghaziabad', 'Crossings Republik', 'Tower C, Crossings Republik, NH-24, Ghaziabad', 'ABES Engineering College (800m), IMS UC (3.5km)', 'GIRLS', 8500, 8500, TRUE, 'Veg & Non-Veg', TRUE, TRUE, 4.8, TRUE, 12, 6),
(2, 'Sunrise PG — Kothrud', 'Peaceful Academic Living for Boys near MIT World Peace Univ', 'Pune', 'Kothrud', 'Plot 44, Paud Road, Ideal Colony, Kothrud, Pune', 'MIT World Peace University (1.1 km), Cummins College (2.2 km)', 'BOYS', 7500, 7500, TRUE, 'Veg Only', TRUE, TRUE, 4.7, TRUE, 18, 4),
(3, 'Green Nest Baner', 'Premium Co-Ed Living near IT Park & Colleges', 'Pune', 'Baner', 'Veerbhadra Nagar, Baner, Pune', 'Symbiosis Lavale Shuttle Point, MIT WPU (4.5 km)', 'COED', 9000, 9000, TRUE, 'Veg & Non-Veg', TRUE, TRUE, 4.9, TRUE, 24, 7),
(4, 'Urban Stay Girls PG — Viman Nagar', 'High-Security AC Rooms for Female Students', 'Pune', 'Viman Nagar', 'Lane 2, Near Symbiosis Campus, Viman Nagar, Pune', 'Symbiosis Centre for Management Studies (SCMS), Pune Univ', 'GIRLS', 10500, 10500, TRUE, 'Veg Only', TRUE, TRUE, 4.9, TRUE, 20, 3);

-- 3. Insert Grievance & Feedback Tickets
INSERT INTO FEEDBACK_COMPLAINTS (ID, TICKET_ID, TYPE, CATEGORY, PRIORITY, SUBJECT, DESCRIPTION, PG_ID, PG_NAME, SUBMITTER_NAME, SUBMITTER_EMAIL, SUBMITTER_PHONE, SUBMITTER_ROLE, STATUS, ADMIN_RESPONSE)
VALUES
(1, 'HS-TKT-10826', 'COMPLAINT', 'Wi-Fi & Connectivity', 'HIGH', 'WiFi connectivity dropping on 3rd floor study room', 'Frequent disconnects during online assignments in evening 8-11 PM.', 1, 'Arushi PG — Crossings Republik', 'Archana Verma', 'archana.student@gmail.com', '+91 98765 12345', 'STUDENT', 'PENDING', NULL),
(2, 'HS-TKT-10821', 'COMPLAINT', 'Wi-Fi & Connectivity', 'HIGH', 'WiFi router on 2nd floor disconnecting during online tests', 'The mesh extender loses connection every 20-30 minutes.', 1, 'Arushi PG — Crossings Republik', 'Aarav Sharma', 'student1@homesetu.demo', '+91 98765 43210', 'STUDENT', 'PENDING', NULL),
(3, 'HS-TKT-10822', 'COMPLAINT', 'Food & Mess Quality', 'HIGH', 'Dinner serving timing delayed beyond 9:45 PM', 'Dinner was served after 10 PM twice this week causing issues for early morning classes.', 2, 'Sunrise PG — Kothrud', 'Aarav Sharma', 'student1@homesetu.demo', '+91 98765 43210', 'STUDENT', 'IN_REVIEW', 'Mess committee has updated serving schedule to 8:00 PM - 9:30 PM.'),
(4, 'HS-TKT-10824', 'COMPLAINT', 'Deposit & Rent Issues', 'HIGH', 'Security deposit refund pending after vacating on Oct 25', 'Completed 30-day notice period and returned room keys. Owner has delayed processing refund.', 2, 'Sunrise PG — Kothrud', 'Rohan Das', 'rohan.das@gmail.com', '+91 98991 22334', 'STUDENT', 'PENDING', NULL);

-- 4. Insert Booking Requests
INSERT INTO BOOKING_REQUESTS (ID, CONFIRMATION_ID, PG_ID, STUDENT_ID, STUDENT_NAME, STUDENT_PHONE, STUDENT_EMAIL, ROOM_TYPE, MONTHLY_RENT, SECURITY_DEPOSIT, STATUS)
VALUES
(1, 'HS-BK-2026-9041', 1, 3, 'Archana Verma', '+91 98765 12345', 'archana.student@gmail.com', 'Double Sharing AC', 8500, 8500, 'CONFIRMED'),
(2, 'HS-BK-2026-8812', 2, 2, 'Aarav Sharma', '+91 98765 43210', 'student1@homesetu.demo', 'Single Room Non-AC', 7500, 7500, 'CONFIRMED');

