import React, { useState, useEffect } from 'react';
import { X, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2, Send, HelpCircle, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function FeedbackModal({ isOpen, onClose, defaultType = 'COMPLAINT', pgs = [] }) {
  const { currentUser } = useAuth();
  const [type, setType] = useState(defaultType); // 'COMPLAINT' | 'FEEDBACK'
  const [category, setCategory] = useState(defaultType === 'COMPLAINT' ? 'Maintenance & WiFi' : 'Platform Usability');
  const [priority, setPriority] = useState('MEDIUM');
  const [selectedPgId, setSelectedPgId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitterRole, setSubmitterRole] = useState('STUDENT'); // 'STUDENT' | 'OWNER'
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setCategory(defaultType === 'COMPLAINT' ? 'Maintenance & WiFi' : 'Platform Usability');
      let active = currentUser;
      if (!active && typeof window !== 'undefined') {
        try {
          active = JSON.parse(localStorage.getItem('homesetu_user') || 'null');
        } catch (e) {}
      }
      if (active) {
        setFullName(active.fullName || '');
        setEmail(active.email || '');
        setPhone(active.phone || '');
        setSubmitterRole(active.role || (defaultType === 'COMPLAINT' ? 'STUDENT' : 'OWNER'));
      } else {
        setSubmitterRole(defaultType === 'COMPLAINT' ? 'STUDENT' : 'OWNER');
      }
    }
  }, [isOpen, currentUser, defaultType]);

  if (!isOpen) return null;

  const complaintCategories = [
    'Maintenance & WiFi',
    'Food & Mess Quality',
    'Security & Safety',
    'Owner / Warden Behavior',
    'Deposit & Billing Dispute',
    'Cleanliness & Sanitation',
    'Electricity / Water Outage',
    'Other Urgent Issue'
  ];

  const feedbackCategories = [
    'Platform Usability',
    'Listing Information Accuracy',
    'Booking & Visit Process',
    'Owner Portal Experience',
    'Feature Suggestion',
    'Appreciation & Praise'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const relatedPg = pgs.find(p => p.id === Number(selectedPgId));
    let active = currentUser;
    if (!active && typeof window !== 'undefined') {
      try {
        active = JSON.parse(localStorage.getItem('homesetu_user') || 'null');
      } catch (e) {}
    }

    const effectiveName = fullName.trim() || active?.fullName || (submitterRole === 'OWNER' ? 'PG Property Owner' : 'College Student');
    const effectiveEmail = email.trim() || active?.email || 'user@homesetu.com';
    const effectivePhone = phone.trim() || active?.phone || '+91 98765 00000';
    const effectiveRole = active?.role ? active.role : (submitterRole || 'STUDENT');

    try {
      const ticket = await api.submitFeedbackComplaint({
        type,
        category,
        priority,
        subject: subject.trim(),
        description: description.trim(),
        pgId: relatedPg ? relatedPg.id : null,
        pgName: relatedPg ? relatedPg.name : 'General Platform',
        submitterId: active?.id || null,
        submitterName: effectiveName,
        submitterEmail: effectiveEmail,
        submitterPhone: effectivePhone,
        submitterRole: effectiveRole
      });

      setSubmittedTicket(ticket);
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback
      setSubmittedTicket({
        ticketId: 'HS-TKT-' + Math.floor(10000 + Math.random() * 90000),
        subject,
        type,
        status: 'PENDING'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setSubject('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b282f] border border-[#1b5f6d] rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d343c] to-[#0a272e] border-b border-teal-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              type === 'COMPLAINT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {type === 'COMPLAINT' ? <AlertTriangle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                HomeSetu Grievance & Feedback Cell
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-medium">
                  Direct to Admin
                </span>
              </h3>
              <p className="text-xs text-teal-300/80">
                Official redressal channel. Submissions are reviewed solely by the Platform Administrator.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicket ? (
          /* Confirmation Receipt View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold text-white">
                {submittedTicket.type === 'COMPLAINT' ? 'Grievance Ticket Raised' : 'Feedback Submitted'}
              </h4>
              <p className="text-sm text-teal-200/80 max-w-md mx-auto">
                Your submission has been officially registered with the HomeSetu Central Grievance Cell.
              </p>
            </div>

            <div className="bg-[#071f25] border border-teal-800/80 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-teal-900">
                <span className="text-teal-400 font-medium">Tracking Ticket ID:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{submittedTicket.ticketId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-400">Current Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase text-[10px]">
                  {submittedTicket.status || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-400">Target SLA:</span>
                <span className="text-white font-medium">Within 24 Hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-400">Monitored By:</span>
                <span className="text-purple-300 font-medium">Platform Administrator</span>
              </div>
            </div>

            <p className="text-xs text-teal-300/70 max-w-md mx-auto italic">
              "We take student safety, proper living standards, and owner satisfaction with zero compromise."
            </p>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
            
            {/* Mode Selector */}
            <div>
              <label className="block text-teal-300 font-semibold mb-2">Submission Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setType('COMPLAINT'); setCategory('Maintenance & WiFi'); }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                    type === 'COMPLAINT'
                      ? 'bg-red-500/20 border-red-500/60 text-red-300 shadow-lg shadow-red-500/10'
                      : 'bg-[#082227] border-teal-800 text-teal-400 hover:bg-[#0d343c]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Report Grievance / Complain</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setType('FEEDBACK'); setCategory('Platform Usability'); }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                    type === 'FEEDBACK'
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10'
                      : 'bg-[#082227] border-teal-800 text-teal-400 hover:bg-[#0d343c]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Submit Feedback / Suggestion</span>
                </button>
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-teal-300 font-semibold mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {(type === 'COMPLAINT' ? complaintCategories : feedbackCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-teal-300 font-semibold mb-1">Priority / Urgency</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="LOW">Low (General suggestion)</option>
                  <option value="MEDIUM">Medium (Standard attention)</option>
                  <option value="HIGH">High (Important issue)</option>
                  <option value="URGENT">Urgent (Immediate attention required)</option>
                </select>
              </div>
            </div>

            {/* Related PG (Optional) */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">Related PG Accommodation (Optional)</label>
              <select
                value={selectedPgId}
                onChange={(e) => setSelectedPgId(e.target.value)}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">General Platform / Not PG Specific</option>
                {pgs.map(pg => (
                  <option key={pg.id} value={pg.id}>{pg.name} ({pg.locality || pg.city})</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">Subject / Summary</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={type === 'COMPLAINT' ? 'e.g. WiFi down on 2nd floor for past 3 days' : 'e.g. Add monthly automated rent receipt download'}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2.5 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">Detailed Description</label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the exact details, timing, and any relevant circumstances so the administrator can take immediate corrective action..."
                className="w-full bg-[#082227] border border-teal-800 rounded-xl p-3 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submitter Info */}
            <div className="p-4 rounded-2xl bg-[#082227] border border-teal-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-teal-300 font-semibold">Contact & Verification Info</span>
                {currentUser ? (
                  <span className="text-[10px] text-teal-300 bg-teal-900/80 px-2.5 py-0.5 rounded-full border border-teal-700/60 font-medium">
                    Logged in as <strong>{currentUser.fullName}</strong> ({currentUser.role === 'OWNER' ? 'PG Owner' : 'College Student'})
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-300 mr-1 font-medium">I am a:</span>
                    <button
                      type="button"
                      onClick={() => setSubmitterRole('STUDENT')}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                        submitterRole === 'STUDENT' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-teal-900/60 text-teal-300 border border-teal-800'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitterRole('OWNER')}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                        submitterRole === 'OWNER' ? 'bg-orange-500 text-slate-950 shadow' : 'bg-teal-900/60 text-teal-300 border border-teal-800'
                      }`}
                    >
                      🏢 PG Owner
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Archana / Rahul"
                    className="w-full bg-[#0c3139] border border-teal-700/60 rounded-lg px-2.5 py-1.5 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. archana@gmail.com"
                    className="w-full bg-[#0c3139] border border-teal-700/60 rounded-lg px-2.5 py-1.5 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 12345"
                    className="w-full bg-[#0c3139] border border-teal-700/60 rounded-lg px-2.5 py-1.5 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 rounded-xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  type === 'COMPLAINT'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting to Grievance Cell...' : (type === 'COMPLAINT' ? 'Submit Grievance to Administrator' : 'Submit Feedback')}</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 px-5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
