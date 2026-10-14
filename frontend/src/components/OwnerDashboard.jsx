import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Building, Plus, CheckCircle2, XCircle, Clock, Users, Bed, MapPin, IndianRupee, ShieldCheck, Check, X, FileText, AlertTriangle, Shield, UploadCloud } from 'lucide-react';

export default function OwnerDashboard() {
  const { currentUser, switchUserRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [selectedPgForRoom, setSelectedPgForRoom] = useState(null);
  const [actionModalBooking, setActionModalBooking] = useState(null);
  const [ownerNote, setOwnerNote] = useState('');
  const [loading, setLoading] = useState(false);

  // New listing form state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    city: 'Pune',
    locality: '',
    address: '',
    nearbyColleges: '',
    genderType: 'BOYS',
    monthlyRent: 8000,
    securityDeposit: 16000,
    foodIncluded: true,
    foodType: 'Veg & Non-Veg',
    hasAc: true,
    hasWifi: true,
    hasLaundry: true,
    hasAttachedBath: true,
    hasCctv: true,
    hasPowerBackup: true,
    hasGym: false,
    gateClosingTime: '10:30 PM',
    totalRooms: 10,
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    description: '',
    houseRules: 'Gate closes strictly on time. Quiet hours after 10:30 PM.'
  });

  // Verification submission state
  const [verificationDossier, setVerificationDossier] = useState({
    propertyDocType: 'Electricity Meter & Property Deed',
    propertyDocNumber: 'EB-PUN-2026-8812',
    ownerGovtIdType: 'Aadhaar Card',
    ownerGovtIdNumber: 'XXXX-XXXX-9124',
    fireSafetyCertified: true,
    policeVerificationStatus: 'Clear & Verified',
    additionalNotes: 'All safety guidelines and municipal certifications in place.'
  });

  // Add Room form state
  const [roomFormData, setRoomFormData] = useState({
    roomType: 'Single Sharing',
    pricePerMonth: 11000,
    totalBeds: 4,
    availableBeds: 2,
    hasBalcony: true,
    hasAttachedWashroom: true
  });

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    const reqs = await api.getOwnerBookings(currentUser.id);
    const pgs = await api.getPgs();
    const myListings = pgs.filter(p => p.ownerId === currentUser.id || p.ownerEmail === currentUser.email);
    setRequests(reqs);
    setListings(myListings.length > 0 ? myListings : pgs.slice(0, 3));
  };

  const handleAction = async (bookingId, action) => {
    setLoading(true);
    await api.processOwnerAction(bookingId, action, ownerNote);
    setActionModalBooking(null);
    setOwnerNote('');
    setLoading(false);
    loadData();
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.createPg({
      ...formData,
      ownerId: currentUser.id,
      ownerName: currentUser.fullName,
      ownerPhone: currentUser.phone || "+91 91234 56789",
      ownerEmail: currentUser.email
    });
    setLoading(false);
    setShowAddModal(false);
    loadData();
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (listings.length > 0) {
      await api.submitPgVerification(listings[0].id, verificationDossier);
    }
    setLoading(false);
    setShowVerificationModal(false);
    loadData();
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!selectedPgForRoom) return;
    setLoading(true);
    await api.addRoomToPg(selectedPgForRoom.id, roomFormData);
    setLoading(false);
    setShowAddRoomModal(false);
    alert(`New ${roomFormData.roomType} room added successfully to ${selectedPgForRoom.name}!`);
  };

  // If not owner, show role management notification
  if (currentUser && currentUser.role !== 'OWNER' && currentUser.role !== 'ADMIN') {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-5 text-white">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/40">
          <Building className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold">PG Owner Dashboard — Restricted Access</h3>
        <p className="text-sm text-teal-300/80 leading-relaxed">
          Proper management governance is active. You are currently logged in as a <strong>Student ({currentUser.fullName})</strong>. Only registered PG Owners and Admins can manage properties, room inventories, and booking approvals.
        </p>
        <button
          onClick={() => switchUserRole('owner')}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs shadow-lg transition-colors"
        >
          Switch to PG Owner Persona
        </button>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED').length;
  const isOwnerVerified = listings.some(l => l.isVerified);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-white">
      {/* Top Banner */}
      <div className="bg-[#0b2b32] border border-[#16515c] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">{currentUser?.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-900/80 text-orange-300 text-xs font-semibold border border-orange-700/60">
                Registered PG Owner
              </span>
              {isOwnerVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Host
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
              🏢 Centralized Listing & Booking Management • 0% Brokerage
            </p>
            <p className="text-xs text-teal-400/60 mt-0.5">
              📞 {currentUser?.phone || "+91 91234 56789"} • 📧 {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVerificationModal(true)}
            className="px-4 py-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-700 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verification Dossier</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New PG Listing</span>
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isOwnerVerified
          ? 'bg-[#092b2c] border-emerald-700/60'
          : 'bg-[#2b2410] border-amber-700/60'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isOwnerVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {isOwnerVerified ? "HomeSetu Trust & Verification Status: Approved" : "PG Verification Pending Admin Review"}
              </h4>
              <p className="text-xs text-teal-200/80">
                {isOwnerVerified
                  ? "Your PG property documents (Electricity Meter, Aadhaar, Fire Safety) are verified by Admin."
                  : "Submit your PG related details and ownership documents for official HomeSetu verification."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowVerificationModal(true)}
            className="px-4 py-2 bg-[#0c3139] hover:bg-[#113f49] border border-teal-700/80 rounded-xl text-xs font-semibold text-teal-200 shrink-0"
          >
            View Submitted Documents
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-teal-300/80 uppercase font-semibold">Total Properties</span>
          <div className="text-3xl font-black text-white mt-1">{listings.length}</div>
          <span className="text-[11px] text-teal-400/60">Active on HomeSetu</span>
        </div>

        <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-amber-300 uppercase font-semibold">Pending Requests</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{pendingCount}</div>
          <span className="text-[11px] text-teal-400/60">Awaiting your approval</span>
        </div>

        <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-emerald-300 uppercase font-semibold">Confirmed Bookings</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{acceptedCount}</div>
          <span className="text-[11px] text-teal-400/60">Confirmation IDs issued</span>
        </div>

        <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-teal-300/80 uppercase font-semibold">Brokerage Paid</span>
          <div className="text-3xl font-black text-white mt-1">₹0</div>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Direct Student Reach</span>
        </div>
      </div>

      {/* Incoming Student Booking Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Student Booking Inquiries</h3>
            <p className="text-xs text-teal-300/70">
              Review student college, phone number, and move-in timeline before issuing Confirmation ID
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {requests.length} Total Requests
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-10 text-center text-teal-300">
            No booking requests received yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="bg-[#0c3139] border border-[#17525e] hover:border-teal-500/60 rounded-2xl p-5 sm:p-6 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Applicant info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{req.studentName}</h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50">
                      🎓 {req.studentCollege || "Student"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200/90">
                    <span>Applied for: <strong>{req.pgName}</strong> ({req.roomType})</span>
                    <span>Move-in: <strong>{req.moveInDate}</strong></span>
                    <span>Duration: <strong>{req.durationMonths} months</strong></span>
                    <span className="text-amber-400 font-bold">₹{req.monthlyRent?.toLocaleString('en-IN')}/mo</span>
                  </div>

                  <p className="text-xs text-teal-300/70">
                    📞 Contact: <strong>{req.studentPhone}</strong> • 📧 {req.studentEmail}
                  </p>

                  {req.message && (
                    <p className="text-xs text-teal-200/80 italic p-2 rounded bg-[#092227] border border-teal-800/60">
                      "{req.message}"
                    </p>
                  )}
                </div>

                {/* Status & Accept/Reject actions */}
                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  {req.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setActionModalBooking(req); setOwnerNote('Looking forward to welcoming you! Please carry college ID.'); }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <Check className="w-4 h-4" />
                        Accept & Generate ID
                      </button>

                      <button
                        onClick={() => { setActionModalBooking(req); setOwnerNote('Sorry, this room was just filled by another student.'); }}
                        className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  ) : req.status === 'ACCEPTED' ? (
                    <div className="text-right space-y-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                      </span>
                      <div className="text-xs font-mono font-bold text-amber-400">
                        Confirmation ID: {req.confirmationId}
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/40">
                      <XCircle className="w-3.5 h-3.5" /> Declined
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Published PG Properties */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">My Properties & Room Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map(pg => (
            <div key={pg.id} className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              <img src={pg.coverImage} alt={pg.name} className="w-full sm:w-32 h-32 object-cover rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{pg.name}</h4>
                  {pg.isVerified ? (
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-teal-500/40">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-500/40">
                      <Clock className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>

                <p className="text-xs text-teal-300/80">
                  📍 {pg.locality}, {pg.city} • Rent from <strong>₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo</strong>
                </p>

                <div className="text-xs text-teal-200/80 flex items-center gap-3">
                  <span>Total Rooms: <strong>{pg.totalRooms || 12}</strong></span>
                  <span>Available: <strong>{pg.availableRooms || 4} beds</strong></span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedPgForRoom(pg); setShowAddRoomModal(true); }}
                    className="px-3 py-1.5 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Room Option</span>
                  </button>
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#082227] hover:bg-[#0a2b32] text-teal-300 text-xs font-semibold border border-teal-800"
                  >
                    Verify Docs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Action confirmation with student */}
      {actionModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-2xl max-w-md w-full p-6 text-white space-y-4">
            <h4 className="text-lg font-bold">Process Student Application</h4>
            <p className="text-xs text-teal-200">
              Student: <strong>{actionModalBooking.studentName}</strong> ({actionModalBooking.studentCollege})
            </p>
            <p className="text-xs text-teal-200">
              Applying for: <strong>{actionModalBooking.pgName}</strong> ({actionModalBooking.roomType})
            </p>

            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">
                Owner Note / Check-in Guidelines:
              </label>
              <textarea
                rows="3"
                value={ownerNote}
                onChange={(e) => setOwnerNote(e.target.value)}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl p-3 text-xs text-white"
                placeholder="e.g. Please bring college ID photocopy during move-in."
              />
            </div>

            <div className="flex gap-2">
              <button
                disabled={loading}
                onClick={() => handleAction(actionModalBooking.id, 'ACCEPTED')}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl"
              >
                Accept & Generate Confirmation ID
              </button>
              <button
                disabled={loading}
                onClick={() => handleAction(actionModalBooking.id, 'DECLINED')}
                className="py-2 px-4 bg-red-800 hover:bg-red-700 font-bold text-xs rounded-xl"
              >
                Decline
              </button>
              <button
                onClick={() => setActionModalBooking(null)}
                className="py-2 px-3 bg-teal-900 font-bold text-xs rounded-xl text-teal-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PG Verification & Ownership Documents Submission */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-lg w-full text-white shadow-2xl p-6 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-teal-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-bold">PG Property Verification Dossier</h4>
              </div>
              <button onClick={() => setShowVerificationModal(false)} className="p-1.5 rounded-lg bg-teal-900 text-teal-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-teal-300/80 leading-relaxed">
              To earn the <strong>HomeSetu 100% Verified Badge</strong>, owners must submit verified municipal electricity meter numbers, property registration proof, and government ID for Admin review.
            </p>

            <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Property Ownership Document Type</label>
                <select
                  value={verificationDossier.propertyDocType}
                  onChange={(e) => setVerificationDossier({ ...verificationDossier, propertyDocType: e.target.value })}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Electricity Meter & Property Deed">Electricity Meter & Property Deed</option>
                  <option value="Municipal Tax Receipt / Khata">Municipal Tax Receipt / Khata</option>
                  <option value="Commercial Rental Deed with Society NOC">Commercial Rental Deed with Society NOC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Electricity Meter / Registration ID Number</label>
                <input
                  type="text"
                  required
                  value={verificationDossier.propertyDocNumber}
                  onChange={(e) => setVerificationDossier({ ...verificationDossier, propertyDocNumber: e.target.value })}
                  placeholder="e.g. EB-PUN-2026-9912"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Owner Govt ID Type</label>
                  <select
                    value={verificationDossier.ownerGovtIdType}
                    onChange={(e) => setVerificationDossier({ ...verificationDossier, ownerGovtIdType: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Govt ID Number</label>
                  <input
                    type="text"
                    required
                    value={verificationDossier.ownerGovtIdNumber}
                    onChange={(e) => setVerificationDossier({ ...verificationDossier, ownerGovtIdNumber: e.target.value })}
                    placeholder="e.g. XXXX-XXXX-9124"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#082227] border border-teal-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verificationDossier.fireSafetyCertified}
                    onChange={(e) => setVerificationDossier({ ...verificationDossier, fireSafetyCertified: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span className="text-teal-200">Fire Extinguisher & Emergency Exit compliance verified</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Additional Host Declarations</label>
                <textarea
                  rows="2"
                  value={verificationDossier.additionalNotes}
                  onChange={(e) => setVerificationDossier({ ...verificationDossier, additionalNotes: e.target.value })}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl p-2.5 text-white"
                  placeholder="e.g. CCTV installed in all corridors, 24x7 security warden available."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs"
                >
                  {loading ? 'Submitting...' : 'Submit Dossier for Admin Verification'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-teal-900 text-teal-300 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Room Option to PG */}
      {showAddRoomModal && selectedPgForRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full text-white shadow-2xl p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-teal-800 pb-3">
              <h4 className="text-lg font-bold">Add Room Option to {selectedPgForRoom.name}</h4>
              <button onClick={() => setShowAddRoomModal(false)} className="p-1.5 rounded-lg bg-teal-900 text-teal-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Sharing Type</label>
                <select
                  value={roomFormData.roomType}
                  onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value })}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Single Sharing">Single Sharing (Private Room)</option>
                  <option value="Double Sharing">Double Sharing (2 Beds)</option>
                  <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
                  <option value="Four Sharing">Four Sharing (Budget 4 Beds)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={roomFormData.pricePerMonth}
                    onChange={(e) => setRoomFormData({ ...roomFormData, pricePerMonth: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Available Beds</label>
                  <input
                    type="number"
                    required
                    value={roomFormData.availableBeds}
                    onChange={(e) => setRoomFormData({ ...roomFormData, availableBeds: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomFormData.hasAttachedWashroom}
                    onChange={(e) => setRoomFormData({ ...roomFormData, hasAttachedWashroom: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Attached Washroom</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomFormData.hasBalcony}
                    onChange={(e) => setRoomFormData({ ...roomFormData, hasBalcony: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Balcony View</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Room Option
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-teal-900 text-teal-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Publish New PG Listing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Publish New PG Property</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-teal-900 text-teal-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">PG Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Emerald Student Residency"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Luxury Living near COEP"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Kota">Kota</option>
                  </select>
                </div>
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Kothrud / Baner"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot number, Street name, Landmark"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Starting Rent / Month (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-teal-300 font-semibold mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Nearby Colleges & Commute</label>
                <input
                  type="text"
                  value={formData.nearbyColleges}
                  onChange={(e) => setFormData({ ...formData, nearbyColleges: e.target.value })}
                  placeholder="e.g. MIT-WPU (1 km), COEP (4 km)"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.foodIncluded}
                    onChange={(e) => setFormData({ ...formData, foodIncluded: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Food Included</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAc}
                    onChange={(e) => setFormData({ ...formData, hasAc: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>AC Rooms</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasWifi}
                    onChange={(e) => setFormData({ ...formData, hasWifi: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Wi-Fi</span>
                </label>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the rooms, food, environment..."
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl p-3 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-slate-950 text-xs"
              >
                {loading ? 'Submitting to Admin Queue...' : 'Submit PG Listing (Sent to Admin for Verification)'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
