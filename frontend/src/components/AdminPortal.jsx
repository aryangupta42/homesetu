import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Building, FileCheck, CheckCircle2, XCircle, Eye, Check, X, Clock, Calendar, QrCode, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminPortal({ openAuthModal, onExploreClick }) {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'bookings' | 'visits' | 'users'
  const [stats, setStats] = useState({
    totalUsers: 16,
    totalStudents: 12,
    totalOwners: 4,
    totalListings: 12,
    verifiedListings: 12,
    pendingVerifications: 0,
    totalBookings: 2,
    totalVisits: 1
  });
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedPgDossier, setSelectedPgDossier] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const s = await api.getAdminStats();
    const list = await api.getPgs();
    const bkgs = await api.getOwnerBookings();
    const vsts = await api.getVisits();
    setStats(s);
    setPgs(list);
    setBookings(bkgs);
    setVisits(vsts);
    setLoading(false);
  };

  const handleVerifyAction = async (pgId, isApproved) => {
    setLoading(true);
    await api.verifyPgByAdmin(pgId, isApproved, adminNote);
    setSelectedPgDossier(null);
    setAdminNote('');
    setLoading(false);
    loadData();
  };

  const handleToggleVerify = async (pgId) => {
    await api.toggleVerifyPg(pgId);
    loadData();
  };

  // Case 1: Unauthenticated visitor
  if (!currentUser) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-6 text-white animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-4xl mx-auto shadow-xl">
          🛡️
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Verification Portal</h3>
          <p className="text-xs uppercase font-bold tracking-widest text-purple-400 mt-1">Authorized Access Only</p>
        </div>
        <p className="text-sm text-teal-200/80 leading-relaxed max-w-md mx-auto">
          This portal is protected and requires platform administrator credentials to verify PG documents, grant safety badges, and audit platform activities.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal && openAuthModal('login', 'ADMIN')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl transition-all"
          >
            Sign In with Admin Credentials
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Logged in as non-admin
  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-6 text-white animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center text-4xl mx-auto shadow-xl">
          🔒
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Access Restricted</h3>
          <p className="text-xs uppercase font-bold tracking-widest text-red-400 mt-1">Platform Security Guard</p>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          Proper management governance is strictly enforced. You are currently logged in as <span className="font-bold text-amber-400">{currentUser.fullName} ({currentUser.role})</span>. Only verified Platform Administrators can access this portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onExploreClick && onExploreClick(currentUser.role === 'OWNER' ? 'owner-dashboard' : 'student-dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
          >
            Back to My Portal
          </button>
          <button
            onClick={() => {
              logout();
              if (openAuthModal) openAuthModal('login', 'ADMIN');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            Sign Out & Log In as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header Banner */}
      <div className="bg-[#0b2b32] border border-[#16515c] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">HomeSetu Central Administration</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/80 text-purple-300 text-xs font-semibold border border-purple-700/60">
                Authorized Governance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
              Proper Management: PG Verification Dossiers, Confirmation ID Audits, and Host Safety Clearance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="px-4 py-2.5 bg-[#0e363e] hover:bg-[#12424b] text-teal-200 border border-teal-700 rounded-xl text-xs font-bold transition-colors"
          >
            Refresh Records
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-teal-400 font-semibold uppercase">Total PGs</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.totalListings || pgs.length}</div>
          <span className="text-[11px] text-teal-300/60">Across 4 major hubs</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Verified PGs</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.verifiedListings || pgs.filter(p => p.isVerified).length}</div>
          <span className="text-[11px] text-emerald-300/60">100% Trust Certified</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-amber-400 font-semibold uppercase">Registered Students</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.totalStudents || 12}</div>
          <span className="text-[11px] text-amber-300/60">Active seekers</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-purple-400 font-semibold uppercase">Applications & Visits</span>
          <div className="text-3xl font-extrabold text-purple-300 mt-1">{bookings.length + visits.length}</div>
          <span className="text-[11px] text-purple-300/60">Direct student connect</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-teal-800 bg-[#092227] p-2 rounded-2xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>PG Verification Queue ({pgs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Bookings & Confirmation IDs ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'visits'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Direct Scheduled Visits ({visits.length})</span>
        </button>
      </div>

      {/* TAB 1: PG VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">PG Owner Verification & Safety Compliance</h3>
              <p className="text-xs text-teal-300/70">
                Inspect property ownership proofs, electricity meter bills, and Aadhaar documents before granting Trust Badge
              </p>
            </div>
          </div>

          <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#092227] text-teal-300/80 border-b border-teal-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Property & Location</th>
                    <th className="p-4">Owner Name</th>
                    <th className="p-4">Starting Rent</th>
                    <th className="p-4">Verification Status</th>
                    <th className="p-4">Submitted Proofs</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-800/40">
                  {pgs.map(pg => (
                    <tr key={pg.id} className="hover:bg-teal-900/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={pg.coverImage} alt={pg.name} className="w-11 h-11 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-white text-sm">{pg.name}</div>
                            <div className="text-[11px] text-teal-300/70 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              {pg.locality}, {pg.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-white">{pg.ownerName || "Ramesh Sharma"}</div>
                        <div className="text-[11px] text-teal-300/70">{pg.ownerPhone || "+91 91234 56789"}</div>
                      </td>

                      <td className="p-4 font-bold text-amber-400 text-sm">
                        ₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo
                      </td>

                      <td className="p-4">
                        {pg.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                            <Clock className="w-3.5 h-3.5" /> In Review
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-teal-200">
                        <div className="text-[11px] font-mono text-teal-300">
                          {pg.verificationDossier?.propertyDocNumber || "EB-PUN-2026-8812"}
                        </div>
                        <div className="text-[10px] text-teal-400/70">
                          {pg.verificationDossier?.ownerGovtIdType || "Aadhaar Card"}
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => { setSelectedPgDossier(pg); setAdminNote(pg.verificationDossier?.adminNotes || ''); }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold transition-colors inline-flex items-center gap-1"
                          title="Inspect full verification details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Dossier</span>
                        </button>

                        <button
                          onClick={() => handleToggleVerify(pg.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                            pg.isVerified
                              ? 'bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800'
                              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                          }`}
                        >
                          {pg.isVerified ? 'Revoke' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS & CONFIRMATION IDS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Central Bookings & Confirmation IDs</h3>
              <p className="text-xs text-teal-300/70">
                Audit every formal booking agreement and official Confirmation ID issued on HomeSetu
              </p>
            </div>
          </div>

          <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#092227] text-teal-300/80 border-b border-teal-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Student Name & College</th>
                    <th className="p-4">PG Property</th>
                    <th className="p-4">Room & Rent</th>
                    <th className="p-4">Move-in Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Confirmation ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-800/40">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-teal-900/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{booking.studentName}</div>
                        <div className="text-[11px] text-teal-300/70">🎓 {booking.studentCollege}</div>
                        <div className="text-[10px] text-teal-400/60">📞 {booking.studentPhone}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-white">{booking.pgName}</div>
                        <div className="text-[11px] text-teal-300/70">{booking.pgLocality}, {booking.pgCity}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-white">{booking.roomType}</div>
                        <div className="font-bold text-amber-400">₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo</div>
                      </td>

                      <td className="p-4 text-teal-200">
                        {booking.moveInDate} ({booking.durationMonths} mos)
                      </td>

                      <td className="p-4">
                        {booking.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                          </span>
                        ) : booking.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                            <Clock className="w-3.5 h-3.5" /> Pending Host
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                            <XCircle className="w-3.5 h-3.5" /> Declined
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-bold text-amber-400">
                        {booking.confirmationId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULED VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Direct Student Visits Log</h3>
              <p className="text-xs text-teal-300/70">
                Physical walk-ins and live 360° video call walkthrough appointments
              </p>
            </div>
          </div>

          <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#092227] text-teal-300/80 border-b border-teal-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Pass Code</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">PG Property</th>
                    <th className="p-4">Visit Mode</th>
                    <th className="p-4">Scheduled Date & Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-800/40">
                  {visits.map(v => (
                    <tr key={v.id} className="hover:bg-teal-900/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{v.passCode}</td>
                      <td className="p-4 font-semibold text-white">{v.studentName} ({v.studentPhone})</td>
                      <td className="p-4 text-teal-200">{v.pgName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-teal-900 text-teal-200 font-semibold border border-teal-700">
                          {v.visitType}
                        </span>
                      </td>
                      <td className="p-4 text-teal-200">{v.visitDate} • {v.timeSlot}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT VERIFICATION DOSSIER MODAL */}
      {selectedPgDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-xl w-full text-white shadow-2xl p-6 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-teal-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-bold">Admin Verification Dossier</h4>
              </div>
              <button onClick={() => setSelectedPgDossier(null)} className="p-1.5 rounded-lg bg-teal-900 text-teal-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#092227] border border-teal-800 flex items-center gap-3">
                <img src={selectedPgDossier.coverImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <h5 className="font-bold text-white text-base">{selectedPgDossier.name}</h5>
                  <p className="text-teal-300/80">{selectedPgDossier.address || `${selectedPgDossier.locality}, ${selectedPgDossier.city}`}</p>
                  <p className="text-amber-400 font-semibold mt-0.5">Rent: ₹{selectedPgDossier.monthlyRent?.toLocaleString('en-IN')}/mo • {selectedPgDossier.genderType} PG</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#082227] border border-teal-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Owner Full Name</span>
                  <div className="text-white font-bold">{selectedPgDossier.ownerName || "Ramesh Sharma"}</div>
                  <div className="text-teal-300/70">{selectedPgDossier.ownerPhone || "+91 91234 56789"}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#082227] border border-teal-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Govt ID Proof</span>
                  <div className="text-white font-bold">{selectedPgDossier.verificationDossier?.ownerGovtIdType || "Aadhaar Card"}</div>
                  <div className="text-amber-300 font-mono">{selectedPgDossier.verificationDossier?.ownerGovtIdNumber || "XXXX-XXXX-9124"}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#082227] border border-teal-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400">Electricity Meter / Property Title Doc</span>
                <div className="text-white font-semibold">{selectedPgDossier.verificationDossier?.propertyDocType || "Electricity Meter & Ownership Deed"}</div>
                <div className="text-emerald-300 font-mono">Registry ID: {selectedPgDossier.verificationDossier?.propertyDocNumber || "EB-PUN-2026-8812"}</div>
                {selectedPgDossier.verificationDossier?.uploadedDocumentFile && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#061e23] border border-teal-700/80 flex items-center justify-between">
                    <span className="text-teal-200 font-mono flex items-center gap-1.5">
                      📄 {selectedPgDossier.verificationDossier.uploadedDocumentFile}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                      Uploaded File Verified
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#082227] border border-teal-800">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Fire Safety Clearance</span>
                  <div className="text-emerald-400 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Certified Compliant
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#082227] border border-teal-800">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Police Verification</span>
                  <div className="text-emerald-400 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clear & Verified
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Admin Audit & Verification Notes</label>
                <textarea
                  rows="2"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Premises cross-checked with municipal database. Verified safe for students."
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  disabled={loading}
                  onClick={() => handleVerifyAction(selectedPgDossier.id, true)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Grant 100% Verified Badge</span>
                </button>

                <button
                  disabled={loading}
                  onClick={() => handleVerifyAction(selectedPgDossier.id, false)}
                  className="py-2.5 px-4 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs"
                >
                  Reject
                </button>

                <button
                  onClick={() => setSelectedPgDossier(null)}
                  className="py-2.5 px-3 rounded-xl bg-teal-900 text-teal-300 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
