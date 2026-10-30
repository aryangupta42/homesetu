import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Building, FileCheck, CheckCircle2, XCircle, Eye, Check, X, Clock, Calendar, QrCode, AlertTriangle, Phone, Mail, MapPin, MessageSquare, Send, Filter, Sparkles } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminPortal({ openAuthModal, onExploreClick, initialSubTab = 'verifications', onSubTabChange }) {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialSubTab || 'verifications');
  const [submitterRoleFilter, setSubmitterRoleFilter] = useState('ALL'); // 'ALL' | 'STUDENT' | 'OWNER'

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };
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
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState('ALL'); // 'ALL' | 'COMPLAINT' | 'FEEDBACK' | 'PENDING' | 'RESOLVED'
  const [selectedFeedbackForAction, setSelectedFeedbackForAction] = useState(null);
  const [adminFeedbackStatus, setAdminFeedbackStatus] = useState('IN_REVIEW');
  const [adminFeedbackNote, setAdminFeedbackNote] = useState('');
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
    const fbList = await api.getFeedbackComplaints();
    setStats(s);
    setPgs(list);
    setBookings(bkgs);
    setVisits(vsts);
    setFeedbacks(fbList);
    setLoading(false);
  };

  const handleFeedbackAction = async (id) => {
    setLoading(true);
    await api.updateFeedbackStatus(id, adminFeedbackStatus, adminFeedbackNote);
    setSelectedFeedbackForAction(null);
    setAdminFeedbackNote('');
    setLoading(false);
    loadData();
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
          onClick={() => switchTab('verifications')}
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
          onClick={() => switchTab('bookings')}
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
          onClick={() => switchTab('visits')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'visits'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Direct Scheduled Visits ({visits.length})</span>
        </button>

        <button
          onClick={() => switchTab('feedbacks')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'feedbacks'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Grievances & Feedback Hub</span>
          {feedbacks.filter(f => f.status === 'PENDING').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-black text-[10px] animate-pulse">
              {feedbacks.filter(f => f.status === 'PENDING').length}
            </span>
          )}
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
           {/* TAB 4: GRIEVANCES & FEEDBACK MONITORING HUB */}
      {activeTab === 'feedbacks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Central Grievance Redressal & Feedback Hub</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/80 text-purple-300 border border-purple-700/60 font-semibold">
                  Administrator Monitoring Console
                </span>
              </h3>
              <p className="text-xs text-teal-300/80 mt-1">
                Real-time monitoring and official response dispatch for all complaints and suggestions from Students and PG Owners.
              </p>
            </div>

            <button
              onClick={() => loadData()}
              className="px-4 py-2 bg-[#0e363e] hover:bg-[#12424b] text-teal-200 border border-teal-700 rounded-xl text-xs font-bold transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              🔄 Refresh Tickets
            </button>
          </div>

          {/* Quick Metrics Bar for Grievances */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-[#09252c] border border-teal-800/80 shadow-md">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Total Tickets</span>
              <div className="text-2xl font-black text-white mt-0.5">{feedbacks.length}</div>
              <span className="text-[11px] text-teal-300/60">Platform-wide</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09252c] border border-teal-800/80 shadow-md">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Student Issues</span>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {feedbacks.filter(f => f.submitterRole === 'STUDENT').length}
              </div>
              <span className="text-[11px] text-amber-300/60">From college students</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09252c] border border-teal-800/80 shadow-md">
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Owner Feedbacks</span>
              <div className="text-2xl font-black text-orange-400 mt-0.5">
                {feedbacks.filter(f => f.submitterRole === 'OWNER').length}
              </div>
              <span className="text-[11px] text-orange-300/60">From property owners</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09252c] border border-teal-800/80 shadow-md">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Pending Action</span>
              <div className="text-2xl font-black text-red-400 mt-0.5">
                {feedbacks.filter(f => f.status === 'PENDING').length}
              </div>
              <span className="text-[11px] text-red-300/60">Needs resolution</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09252c] border border-teal-800/80 shadow-md">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Resolved</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {feedbacks.filter(f => f.status === 'RESOLVED').length}
              </div>
              <span className="text-[11px] text-emerald-300/60">Corrective actions taken</span>
            </div>
          </div>

          {/* Filtering Controls: Dual Bar for Submitter Role & Status */}
          <div className="p-4 rounded-2xl bg-[#092227] border border-teal-800/80 space-y-3">
            {/* 1. Submitter Role Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider mr-1">Submitter:</span>
              <button
                onClick={() => setSubmitterRoleFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submitterRoleFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800'
                }`}
              >
                👥 All Submissions ({feedbacks.length})
              </button>
              <button
                onClick={() => setSubmitterRoleFilter('STUDENT')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  submitterRoleFilter === 'STUDENT'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800'
                }`}
              >
                <span>🎓 College Students</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  submitterRoleFilter === 'STUDENT' ? 'bg-slate-950/20 text-slate-950' : 'bg-teal-900 text-teal-300'
                }`}>
                  {feedbacks.filter(f => f.submitterRole === 'STUDENT').length}
                </span>
              </button>
              <button
                onClick={() => setSubmitterRoleFilter('OWNER')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  submitterRoleFilter === 'OWNER'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800'
                }`}
              >
                <span>🏢 PG Property Owners</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  submitterRoleFilter === 'OWNER' ? 'bg-black/30 text-white' : 'bg-teal-900 text-teal-300'
                }`}>
                  {feedbacks.filter(f => f.submitterRole === 'OWNER').length}
                </span>
              </button>
            </div>

            {/* 2. Type & Status Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-teal-900/60">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider mr-1">Status / Type:</span>
              <button
                onClick={() => setFeedbackFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'ALL' ? 'bg-purple-700 text-white font-bold' : 'text-teal-300 hover:text-white hover:bg-teal-900/50'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setFeedbackFilter('COMPLAINT')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'COMPLAINT' ? 'bg-red-600 text-white font-bold' : 'text-red-300 hover:text-white hover:bg-red-950/40'
                }`}
              >
                🚨 Complaints ({feedbacks.filter(f => f.type === 'COMPLAINT').length})
              </button>
              <button
                onClick={() => setFeedbackFilter('FEEDBACK')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'FEEDBACK' ? 'bg-amber-600 text-white font-bold' : 'text-amber-300 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                💡 Feedback ({feedbacks.filter(f => f.type === 'FEEDBACK').length})
              </button>
              <button
                onClick={() => setFeedbackFilter('PENDING')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'PENDING' ? 'bg-orange-600 text-white font-bold' : 'text-orange-300 hover:text-white hover:bg-orange-950/40'
                }`}
              >
                ⏳ Pending ({feedbacks.filter(f => f.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setFeedbackFilter('IN_REVIEW')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'IN_REVIEW' ? 'bg-blue-600 text-white font-bold' : 'text-blue-300 hover:text-white hover:bg-blue-950/40'
                }`}
              >
                🔍 In Review ({feedbacks.filter(f => f.status === 'IN_REVIEW').length})
              </button>
              <button
                onClick={() => setFeedbackFilter('RESOLVED')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'RESOLVED' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                ✅ Resolved ({feedbacks.filter(f => f.status === 'RESOLVED').length})
              </button>
            </div>
          </div>

          {/* Grievance Ticket Cards */}
          <div className="space-y-4">
            {feedbacks
              .filter(item => {
                // Submitter role filter
                if (submitterRoleFilter === 'STUDENT' && item.submitterRole !== 'STUDENT') return false;
                if (submitterRoleFilter === 'OWNER' && item.submitterRole !== 'OWNER') return false;

                // Status/Type filter
                if (feedbackFilter === 'COMPLAINT') return item.type === 'COMPLAINT';
                if (feedbackFilter === 'FEEDBACK') return item.type === 'FEEDBACK';
                if (feedbackFilter === 'PENDING') return item.status === 'PENDING';
                if (feedbackFilter === 'IN_REVIEW') return item.status === 'IN_REVIEW';
                if (feedbackFilter === 'RESOLVED') return item.status === 'RESOLVED';
                return true;
              })
              .map(item => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0c3139] border border-[#17525e] hover:border-teal-500/60 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-800/60 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {item.ticketId}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                        item.submitterRole === 'STUDENT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      }`}>
                        {item.submitterRole === 'STUDENT' ? '🎓 Student' : '🏢 PG Owner'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.type === 'COMPLAINT'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.priority === 'URGENT' ? 'bg-red-900 text-red-200 border border-red-700' :
                        item.priority === 'HIGH' ? 'bg-orange-900 text-orange-200 border border-orange-700' :
                        'bg-teal-900 text-teal-300 border border-teal-700'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-xs text-teal-300/80 font-medium">
                        • {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                        item.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        item.status === 'IN_REVIEW' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        item.status === 'DISMISSED' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedFeedbackForAction(item);
                          setAdminFeedbackStatus(item.status || 'IN_REVIEW');
                          setAdminFeedbackNote(item.adminResponse || '');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/25 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.adminResponse ? 'Update Response' : 'Respond & Resolve'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{item.subject}</h4>
                    <p className="text-xs text-teal-200/90 leading-relaxed mt-1.5 bg-[#082227] p-3.5 rounded-xl border border-teal-800/80 italic">
                      "{item.description}"
                    </p>
                  </div>

                  {item.adminResponse && (
                    <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-700/60 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          Official Admin Response & Action Taken:
                        </span>
                        <span className="text-[10px] text-purple-300/70 font-mono">
                          Status: {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-teal-100 font-medium leading-relaxed">{item.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-teal-300/80 pt-2 border-t border-teal-900/60">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Submitted by: <strong className="text-white">{item.submitterName}</strong> ({item.submitterRole})</span>
                      <span>📞 <strong className="text-teal-200">{item.submitterPhone}</strong></span>
                      <span>📧 <strong className="text-teal-200">{item.submitterEmail}</strong></span>
                    </div>
                    <div>
                      Associated Property: <strong className="text-amber-400">{item.pgName || 'General Platform'}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* RESOLVE FEEDBACK / COMPLAINT MODAL */}
      {selectedFeedbackForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-lg w-full text-white shadow-2xl p-6 space-y-5 my-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-teal-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-bold">Admin Resolution: {selectedFeedbackForAction.ticketId}</h4>
              </div>
              <button 
                onClick={() => setSelectedFeedbackForAction(null)} 
                className="p-1.5 rounded-lg bg-teal-900 text-teal-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-[#082227] border border-teal-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-teal-400 font-semibold uppercase text-[10px]">Ticket Subject:</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded font-bold uppercase ${
                    selectedFeedbackForAction.submitterRole === 'STUDENT' ? 'bg-amber-900 text-amber-200' : 'bg-orange-900 text-orange-200'
                  }`}>
                    {selectedFeedbackForAction.submitterRole}
                  </span>
                </div>
                <p className="text-white font-bold text-sm">{selectedFeedbackForAction.subject}</p>
                <span className="text-teal-400 font-semibold block pt-1 uppercase text-[10px]">Original Statement:</span>
                <p className="text-teal-200 italic bg-[#05171b] p-2 rounded-lg border border-teal-900">"{selectedFeedbackForAction.description}"</p>
                <div className="pt-1.5 text-[11px] text-teal-300/80 flex flex-wrap gap-2">
                  <span>From: <strong className="text-white">{selectedFeedbackForAction.submitterName}</strong></span>
                  <span>• PG: <strong className="text-amber-400">{selectedFeedbackForAction.pgName}</strong></span>
                  <span>• 📞 {selectedFeedbackForAction.submitterPhone}</span>
                </div>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Update Status</label>
                <select
                  value={adminFeedbackStatus}
                  onChange={(e) => setAdminFeedbackStatus(e.target.value)}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="PENDING">⏳ Pending (Still awaiting physical inspection)</option>
                  <option value="IN_REVIEW">🔍 In Review (Investigation active with PG Owner/Warden)</option>
                  <option value="RESOLVED">✅ Resolved (Corrective action implemented & verified)</option>
                  <option value="DISMISSED">❌ Dismissed (Invalid or duplicate submission)</option>
                </select>
              </div>

              {/* Quick Action Response Templates */}
              <div>
                <label className="block text-teal-300 font-semibold mb-1">Quick Resolution Templates (Click to apply)</label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {[
                    "Contacted PG Owner; physical inspection scheduled within 24 hours.",
                    "ISP technician dispatched; WiFi router replaced & 250 Mbps connection restored.",
                    "Mess kitchen supervisor contacted; dinner menu rotation revised with fresh fruit options.",
                    "Feature request accepted and logged into HomeSetu platform roadmap.",
                    "Verified with student and owner; matter resolved satisfactorily."
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAdminFeedbackNote(tpl)}
                      className="text-[10px] px-2 py-1 rounded-md bg-[#061e23] border border-teal-700/80 hover:border-purple-400 text-teal-200 hover:text-white transition-colors text-left cursor-pointer"
                    >
                      + {tpl.slice(0, 42)}...
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Official Resolution & Action Taken Note</label>
                <textarea
                  rows="3"
                  value={adminFeedbackNote}
                  onChange={(e) => setAdminFeedbackNote(e.target.value)}
                  placeholder="e.g. Contacted owner Deepak Singhal. ISP replaced the damaged fiber line and speed test verified at 250 Mbps on 2nd floor."
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  disabled={loading}
                  onClick={() => handleFeedbackAction(selectedFeedbackForAction.id)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Dispatching...' : 'Dispatch Official Response & Update'}</span>
                </button>

                <button
                  onClick={() => setSelectedFeedbackForAction(null)}
                  className="py-2.5 px-4 rounded-xl bg-teal-900 text-teal-300 font-bold text-xs hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
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
