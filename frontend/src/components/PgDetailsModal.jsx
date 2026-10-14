import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, MapPin, IndianRupee, Bed, Wind, Wifi, Utensils, CheckCircle2, Phone, Mail, Clock, Send, Shield, MessageSquare, AlertCircle, Calendar, Eye, Navigation, Check } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import BookingRequestModal from './BookingRequestModal';
import ScheduleVisitModal from './ScheduleVisitModal';

export default function PgDetailsModal({ pg, onClose }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'mess' | 'commute' | 'verification'
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [activeImage, setActiveImage] = useState(pg.coverImage);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const galleryImages = pg.images ? pg.images.split(',') : [pg.coverImage];

  useEffect(() => {
    loadDetails();
  }, [pg]);

  const loadDetails = async () => {
    const roomList = await api.getRoomsForPg(pg.id);
    const reviewList = await api.getReviewsForPg(pg.id);
    setRooms(roomList);
    setReviews(reviewList);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    setSubmittingReview(true);
    await api.addReview({
      pgListingId: pg.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentCollege: currentUser.college || "Student",
      rating: newRating,
      comment: newComment,
      cleanlinessScore: 5,
      foodScore: 5,
      amenitiesScore: 5
    });
    setNewComment('');
    setSubmittingReview(false);
    loadDetails();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="p-4 sm:p-5 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate max-w-md">{pg.name}</h3>
            {pg.isVerified ? (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1 border border-teal-500/40">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Stay
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/40">
                <Clock className="w-3.5 h-3.5" /> In Review
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-teal-800/60 bg-[#092227] text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-teal-300/70 hover:text-teal-200'
            }`}
          >
            Overview & Rooms
          </button>
          <button
            onClick={() => setActiveTab('mess')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'mess'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-teal-300/70 hover:text-teal-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Mess & Meal Menu
          </button>
          <button
            onClick={() => setActiveTab('commute')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'commute'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-teal-300/70 hover:text-teal-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            College Commute
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'verification'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-teal-300/70 hover:text-teal-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Trust & Verification Details
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
          {/* Quick Price & Action Bar (Always Visible) */}
          <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-teal-300/80 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{pg.address || `${pg.locality}, ${pg.city}`}</span>
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-teal-200">
                <span className="font-semibold text-white">Occupancy: {pg.genderType} PG</span>
                <span>•</span>
                <span>Gate Close: <strong className="text-amber-300">{pg.gateClosingTime || "10:30 PM"}</strong></span>
                <span>•</span>
                <span>Notice: <strong>{pg.noticePeriodDays || 30} days</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-teal-300/70">Starting From</div>
                <div className="text-2xl font-black text-amber-400">
                  ₹{pg.monthlyRent?.toLocaleString('en-IN')}<span className="text-xs text-teal-300/70 font-normal">/mo</span>
                </div>
                <div className="text-[10px] text-teal-400/60">Deposit: ₹{pg.securityDeposit?.toLocaleString('en-IN') || "15,000"}</div>
              </div>

              {/* Schedule Visit Button */}
              <button
                onClick={() => setShowVisitModal(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-700/80 font-bold text-xs transition-all flex items-center gap-1.5"
                title="Schedule in-person or video visit with owner"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule Visit</span>
              </button>

              {/* Booking Request Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
              >
                Request to Book
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & ROOMS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo Gallery Viewer */}
              <div className="space-y-3">
                <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={activeImage}
                    alt={pg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{pg.rating} ({pg.totalReviews} Reviews)</span>
                  </div>
                </div>

                {/* Thumbnail selector */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img.trim())}
                      className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === img.trim() ? 'border-amber-400 scale-105' : 'border-teal-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.trim()} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Configurations Table */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Bed className="w-4 h-4 text-amber-400" />
                  Room Sharing & Live Availability
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rooms.map(room => (
                    <div key={room.id} className="p-4 rounded-xl bg-[#092227] border border-teal-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{room.roomType}</span>
                        <span className="text-xs font-bold text-amber-400">₹{room.pricePerMonth?.toLocaleString('en-IN')}/mo</span>
                      </div>
                      <div className="text-xs text-teal-300/70">
                        {room.availableBeds > 0 ? (
                          <span className="text-emerald-400 font-semibold">{room.availableBeds} beds available</span>
                        ) : (
                          <span className="text-red-400">Fully Occupied</span>
                        )}
                      </div>
                      <div className="text-[11px] text-teal-400/80 flex flex-wrap gap-2 pt-1 border-t border-teal-900/60">
                        {room.hasAttachedWashroom && <span>• Attached Bath</span>}
                        {room.hasBalcony && <span>• Balcony</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Amenities */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white">About the Accommodation</h4>
                <p className="text-xs sm:text-sm text-teal-200/90 leading-relaxed bg-[#092227] p-4 rounded-xl border border-teal-800/80">
                  {pg.description}
                </p>
              </div>

              {/* Key Features Grid */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white">Included Facilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-teal-200">
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>300 Mbps Wi-Fi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{pg.foodIncluded ? "3 Homely Meals / Day" : "Modular Kitchen Access"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>24/7 CCTV & Security</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Attached Washrooms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Full Power Backup</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#092227] border border-teal-800/80 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Daily Housekeeping</span>
                  </div>
                </div>
              </div>

              {/* Direct PG Owner Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d383f] to-[#09252a] border border-teal-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold flex items-center justify-center text-lg">
                    {pg.ownerName?.charAt(0) || "O"}
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-300 uppercase tracking-wider font-semibold">Direct Owner</span>
                    <h5 className="font-bold text-white text-base">{pg.ownerName || "Ramesh Sharma"}</h5>
                    <p className="text-xs text-teal-300/70">Verified Property Owner • No Middleman Fees</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-[#082227] border border-teal-800 text-teal-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    {pg.ownerPhone || "+91 91234 56789"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MESS & FOOD MENU */}
          {activeTab === 'mess' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#092227] border border-teal-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    Weekly Student Mess & Meal Schedule
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                    {pg.messMenu?.dietOption || "Veg & Non-Veg"}
                  </span>
                </div>
                <p className="text-xs text-teal-300/80">
                  Hygienic, nutritious student meals prepared fresh with RO drinking water and sanitized kitchen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Breakfast */}
                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 space-y-2">
                  <span className="text-xs font-bold uppercase text-amber-400">Breakfast (7:30 - 10:00 AM)</span>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    {pg.messMenu?.breakfast || "Poha, Aloo Paratha, Upma, Fresh Milk & Tea"}
                  </p>
                </div>

                {/* Lunch */}
                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 space-y-2">
                  <span className="text-xs font-bold uppercase text-teal-300">Lunch (12:30 - 2:30 PM)</span>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    {pg.messMenu?.lunch || "Dal Tadka, Rice, 4 Phulkas, Seasonal Sabzi, Curd / Salad"}
                  </p>
                </div>

                {/* Dinner */}
                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 space-y-2">
                  <span className="text-xs font-bold uppercase text-emerald-400">Dinner (8:00 - 10:00 PM)</span>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    {pg.messMenu?.dinner || "Paneer / Egg Curry, Jeera Rice, Tawa Roti, Dessert"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUTE & DISTANCE */}
          {activeTab === 'commute' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#092227] border border-teal-800 space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  College Distance & Commute Analysis
                </h4>
                <p className="text-xs text-teal-300/80">
                  Nearby institutes: <strong>{pg.nearbyColleges}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 text-center space-y-1">
                  <span className="text-2xl font-black text-amber-400">🚶</span>
                  <div className="text-sm font-bold text-white mt-1">Walking</div>
                  <div className="text-xs text-teal-300">{pg.commuteTimes?.walk || "8-12 mins"}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 text-center space-y-1">
                  <span className="text-2xl font-black text-teal-400">🚲</span>
                  <div className="text-sm font-bold text-white mt-1">Bicycle / Yulu</div>
                  <div className="text-xs text-teal-300">{pg.commuteTimes?.cycle || "3-5 mins"}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#09252c] border border-teal-800/80 text-center space-y-1">
                  <span className="text-2xl font-black text-emerald-400">🚌</span>
                  <div className="text-sm font-bold text-white mt-1">Bus / Metro</div>
                  <div className="text-xs text-teal-300">{pg.commuteTimes?.bus || "7-10 mins"}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRUST & VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#09252c] border border-teal-800 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">HomeSetu Trust & Safety Audit</h4>
                </div>
                <p className="text-xs text-teal-300/80 leading-relaxed">
                  Every verified accommodation undergoes verification of municipal property ownership, electricity meter registry, and owner ID proof before receiving the HomeSetu Trust Stamp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#092227] border border-teal-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Ownership Proof Type</span>
                  <div className="text-white font-medium">{pg.verificationDossier?.propertyDocType || "Property Registry & Electricity Bill"}</div>
                  <div className="text-[11px] font-mono text-amber-300">Doc ID: {pg.verificationDossier?.propertyDocNumber || "EB-PUN-2026-8812"}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#092227] border border-teal-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Owner Identity Proof</span>
                  <div className="text-white font-medium">{pg.verificationDossier?.ownerGovtIdType || "Aadhaar Card"}</div>
                  <div className="text-[11px] font-mono text-emerald-300">Status: Verified by HomeSetu Admin</div>
                </div>

                <div className="p-4 rounded-xl bg-[#092227] border border-teal-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Fire & Safety Norms</span>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Certified Fire Extinguisher & Emergency Exits
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#092227] border border-teal-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Admin Audit Notes</span>
                  <div className="text-teal-200 italic">{pg.verificationDossier?.adminNotes || "Physical premises cross-verified."}</div>
                </div>
              </div>
            </div>
          )}

          {/* Student Reviews & Ratings */}
          <div className="space-y-4 pt-4 border-t border-teal-800/60">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Student Reviews ({reviews.length})
              </h4>
            </div>

            {/* Existing reviews */}
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#092227] border border-teal-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white">{rev.studentName}</span>
                      <span className="text-[11px] text-teal-400/60 ml-2">({rev.studentCollege || "Student"})</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating} / 5
                    </div>
                  </div>
                  <p className="text-xs text-teal-200/80">"{rev.comment}"</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            {currentUser && currentUser.role === 'STUDENT' && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#0c3139] border border-teal-700/60 space-y-3">
                <h5 className="text-xs font-bold uppercase text-teal-300">Write a Student Review</h5>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-teal-200">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share feedback on cleanliness, food quality, Wi-Fi speed..."
                    className="flex-1 bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Booking Request Modal */}
      {showBookingModal && (
        <BookingRequestModal
          pg={pg}
          rooms={rooms}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            onClose();
          }}
        />
      )}

      {/* Schedule Visit Modal */}
      {showVisitModal && (
        <ScheduleVisitModal
          pg={pg}
          onClose={() => setShowVisitModal(false)}
        />
      )}
    </div>
  );
}
