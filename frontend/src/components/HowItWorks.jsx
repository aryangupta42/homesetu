import React, { useState, useEffect } from 'react';
import { Search, Filter, GitCompare, Send, CheckCircle2, ShieldCheck, UserCheck, KeyRound, Building, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HowItWorks() {
  const { currentUser } = useAuth();
  
  const isStudent = currentUser?.role === 'STUDENT';
  const isOwner = currentUser?.role === 'OWNER';

  const [activeSide, setActiveSide] = useState(() => {
    if (isOwner) return 'owner';
    return 'student';
  });

  useEffect(() => {
    if (isStudent) setActiveSide('student');
    else if (isOwner) setActiveSide('owner');
  }, [isStudent, isOwner]);

  const studentSteps = [
    { num: 1, title: "Register / Login", desc: "Create your student profile with your college & verified email." },
    { num: 2, title: "Search PGs", desc: "Find listings by college (e.g. COEP, MIT), city, or locality." },
    { num: 3, title: "Apply Filters", desc: "Refine by budget, room sharing (single/double), AC, Wi-Fi, and food." },
    { num: 4, title: "View PG Details", desc: "Inspect real photos, house rules, gate closing time, and distance." },
    { num: 5, title: "Select Room", desc: "Check live bed availability and pick your desired room type." },
    { num: 6, title: "Send Booking Request", desc: "Submit your move-in date and college info directly to the owner." },
    { num: 7, title: "Wait for Owner Approval", desc: "Track application status in real-time on your student dashboard." },
    { num: 8, title: "Receive Confirmation ID", desc: "Get an official verified HomeSetu Confirmation ID (e.g. HS-2026-7842)." },
  ];

  const ownerSteps = [
    { num: 1, title: "Register / Login", desc: "Sign in with PG Owner credentials to access your host portal." },
    { num: 2, title: "Create PG Listing", desc: "Enter PG name, city, landmark colleges, and room types." },
    { num: 3, title: "Add Photos & Details", desc: "Upload room photos, specify rent, security deposit, and gate rules." },
    { num: 4, title: "Publish Listing", desc: "Make your PG visible to thousands of verified students." },
    { num: 5, title: "Receive Booking Request", desc: "Get notified when a student applies for an available bed." },
    { num: 6, title: "Review Student Details", desc: "Check student college, phone number, and move-in timeline." },
    { num: 7, title: "Accept / Reject", desc: "Make an informed decision with custom feedback notes." },
    { num: 8, title: "Generate Confirmation ID", desc: "System generates and signs a secure confirmation ID upon acceptance." },
  ];

  const currentSteps = activeSide === 'student' ? studentSteps : ownerSteps;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          How It Works
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          {isStudent ? (
            <>Student Journey — <span className="text-amber-400">Step by Step</span></>
          ) : isOwner ? (
            <>PG Owner Journey — <span className="text-orange-400">Step by Step</span></>
          ) : (
            <>Student & PG Owner Journey — <span className="text-amber-400">Step by Step</span></>
          )}
        </h2>
        <p className="text-teal-200/80 mt-3 text-sm sm:text-base">
          {isStudent 
            ? 'A transparent, structured workflow engineered for students to discover, visit, and book verified stays with 0% brokerage.'
            : isOwner
            ? 'A structured workflow engineered for PG owners to list rooms, verify property documents, and approve student requests directly.'
            : 'A transparent, structured workflow engineered to eliminate middlemen and ensure peace of mind.'}
        </p>

        {/* Role-based Flow Selector: Hide Owner flow when logged in as Student */}
        {!isStudent && !isOwner ? (
          <div className="mt-8 inline-flex p-1.5 bg-[#0a272e] border border-[#16515c] rounded-2xl">
            <button
              onClick={() => setActiveSide('student')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeSide === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              🎓 Student Side Flow
            </button>
            <button
              onClick={() => setActiveSide('owner')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeSide === 'owner'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              🏢 PG Owner Side Flow
            </button>
          </div>
        ) : isStudent ? (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>🎓 Student Flow (Owner Side Excluded)</span>
          </div>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>🏢 PG Owner Flow Active</span>
          </div>
        )}
      </div>

      {/* Process Pipeline Overview (Slide 3) */}
      <div className="bg-[#0b2c34] border border-[#16515c] rounded-2xl p-4 sm:p-6 mb-12 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 text-center mb-5">
          {activeSide === 'student' ? 'Student Booking & Verification Pipeline' : 'PG Owner Listing & Approval Pipeline'}
        </h3>
        {activeSide === 'student' ? (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Search</span>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Filter</span>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Compare</span>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Request</span>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-orange-950/70 text-orange-200 border border-orange-700/50">Owner Approval</span>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-md font-bold">Confirmation ID</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Create PG</span>
            <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Upload KYC</span>
            <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Receive Requests</span>
            <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-[#113e47] text-teal-200 border border-teal-700/50">Review Profile</span>
            <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-emerald-950/70 text-emerald-200 border border-emerald-700/50">Accept</span>
            <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="px-3.5 py-2 rounded-xl bg-orange-500 text-slate-950 shadow-md font-bold">Confirmation ID</span>
          </div>
        )}
      </div>

      {/* Step by Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentSteps.map((s) => (
          <div
            key={s.num}
            className="bg-gradient-to-b from-[#0c3139] to-[#082227] border border-[#17525e] rounded-2xl p-5 relative flex flex-col justify-between hover:border-amber-400/60 transition-all hover:-translate-y-1 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-sm flex items-center justify-center mb-3">
                {s.num}
              </div>
              <h4 className="font-bold text-white text-base mb-1.5 group-hover:text-amber-300 transition-colors">
                {s.title}
              </h4>
              <p className="text-xs text-teal-200/70 leading-relaxed">
                {s.desc}
              </p>
            </div>
            {s.num === 8 && (
              <div className="mt-3 pt-2 border-t border-amber-500/30 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Guaranteed Room Voucher
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Critical Rule Callout from Slide 5 */}
      <div className="mt-12 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-2xl p-5 sm:p-6 text-slate-950 shadow-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-white">
          <Info className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-extrabold text-base sm:text-lg text-white">
            Crucial Architecture Rule
          </h4>
          <p className="text-xs sm:text-sm text-slate-900 font-medium mt-0.5">
            Confirmation ID is generated <strong>strictly and only</strong> after the PG owner reviews the student profile and formally clicks "Accept". No random chats or fake claims.
          </p>
        </div>
      </div>
    </div>
  );
}
