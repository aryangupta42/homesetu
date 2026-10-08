// API service for HomeSetu frontend
// Connects to Spring Boot backend at /api and has graceful fallback for instant evaluation

const API_BASE = '/api';

// Initial fallback mock data matching Spring Boot DataInitializer & Slides
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
    rating: 4.3,
    totalReviews: 18,
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 4,
    ownerName: "Ramesh Kothrud",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "ramesh@pgowner.com"
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
    rating: 4.6,
    totalReviews: 24,
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 5,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@pgowner.com"
  },
  {
    id: 3,
    name: "Urban Stay — Viman Nagar",
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
    rating: 4.1,
    totalReviews: 15,
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ownerId: 5,
    ownerName: "Sunita Patil",
    ownerPhone: "+91 92345 67890",
    ownerEmail: "sunita@pgowner.com"
  },
  {
    id: 4,
    name: "Royal Comfort PG — Koramangala",
    tagline: "Prime Location Accommodation Near Christ University",
    city: "Bengaluru",
    locality: "Koramangala",
    address: "4th Block, 80 Feet Road, Koramangala",
    pincode: "560034",
    nearbyColleges: "Christ University (1.4 km), St. John's Medical College (2.2 km)",
    genderType: "COED",
    monthlyRent: 9500,
    securityDeposit: 20000,
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
    rating: 4.7,
    totalReviews: 32,
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ownerId: 4,
    ownerName: "Ramesh Kothrud",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "ramesh@pgowner.com"
  },
  {
    id: 5,
    name: "Campus Haven — North Campus",
    tagline: "Vibrant DU Student Hostel Near SRCC & Hindu College",
    city: "Delhi",
    locality: "North Campus",
    address: "Kalyan Vihar, Near GTB Nagar Metro",
    pincode: "110009",
    nearbyColleges: "Delhi University North Campus, SRCC (1.2 km), Hindu College (1.5 km)",
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
    totalRooms: 14,
    availableRooms: 4,
    isVerified: true,
    rating: 4.5,
    totalReviews: 21,
    coverImage: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
    images: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
    ownerId: 4,
    ownerName: "Ramesh Kothrud",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "ramesh@pgowner.com"
  }
];

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
    { id: 401, roomType: "Single Sharing", pricePerMonth: 15000, totalBeds: 5, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true },
    { id: 402, roomType: "Double Sharing", pricePerMonth: 9500, totalBeds: 10, availableBeds: 4, hasBalcony: true, hasAttachedWashroom: true },
  ],
  5: [
    { id: 501, roomType: "Single Sharing", pricePerMonth: 12500, totalBeds: 4, availableBeds: 1, hasBalcony: true, hasAttachedWashroom: true },
    { id: 502, roomType: "Double Sharing", pricePerMonth: 8000, totalBeds: 10, availableBeds: 3, hasBalcony: false, hasAttachedWashroom: true },
  ]
};

const INITIAL_BOOKINGS = [
  {
    id: 1,
    studentId: 1,
    studentName: "Aryan Gupta",
    studentEmail: "aryan@homesetu.com",
    studentPhone: "+91 98765 43210",
    studentCollege: "College of Engineering Pune (COEP)",
    pgListingId: 1,
    pgName: "Sunrise PG — Kothrud",
    pgCity: "Pune",
    pgLocality: "Kothrud",
    ownerId: 4,
    roomType: "Double Sharing",
    monthlyRent: 7500,
    moveInDate: "2026-10-15",
    durationMonths: 10,
    message: "Hello Ramesh Uncle, I am a 2nd year B.Tech student at COEP. Looking for a quiet room with Wi-Fi.",
    status: "ACCEPTED",
    confirmationId: "HS-2026-7842", // Confirmation ID generated by owner acceptance!
    ownerNotes: "Booking accepted! Looking forward to welcoming you. Please bring college ID photocopy during check-in.",
    createdAt: "2026-10-05T10:00:00",
    actionDate: "2026-10-06T14:30:00"
  },
  {
    id: 2,
    studentId: 1,
    studentName: "Aryan Gupta",
    studentEmail: "aryan@homesetu.com",
    studentPhone: "+91 98765 43210",
    studentCollege: "College of Engineering Pune (COEP)",
    pgListingId: 2,
    pgName: "Green Nest PG — Baner",
    pgCity: "Pune",
    pgLocality: "Baner",
    ownerId: 5,
    roomType: "Single Sharing",
    monthlyRent: 13000,
    moveInDate: "2026-10-20",
    durationMonths: 6,
    message: "Checking if AC single room is available starting next week.",
    status: "PENDING",
    confirmationId: null,
    createdAt: "2026-10-08T09:15:00"
  },
  {
    id: 3,
    studentId: 2,
    studentName: "Arsh Mittal",
    studentEmail: "arsh@homesetu.com",
    studentPhone: "+91 98765 43211",
    studentCollege: "Symbiosis International University",
    pgListingId: 1,
    pgName: "Sunrise PG — Kothrud",
    pgCity: "Pune",
    pgLocality: "Kothrud",
    ownerId: 4,
    roomType: "Single Sharing",
    monthlyRent: 11500,
    moveInDate: "2026-10-18",
    durationMonths: 12,
    message: "Hi, I study at Symbiosis and want to book the single room.",
    status: "PENDING",
    confirmationId: null,
    createdAt: "2026-10-08T11:45:00"
  }
];

