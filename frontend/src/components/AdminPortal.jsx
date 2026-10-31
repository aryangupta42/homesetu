import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Building, FileCheck, CheckCircle2, XCircle, Eye, Check, X, Clock, Calendar, QrCode, AlertTriangle, Phone, Mail, MapPin, MessageSquare, Send, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminPortal({ openAuthModal, onExploreClick, initialSubTab = 'verifications', onSubTabChange }) {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialSubTab || 'verifications');
  const [submitterRoleFilter, setSubmitterRoleFilter] = useState('ALL'); // 'ALL' | 'STUDENT' | 'OWNER'
  const [pgVerificationFilter, setPgVerificationFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'VERIFIED'
  const [isRefreshingTickets, setIsRefreshingTickets] = useState(false);
  const [ticketToast, setTicketToast] = useState('');
  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);
  const [queueToast, setQueueToast] = useState('');

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

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('homesetu_pgs_updated', handleStorageChange);
    window.addEventListener('homesetu_feedbacks_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('homesetu_pgs_updated', handleStorageChange);
      window.removeEventListener('homesetu_feedbacks_updated', handleStorageChange);
    };
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

  const handleRefreshTickets = async () => {
    setIsRefreshingTickets(true);
    setTicketToast('');
    const fbList = await api.getFeedbackComplaints();
    setFeedbacks(fbList);
    setIsRefreshingTickets(false);
    setTicketToast(`Refreshed ${fbList.length} tickets successfully!`);
    setTimeout(() => setTicketToast(''), 3000);
  };

  const handleRefreshQueue = async () => {
    setIsRefreshingQueue(true);
    setQueueToast('');
    const list = await api.getPgs();
    const s = await api.getAdminStats();
    setPgs(list);
    setStats(s);
    setIsRefreshingQueue(false);
    setQueueToast(`Queue updated (${list.length} PGs)`);
    setTimeout(() => setQueueToast(''), 3000);
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

  // Case 2: Strictly enforce Administrator identity - ONLY arshm2772@gmail.com allowed
  const isAuthorizedAdmin = currentUser.role === 'ADMIN' && currentUser.email?.trim().toLowerCase() === 'arshm2772@gmail.com';
  if (!isAuthorizedAdmin) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-6 text-white animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center text-4xl mx-auto shadow-xl">
          🔒
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Access Restricted</h3>
          <p className="text-xs uppercase font-bold tracking-widest text-red-400 mt-1">Platform Administrator Only</p>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          The Admin Portal is exclusively protected and reserved for the designated administrator (<span className="font-bold text-amber-400">arshm2772@gmail.com</span>). No other account has administrative permissions.
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
            Sign In as Admin (arshm2772@gmail.com)
          </button>
        </div>
      </div>
    );
  }

  const pendingPgs = pgs.filter(p => !p.isVerified || p.verificationStatus === 'PENDING');
  const verifiedPgs = pgs.filter(p => p.isVerified && p.verificationStatus !== 'PENDING');
  const filteredPgs = pgs.filter(p => {
    if (pgVerificationFilter === 'PENDING') return !p.isVerified || p.verificationStatus === 'PENDING';
    if (pgVerificationFilter === 'VERIFIED') return p.isVerified && p.verificationStatus !== 'PENDING';
    return true;
  }).sort((a, b) => {
    if (!a.isVerified && b.isVerified) return -1;
    if (a.isVerified && !b.isVerified) return 1;
    return 0;
  });

  const pendingFeedbacks = feedbacks.filter(f => f.status === 'PENDING');
  const studentFeedbacks = feedbacks.filter(f => f.submitterRole === 'STUDENT');
  const ownerFeedbacks = feedbacks.filter(f => f.submitterRole === 'OWNER');
  const filteredFeedbacks = feedbacks
    .filter(item => {
      if (submitterRoleFilter === 'STUDENT' && item.submitterRole !== 'STUDENT') return false;
      if (submitterRoleFilter === 'OWNER' && item.submitterRole !== 'OWNER') return false;

      if (feedbackFilter === 'COMPLAINT') return item.type === 'COMPLAINT';
      if (feedbackFilter === 'FEEDBACK') return item.type === 'FEEDBACK';
      if (feedbackFilter === 'PENDING') return item.status === 'PENDING';
      if (feedbackFilter === 'IN_REVIEW') return item.status === 'IN_REVIEW';
      if (feedbackFilter === 'RESOLVED') return item.status === 'RESOLVED';
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      if (a.status === 'IN_REVIEW' && b.status === 'RESOLVED') return -1;
      if (a.status === 'RESOLVED' && b.status === 'IN_REVIEW') return 1;
      return (b.id || 0) - (a.id || 0);
    });

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
              <h2 className="text-2xl font-extrabold text-white">{currentUser?.fullName || "Arsh Mittal"}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/80 text-purple-300 text-xs font-semibold border border-purple-700/60">
                Platform Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
              🏢 Central Administration • Logged in as <span className="font-bold text-amber-300">{currentUser?.email || "arshm2772@gmail.com"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="px-4 py-2.5 bg-[#0e363e] hover:bg-[#12424b] text-teal-200 border border-teal-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
          <span className="text-[11px] text-teal-300/60">Across platform listings</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Verified PGs</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{verifiedPgs.length}</div>
          <span className="text-[11px] text-emerald-300/60">100% Trust Certified</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-amber-400 font-semibold uppercase">Pending Requests</span>
          <div className={`text-3xl font-extrabold mt-1 ${pendingPgs.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {pendingPgs.length}
          </div>
          <span className="text-[11px] text-amber-300/80">Awaiting admin permission</span>
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
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>PG Verification Queue ({pgs.length})</span>
          {pendingPgs.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] animate-pulse">
              {pendingPgs.length} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => switchTab('bookings')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
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
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
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
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
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
        <div className="space-y-5">
          {/* Header & Refresh Queue */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>PG Owner Verification & Safety Compliance</span>
                {pendingPgs.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                    {pendingPgs.length} Needs Permission
                  </span>
                )}
              </h3>
              <p className="text-xs text-teal-300/70">
                Inspect property ownership proofs, electricity meter bills, and Aadhaar documents before granting Trust Badge
              </p>
            </div>

            <div className="flex items-center gap-2">
              {queueToast && (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl animate-in fade-in">
                  ✓ {queueToast}
                </span>
              )}
              <button
                onClick={handleRefreshQueue}
                disabled={isRefreshingQueue}
                className="px-3.5 py-2 rounded-xl bg-[#0e373f] hover:bg-[#134954] text-teal-200 border border-teal-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                title="Reload PG verification queue from database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingQueue ? 'animate-spin text-amber-400' : 'text-teal-300'}`} />
                <span>{isRefreshingQueue ? 'Refreshing Queue...' : 'Refresh Queue'}</span>
              </button>
            </div>
          </div>

          {/* HIGH-PRIORITY PENDING PERMISSION REQUESTS BANNER */}
          {pendingPgs.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#271d09] to-[#0c2e36] border-2 border-amber-500/60 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center justify-center font-extrabold text-xl shadow-inner">
                    ⏳
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-amber-200 flex items-center gap-2">
                      <span>Action Required: {pendingPgs.length} PG Permission Request{pendingPgs.length > 1 ? 's' : ''} Pending</span>
                    </h4>
                    <p className="text-xs text-amber-300/80">
                      Newly registered PG owners have submitted property proofs. Review details below and click <strong>"Grant Permission"</strong> to verify.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow">
                  Awaiting Approval
                </span>
              </div>

              {/* Grid of Pending PG Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {pendingPgs.map(pg => (
                  <div key={pg.id} className="p-4 rounded-2xl bg-[#092227] border border-amber-500/40 hover:border-amber-400 transition-all space-y-3 shadow-lg flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={pg.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"} 
                          alt={pg.name} 
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-amber-500/30 shadow-sm" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-white text-sm truncate">{pg.name}</h5>
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/40 shrink-0">
                              NEW
                            </span>
                          </div>
                          <p className="text-[11px] text-teal-300/80 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            {pg.locality}, {pg.city}
                          </p>
                          <div className="text-[11px] text-amber-300 font-bold mt-1">
                            ₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo • {pg.genderType} PG
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#061e23] border border-teal-800/80 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-teal-200">
                          <span>Owner: <strong className="text-white">{pg.ownerName || "Registered Owner"}</strong></span>
                          <span className="text-teal-400">{pg.ownerPhone || "+91 98111 00000"}</span>
                        </div>
                        <div className="text-[10px] text-teal-300/80 font-mono truncate">
                          Proof: <span className="text-amber-300 font-bold">{pg.verificationDossier?.propertyDocNumber || "EB-DEED-PENDING"}</span>
                        </div>
                        <div className="text-[10px] text-emerald-300/90 font-mono truncate">
                          📄 {pg.verificationDossier?.uploadedDocumentFile || "electricity_bill_deed.pdf"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleVerifyAction(pg.id, true)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Grant permission and 100% Verified Trust Badge"
                      >
                        <Check className="w-4 h-4" />
                        <span>Grant Permission</span>
                      </button>

                      <button
                        onClick={() => { setSelectedPgDossier(pg); setAdminNote(pg.verificationDossier?.adminNotes || ''); }}
                        className="py-2 px-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="Inspect full documents dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTER TABS */}
          <div className="flex items-center gap-2 bg-[#092227] p-1.5 rounded-2xl border border-teal-800/80 w-fit text-xs font-semibold">
            <button
              onClick={() => setPgVerificationFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                pgVerificationFilter === 'ALL'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
              }`}
            >
              All Properties ({pgs.length})
            </button>

            <button
              onClick={() => setPgVerificationFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                pgVerificationFilter === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-amber-300 hover:text-white hover:bg-amber-900/30'
              }`}
            >
              <span>⏳ Pending Permission ({pendingPgs.length})</span>
              {pendingPgs.length > 0 && (
                <span className={`w-2 h-2 rounded-full ${pgVerificationFilter === 'PENDING' ? 'bg-slate-950' : 'bg-amber-400'} animate-ping`} />
              )}
            </button>

            <button
              onClick={() => setPgVerificationFilter('VERIFIED')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                pgVerificationFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-emerald-300 hover:text-white hover:bg-teal-900/40'
              }`}
            >
              ✅ 100% Verified ({verifiedPgs.length})
            </button>
          </div>

          {/* TABLE OF LISTINGS */}
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
                  {filteredPgs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-teal-300/70 text-sm">
                        No properties found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPgs.map(pg => (
                      <tr key={pg.id} className={`hover:bg-teal-900/20 transition-colors ${!pg.isVerified ? 'bg-amber-950/20' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={pg.coverImage} alt={pg.name} className="w-11 h-11 rounded-lg object-cover" />
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                <span>{pg.name}</span>
                                {!pg.isVerified && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">
                                    PENDING
                                  </span>
                                )}
                              </div>
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
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> ⏳ Pending Permission
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
                            className="px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Inspect full verification details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Dossier</span>
                          </button>

                          {pg.isVerified ? (
                            <button
                              onClick={() => handleToggleVerify(pg.id)}
                              className="px-3 py-1.5 rounded-xl font-bold transition-colors bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 cursor-pointer"
                              title="Revoke verified badge"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerifyAction(pg.id, true)}
                              className="px-3 py-1.5 rounded-xl font-extrabold transition-colors bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md inline-flex items-center gap-1 cursor-pointer"
                              title="Grant platform admin permission"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Grant Permission</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
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

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {ticketToast && (
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/40 animate-in fade-in flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ticketToast}</span>
                </span>
              )}
              <button
                type="button"
                onClick={handleRefreshTickets}
                disabled={isRefreshingTickets}
                className="px-4 py-2 bg-[#0e363e] hover:bg-[#154b57] text-teal-200 hover:text-white border border-teal-700 hover:border-purple-400 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshingTickets ? 'animate-spin' : ''}`} />
                <span>{isRefreshingTickets ? 'Refreshing Tickets...' : 'Refresh Tickets'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar for Grievances (Interactive Clickable Filters) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => { setSubmitterRoleFilter('ALL'); setFeedbackFilter('ALL'); }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                submitterRoleFilter === 'ALL' && feedbackFilter === 'ALL'
                  ? 'bg-[#103a44] border-teal-400 ring-2 ring-teal-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#09252c] border-teal-800/80 hover:border-teal-600 hover:bg-[#0c313a]'
              }`}
              title="Click to view all platform tickets"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Total Tickets</span>
                <span className="text-[10px] text-teal-300/60 font-semibold">ALL</span>
              </div>
              <div className="text-2xl font-black text-white mt-0.5">{feedbacks.length}</div>
              <span className="text-[11px] text-teal-300/70">👥 Platform-wide</span>
            </button>

            <button
              type="button"
              onClick={() => { setSubmitterRoleFilter('STUDENT'); setFeedbackFilter('ALL'); }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                submitterRoleFilter === 'STUDENT'
                  ? 'bg-[#29200a] border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#09252c] border-teal-800/80 hover:border-amber-600/60 hover:bg-[#152e35]'
              }`}
              title="Click to filter by College Student tickets"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Student Issues</span>
                <span className="text-[10px] text-amber-300/80 font-bold">STUDENTS</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {studentFeedbacks.length}
              </div>
              <span className="text-[11px] text-amber-300/70">🎓 From college students</span>
            </button>

            <button
              type="button"
              onClick={() => { setSubmitterRoleFilter('OWNER'); setFeedbackFilter('ALL'); }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                submitterRoleFilter === 'OWNER'
                  ? 'bg-[#2b1708] border-orange-400 ring-2 ring-orange-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#09252c] border-teal-800/80 hover:border-orange-600/60 hover:bg-[#152e35]'
              }`}
              title="Click to filter by PG Property Owner tickets"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Owner Feedbacks</span>
                <span className="text-[10px] text-orange-300/80 font-bold">OWNERS</span>
              </div>
              <div className="text-2xl font-black text-orange-400 mt-0.5">
                {ownerFeedbacks.length}
              </div>
              <span className="text-[11px] text-orange-300/70">🏢 From property owners</span>
            </button>

            <button
              type="button"
              onClick={() => setFeedbackFilter('PENDING')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                feedbackFilter === 'PENDING'
                  ? 'bg-[#2c1010] border-red-400 ring-2 ring-red-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#09252c] border-teal-800/80 hover:border-red-600/60 hover:bg-[#152e35]'
              }`}
              title="Click to filter by Pending Action tickets"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Pending Action</span>
                {pendingFeedbacks.length > 0 && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />}
              </div>
              <div className="text-2xl font-black text-red-400 mt-0.5">
                {pendingFeedbacks.length}
              </div>
              <span className="text-[11px] text-red-300/70">🚨 Needs resolution</span>
            </button>

            <button
              type="button"
              onClick={() => setFeedbackFilter('RESOLVED')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                feedbackFilter === 'RESOLVED'
                  ? 'bg-[#09291f] border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#09252c] border-teal-800/80 hover:border-emerald-600/60 hover:bg-[#152e35]'
              }`}
              title="Click to filter by Resolved tickets"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Resolved</span>
                <span className="text-[10px] text-emerald-300/80 font-bold">CLOSED</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {feedbacks.filter(f => f.status === 'RESOLVED').length}
              </div>
              <span className="text-[11px] text-emerald-300/70">✅ Corrective actions taken</span>
            </button>
          </div>

          {/* Filtering Controls: Dual Bar for Submitter Role & Status */}
          <div className="p-4 rounded-2xl bg-[#092227] border border-teal-800/80 space-y-3">
            {/* 1. Submitter Role Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider mr-1">Submitter:</span>
              <button
                type="button"
                onClick={() => setSubmitterRoleFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submitterRoleFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/50'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800 hover:bg-teal-900/60'
                }`}
              >
                👥 All Submissions ({feedbacks.length})
              </button>
              <button
                type="button"
                onClick={() => setSubmitterRoleFilter('STUDENT')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  submitterRoleFilter === 'STUDENT'
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800 hover:bg-teal-900/60'
                }`}
              >
                <span>🎓 College Students</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  submitterRoleFilter === 'STUDENT' ? 'bg-slate-950/20 text-slate-950' : 'bg-teal-900 text-teal-300'
                }`}>
                  {studentFeedbacks.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSubmitterRoleFilter('OWNER')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  submitterRoleFilter === 'OWNER'
                    ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-400/50'
                    : 'bg-[#0b2b32] text-teal-300 hover:text-white border border-teal-800 hover:bg-teal-900/60'
                }`}
              >
                <span>🏢 PG Property Owners</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  submitterRoleFilter === 'OWNER' ? 'bg-black/30 text-white' : 'bg-teal-900 text-teal-300'
                }`}>
                  {ownerFeedbacks.length}
                </span>
              </button>
            </div>

            {/* 2. Type & Status Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-teal-900/60">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider mr-1">Status / Type:</span>
              <button
                type="button"
                onClick={() => setFeedbackFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'ALL' ? 'bg-purple-700 text-white font-bold ring-1 ring-purple-400' : 'text-teal-300 hover:text-white hover:bg-teal-900/50'
                }`}
              >
                All Statuses ({feedbacks.length})
              </button>
              <button
                type="button"
                onClick={() => setFeedbackFilter('COMPLAINT')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'COMPLAINT' ? 'bg-red-600 text-white font-bold ring-1 ring-red-400' : 'text-red-300 hover:text-white hover:bg-red-950/40'
                }`}
              >
                🚨 Complaints ({feedbacks.filter(f => f.type === 'COMPLAINT').length})
              </button>
              <button
                type="button"
                onClick={() => setFeedbackFilter('FEEDBACK')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'FEEDBACK' ? 'bg-amber-600 text-white font-bold ring-1 ring-amber-400' : 'text-amber-300 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                💡 Feedback ({feedbacks.filter(f => f.type === 'FEEDBACK').length})
              </button>
              <button
                type="button"
                onClick={() => setFeedbackFilter('PENDING')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'PENDING' ? 'bg-orange-600 text-white font-bold ring-1 ring-orange-400' : 'text-orange-300 hover:text-white hover:bg-orange-950/40'
                }`}
              >
                <span>⏳ Pending ({pendingFeedbacks.length})</span>
                {pendingFeedbacks.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block ml-1" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setFeedbackFilter('IN_REVIEW')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'IN_REVIEW' ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' : 'text-blue-300 hover:text-white hover:bg-blue-950/40'
                }`}
              >
                🔍 In Review ({feedbacks.filter(f => f.status === 'IN_REVIEW').length})
              </button>
              <button
                type="button"
                onClick={() => setFeedbackFilter('RESOLVED')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  feedbackFilter === 'RESOLVED' ? 'bg-emerald-600 text-white font-bold ring-1 ring-emerald-400' : 'text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                ✅ Resolved ({feedbacks.filter(f => f.status === 'RESOLVED').length})
              </button>
            </div>
          </div>

          {/* Active Filter Notice Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#082227] border border-teal-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-teal-400 font-bold">Showing {filteredFeedbacks.length} of {feedbacks.length} tickets</span>
              <span className="text-teal-300/60">•</span>
              <span className="text-teal-200">
                Submitter: <strong>{submitterRoleFilter === 'ALL' ? 'All Roles' : submitterRoleFilter === 'STUDENT' ? '🎓 College Students' : '🏢 PG Owners'}</strong>
              </span>
              <span className="text-teal-300/60">•</span>
              <span className="text-teal-200">
                Filter: <strong>{feedbackFilter === 'ALL' ? 'All Statuses & Types' : feedbackFilter}</strong>
              </span>
            </div>
            {(submitterRoleFilter !== 'ALL' || feedbackFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => { setSubmitterRoleFilter('ALL'); setFeedbackFilter('ALL'); }}
                className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer self-start sm:self-auto"
              >
                Reset to Show All
              </button>
            )}
          </div>

          {/* Grievance Ticket Cards */}
          <div className="space-y-4">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center bg-[#092227] border border-teal-800 rounded-2xl space-y-3">
                <p className="text-sm text-teal-300">No tickets found matching the selected filter ({feedbackFilter}).</p>
                <button
                  type="button"
                  onClick={() => { setFeedbackFilter('ALL'); setSubmitterRoleFilter('ALL'); }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  Show All Submissions ({feedbacks.length})
                </button>
              </div>
            ) : (
              filteredFeedbacks.map(item => (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-[#0c3139] border transition-all space-y-4 shadow-xl ${
                    item.status === 'PENDING'
                      ? 'border-red-500/60 ring-1 ring-red-500/20 bg-gradient-to-b from-[#0c3139] to-[#121c22]'
                      : 'border-[#17525e] hover:border-teal-500/60'
                  }`}
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
                        {item.submitterRole === 'STUDENT' ? '🎓 College Student' : '🏢 PG Property Owner'}
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
                        'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
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
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-teal-950 border border-teal-800 text-white font-bold">
                        👤 {item.submitterName}
                      </span>
                      <span>📞 <strong className="text-teal-200">{item.submitterPhone}</strong></span>
                      <span>📧 <strong className="text-teal-200">{item.submitterEmail}</strong></span>
                    </div>
                    <div>
                      Associated Property: <strong className="text-amber-400">{item.pgName || 'General Platform'}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
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
