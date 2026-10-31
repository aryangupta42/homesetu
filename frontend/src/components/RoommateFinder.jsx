import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, MessageSquare, Heart, Search, Filter, 
  Send, CheckCircle2, XCircle, Clock, Sparkles, Building, 
  Calendar, MapPin, IndianRupee, ShieldCheck, Moon, Sun, 
  Sparkle, BookOpen, Coffee, Cigarette, AlertCircle, Plus, 
  ChevronRight, ArrowRight, UserPlus, BedDouble
} from 'lucide-react';
import { api, MASTER_COLLEGES } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RoommateFinder({ onSelectPg }) {
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('browse'); // 'browse' | 'my-profile' | 'connections' | 'find-together' | 'wanted'
  
  // Data state
  const [profiles, setProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [activeChatConnection, setActiveChatConnection] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [wantedListings, setWantedListings] = useState([]);
  const [sharedPgMatches, setSharedPgMatches] = useState([]);
  
  // Loading & Filter state
  const [loading, setLoading] = useState(true);
  const [filterCollege, setFilterCollege] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [filterBudget, setFilterBudget] = useState(12000);
  const [filterSleep, setFilterSleep] = useState('All');
  const [filterFood, setFilterFood] = useState('All');

  // Combined budget tool state
  const [myBudgetValue, setMyBudgetValue] = useState(7500);
  const [partnerBudgetValue, setPartnerBudgetValue] = useState(7500);

  // Request modal state
  const [requestTargetProfile, setRequestTargetProfile] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  
  // Wanted bed modal state
  const [showPostWantedModal, setShowPostWantedModal] = useState(false);
  const [newWanted, setNewWanted] = useState({
    pgName: '',
    locality: '',
    city: 'Pune',
    rentPerPerson: 7500,
    roomType: 'Double Sharing',
    availableFrom: '2026-11-15',
    roomDescription: '',
    genderPreference: 'ANY'
  });

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  const loadAllData = async () => {
    setLoading(true);
    const studentId = currentUser?.id || 6; // default demo student Aarav if guest
    
    // 1. My Profile
    const myProf = await api.getMyRoommateProfile(studentId);
    setMyProfile(myProf);

    // 2. All Profiles
    const profs = await api.getRoommateProfiles({ studentId });
    setProfiles(profs);

    // 3. Connections
    const conns = await api.getRoommateConnections(studentId);
    setConnections(conns);

    // 4. Wanted Listings
    const wanted = await api.getRoommatesWanted('All');
    setWantedListings(wanted);

    // 5. Initial Shared PGs
    const pgs = await api.findPgTogether(7500, 7500, 'All');
    setSharedPgMatches(pgs);

    setLoading(false);
  };

  const handleSendRequest = async () => {
    if (!requestTargetProfile) return;
    const studentId = currentUser?.id || 6;
    await api.sendRoommateRequest(studentId, requestTargetProfile.studentId, requestNote);
    setRequestTargetProfile(null);
    setRequestNote('');
    alert(`Connection request sent to ${requestTargetProfile.fullName}! Private chat will unlock once they accept.`);
    loadAllData();
  };

  const handleUpdateConnection = async (connId, status) => {
    await api.updateRoommateConnectionStatus(connId, status);
    loadAllData();
    if (activeChatConnection && activeChatConnection.id === connId) {
      setActiveChatConnection(prev => ({ ...prev, status }));
    }
  };

  const openChatForConnection = async (conn) => {
    setActiveChatConnection(conn);
    const msgs = await api.getRoommateMessages(conn.id);
    setChatMessages(msgs);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeChatConnection || !newChatMessage.trim()) return;
    const studentId = currentUser?.id || 6;
    const senderName = currentUser?.fullName || "Aarav Sharma";
    
    const sent = await api.sendRoommateMessage(
      activeChatConnection.id,
      studentId,
      senderName,
      newChatMessage.trim()
    );

    setChatMessages(prev => [...prev, sent]);
    setNewChatMessage('');
  };

  const handleSaveMyProfile = async (e) => {
    e.preventDefault();
    const updated = await api.saveRoommateProfile(myProfile);
    setMyProfile(updated);
    alert("Your Roommate Profile & Lifestyle Preferences have been updated successfully!");
    loadAllData();
  };

  const handlePostWanted = async (e) => {
    e.preventDefault();
    const studentId = currentUser?.id || 6;
    await api.postRoommateWanted({
      ...newWanted,
      postedByStudentId: studentId,
      studentName: currentUser?.fullName || "Aarav Sharma",
      studentCollege: currentUser?.college || "ABES Engineering College",
      studentPhone: currentUser?.phone || "+91 98765 43210",
      studentEmail: currentUser?.email || "student1@homesetu.demo"
    });
    setShowPostWantedModal(false);
    alert("Vacant bed listing posted successfully!");
    loadAllData();
  };

  const handleSearchSharedPgs = async () => {
    const results = await api.findPgTogether(myBudgetValue, partnerBudgetValue, filterCity);
    setSharedPgMatches(results);
  };

  // Filtered profiles for Browse tab
  const filteredProfiles = profiles.filter(p => {
    if (filterCity !== 'All' && p.city.toLowerCase() !== filterCity.toLowerCase()) return false;
    if (filterCollege !== 'All' && !p.college.toLowerCase().includes(filterCollege.toLowerCase())) return false;
    if (p.budgetMax > filterBudget) return false;
    if (filterSleep !== 'All' && p.sleepSchedule !== filterSleep) return false;
    if (filterFood !== 'All' && p.foodPreference !== filterFood) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0c363f] via-[#092227] to-[#124550] border-2 border-teal-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Compatibility Engine
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold">
                Verified Students Only
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              HomeSetu Smart Roommate Finder & Match
            </h2>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1 max-w-2xl">
              Match with compatible college peers based on sleep schedules, cleanliness habits, dietary preferences, and combined budgets. Lock private chat only upon mutual agreement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPostWantedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#081d21] hover:bg-[#0d343c] border border-teal-600 text-teal-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <BedDouble className="w-4 h-4 text-amber-400" />
              <span>Post Vacant Bed</span>
            </button>
            <button
              onClick={() => setActiveSubTab('my-profile')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Edit My Lifestyle Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main SubTab Navigation */}
      <div className="flex items-center gap-2 border-b border-teal-800 bg-[#092227] p-2 rounded-2xl overflow-x-auto text-xs font-bold">
        {[
          { id: 'browse', label: 'Recommended Roommates', icon: Users, badge: filteredProfiles.length },
          { id: 'my-profile', label: 'My Lifestyle Profile', icon: UserCheck },
          { id: 'connections', label: 'Mutual Connections & Chat', icon: MessageSquare, badge: connections.length },
          { id: 'find-together', label: 'Find PG Together (Combined Budget)', icon: Building },
          { id: 'wanted', label: 'Roommate Wanted (Vacant Beds)', icon: BedDouble, badge: wantedListings.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-[#0b2b32] border-teal-800 text-teal-300 hover:text-white hover:bg-teal-900/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-slate-900 text-amber-300' : 'bg-teal-900 text-teal-200'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: BROWSE ROOMMATES
      ========================================================================= */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-teal-300/80 block mb-1 font-semibold">City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full bg-[#081d21] border border-teal-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="All">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Ghaziabad">Ghaziabad & Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kota">Kota</option>
              </select>
            </div>

            <div>
              <label className="text-teal-300/80 block mb-1 font-semibold">College / University</label>
              <select
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
                className="w-full bg-[#081d21] border border-teal-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="All">All Colleges</option>
                {MASTER_COLLEGES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-teal-300/80 block mb-1 font-semibold">Max Budget (₹{filterBudget}/mo)</label>
              <input
                type="range"
                min="4000"
                max="15000"
                step="500"
                value={filterBudget}
                onChange={(e) => setFilterBudget(Number(e.target.value))}
                className="w-full accent-amber-400 mt-2"
              />
            </div>

            <div>
              <label className="text-teal-300/80 block mb-1 font-semibold">Sleep Schedule</label>
              <select
                value={filterSleep}
                onChange={(e) => setFilterSleep(e.target.value)}
                className="w-full bg-[#081d21] border border-teal-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="All">Any Sleep Schedule</option>
                <option value="EARLY_BIRD">Early Bird (Sleep by 10 PM)</option>
                <option value="NIGHT_OWL">Night Owl (After 1 AM)</option>
                <option value="FLEXIBLE">Flexible Hours</option>
              </select>
            </div>

            <div>
              <label className="text-teal-300/80 block mb-1 font-semibold">Dietary Preference</label>
              <select
                value={filterFood}
                onChange={(e) => setFilterFood(e.target.value)}
                className="w-full bg-[#081d21] border border-teal-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="All">Any Dietary Habit</option>
                <option value="VEG_ONLY">Vegetarian Only</option>
                <option value="NON_VEG_OK">Non-Veg OK</option>
                <option value="JAIN">Strict Jain</option>
              </select>
            </div>
          </div>

          {/* Roommate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((p) => {
              const score = p.compatibilityScore || 85;
              return (
                <div
                  key={p.id}
                  className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-5 hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:-translate-y-1"
                >
                  <div>
                    {/* Header with Avatar & Compatibility Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                          alt={p.fullName}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-teal-600 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-white text-base">{p.fullName}</h4>
                            <ShieldCheck className="w-4 h-4 text-teal-400" title="Verified Student ID" />
                          </div>
                          <div className="text-xs text-teal-300/80 font-medium">{p.course} • {p.academicYear}</div>
                          <div className="text-[11px] text-teal-400/60 truncate max-w-[170px]">{p.college}</div>
                        </div>
                      </div>

                      {/* Compatibility Badge */}
                      <div className="px-2.5 py-1 rounded-xl bg-[#081d21] border border-amber-400/60 text-right shrink-0">
                        <div className="text-[9px] uppercase font-bold text-teal-300">Match</div>
                        <div className="text-sm font-black text-amber-400">{score}%</div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 italic bg-[#081d21] p-2.5 rounded-xl border border-teal-800/60">
                      "{p.bio || "Looking for a tidy, focused roommate who respects quiet hours."}"
                    </p>

                    {/* Lifestyle Attributes Matrix */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-[#081d21] border border-teal-800/80 flex items-center gap-2">
                        {p.sleepSchedule === 'EARLY_BIRD' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                        <span className="truncate">{p.sleepSchedule === 'EARLY_BIRD' ? 'Early Bird (10 PM)' : p.sleepSchedule === 'NIGHT_OWL' ? 'Night Owl (1 AM+)' : 'Flexible'}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-[#081d21] border border-teal-800/80 flex items-center gap-2">
                        <Sparkle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{p.cleanlinessLevel === 'HIGH' ? 'Neat & Tidy' : 'Moderate Clean'}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-[#081d21] border border-teal-800/80 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span className="truncate">{p.studyHabit === 'SILENT_ROOM' ? 'Silent Study' : 'Library / Group'}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-[#081d21] border border-teal-800/80 flex items-center gap-2">
                        <Coffee className="w-3.5 h-3.5 text-orange-400" />
                        <span className="truncate">{p.foodPreference === 'VEG_ONLY' ? 'Veg Only' : 'Non-Veg OK'}</span>
                      </div>
                    </div>

                    {/* Budget & Target Locality */}
                    <div className="mt-3 pt-3 border-t border-teal-800/60 flex items-center justify-between text-xs">
                      <div className="text-teal-300/80">
                        <span>Budget: </span>
                        <strong className="text-white">₹{p.budgetMin?.toLocaleString('en-IN')} - ₹{p.budgetMax?.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="text-teal-300/80 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate max-w-[110px]">{p.preferredLocality || p.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <button
                    onClick={() => setRequestTargetProfile(p)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Send Connection Request</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MY LIFESTYLE PROFILE
      ========================================================================= */}
      {activeSubTab === 'my-profile' && myProfile && (
        <div className="bg-[#0b2b32] border border-teal-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl">
          <div className="border-b border-teal-800 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white">Your Roommate Matching Profile</h3>
            <p className="text-xs text-teal-300/80 mt-1">
              Set your honest daily routines so the algorithm pairs you with students who share identical living standards.
            </p>
          </div>

          <form onSubmit={handleSaveMyProfile} className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-teal-300 font-semibold block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={myProfile.fullName || ''}
                  onChange={(e) => setMyProfile({ ...myProfile, fullName: e.target.value })}
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">College / Campus</label>
                <input
                  type="text"
                  value={myProfile.college || ''}
                  onChange={(e) => setMyProfile({ ...myProfile, college: e.target.value })}
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">Degree & Academic Year</label>
                <input
                  type="text"
                  value={myProfile.course || ''}
                  onChange={(e) => setMyProfile({ ...myProfile, course: e.target.value })}
                  placeholder="e.g. B.Tech CS 3rd Year"
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">Target City / Hub</label>
                <select
                  value={myProfile.city || 'Pune'}
                  onChange={(e) => setMyProfile({ ...myProfile, city: e.target.value })}
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Pune">Pune</option>
                  <option value="Ghaziabad">Ghaziabad & Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kota">Kota</option>
                </select>
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">
                  Budget Range (Min - Max ₹/month)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={myProfile.budgetMin || 5000}
                    onChange={(e) => setMyProfile({ ...myProfile, budgetMin: Number(e.target.value) })}
                    className="w-1/2 bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={myProfile.budgetMax || 9000}
                    onChange={(e) => setMyProfile({ ...myProfile, budgetMax: Number(e.target.value) })}
                    className="w-1/2 bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">Room Sharing Preference</label>
                <select
                  value={myProfile.roomSharingPreference || 'DOUBLE_SHARING'}
                  onChange={(e) => setMyProfile({ ...myProfile, roomSharingPreference: e.target.value })}
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                >
                  <option value="SINGLE">Single Room Only</option>
                  <option value="DOUBLE_SHARING">Double Sharing (2 Beds)</option>
                  <option value="TRIPLE_SHARING">Triple Sharing (3 Beds)</option>
                  <option value="ANY">Flexible / Any Sharing</option>
                </select>
              </div>
            </div>

            {/* 6 Lifestyle Preference Selectors */}
            <div className="border-t border-teal-800 pt-5 space-y-4">
              <h4 className="text-sm font-bold text-amber-400">Daily Living & Routine Preferences</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Sleeping Routine</label>
                  <select
                    value={myProfile.sleepSchedule || 'EARLY_BIRD'}
                    onChange={(e) => setMyProfile({ ...myProfile, sleepSchedule: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="EARLY_BIRD">🌅 Early Bird (Sleep by 10:30 PM, Awake by 6 AM)</option>
                    <option value="NIGHT_OWL">🌙 Night Owl (Late Night Study / Code past 1 AM)</option>
                    <option value="FLEXIBLE">⚖️ Flexible / No Fixed Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Cleanliness Standard</label>
                  <select
                    value={myProfile.cleanlinessLevel || 'HIGH'}
                    onChange={(e) => setMyProfile({ ...myProfile, cleanlinessLevel: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="HIGH">✨ High (Daily tidy bed, shoes rack, no clutter)</option>
                    <option value="MODERATE">🧹 Moderate (Weekend cleaning, generally organized)</option>
                    <option value="RELAXED">🛋️ Relaxed (Casual living standard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Dietary Habits</label>
                  <select
                    value={myProfile.foodPreference || 'VEG_ONLY'}
                    onChange={(e) => setMyProfile({ ...myProfile, foodPreference: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="VEG_ONLY">🥗 Pure Vegetarian Only</option>
                    <option value="NON_VEG_OK">🍗 Non-Vegetarian OK</option>
                    <option value="JAIN">🪷 Strict Jain (No Onion/Garlic)</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Study Habits & Quiet Hours</label>
                  <select
                    value={myProfile.studyHabit || 'SILENT_ROOM'}
                    onChange={(e) => setMyProfile({ ...myProfile, studyHabit: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="SILENT_ROOM">🤫 Complete Silence in Room for Study</option>
                    <option value="LIBRARY_FOCUSED">📚 Study in College Library / Study Hall</option>
                    <option value="GROUP_STUDY">👥 Discussion & Group Coding Sessions OK</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Smoking & Alcohol Policy</label>
                  <select
                    value={myProfile.smokingHabit || 'STRICTLY_NO'}
                    onChange={(e) => setMyProfile({ ...myProfile, smokingHabit: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="STRICTLY_NO">🚭 Strictly Non-Smoker / Non-Drinker</option>
                    <option value="OCCASIONAL">🚬 Occasional / Outside premises only</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 font-semibold block mb-1">Outside Visitors Policy</label>
                  <select
                    value={myProfile.guestPolicy || 'STUDY_BUDDIES_ONLY'}
                    onChange={(e) => setMyProfile({ ...myProfile, guestPolicy: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="STUDY_BUDDIES_ONLY">📖 Study partners allowed until 8 PM</option>
                    <option value="FRIENDS_WELCOME">🎉 Friends welcome anytime (with heads-up)</option>
                    <option value="NO_OUTSIDE_GUESTS">🔒 No outside guests inside private bedroom</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-teal-300 font-semibold block mb-1">About Me / Bio</label>
              <textarea
                rows={3}
                value={myProfile.bio || ''}
                onChange={(e) => setMyProfile({ ...myProfile, bio: e.target.value })}
                placeholder="Describe your daily routine, academic year, favorite hobbies, and what kind of roommate vibe you appreciate..."
                className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-3 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Matching Preferences</span>
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CONNECTIONS & PRIVATE 1-TO-1 CHAT
      ========================================================================= */}
      {activeSubTab === 'connections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Connections List */}
          <div className="bg-[#0b2b32] border border-teal-800 rounded-3xl p-5 space-y-4 lg:col-span-1">
            <h4 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Your Roommate Connections</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-900 text-teal-300">
                {connections.length}
              </span>
            </h4>

            {connections.length === 0 ? (
              <div className="py-12 text-center text-teal-300/60 text-xs">
                No connections yet. Go to "Recommended Roommates" and send requests to students!
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[500px]">
                {connections.map((c) => {
                  const studentId = currentUser?.id || 6;
                  const isRequester = c.requesterStudentId === studentId;
                  const otherName = isRequester ? c.recipientName : c.requesterName;
                  const otherCollege = isRequester ? c.recipientCollege : c.requesterCollege;
                  const isAccepted = c.status === 'ACCEPTED';
                  const isSelected = activeChatConnection?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => isAccepted && openChatForConnection(c)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400'
                          : 'bg-[#081d21] border-teal-800/80 hover:border-teal-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{otherName}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          c.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' :
                          c.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-700/60' :
                          'bg-red-950 text-red-300 border border-red-700/60'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-teal-300/70 truncate mt-0.5">{otherCollege}</div>

                      {/* Request action buttons for incoming pending */}
                      {!isRequester && c.status === 'PENDING' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-teal-800">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateConnection(c.id, 'ACCEPTED'); }}
                            className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                          >
                            Accept & Chat
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateConnection(c.id, 'REJECTED'); }}
                            className="py-1 px-3 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-[11px]"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="text-[10px] text-teal-400 font-semibold mt-2 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>Mutual Match • Click to Open Private Chat</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Private 1-to-1 Chat Window */}
          <div className="bg-[#0b2b32] border border-teal-800 rounded-3xl p-5 flex flex-col justify-between h-[580px] lg:col-span-2">
            {activeChatConnection && activeChatConnection.status === 'ACCEPTED' ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-teal-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center font-bold text-white text-sm">
                      {activeChatConnection.recipientName?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">
                        {activeChatConnection.requesterStudentId === (currentUser?.id || 6) 
                          ? activeChatConnection.recipientName 
                          : activeChatConnection.requesterName}
                      </h5>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Mutually Verified Roommates • End-to-End Private Chat</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                  {chatMessages.length === 0 ? (
                    <div className="py-20 text-center text-teal-300/60 text-xs">
                      Say hello! Discuss move-in dates, PG budget splits, and check rooms together.
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => {
                      const isMe = msg.senderStudentId === (currentUser?.id || 6);
                      return (
                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                            isMe 
                              ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md' 
                              : 'bg-[#081d21] border border-teal-800 text-white rounded-bl-none shadow'
                          }`}>
                            <p>{msg.content}</p>
                          </div>
                          <span className="text-[9px] text-teal-400/60 mt-0.5 px-1">{msg.sentAt?.split('T')[1]?.slice(0, 5) || "Just now"}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-teal-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type a message to your roommate match..."
                    className="flex-1 bg-[#081d21] border border-teal-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-md cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-40 text-center space-y-3 text-teal-300/70 text-xs">
                <ShieldCheck className="w-12 h-12 text-teal-500 mx-auto opacity-40" />
                <h5 className="font-bold text-white text-base">Private Chat Locked</h5>
                <p className="max-w-md mx-auto">
                  For safety and privacy, 1-to-1 chat is strictly unlocked only after both students accept each other's connection request.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FIND PG TOGETHER (COMBINED BUDGET DISCOVERY)
      ========================================================================= */}
      {activeSubTab === 'find-together' && (
        <div className="space-y-6">
          <div className="bg-[#0b2b32] border border-teal-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-teal-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-6 h-6 text-amber-400" />
                <span>Find Shared PG Together (Combined Budget Engine)</span>
              </h3>
              <p className="text-xs text-teal-300/80 mt-1">
                Pool your monthly accommodation budget with your roommate to unlock larger 2-sharing suites, balcony rooms, and prime campus locations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-teal-300 font-semibold block mb-1">Your Monthly Budget</label>
                <div className="flex items-center gap-2 bg-[#081d21] p-3 rounded-xl border border-teal-700">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                  <input
                    type="number"
                    value={myBudgetValue}
                    onChange={(e) => setMyBudgetValue(Number(e.target.value))}
                    step="500"
                    className="w-full bg-transparent font-bold text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">Roommate's Monthly Budget</label>
                <div className="flex items-center gap-2 bg-[#081d21] p-3 rounded-xl border border-teal-700">
                  <IndianRupee className="w-4 h-4 text-cyan-400" />
                  <input
                    type="number"
                    value={partnerBudgetValue}
                    onChange={(e) => setPartnerBudgetValue(Number(e.target.value))}
                    step="500"
                    className="w-full bg-transparent font-bold text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-teal-300 font-semibold block mb-1">Combined Purchasing Power</label>
                <div className="p-3 rounded-xl bg-gradient-to-r from-teal-900 to-[#12424b] border border-amber-400/50 flex items-center justify-between">
                  <span className="font-extrabold text-amber-300 text-base">
                    ₹{(myBudgetValue + partnerBudgetValue).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={handleSearchSharedPgs}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow"
                  >
                    Search Rooms
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shared PG Results */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">
              Shared Accommodations Fitting Combined Budget ({sharedPgMatches.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sharedPgMatches.map((pg) => (
                <div
                  key={pg.id}
                  className="bg-[#0b2b32] border border-teal-800 rounded-2xl overflow-hidden hover:border-amber-400 transition-all flex flex-col justify-between shadow-lg"
                >
                  <img
                    src={pg.coverImage}
                    alt={pg.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h5 className="font-bold text-white text-base truncate">{pg.name}</h5>
                    <div className="text-xs text-teal-300/80">{pg.locality}, {pg.city}</div>
                    
                    <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800 text-xs flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-teal-400/70">Per-Bed Rent</div>
                        <div className="font-black text-white text-sm">₹{pg.monthlyRent?.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-teal-400/70">Double Room Total</div>
                        <div className="font-black text-amber-400 text-sm">₹{(pg.monthlyRent * 2)?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPg && onSelectPg(pg)}
                      className="w-full py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Shared Room Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ROOMMATE WANTED (VACANT BEDS)
      ========================================================================= */}
      {activeSubTab === 'wanted' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">Vacant Bed Vacancies Posted by Students</h4>
              <p className="text-xs text-teal-300/80">Students with existing rooms looking for a co-tenant to split rent.</p>
            </div>
            <button
              onClick={() => setShowPostWantedModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Post Vacant Bed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wantedListings.map((item) => (
              <div
                key={item.id}
                className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-5 space-y-3 hover:border-teal-600 transition-colors shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/40">
                      {item.vacantBeds} Bed Vacant
                    </span>
                    <h5 className="font-bold text-white text-sm mt-1.5">{item.pgName}</h5>
                    <div className="text-xs text-teal-300/80">{item.locality}, {item.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-teal-300/70">Rent / share</div>
                    <div className="text-base font-black text-emerald-400">₹{item.rentPerPerson?.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-[#081d21] p-3 rounded-xl border border-teal-800/80">
                  "{item.roomDescription}"
                </p>

                <div className="pt-2 border-t border-teal-800 text-[11px] text-teal-300/80 flex items-center justify-between">
                  <div>
                    <span>Posted by: </span>
                    <strong className="text-white">{item.studentName}</strong>
                    <div className="text-[10px] text-teal-400/60">{item.studentCollege}</div>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold">Avail: {item.availableFrom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Request Modal */}
      {requestTargetProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2b32] border border-teal-600 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>Connect with {requestTargetProfile.fullName}</span>
            </h4>
            <p className="text-xs text-teal-300/80">
              Add a friendly note to introduce yourself, mention your course, target move-in date, and why you feel you would make great roommates.
            </p>

            <textarea
              rows={3}
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Hey! I study CS at ABES EC and love quiet study hours. Would love to explore shared PGs near campus together..."
              className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-3 text-xs text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRequestTargetProfile(null)}
                className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold cursor-pointer shadow"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Vacant Bed Modal */}
      {showPostWantedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2b32] border border-teal-600 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-amber-400" />
              <span>Post a Vacant Bed in Your Current PG</span>
            </h4>

            <form onSubmit={handlePostWanted} className="space-y-3 text-xs">
              <div>
                <label className="text-teal-300 block mb-1 font-semibold">PG / Stay Name</label>
                <input
                  type="text"
                  value={newWanted.pgName}
                  onChange={(e) => setNewWanted({ ...newWanted, pgName: e.target.value })}
                  placeholder="e.g. Sunrise PG Anand Nagar"
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-teal-300 block mb-1 font-semibold">City</label>
                  <select
                    value={newWanted.city}
                    onChange={(e) => setNewWanted({ ...newWanted, city: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Ghaziabad">Ghaziabad & Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Kota">Kota</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-300 block mb-1 font-semibold">Locality</label>
                  <input
                    type="text"
                    value={newWanted.locality}
                    onChange={(e) => setNewWanted({ ...newWanted, locality: e.target.value })}
                    placeholder="e.g. Kothrud / Baner"
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-teal-300 block mb-1 font-semibold">Monthly Rent per Person (₹)</label>
                  <input
                    type="number"
                    value={newWanted.rentPerPerson}
                    onChange={(e) => setNewWanted({ ...newWanted, rentPerPerson: Number(e.target.value) })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-teal-300 block mb-1 font-semibold">Available Move-in Date</label>
                  <input
                    type="date"
                    value={newWanted.availableFrom}
                    onChange={(e) => setNewWanted({ ...newWanted, availableFrom: e.target.value })}
                    className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-teal-300 block mb-1 font-semibold">Room Description & Facilities</label>
                <textarea
                  rows={2}
                  value={newWanted.roomDescription}
                  onChange={(e) => setNewWanted({ ...newWanted, roomDescription: e.target.value })}
                  placeholder="Spacious double sharing AC room with attached washroom, study desks, and high-speed Wi-Fi..."
                  className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostWantedModal(false)}
                  className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer shadow"
                >
                  Post Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
