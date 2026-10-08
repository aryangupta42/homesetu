import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Building, Plus, CheckCircle2, XCircle, Clock, Users, Bed, MapPin, IndianRupee, ShieldCheck, Check, X } from 'lucide-react';

export default function OwnerDashboard() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
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

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    const reqs = await api.getOwnerBookings(currentUser.id);
    const pgs = await api.getPgs();
    const myListings = pgs.filter(p => p.ownerId === currentUser.id);
    setRequests(reqs);
    setListings(myListings.length > 0 ? myListings : pgs.slice(0, 2));
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

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED').length;

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
            </div>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
              🏢 Centralized Listing & Booking Management • Direct Student Connect
            </p>
            <p className="text-xs text-teal-400/60 mt-0.5">
              📞 {currentUser?.phone || "+91 91234 56789"} • 📧 {currentUser?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New PG Listing</span>
        </button>
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
          <span className="text-[11px] text-teal-400/60">Confirmation IDs generated</span>
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
        <h3 className="text-xl font-bold text-white">My Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map(pg => (
            <div key={pg.id} className="bg-[#0c3139] border border-[#17525e] rounded-2xl p-5 flex gap-4">
              <img src={pg.coverImage} alt={pg.name} className="w-28 h-28 object-cover rounded-xl shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{pg.name}</h4>
                  {pg.isVerified && (
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-teal-300/80">{pg.locality}, {pg.city}</p>
                <div className="text-sm font-bold text-amber-400 pt-1">
                  ₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo
                </div>
                <div className="text-[11px] text-teal-300/70 pt-1">
                  Rooms: <strong>{pg.availableRooms} available</strong> / {pg.totalRooms} total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Action Modal */}
      {actionModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold">
              Review Application: {actionModalBooking.studentName}
            </h3>
            <p className="text-xs text-teal-300/80">
              Applying for {actionModalBooking.pgName} ({actionModalBooking.roomType}) starting on {actionModalBooking.moveInDate}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Response / Check-in Instructions:
              </label>
              <textarea
                rows="3"
                value={ownerNote}
                onChange={(e) => setOwnerNote(e.target.value)}
                placeholder="Add check-in guidelines, gate timing info, or documents required..."
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              Approving this request will immediately generate a unique <strong>Confirmation ID</strong> for the student and reserve the room.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-teal-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleAction(actionModalBooking.id, 'REJECT')}
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs"
              >
                Decline Application
              </button>
              <button
                disabled={loading}
                onClick={() => handleAction(actionModalBooking.id, 'ACCEPT')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Accept & Generate Confirmation ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New PG Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-6">
            <div className="p-6 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Publish New PG Accommodation</h3>
                <p className="text-xs text-teal-300/80">List your property with zero middleman commissions</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-teal-900 text-teal-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">PG Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Living PG"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Kota">Kota</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Kothrud, Baner, Viman Nagar"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Gender Occupancy</label>
                  <select
                    value={formData.genderType}
                    onChange={(e) => setFormData({ ...formData, genderType: e.target.value })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="BOYS">Boys Only</option>
                    <option value="GIRLS">Girls Only</option>
                    <option value="COED">Co-ed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Starting Rent (₹/month)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Nearby Colleges & Distances</label>
                <input
                  type="text"
                  value={formData.nearbyColleges}
                  onChange={(e) => setFormData({ ...formData, nearbyColleges: e.target.value })}
                  placeholder="e.g. MIT (1.2 km), COEP (4.5 km)"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot/Flat number, road, landmark"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              {/* Amenities Grid */}
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-2">Amenities Included</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { key: 'hasAc', label: 'Air Conditioner' },
                    { key: 'hasWifi', label: 'High-speed Wi-Fi' },
                    { key: 'foodIncluded', label: 'Daily Meals' },
                    { key: 'hasLaundry', label: 'Laundry Service' },
                    { key: 'hasAttachedBath', label: 'Attached Washroom' },
                    { key: 'hasCctv', label: 'CCTV Security' },
                    { key: 'hasPowerBackup', label: 'Power Backup' },
                    { key: 'hasGym', label: 'Gym Facility' }
                  ].map(a => (
                    <label key={a.key} className="flex items-center gap-2 p-2 rounded-lg bg-[#082227] border border-teal-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[a.key]}
                        onChange={(e) => setFormData({ ...formData, [a.key]: e.target.checked })}
                        className="accent-amber-500"
                      />
                      <span>{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-teal-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-teal-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs"
                >
                  Publish Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
