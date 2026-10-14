// API service for HomeSetu frontend
// Connects to Spring Boot backend at /api with graceful local fallback for standalone & evaluation use

const API_BASE = '/api';

// Initial fallback mock data with 12 rich student PGs across Pune, Bengaluru, Delhi, Kota
const INITIAL_PGS = [
  {
    id: 1,
    name: "Sunrise PG — Kothrud",
    tagline: "Student Living near MIT-WPU & COEP with Homely Food",
    city: "Pune",
    locality: "Kothrud",
    address: "Plot 42, Anand Nagar, Paud Road, Kothrud",
    pincode: "411038",
    nearbyColleges: "MIT World Peace University (1.1 km), Cummins College (2.2 km), COEP (4.8 km)",
    genderType: "BOYS",
    monthlyRent: 7500,
    securityDeposit: 15000,
    foodIncluded: true,
    foodType: "Veg & Non-Veg",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Sunrise PG is tailored for engineering and management students in Kothrud. Fully furnished rooms with high-speed 300 Mbps Wi-Fi, hygienic 3-time meals prepared by professional chefs, and 24/7 security.",
    houseRules: "Gate closes at 10:30 PM. No alcohol or smoking on premises. Quiet study hours after 10 PM. Non-resident visitors allowed until 7 PM.",
    noticePeriodDays: 30,
    gateClosingTime: "10:30 PM",
    totalRooms: 12,
    availableRooms: 4,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Property Ownership Deed & Electricity Meter Registry",
      propertyDocNumber: "EB-PUN-KOT-2026-8812",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-9124",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-01",
      verifiedAt: "2026-10-03",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Physical premises and municipal property deed cross-verified."
    },
    messMenu: {
      breakfast: "Poha, Idli Sambhar, Aloo Paratha, Fresh Milk / Tea",
      lunch: "Dal Tadka, Seasonal Veg / Paneer, Steamed Basmati Rice, Phulkas, Raita",
      dinner: "Rajma Masala / Chicken Curry (Wed/Sun), Jeera Rice, Tawa Roti, Gulab Jamun",
      dietOption: "Veg & Non-Veg Separate Kitchens"
    },
    commuteTimes: {
      walk: "10 mins to MIT-WPU",
      cycle: "4 mins",
      bus: "7 mins (Direct bus stop 100m away)"
    },
    rating: 4.4,
    totalReviews: 18,
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 2,
    name: "Green Nest PG — Baner",
    tagline: "Spacious & Serene Stay with In-House Gym & Study Lounge",
    city: "Pune",
    locality: "Baner",
    address: "Sector 7, Pan Card Club Road, Baner",
    pincode: "411045",
    nearbyColleges: "NICMAR University (2.1 km), Pune University (4.0 km), Symbiosis SB Road (5.5 km)",
    genderType: "COED",
    monthlyRent: 8200,
    securityDeposit: 16000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: true,
    description: "Located in the peaceful IT corridor of Baner, Green Nest offers modern furnished student suites with dedicated study desks, ergonomic chairs, RO water dispensers, and daily housekeeping.",
    houseRules: "Biometric entry. Gate closes at 11:00 PM. No loud disturbances during exam seasons. ID card mandatory for all visitors.",
    noticePeriodDays: 30,
    gateClosingTime: "11:00 PM",
    totalRooms: 16,
    availableRooms: 5,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Commercial Lease & Electricity Meter",
      propertyDocNumber: "EB-PUN-BAN-2026-4401",
      ownerGovtIdType: "PAN Card",
      ownerGovtIdNumber: "XXXXX4412P",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-09-28",
      verifiedAt: "2026-09-30",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Safety compliance and emergency exit verified."
    },
    messMenu: {
      breakfast: "Upma, Masala Dosa, Bread Butter, Coffee / Tea",
      lunch: "Dal Fry, Mix Veg Korma, Steamed Rice, Roti, Salad",
      dinner: "Paneer Lababdar, Jeera Rice, Tandoori Roti, Fruit Salad",
      dietOption: "100% Pure Vegetarian"
    },
    commuteTimes: {
      walk: "15 mins to NICMAR",
      cycle: "6 mins",
      bus: "10 mins"
    },
    rating: 4.6,
    totalReviews: 24,
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 3,
    name: "Urban Stay Girls PG — Viman Nagar",
    tagline: "Budget-Friendly, Secure Girls PG Close to Symbiosis Campus",
    city: "Pune",
    locality: "Viman Nagar",
    address: "Lane 2, Behind Dutta Mandir, Viman Nagar",
    pincode: "411014",
    nearbyColleges: "Symbiosis Design / Law / Media (800m), Phoenix Mall (1.2 km)",
    genderType: "GIRLS",
    monthlyRent: 6800,
    securityDeposit: 12000,
    foodIncluded: false,
    foodType: "No Meals (Modular Kitchen Available)",
    hasAc: false,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "A safe, homely haven for female students studying in Viman Nagar. Fully automated laundry, water purifiers, fast Wi-Fi, and 24-hour female warden on premises.",
    houseRules: "Strict 10:00 PM entry. Female visitors only permitted inside residential floors. Maintenance issues resolved within 24 hours.",
    noticePeriodDays: 30,
    gateClosingTime: "10:00 PM",
    totalRooms: 10,
    availableRooms: 3,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Registered Rental Deed & Society NOC",
      propertyDocNumber: "NOC-VIM-2026-119",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-6602",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-02",
      verifiedAt: "2026-10-04",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Warden background check and CCTV installation verified."
    },
    messMenu: {
      breakfast: "Self-Cooking Kitchen (Microwave, Induction & RO Provided)",
      lunch: "Local Tiffin Partner Service (Optional ₹2,500/mo)",
      dinner: "Local Tiffin Partner Service (Optional)",
      dietOption: "Kitchen Access 24x7"
    },
    commuteTimes: {
      walk: "8 mins to Symbiosis Law/Design",
      cycle: "3 mins",
      bus: "5 mins"
    },
    rating: 4.2,
    totalReviews: 15,
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 11,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@homesetu.com"
  },
  {
    id: 4,
    name: "Scholar Haven — Hinjewadi Phase 1",
    tagline: "Modern Tech-Hub Stay for Engineering & MCA Students",
    city: "Pune",
    locality: "Hinjewadi",
    address: "Blue Ridge Road, Hinjewadi Phase 1",
    pincode: "411057",
    nearbyColleges: "Symbiosis Centre for Information Tech (1.5 km), JSPM Hadapsar/Bavdhan (4 km)",
    genderType: "BOYS",
    monthlyRent: 7800,
    securityDeposit: 15000,
    foodIncluded: true,
    foodType: "Veg & Non-Veg",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: true,
    description: "Equipped with dedicated workstation desks, 500 Mbps fiber internet, ergonomic gaming chairs, power backup for laptops, and daily hot breakfast and dinner.",
    houseRules: "Gate closes at 11:30 PM. High-volume sound prohibited after 11 PM. Clean room policy.",
    noticePeriodDays: 30,
    gateClosingTime: "11:30 PM",
    totalRooms: 15,
    availableRooms: 6,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Society Ownership Certificate & Electricity Meter",
      propertyDocNumber: "EB-PUN-HIN-2026-9023",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-3341",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-05",
      verifiedAt: "2026-10-06",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "High-speed internet and power backup verified."
    },
    messMenu: {
      breakfast: "Poha, Puri Bhaji, Boiled Eggs, Tea / Coffee",
      lunch: "Dal Palak, Aloo Gobhi, Rice, Chapatis",
      dinner: "Egg Curry / Shahi Paneer, Rice, Rotis, Halwa",
      dietOption: "Veg & Non-Veg Available"
    },
    commuteTimes: {
      walk: "12 mins to SCIT Hinjewadi",
      cycle: "5 mins",
      bus: "8 mins"
    },
    rating: 4.5,
    totalReviews: 20,
    coverImage: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 5,
    name: "Harmony Living — Shivaji Nagar",
    tagline: "Prime Central Stay Near Fergusson & BMCC Colleges",
    city: "Pune",
    locality: "Shivaji Nagar",
    address: "FC Road, Near Goodluck Cafe, Shivaji Nagar",
    pincode: "411004",
    nearbyColleges: "Fergusson College (400m), BMCC (900m), COEP (1.8 km)",
    genderType: "GIRLS",
    monthlyRent: 8500,
    securityDeposit: 17000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Right in the heart of Pune student life on FC Road. Surrounded by cafes, bookstores, and top colleges. Home-cooked vegetarian meals and tight security.",
    houseRules: "Gate closing at 10:00 PM. Parents permitted in lounge area. Strict study environment.",
    noticePeriodDays: 30,
    gateClosingTime: "10:00 PM",
    totalRooms: 14,
    availableRooms: 3,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Heritage Property Sanction & Electricity Bill",
      propertyDocNumber: "EB-PUN-SHV-2026-1184",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-7729",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-04",
      verifiedAt: "2026-10-06",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Prime location verified; female security guard on duty."
    },
    messMenu: {
      breakfast: "Sabudana Khichdi, Idli, Toast, Milk / Bournvita",
      lunch: "Maharashtrian Thali: Varan Bhaat, Bhindi, Chapati",
      dinner: "Paneer Bhurji / Dal Fry, Jeera Rice, Phulka, Sweet",
      dietOption: "Pure Vegetarian Jain Options Available"
    },
    commuteTimes: {
      walk: "4 mins to Fergusson College",
      cycle: "2 mins",
      bus: "Direct metro 300m away"
    },
    rating: 4.7,
    totalReviews: 29,
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    ownerId: 11,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@homesetu.com"
  },
  {
    id: 6,
    name: "Royal Comfort PG — Koramangala",
    tagline: "Prime Location Accommodation Near Christ University",
    city: "Bengaluru",
    locality: "Koramangala",
    address: "4th Block, 80 Feet Road, Koramangala",
    pincode: "560034",
    nearbyColleges: "Christ University Central Campus (1.4 km), St. John's Medical College (2.2 km)",
    genderType: "COED",
    monthlyRent: 9500,
    securityDeposit: 19000,
    foodIncluded: true,
    foodType: "Veg & Non-Veg",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: true,
    description: "Ultra-modern PG living in the heart of Bengaluru's education hub. High-speed fiber internet, rooftop cafe lounge, self-cooking station, and air-conditioned rooms.",
    houseRules: "Fingerprint lock access. Gate closing time 11:30 PM. Common areas sanitized daily.",
    noticePeriodDays: 30,
    gateClosingTime: "11:30 PM",
    totalRooms: 20,
    availableRooms: 6,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "BBMP Khata & Commercial Electricity Connection",
      propertyDocNumber: "BBMP-BLR-KOR-2026-5501",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-9912",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-02",
      verifiedAt: "2026-10-04",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Modern amenities and biometrics verified."
    },
    messMenu: {
      breakfast: "Dosa, Vada Sambhar, Poha, Fresh Filter Coffee",
      lunch: "South & North Indian Meals: Sambar, Dal, Paneer/Chicken, Curd Rice",
      dinner: "Veg Pulao, Dal Makhani, Phulkas, Payasam",
      dietOption: "Veg & Non-Veg"
    },
    commuteTimes: {
      walk: "14 mins to Christ University",
      cycle: "5 mins",
      bus: "8 mins"
    },
    rating: 4.8,
    totalReviews: 35,
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 7,
    name: "Silicon Comfort PG — Electronic City",
    tagline: "Affordable Stay for PES & IIIT Bangalore Students",
    city: "Bengaluru",
    locality: "Electronic City",
    address: "Phase 1, Near Wipro Gate 5, Electronic City",
    pincode: "560100",
    nearbyColleges: "IIIT Bangalore (1.2 km), PES University South Campus (2.8 km)",
    genderType: "BOYS",
    monthlyRent: 8000,
    securityDeposit: 16000,
    foodIncluded: true,
    foodType: "Veg & Non-Veg",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Quiet student accommodation located minutes from tech campuses and tech institutes. 200 Mbps Wi-Fi, daily cleaning, hot water, and delicious homestyle South and North Indian meals.",
    houseRules: "Gate closing at 11:00 PM. No loud noise during late study hours.",
    noticePeriodDays: 30,
    gateClosingTime: "11:00 PM",
    totalRooms: 18,
    availableRooms: 5,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Electricity Meter Bill & Property Deed",
      propertyDocNumber: "EB-BLR-ELC-2026-3810",
      ownerGovtIdType: "PAN Card",
      ownerGovtIdNumber: "XXXXX9931K",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-06",
      verifiedAt: "2026-10-07",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Institute commute proximity verified."
    },
    messMenu: {
      breakfast: "Idli Vada, Pongal, Bread Omelette, Tea",
      lunch: "Rice, Rasam, Sambar, Cabbage Poriyal, Curd",
      dinner: "Chapati, Dal Fry, Chicken Curry / Aloo Mattar, Kheer",
      dietOption: "Veg & Non-Veg"
    },
    commuteTimes: {
      walk: "12 mins to IIIT Bangalore",
      cycle: "4 mins",
      bus: "7 mins"
    },
    rating: 4.3,
    totalReviews: 22,
    coverImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 8,
    name: "Greenwood Girls Residency — HSR Layout",
    tagline: "Premium Girls PG Near NIFT & Oxford College",
    city: "Bengaluru",
    locality: "HSR Layout",
    address: "Sector 2, 27th Main Road, HSR Layout",
    pincode: "560102",
    nearbyColleges: "NIFT Bengaluru (1.8 km), The Oxford College of Science (2.5 km)",
    genderType: "GIRLS",
    monthlyRent: 9200,
    securityDeposit: 18000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: true,
    description: "Safe, luxury living designed for women students. Includes biometric entry, 24/7 security warden, power backup, study desks, and hygienic meals with healthy options.",
    houseRules: "Gate closing at 10:30 PM. Overnight female guests allowed with prior intimation.",
    noticePeriodDays: 30,
    gateClosingTime: "10:30 PM",
    totalRooms: 14,
    availableRooms: 4,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "BBMP Certificate & Police Verification",
      propertyDocNumber: "BBMP-BLR-HSR-2026-7782",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-2194",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-04",
      verifiedAt: "2026-10-06",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Warden background check complete."
    },
    messMenu: {
      breakfast: "Poha, Masala Oats, Fresh Cut Fruits, Milk / Tea",
      lunch: "North Indian Thali: Rajma, Bhindi, Rice, Rotis",
      dinner: "Paneer Butter Masala, Jeera Rice, Tawa Roti, Fruit Custard",
      dietOption: "100% Pure Veg"
    },
    commuteTimes: {
      walk: "15 mins to NIFT",
      cycle: "5 mins",
      bus: "8 mins"
    },
    rating: 4.7,
    totalReviews: 27,
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    ownerId: 11,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@homesetu.com"
  },
  {
    id: 9,
    name: "Campus Haven — North Campus",
    tagline: "Vibrant DU Student Hostel Near SRCC & Hindu College",
    city: "Delhi",
    locality: "North Campus",
    address: "Kalyan Vihar, Near GTB Nagar Metro, North Campus",
    pincode: "110009",
    nearbyColleges: "SRCC (1.2 km), Hindu College (1.5 km), Hansraj College (1.8 km)",
    genderType: "BOYS",
    monthlyRent: 8000,
    securityDeposit: 16000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Conveniently located 5 minutes from GTB Nagar Metro, perfect for Delhi University students. Unlimited Wi-Fi, air conditioned rooms, and authentic North Indian meals.",
    houseRules: "Entry allowed until 10:30 PM. No unauthorized overnight guests.",
    noticePeriodDays: 30,
    gateClosingTime: "10:30 PM",
    totalRooms: 16,
    availableRooms: 5,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "DDA Property Registration & Electricity Meter",
      propertyDocNumber: "DDA-DEL-NC-2026-9041",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-8833",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-09-29",
      verifiedAt: "2026-10-01",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Delhi Metro proximity and safety norms verified."
    },
    messMenu: {
      breakfast: "Aloo Paratha with Curd & Pickle, Tea",
      lunch: "Dal Makhani, Mix Veg, Steamed Rice, Roti, Salad",
      dinner: "Paneer Do Pyaza, Rice, Butter Roti, Gulab Jamun",
      dietOption: "Pure Vegetarian"
    },
    commuteTimes: {
      walk: "10 mins to GTB Nagar Metro / SRCC",
      cycle: "4 mins",
      bus: "E-rickshaw available 24x7"
    },
    rating: 4.4,
    totalReviews: 31,
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 10,
    name: "Metro Prime PG — South Campus",
    tagline: "Comfort Stay Near Sri Venkateswara & Gargi College",
    city: "Delhi",
    locality: "South Campus",
    address: "Satya Niketan, Opp. Venkateswara College",
    pincode: "110021",
    nearbyColleges: "Sri Venkateswara College (300m), ARSD College (600m), Gargi College (2.5 km)",
    genderType: "COED",
    monthlyRent: 8800,
    securityDeposit: 17500,
    foodIncluded: true,
    foodType: "Veg & Non-Veg",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: true,
    description: "Situated in the bustling student cafe lane of Satya Niketan. Direct walk to South Campus colleges and Durgabai Deshmukh South Campus Metro Station.",
    houseRules: "Gate closing at 11:00 PM. Clean common areas. ID card mandatory.",
    noticePeriodDays: 30,
    gateClosingTime: "11:00 PM",
    totalRooms: 18,
    availableRooms: 4,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "Municipal Tax Receipt & BSES Electricity Bill",
      propertyDocNumber: "BSES-DEL-SC-2026-6612",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-1903",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-03",
      verifiedAt: "2026-10-05",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Physically inspected and safety certified."
    },
    messMenu: {
      breakfast: "Chole Bhature / Poha, Juice / Tea",
      lunch: "Kadhi Pakora / Dal Tadka, Rice, Roti, Salad",
      dinner: "Butter Chicken / Shahi Paneer, Pulao, Tandoori Roti",
      dietOption: "Veg & Non-Veg"
    },
    commuteTimes: {
      walk: "3 mins to Sri Venkateswara College",
      cycle: "1 min",
      bus: "5 mins to Metro"
    },
    rating: 4.6,
    totalReviews: 28,
    coverImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 11,
    name: "Kota Pride Youth Residency — Landmark City",
    tagline: "Distraction-Free Study Environment for JEE & NEET Aspirants",
    city: "Kota",
    locality: "Landmark City",
    address: "Kunhari, Near Allen Sangyan Campus, Landmark City",
    pincode: "324008",
    nearbyColleges: "Allen Sangyan (400m), Resonance Eduventures (800m), PhysicsWallah Vidyapeeth (1.1 km)",
    genderType: "BOYS",
    monthlyRent: 7200,
    securityDeposit: 14000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Designed specifically for coaching students preparing for competitive exams. Soundproof study rooms, nutritious balanced diet recommended for long study hours, RO water, and emergency medical support.",
    houseRules: "Mandatory study hours 9 PM to 12 AM. No mobile phone speaker usage. Gate closes at 10:00 PM.",
    noticePeriodDays: 30,
    gateClosingTime: "10:00 PM",
    totalRooms: 24,
    availableRooms: 8,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "UIT Kota Hostel Registry & Electricity Connection",
      propertyDocNumber: "UIT-KOT-2026-7840",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-4512",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-01",
      verifiedAt: "2026-10-02",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Kota student safety guidelines and counselling support verified."
    },
    messMenu: {
      breakfast: "Poha, Daliya, Sprouts, Milk / Boost",
      lunch: "Dal, Paneer / Green Veg, Chapatis, Curd, Rice",
      dinner: "Moong Dal Khichdi / Roti Sabzi, Milk at Night",
      dietOption: "100% Satvik / Pure Veg for Students"
    },
    commuteTimes: {
      walk: "5 mins to Allen Sangyan",
      cycle: "2 mins",
      bus: "Coaching shuttle stops at gate"
    },
    rating: 4.5,
    totalReviews: 36,
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    ownerId: 10,
    ownerName: "Ramesh Sharma",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "owner@homesetu.com"
  },
  {
    id: 12,
    name: "Saraswati Girls Residency — Indra Vihar",
    tagline: "Safe & Nurturing Girls Hostel Near Allen Samyak",
    city: "Kota",
    locality: "Indra Vihar",
    address: "Road No. 2, Near Indra Vihar Circle",
    pincode: "324005",
    nearbyColleges: "Allen Samyak (300m), Career Point (700m), Motion IIT (900m)",
    genderType: "GIRLS",
    monthlyRent: 7500,
    securityDeposit: 15000,
    foodIncluded: true,
    foodType: "Veg Only",
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    description: "Top-rated girls hostel in Indra Vihar with on-site resident doctor visits, round-the-clock female warden, camera monitoring, and healthy homely meals.",
    houseRules: "Gate closing at 8:30 PM. Weekly attendance report sent to registered parents.",
    noticePeriodDays: 30,
    gateClosingTime: "8:30 PM",
    totalRooms: 20,
    availableRooms: 5,
    isVerified: true,
    verificationStatus: "VERIFIED",
    verificationDossier: {
      propertyDocType: "UIT Registration & Kota Police Verification Certificate",
      propertyDocNumber: "UIT-KOT-IV-2026-2109",
      ownerGovtIdType: "Aadhaar Card",
      ownerGovtIdNumber: "XXXX-XXXX-8821",
      fireSafetyCertified: true,
      policeVerificationStatus: "Clear & Verified",
      submittedAt: "2026-10-03",
      verifiedAt: "2026-10-04",
      verifiedBy: "HomeSetu Trust & Safety Team",
      adminNotes: "Warden protocol and parent notification system verified."
    },
    messMenu: {
      breakfast: "Stuffed Parathas, Fruit Bowl, Milk",
      lunch: "Dal Makhani, Mixed Vegetable, Rice, Phulkas",
      dinner: "Paneer, Dal Tadka, Rice, Roti, Kheer",
      dietOption: "Pure Vegetarian"
    },
    commuteTimes: {
      walk: "4 mins to Allen Samyak",
      cycle: "2 mins",
      bus: "Direct e-rickshaw stand outside"
    },
    rating: 4.8,
    totalReviews: 42,
    coverImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    ownerId: 11,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@homesetu.com"
  }
];

