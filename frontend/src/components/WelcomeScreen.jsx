import React, { useState } from 'react';
import { Home, ArrowRight, ShieldCheck, Compass, GitCompare, Sparkles, Building, GraduationCap, CheckCircle2, MapPin, Users, HeartHandshake, Lightbulb } from 'lucide-react';
import WhyBeneficialModal from './WhyBeneficialModal';

export default function WelcomeScreen({ onGetStarted, onSelectRole, onExploreAsGuest }) {
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  return (
    <div className="min-h-screen bg-[#07191d] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header / Branding Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20 ring-1 ring-white/20">
            <Home className="w-7 h-7 text-slate-950 font-black" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-teal-100 to-amber-300 bg-clip-text text-transparent">
              HomeSetu
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                Student Accommodation Bridge
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-teal-400" />
              <span className="text-[11px] text-teal-300/80">0% Brokerage</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreAsGuest}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-950/60 hover:bg-teal-900 border border-teal-700/50 text-teal-200 text-xs font-semibold transition-all hover:border-amber-400/50"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Explore PGs as Guest
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Sign In / Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-14 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/50 border border-teal-600/40 text-teal-200 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Direct Student-to-Owner Connect • Zero Middlemen</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Find Your Perfect Stay,{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Near Your Campus.
              </span>
            </h1>

            {/* Tagline & Description */}
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              A smarter way for students to discover, compare and book verified PG accommodations.
              Say goodbye to broker fees, hidden maintenance charges, and misleading room photos.
            </p>

            {/* Key Value Proposition Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#0b282e]/80 border border-[#144852] backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Owner Connection</h4>
                  <p className="text-[11px] text-teal-300/80">0% Commission, no broker interference</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#0b282e]/80 border border-[#144852] backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">100% Verified Properties</h4>
                  <p className="text-[11px] text-teal-300/80">KYC audited owners & physical safety checks</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#0b282e]/80 border border-[#144852] backdrop-blur-sm">
                <GitCompare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Side-by-Side PG Comparison</h4>
                  <p className="text-[11px] text-teal-300/80">Compare rent, food menu, AC & gate timings</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#0b282e]/80 border border-[#144852] backdrop-blur-sm">
                <GraduationCap className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Verifiable Confirmation ID</h4>
                  <p className="text-[11px] text-teal-300/80">Instant digital booking slip with tamper-proof ID</p>
                </div>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 hover:shadow-amber-500/40 active:translate-y-0 group cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreAsGuest}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#0d343c] hover:bg-[#13444e] border border-teal-600/40 text-teal-100 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:border-amber-400/60"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Browse 25+ Stays in NCR</span>
              </button>
            </div>

            {/* Popular Student Hubs Badges */}
            <div className="pt-3">
              <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                Popular Student Hubs & Campuses Covered:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                {[
                  'ABES Engineering College',
                  'Crossings Republik',
                  'Indirapuram',
                  'AKGEC Ghaziabad',
                  'KIET Group',
                  'Noida Sector 62',
                  'Galgotias Univ',
                  'COEP Pune'
                ].map((hub) => (
                  <span
                    key={hub}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0b282e] border border-teal-700/40 text-teal-200/90 font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {hub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Interactive Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glowing Border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/40 via-teal-500/40 to-orange-500/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Main Card Container */}
              <div className="relative bg-[#09252c] border border-teal-600/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 backdrop-blur-xl">
                
                {/* Header within Card */}
                <div className="flex items-center justify-between border-b border-teal-800/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Role-Based Access</h3>
                      <p className="text-[11px] text-teal-300/70">Select your persona to enter</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-900 text-teal-300 font-bold uppercase tracking-wider border border-teal-700/50">
                    Live Demo Ready
                  </span>
                </div>

                {/* 3 Persona Mini Cards */}
                <div className="space-y-3">
                  {/* Student Persona */}
                  <div 
                    onClick={() => onSelectRole ? onSelectRole('STUDENT') : onGetStarted()}
                    className="p-3.5 rounded-2xl bg-[#0c313a] hover:bg-[#12424e] border border-teal-700/40 hover:border-amber-400/50 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        🎓
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          College Student
                        </h4>
                        <p className="text-[11px] text-teal-300/80">
                          Search, compare & book stays near campus
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-teal-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* PG Owner Persona */}
                  <div 
                    onClick={() => onSelectRole ? onSelectRole('OWNER') : onGetStarted()}
                    className="p-3.5 rounded-2xl bg-[#0c313a] hover:bg-[#12424e] border border-teal-700/40 hover:border-orange-400/50 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-300 border border-orange-500/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        🏢
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                          PG Property Owner
                        </h4>
                        <p className="text-[11px] text-teal-300/80">
                          List rooms, manage requests & track occupancy
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-teal-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Admin Persona */}
                  <div 
                    onClick={() => onSelectRole ? onSelectRole('ADMIN') : onGetStarted()}
                    className="p-3.5 rounded-2xl bg-[#0c313a] hover:bg-[#12424e] border border-teal-700/40 hover:border-purple-400/50 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        🛡️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                          Platform Administrator
                        </h4>
                        <p className="text-[11px] text-teal-300/80">
                          Audit KYC documents & verify accommodations
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-teal-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Demo Stats Bar */}
                <div className="bg-[#061e23] border border-teal-800/60 rounded-2xl p-4 flex items-center justify-between text-center">
                  <div>
                    <p className="text-lg font-black text-amber-400">25+</p>
                    <p className="text-[10px] text-teal-300/70 uppercase font-semibold">PG Listings</p>
                  </div>
                  <div className="w-px h-8 bg-teal-800/80" />
                  <div>
                    <p className="text-lg font-black text-white">5</p>
                    <p className="text-[10px] text-teal-300/70 uppercase font-semibold">Demo Owners</p>
                  </div>
                  <div className="w-px h-8 bg-teal-800/80" />
                  <div>
                    <p className="text-lg font-black text-teal-300">5</p>
                    <p className="text-[10px] text-teal-300/70 uppercase font-semibold">Demo Students</p>
                  </div>
                </div>

                {/* Why It Is Beneficial Button (Features & Advantages) */}
                <button
                  onClick={() => setShowBenefitsModal(true)}
                  className="w-full py-3.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-teal-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-2 border-amber-400 hover:border-amber-300 text-amber-300 hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Why It Is Beneficial? (Features & Advantages)</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Why HomeSetu is Beneficial Modal (Detailed features & advantages breakdown) */}
      <WhyBeneficialModal
        isOpen={showBenefitsModal}
        onClose={() => setShowBenefitsModal(false)}
        onGetStarted={onGetStarted}
      />

      {/* Footer Info Strip */}
      <footer className="relative z-10 border-t border-[#12424e]/60 bg-[#061a1f]/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-teal-300/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 HomeSetu Platform. Connecting students with verified accommodations with 0% brokerage.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-amber-400 font-semibold">Spring Boot 3 + MySQL 8</span>
            <span>•</span>
            <span className="text-teal-300 font-semibold">React + Tailwind</span>
            <span>•</span>
            <button onClick={onExploreAsGuest} className="hover:text-white underline">Skip Welcome</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
