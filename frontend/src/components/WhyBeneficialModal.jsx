import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, ShieldCheck, GitCompare, 
  GraduationCap, Building, Zap, ArrowRight, DollarSign, 
  FileCheck, Users, Eye, HelpCircle, Lock, Award
} from 'lucide-react';

export default function WhyBeneficialModal({ isOpen, onClose, onGetStarted }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'owner' | 'platform'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#082228] text-slate-100 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 border border-teal-600/40 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-teal-800/60 bg-[#061c21] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl shadow-lg shadow-amber-500/10">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Value Proposition & Capabilities
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900 text-teal-300 font-bold border border-teal-700/50">
                  Zero Brokerage
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Why HomeSetu is Beneficial?
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-teal-400 hover:text-white hover:bg-teal-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-6 pt-4 shrink-0 bg-[#082228]">
          <div className="grid grid-cols-3 gap-2 bg-[#05171a] p-1.5 rounded-2xl border border-teal-800/60 text-xs font-bold">
            <button
              onClick={() => setActiveTab('student')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-teal-200/80 hover:text-white hover:bg-teal-900/30'
              }`}
            >
              <span>🎓</span>
              <span className="truncate">For Students</span>
            </button>

            <button
              onClick={() => setActiveTab('owner')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'owner'
                  ? 'bg-orange-500 text-white shadow-md font-extrabold'
                  : 'text-teal-200/80 hover:text-white hover:bg-teal-900/30'
              }`}
            >
              <span>🏢</span>
              <span className="truncate">For PG Owners</span>
            </button>

            <button
              onClick={() => setActiveTab('platform')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'platform'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-teal-200/80 hover:text-white hover:bg-teal-900/30'
              }`}
            >
              <span>🛡️</span>
              <span className="truncate">Platform Tech</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: FOR STUDENTS */}
          {activeTab === 'student' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <p className="text-xs text-amber-200 font-medium leading-relaxed">
                  HomeSetu eliminates offline broker hassles, unverified listings, and surprise rent hikes for students near top NCR campuses.
                </p>
              </div>

              {/* Advantage 1 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-amber-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    0% Brokerage & Direct Connect
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Connect straight with verified PG hosts without middlemen. Save ₹10,000–₹25,000 in broker commission every single academic year.
                  </p>
                </div>
              </div>

              {/* Advantage 2 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-amber-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Side-by-Side PG Comparison
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Compare up to 3 properties side-by-side: monthly rent, food menu, AC availability, gate closing time, and distance to your college campus.
                  </p>
                </div>
              </div>

              {/* Advantage 3 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-amber-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Verifiable Digital Confirmation ID
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Once the PG owner approves your request, receive an official booking slip with a tamper-proof confirmation ID (e.g. HS-2026-7842) guaranteeing your reserved bed.
                  </p>
                </div>
              </div>

              {/* Advantage 4 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-amber-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    100% Verified Stays & Grievance Redressal
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Properties are verified via electricity deeds & KYC. If you ever face food or hygiene issues, submit a direct grievance ticket audited by platform administrators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOR PG OWNERS */}
          {activeTab === 'owner' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                <p className="text-xs text-orange-200 font-medium leading-relaxed">
                  HomeSetu empowers property owners to fill vacant beds directly with verified college students without giving cuts to brokers.
                </p>
              </div>

              {/* Owner Advantage 1 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-orange-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                    Direct Student Applications
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Receive verified booking applications directly from students studying at ABES, AKGEC, KIET, and Galgotias. No third-party agent cuts.
                  </p>
                </div>
              </div>

              {/* Owner Advantage 2 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-orange-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                    Per-PG Features & Amenities Customization
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Customize separate amenities and features for each of your properties — Power Backup, High-Speed Wi-Fi, Food Mess, CCTV, Biometric Entry, and Study Desks.
                  </p>
                </div>
              </div>

              {/* Owner Advantage 3 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-orange-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                    Centralized Room & Bed Inventory
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Track live vacant bed counts across Single, Double, and Triple sharing rooms with automatic occupancy calculations and instant status updates.
                  </p>
                </div>
              </div>

              {/* Owner Advantage 4 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-orange-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                    Verified Host Badge & Higher Bookings
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Gain parent trust with official HomeSetu Verified Host badges, audited property deeds, and prominent ranking in campus searches.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLATFORM & ARCHITECTURE */}
          {activeTab === 'platform' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <p className="text-xs text-teal-200 font-medium leading-relaxed">
                  Built on a robust full-stack architecture with enterprise security, strict role isolation, and real-time MySQL relational persistence.
                </p>
              </div>

              {/* Platform 1 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-teal-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    Strict Role-Based Access Control (RBAC)
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Three completely segregated portals for Student, Owner, and Platform Administrator with secure token-based authentication and database guardrails.
                  </p>
                </div>
              </div>

              {/* Platform 2 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-teal-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    Spring Boot 3 + MySQL 8 Relational Backend
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Production-grade RESTful APIs managing PGs, room options, bookings, and grievances with transactional consistency.
                  </p>
                </div>
              </div>

              {/* Platform 3 */}
              <div className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-700/40 hover:border-teal-400/50 transition-all flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    Instant 1-Click Evaluation Ecosystem
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                    Pre-seeded with 5 Students, 5 Owners, and 25 live PG listings across NCR colleges so you can evaluate all features immediately without tedious setup.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer CTAs */}
        <div className="p-5 sm:p-6 border-t border-teal-800/60 bg-[#061c21] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-teal-300/70 text-center sm:text-left">
            Ready to experience 0% brokerage accommodation?
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-teal-700/50 text-teal-200 hover:text-white hover:bg-teal-900/40 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onGetStarted) onGetStarted();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Choose Persona & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