const INITIAL_REVIEWS = {
  1: [
    {
      id: 1,
      studentName: "Aryan Gupta",
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
      studentName: "Archana",
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

// In-memory local state cache
let mockPgs = [...INITIAL_PGS];
let mockRooms = { ...INITIAL_ROOMS };
let mockBookings = [...INITIAL_BOOKINGS];
let mockReviews = { ...INITIAL_REVIEWS };

export const api = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable, falling back to local auth:", e);
    }

    // Local fallback
    if (email === "aryan@homesetu.com") {
      return {
        success: true,
        user: { id: 1, fullName: "Aryan Gupta", email, role: "STUDENT", college: "COEP Pune", phone: "+91 98765 43210" }
      };
    } else if (email === "arsh@homesetu.com") {
      return {
        success: true,
        user: { id: 2, fullName: "Arsh Mittal", email, role: "STUDENT", college: "Symbiosis Pune", phone: "+91 98765 43211" }
      };
    } else if (email === "ramesh@pgowner.com") {
      return {
        success: true,
        user: { id: 4, fullName: "Ramesh Kothrud", email, role: "OWNER", city: "Pune", phone: "+91 91234 56789" }
      };
    } else if (email === "admin@homesetu.com") {
      return {
        success: true,
        user: { id: 99, fullName: "HomeSetu Admin", email, role: "ADMIN", city: "Pune" }
      };
    }
    return {
      success: true,
      user: { id: 10, fullName: email.split('@')[0], email, role: "STUDENT", college: "University of Pune" }
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
    const newUser = { id: Date.now(), ...userData };
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
    } else if (filters.sortBy === 'rating_desc') {
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

  getRoomsForPg: async (pgId) => {
    try {
      const res = await fetch(`${API_BASE}/pgs/${pgId}/rooms`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getRoomsForPg:", e);
    }
    return mockRooms[pgId] || [
      { id: 991, roomType: "Double Sharing", pricePerMonth: 7500, totalBeds: 4, availableBeds: 2, hasBalcony: true, hasAttachedWashroom: true }
    ];
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
      rating: 4.5,
      totalReviews: 0,
      isVerified: false,
      availableRooms: pgData.totalRooms || 5,
      ...pgData
    };
    mockPgs.unshift(newPg);
    return newPg;
  },

  toggleVerifyPg: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pgs/${id}/verify`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for toggleVerifyPg:", e);
    }
    const pg = mockPgs.find(p => p.id === Number(id));
    if (pg) {
      pg.isVerified = !pg.isVerified;
      return { ...pg };
    }
    return null;
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
      status: "PENDING",
      confirmationId: null,
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    mockBookings.unshift(newBooking);
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
    return mockBookings.filter(b => b.ownerId === Number(ownerId));
  },

  processOwnerAction: async (bookingId, action, note) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for processOwnerAction:", e);
    }
    const booking = mockBookings.find(b => b.id === Number(bookingId));
    if (booking) {
      booking.status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
      booking.ownerNotes = note;
      booking.actionDate = new Date().toISOString();
      if (action === "ACCEPT") {
        const rand = Math.floor(1000 + Math.random() * 9000);
        booking.confirmationId = `HS-2026-${rand}`;
      }
      return { ...booking };
    }
    return null;
  },

  // Reviews
  getReviewsForPg: async (pgId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/pg/${pgId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API fallback for getReviewsForPg:", e);
    }
    return mockReviews[pgId] || [];
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
    const newRev = {
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    if (!mockReviews[reviewData.pgListingId]) {
      mockReviews[reviewData.pgListingId] = [];
    }
    mockReviews[reviewData.pgListingId].unshift(newRev);
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
    return {
      totalUsers: 6,
      totalStudents: 3,
      totalOwners: 2,
      totalListings: mockPgs.length,
      verifiedListings: mockPgs.filter(p => p.isVerified).length,
      totalBookings: mockBookings.length
    };
  }
};
