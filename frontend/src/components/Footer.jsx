import React from 'react';
import { Home, Heart, Mail, Shield, CheckCircle2, Sparkles, MapPin, Code2 } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    { name: "Arsh Mittal", isLeader: true, phone: "+91 87553 59505" },
    { name: "Aryan Gupta", isLeader: false, phone: "+91 95558 99137" },
    { name: "Divyanshi Mittal", isLeader: false, phone: "+91 93898 73080" },
    { name: "Manasvi Sharma", isLeader: false, phone: "+91 72480 27977" }
  ];

  const futureScopeItems = [
    "Preference-based PG recommendation engine",
    "Advanced owner & listing verification with DigiLocker",
    "Real-time chat between students & owners",
    "Maps integration for live commute & distance calculations",
    "Analytics dashboard for owners & college administrations",
    "Full-fledged institutional admin management module"
  ];

  return (
    <footer className="bg-[#06181b] border-t border-[#144852] text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Future Scope Section (Slide 9) */}
        <div className="bg-[#09252c] border border-teal-800/80 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Future Scope & Roadmap (Slide 9)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
            From Finding a Room to Finding a Place to Call Home
          </h3>
          <p className="text-xs sm:text-sm text-teal-300/80 mb-6 italic">
            "HomeSetu aims to make the transition to a new city simpler, more transparent and more student-friendly — a practical, achievable platform built by students, for students."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {futureScopeItems.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#061e23] border border-teal-900/80 text-xs text-teal-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Links & Team Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
                HomeSetu
              </span>
            </div>
            <p className="text-xs text-teal-300/80 leading-relaxed max-w-sm">
              A student-centric PG discovery and booking platform built with React.js, Spring Boot Java, and MySQL. Zero brokers, 100% transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-mono">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>React • Spring Boot 3 • Java 17 • REST APIs</span>
            </div>
          </div>

          {/* Team ByteBros */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Developed by TEAM - ByteBros
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-teal-200">
              {teamMembers.map((m, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className="font-semibold text-white">{m.name}</span>
                  {m.isLeader && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                      Team Leader
                    </span>
                  )}
                  <span className="text-xs text-teal-300/70 font-mono">({m.phone})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-teal-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-400/60">
          <div>
            © {new Date().getFullYear()} HomeSetu • Built for Students, By Students.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-teal-200">Zero Commission Model</span>
            <span>•</span>
            <span className="hover:text-teal-200">Verified Accommodations</span>
            <span>•</span>
            <span className="hover:text-teal-200">GitHub Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