// Room inventories for each PG
const INITIAL_ROOMS = {
  1: [
    { id: 101, roomType: "Single Sharing", pricePerMonth: 11500, totalBeds: 3, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 102, roomType: "Double Sharing", pricePerMonth: 7500, totalBeds: 6, availableBeds: 3, hasBalcony: true, hasAttachedWashroom: true },
    { id: 103, roomType: "Triple Sharing", pricePerMonth: 5800, totalBeds: 3, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
  ],
  2: [
    { id: 201, roomType: "Single Sharing", pricePerMonth: 13000, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 202, roomType: "Double Sharing", pricePerMonth: 8200, totalBeds: 8, availableBeds: 4, hasBalcony: true, hasAttachedWashroom: true },
    { id: 203, roomType: "Triple Sharing", pricePerMonth: 6500, totalBeds: 4, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
  ],
  3: [
    { id: 301, roomType: "Double Sharing", pricePerMonth: 8500, totalBeds: 5, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
    { id: 302, roomType: "Triple Sharing", pricePerMonth: 6800, totalBeds: 5, availableBeds: 3, hasBalcony: false, hasAttachedWashroom: true },
  ],
  4: [
    { id: 401, roomType: "Single Sharing", pricePerMonth: 12500, totalBeds: 4, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
    { id: 402, roomType: "Double Sharing", pricePerMonth: 7800, totalBeds: 8, availableBeds: 3, hasBalcony: true, hasAttachedWashroom: true },
    { id: 403, roomType: "Triple Sharing", pricePerMonth: 6200, totalBeds: 3, availableBeds: 1, hasBalcony: false, hasAttachedWashroom: true },
  ],
  5: [
    { id: 501, roomType: "Single Sharing", pricePerMonth: 13500, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 502, roomType: "Double Sharing", pricePerMonth: 8500, totalBeds: 6, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
    { id: 503, roomType: "Triple Sharing", pricePerMonth: 6900, totalBeds: 4, availableBeds: 1, hasBalcony: false, hasAttachedWashroom: true },
  ],
  6: [
    { id: 601, roomType: "Single Sharing", pricePerMonth: 15500, totalBeds: 5, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
    { id: 602, roomType: "Double Sharing", pricePerMonth: 9500, totalBeds: 10, availableBeds: 4, hasBalcony: true, hasAttachedWashroom: true },
    { id: 603, roomType: "Triple Sharing", pricePerMonth: 7500, totalBeds: 5, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
  ],
  7: [
    { id: 701, roomType: "Single Sharing", pricePerMonth: 12500, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 702, roomType: "Double Sharing", pricePerMonth: 8000, totalBeds: 10, availableBeds: 3, hasBalcony: false, hasAttachedWashroom: true },
  ],
  8: [
    { id: 801, roomType: "Single Sharing", pricePerMonth: 14500, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 802, roomType: "Double Sharing", pricePerMonth: 9200, totalBeds: 6, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
  ],
  9: [
    { id: 901, roomType: "Single Sharing", pricePerMonth: 13000, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 902, roomType: "Double Sharing", pricePerMonth: 8000, totalBeds: 8, availableBeds: 3, hasBalcony: true, hasAttachedWashroom: true },
  ],
  10: [
    { id: 1001, roomType: "Single Sharing", pricePerMonth: 14000, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 1002, roomType: "Double Sharing", pricePerMonth: 8800, totalBeds: 8, availableBeds: 3, hasBalcony: true, hasAttachedWashroom: true },
  ],
  11: [
    { id: 1101, roomType: "Single Sharing", pricePerMonth: 11000, totalBeds: 8, availableBeds: 3, hasBalcony: false, hasAttachedWashroom: true },
    { id: 1102, roomType: "Double Sharing", pricePerMonth: 7200, totalBeds: 16, availableBeds: 5, hasBalcony: true, hasAttachedWashroom: true },
  ],
  12: [
    { id: 1201, roomType: "Single Sharing", pricePerMonth: 11500, totalBeds: 6, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
    { id: 1202, roomType: "Double Sharing", pricePerMonth: 7500, totalBeds: 14, availableBeds: 4, hasBalcony: true, hasAttachedWashroom: true },
  ]
};

const INITIAL_BOOKINGS = [
  {
    id: 1,
    studentId: 1,
    studentName: "Rahul Verma",
    studentEmail: "student@homesetu.com",
    studentPhone: "+91 98765 00001",
    studentCollege: "Pune Engineering College (COEP)",
    pgListingId: 1,
    pgName: "Sunrise PG — Kothrud",
    pgCity: "Pune",
    pgLocality: "Kothrud",
    ownerId: 10,
    roomType: "Double Sharing",
    monthlyRent: 7500,
    moveInDate: "2026-10-20",
    durationMonths: 10,
    message: "Hello Ramesh Uncle, I am a 2nd year B.Tech student at COEP. Looking for a quiet room with Wi-Fi.",
    status: "ACCEPTED",
    confirmationId: "HS-2026-7842",
    ownerNotes: "Booking accepted! Looking forward to welcoming you. Please bring college ID photocopy during check-in.",
    createdAt: "2026-10-05T10:00:00",
    actionDate: "2026-10-06T14:30:00"
  },
  {
    id: 2,
    studentId: 1,
    studentName: "Rahul Verma",
    studentEmail: "student@homesetu.com",
    studentPhone: "+91 98765 00001",
    studentCollege: "Pune Engineering College (COEP)",
    pgListingId: 2,
    pgName: "Green Nest PG — Baner",
    pgCity: "Pune",
    pgLocality: "Baner",
    ownerId: 10,
    roomType: "Single Sharing",
    monthlyRent: 13000,
    moveInDate: "2026-10-25",
    durationMonths: 6,
    message: "Checking if AC single room is available starting next week.",
    status: "PENDING",
    confirmationId: null,
    ownerNotes: null,
    createdAt: "2026-10-08T11:20:00",
    actionDate: null
  }
];

const INITIAL_REVIEWS = {
  1: [
    {
      id: 1,
      studentName: "Rahul Verma",
      studentCollege: "COEP Pune",
      rating: 5,
      comment: "Extremely clean and peaceful place to study. Food tastes just like home. Wi-Fi speed is top notch!",
      cleanlinessScore: 5,
      foodScore: 5,
      amenitiesScore: 5,
      createdAt: "2026-09-28"
    },
    {
      id: 2,
      studentName: "Priya Sen",
      studentCollege: "MIT World Peace University",
      rating: 4,
      comment: "Ramesh uncle is very helpful. Distance to MIT is just a 10 min walk.",
      cleanlinessScore: 4,
      foodScore: 4,
      amenitiesScore: 5,
      createdAt: "2026-10-01"
    }
  ]
};

// Initial Visits
const INITIAL_VISITS = [
  {
    id: 1,
    studentId: 1,
    studentName: "Rahul Verma",
    studentPhone: "+91 98765 00001",
    pgId: 1,
    pgName: "Sunrise PG — Kothrud",
    visitDate: "2026-10-18",
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    visitType: "Physical In-Person Visit",
    status: "CONFIRMED",
    passCode: "VISIT-8841"
  }
];

// In-memory state cached with localStorage persistence
function loadSavedPgs() {
  const saved = localStorage.getItem('homesetu_pgs');
  return saved ? JSON.parse(saved) : INITIAL_PGS;
}

function loadSavedBookings() {
  const saved = localStorage.getItem('homesetu_bookings');
  return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
}

function loadSavedVisits() {
  const saved = localStorage.getItem('homesetu_visits');
  return saved ? JSON.parse(saved) : INITIAL_VISITS;
}

let mockPgs = loadSavedPgs();
let mockRooms = { ...INITIAL_ROOMS };
let mockBookings = loadSavedBookings();
let mockReviews = { ...INITIAL_REVIEWS };
let mockVisits = loadSavedVisits();

function savePgsToStorage() {
  localStorage.setItem('homesetu_pgs', JSON.stringify(mockPgs));
}

function saveBookingsToStorage() {
  localStorage.setItem('homesetu_bookings', JSON.stringify(mockBookings));
}

function saveVisitsToStorage() {
  localStorage.setItem('homesetu_visits', JSON.stringify(mockVisits));
}

export const api = {
  // Authentication with Strict Credential & Role Verification
  login: async (email, password, expectedRole = null) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable, falling back to client-side auth:", e);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check user registered in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('homesetu_registered_users') || '[]');
    const registeredMatch = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (registeredMatch) {
      if (registeredMatch.password && registeredMatch.password !== cleanPassword) {
        return { success: false, message: "Incorrect password. Please verify your password." };
      }
      if (expectedRole && registeredMatch.role !== expectedRole) {
        return {
          success: false,
          message: `Access Denied: This account is registered as a ${registeredMatch.role}. Please login via the ${registeredMatch.role === 'STUDENT' ? 'Student' : registeredMatch.role === 'OWNER' ? 'PG Owner' : 'Admin'} portal.`
        };
      }
      return { success: true, user: registeredMatch };
    }

    // 2. Pre-seeded Verified Accounts
    if (cleanEmail === "student@homesetu.com") {
      if (cleanPassword !== "123456") {
        return { success: false, message: "Incorrect password. (Default demo student password is 123456)" };
      }
      if (expectedRole && expectedRole !== 'STUDENT') {
        return { success: false, message: "Access Denied: student@homesetu.com is a Student account. Please login through the Student portal." };
      }
      return {
        success: true,
        user: { id: 1, fullName: "Rahul Verma", email: "student@homesetu.com", role: "STUDENT", college: "Pune Engineering College (COEP)", phone: "+91 98765 00001", city: "Pune" }
      };
    } else if (cleanEmail === "owner@homesetu.com" || cleanEmail === "ramesh@homesetu.com") {
      if (cleanPassword !== "123456") {
        return { success: false, message: "Incorrect password. (Default demo owner password is 123456)" };
      }
      if (expectedRole && expectedRole !== 'OWNER') {
        return { success: false, message: "Access Denied: owner@homesetu.com is a PG Owner account. Please login through the PG Owner portal." };
      }
      return {
        success: true,
        user: { id: 10, fullName: "Ramesh Sharma", email: "owner@homesetu.com", role: "OWNER", city: "Pune", phone: "+91 91234 56789", isVerified: true }
      };
    } else if (cleanEmail === "admin@homesetu.com") {
      if (cleanPassword !== "admin123" && cleanPassword !== "ADMIN2026") {
        return { success: false, message: "Incorrect password. (Default demo admin password is admin123)" };
      }
      if (expectedRole && expectedRole !== 'ADMIN') {
        return { success: false, message: "Access Denied: admin@homesetu.com is an Administrator account. Please login through the Admin portal." };
      }
      return {
        success: true,
        user: { id: 99, fullName: "HomeSetu Admin", email: "admin@homesetu.com", role: "ADMIN", city: "Pune", phone: "+91 99999 88888" }
      };
    }

    // 3. Email not found - Strict Error
    return {
      success: false,
      message: "No account found with this email. Please click 'Create Account' below to register first."
    };
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for register:", e);
    }

    const newUser = {
      id: Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role || "STUDENT",
      phone: userData.phone || "+91 98765 00000",
      college: userData.college || "",
      studentId: userData.studentId || "",
      city: userData.city || "Pune",
      isVerified: userData.role === 'OWNER' ? false : true,
      verificationStatus: userData.role === 'OWNER' ? 'PENDING' : 'VERIFIED',
      propertyName: userData.propertyName || "",
      address: userData.address || "",
      verificationDoc: userData.verificationDoc || "electricity_bill_deed.pdf"
    };

    // If a new PG Owner registers, auto-queue their PG listing for Admin verification
    if (newUser.role === 'OWNER' && newUser.propertyName) {
      const ownerPg = {
        id: Date.now(),
        name: newUser.propertyName,
        tagline: "Student Living in " + (newUser.address || "Prime Location"),
        city: newUser.city || "Pune",
        locality: newUser.address ? newUser.address.split(',')[0] : "Central",
        address: newUser.address || "Main Street, Student Area",
        pincode: "411038",
        nearbyColleges: "Top City Engineering & Management Campuses (1.2 km)",
        genderType: "COED",
        monthlyRent: 8500,
        securityDeposit: 17000,
        foodIncluded: true,
        foodType: "Veg & Non-Veg",
        hasAc: true,
        hasWifi: true,
        hasLaundry: true,
        hasAttachedBath: true,
        hasCctv: true,
        hasPowerBackup: true,
        hasGym: false,
        description: `Newly listed property by host ${newUser.fullName}. Furnished rooms, high-speed Wi-Fi, and verified security.`,
        houseRules: "Gate closing at 10:30 PM. Clean study hours.",
        noticePeriodDays: 30,
        gateClosingTime: "10:30 PM",
        totalRooms: 12,
        availableRooms: 6,
        isVerified: false,
        verificationStatus: "PENDING",
        verificationDossier: {
          propertyDocType: "Uploaded Electricity Meter Bill & Ownership Proof",
          propertyDocNumber: "EB-" + Math.floor(100000 + Math.random() * 900000),
          ownerGovtIdType: "Uploaded Aadhaar / Govt ID Proof",
          ownerGovtIdNumber: "XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000),
          uploadedDocumentFile: newUser.verificationDoc,
          fireSafetyCertified: true,
          policeVerificationStatus: "Pending Admin Audit",
          submittedAt: new Date().toISOString().split('T')[0],
          adminNotes: "Newly submitted host registration. Review uploaded documents to grant Verified Badge."
        },
        messMenu: {
          breakfast: "Poha, Aloo Paratha, Milk / Tea",
          lunch: "Dal, Paneer / Veg, Steamed Rice, Phulkas",
          dinner: "Dal Tadka, Rice, Tawa Roti, Dessert",
          dietOption: "Veg & Non-Veg"
        },
        commuteTimes: {
          walk: "8 mins",
          cycle: "3 mins",
          bus: "5 mins"
        },
        rating: 4.8,
        totalReviews: 1,
        coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        images: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        ownerId: newUser.id,
        ownerName: newUser.fullName,
        ownerPhone: newUser.phone,
        ownerEmail: newUser.email
      };

      mockPgs.unshift(ownerPg);
      savePgsToStorage();
    }

    const registeredUsers = JSON.parse(localStorage.getItem('homesetu_registered_users') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('homesetu_registered_users', JSON.stringify(registeredUsers));

    return { success: true, user: newUser };
  },

  // PG Listings
  getPgs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.city && filters.city !== "All") params.append('city', filters.city);
      if (filters.locality && filters.locality !== "All") params.append('locality', filters.locality);
      if (filters.query) params.append('query', filters.query);
      if (filters.maxRent) params.append('maxRent', filters.maxRent);
      if (filters.genderType && filters.genderType !== "All") params.append('genderType', filters.genderType);
      if (filters.hasAc) params.append('hasAc', true);
      if (filters.hasWifi) params.append('hasWifi', true);
      if (filters.foodIncluded) params.append('foodIncluded', true);
      if (filters.isVerified) params.append('isVerified', true);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`${API_BASE}/pgs?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable for getPgs, using local mock data:", e);
    }

    // Local filter
    let list = [...mockPgs];
    if (filters.city && filters.city !== "All") {
      list = list.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.locality && filters.locality !== "All") {
      list = list.filter(p => p.locality.toLowerCase().includes(filters.locality.toLowerCase()));
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.locality.toLowerCase().includes(q) || 
        p.city.toLowerCase().includes(q) ||
        (p.nearbyColleges && p.nearbyColleges.toLowerCase().includes(q))
      );
    }
    if (filters.maxRent) {
      list = list.filter(p => p.monthlyRent <= filters.maxRent);
    }
    if (filters.genderType && filters.genderType !== "All") {
      list = list.filter(p => p.genderType === filters.genderType);
    }
    if (filters.hasAc) list = list.filter(p => p.hasAc);
    if (filters.hasWifi) list = list.filter(p => p.hasWifi);
    if (filters.foodIncluded) list = list.filter(p => p.foodIncluded);
    if (filters.isVerified) list = list.filter(p => p.isVerified);

    if (filters.sortBy === 'price_asc') {
      list.sort((a, b) => a.monthlyRent - b.monthlyRent);
    } else if (filters.sortBy === 'price_desc') {
      list.sort((a, b) => b.monthlyRent - a.monthlyRent);
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  },

  getPgById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pgs/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getPgById:", e);
    }
    return mockPgs.find(p => p.id === Number(id)) || mockPgs[0];
  },

  createPg: async (pgData) => {
    try {
      const res = await fetch(`${API_BASE}/pgs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pgData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for createPg:", e);
    }

    const newPg = {
      id: Date.now(),
      ...pgData,
      rating: 4.5,
      totalReviews: 1,
      isVerified: false, // Newly submitted PGs require Admin Verification
      verificationStatus: 'PENDING',
      verificationDossier: {
        propertyDocType: "Uploaded Electricity Bill / Ownership Proof",
        propertyDocNumber: "EB-" + Math.floor(100000 + Math.random() * 900000),
        ownerGovtIdType: "Aadhaar Card",
        ownerGovtIdNumber: "XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000),
        fireSafetyCertified: true,
        policeVerificationStatus: "Pending Police Clearance",
        submittedAt: new Date().toISOString().split('T')[0],
        adminNotes: "New PG registration awaiting Trust & Safety audit."
      },
      messMenu: {
        breakfast: "Poha, Paratha, Tea/Milk",
        lunch: "Dal, Rice, Roti, Seasonal Sabzi",
        dinner: "Dal Tadka, Rice, Phulkas, Sweet",
        dietOption: pgData.foodType || "Veg & Non-Veg"
      },
      commuteTimes: {
        walk: "10 mins to nearest campus",
        cycle: "4 mins",
        bus: "7 mins"
      }
    };

    mockPgs.unshift(newPg);
    savePgsToStorage();
    return newPg;
  },

  // Owner submits PG Verification details
  submitPgVerification: async (pgId, dossier) => {
    const pg = mockPgs.find(p => p.id === Number(pgId));
    if (pg) {
      pg.verificationStatus = 'PENDING';
      pg.verificationDossier = {
        ...pg.verificationDossier,
        ...dossier,
        submittedAt: new Date().toISOString().split('T')[0],
        adminNotes: "Verification submitted by owner; queued for Admin review."
      };
      savePgsToStorage();
    }
    return { success: true, pg };
  },

  // Admin approves or rejects PG verification
  verifyPgByAdmin: async (pgId, isApproved, adminNotes = '') => {
    const pg = mockPgs.find(p => p.id === Number(pgId));
    if (pg) {
      pg.isVerified = isApproved;
      pg.verificationStatus = isApproved ? 'VERIFIED' : 'REJECTED';
      if (!pg.verificationDossier) pg.verificationDossier = {};
      pg.verificationDossier.verifiedAt = new Date().toISOString().split('T')[0];
      pg.verificationDossier.verifiedBy = "HomeSetu Trust & Safety Admin";
      pg.verificationDossier.adminNotes = adminNotes || (isApproved ? "Approved by Admin after reviewing documents." : "Verification rejected; re-upload needed.");
      savePgsToStorage();
    }
    return { success: true, pg };
  },

  // Admin toggles verification badge
  toggleVerifyPg: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/pg/${id}/toggle-verify`, { method: 'PUT' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for toggleVerify:", e);
    }

    const pg = mockPgs.find(p => p.id === Number(id));
    if (pg) {
      pg.isVerified = !pg.isVerified;
      pg.verificationStatus = pg.isVerified ? 'VERIFIED' : 'PENDING';
      savePgsToStorage();
    }
    return pg;
  },

  // Room Options
  getRoomsForPg: async (pgId) => {
    try {
      const res = await fetch(`${API_BASE}/rooms/pg/${pgId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getRoomsForPg:", e);
    }

    if (mockRooms[pgId]) return mockRooms[pgId];
    return [
      { id: pgId * 100 + 1, roomType: "Single Sharing", pricePerMonth: 12000, totalBeds: 4, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
      { id: pgId * 100 + 2, roomType: "Double Sharing", pricePerMonth: 8000, totalBeds: 8, availableBeds: 4, hasBalcony: true, hasAttachedWashroom: true },
      { id: pgId * 100 + 3, roomType: "Triple Sharing", pricePerMonth: 6500, totalBeds: 6, availableBeds: 2, hasBalcony: false, hasAttachedWashroom: true },
    ];
  },

  addRoomToPg: async (pgId, roomData) => {
    const newRoom = {
      id: Date.now(),
      ...roomData,
      totalBeds: Number(roomData.totalBeds || 4),
      availableBeds: Number(roomData.availableBeds || 2),
      pricePerMonth: Number(roomData.pricePerMonth || 8000)
    };
    if (!mockRooms[pgId]) mockRooms[pgId] = [];
    mockRooms[pgId].push(newRoom);
    return newRoom;
  },

  // Bookings
  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for createBooking:", e);
    }

    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'PENDING',
      confirmationId: null,
      createdAt: new Date().toISOString()
    };
    mockBookings.unshift(newBooking);
    saveBookingsToStorage();
    return newBooking;
  },

  getStudentBookings: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/student/${studentId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getStudentBookings:", e);
    }
    return mockBookings.filter(b => b.studentId === Number(studentId));
  },

  getOwnerBookings: async (ownerId) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/owner/${ownerId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getOwnerBookings:", e);
    }
    // Return all bookings or matching owner
    return mockBookings;
  },

  processOwnerAction: async (bookingId, action, notes) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for processOwnerAction:", e);
    }

    const booking = mockBookings.find(b => b.id === Number(bookingId));
    if (booking) {
      booking.status = action;
      booking.ownerNotes = notes;
      booking.actionDate = new Date().toISOString();
      if (action === 'ACCEPTED') {
        const randId = Math.floor(1000 + Math.random() * 9000);
        booking.confirmationId = `HS-2026-${randId}`;
      }
      saveBookingsToStorage();
    }
    return booking;
  },

  // Visit Scheduling Feature
  scheduleVisit: async (visitData) => {
    const newVisit = {
      id: Date.now(),
      ...visitData,
      status: 'CONFIRMED',
      passCode: 'VISIT-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };
    mockVisits.unshift(newVisit);
    saveVisitsToStorage();
    return newVisit;
  },

  getVisits: async () => {
    return mockVisits;
  },

  // Reviews
  getReviewsForPg: async (pgId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/pg/${pgId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getReviewsForPg:", e);
    }
    return mockReviews[pgId] || [
      {
        id: 101,
        studentName: "Ananya Iyer",
        studentCollege: "Student",
        rating: 5,
        comment: "Great location and very responsive management. Highly recommended for first-year students!",
        createdAt: "2026-10-09"
      }
    ];
  },

  addReview: async (reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for addReview:", e);
    }

    const pgId = reviewData.pgListingId;
    if (!mockReviews[pgId]) mockReviews[pgId] = [];
    const newRev = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockReviews[pgId].unshift(newRev);
    return newRev;
  },

  // Admin Stats
  getAdminStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getAdminStats:", e);
    }

    const registeredUsers = JSON.parse(localStorage.getItem('homesetu_registered_users') || '[]');
    const totalStudents = 12 + registeredUsers.filter(u => u.role === 'STUDENT').length;
    const totalOwners = 4 + registeredUsers.filter(u => u.role === 'OWNER').length;
    const verifiedListings = mockPgs.filter(p => p.isVerified).length;

    return {
      totalUsers: totalStudents + totalOwners + 1,
      totalStudents,
      totalOwners,
      totalListings: mockPgs.length,
      verifiedListings,
      pendingVerifications: mockPgs.filter(p => !p.isVerified).length,
      totalBookings: mockBookings.length,
      totalVisits: mockVisits.length
    };
  }
};
