import React from 'react';
import { Search, MapPin, IndianRupee, Users, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function HeroSection({ filters, setFilters, onSearchClick, openAuthModal }) {
  const cities = ["Pune", "Bengaluru", "Delhi", "Kota", "Mumbai"];

  const handleCitySelect = (cityName) => {
    setFilters(prev => ({ ...prev, city: cityName }));
  };

  const handleQuickTagClick = (tagKey, value) => {
    setFilters(prev => ({ ...prev, [tagKey]: value }));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#092227] via-[#0b2b32] to-[#081d21] pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#144852]">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/60 border border-teal-600/40 text-teal-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>TEAM ByteBros Presents HomeSetu</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Zero Brokerage • 100% Student Verified</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Connecting Students with the{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
            Right Place to Stay
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-teal-200/80 max-w-2xl mx-auto leading-relaxed">
          HomeSetu bridges the gap between students and PG owners with complete transparency, verified listings, side-by-side comparisons, and guaranteed Confirmation IDs.
        </p>

        {/* Role Selection Gateway Banner (As requested: pehle hi page puche as student, pg owner, admin) */}
        <div className="mt-8 max-w-3xl mx-auto bg-[#0a2930]/90 border border-teal-700/50 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-teal-800/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Strict Role Gateway</span>
              <h3 className="text-sm sm:text-base font-extrabold text-white">Who Are You? Select Your Role to Enter:</h3>
            </div>
            <span className="text-[10px] text-teal-300/80 bg-teal-950/60 border border-teal-800/80 px-2 py-0.5 rounded-full font-mono">
              Protected by ID & Password
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => openAuthModal && openAuthModal('login', 'STUDENT')}
              className="p-3 rounded-xl bg-[#082227] hover:bg-[#12424b] border border-teal-700/50 hover:border-amber-400 transition-all text-left flex items-center gap-3 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🎓
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">College Student</p>
                <p className="text-[10px] text-teal-300/70">Find PGs & Bookings</p>
              </div>
            </button>

            <button
              onClick={() => openAuthModal && openAuthModal('login', 'OWNER')}
              className="p-3 rounded-xl bg-[#082227] hover:bg-[#12424b] border border-teal-700/50 hover:border-orange-400 transition-all text-left flex items-center gap-3 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">PG Owner</p>
                <p className="text-[10px] text-teal-300/70">Manage PGs & Requests</p>
              </div>
            </button>

            <button
              onClick={() => openAuthModal && openAuthModal('login', 'ADMIN')}
              className="p-3 rounded-xl bg-[#082227] hover:bg-[#12424b] border border-teal-700/50 hover:border-purple-400 transition-all text-left flex items-center gap-3 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Administrator</p>
                <p className="text-[10px] text-teal-300/70">Audit & Verify PGs</p>
              </div>
            </button>
          </div>
        </div>

        {/* City Quick Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-teal-300/70 font-medium mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> Popular Cities:
          </span>
          {cities.map(c => (
            <button
              key={c}
              onClick={() => handleCitySelect(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filters.city === c
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-[#103b44] text-teal-200 hover:bg-[#164f5b] hover:text-white border border-teal-700/40'
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => handleCitySelect("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filters.city === "All" || !filters.city
                ? 'bg-teal-700 text-white'
                : 'bg-[#103b44]/60 text-teal-300/80 hover:bg-[#164f5b] border border-teal-700/30'
            }`}
          >
            All Cities
          </button>
        </div>

        {/* Main Search Box */}
        <div className="mt-8 bg-[#0c3139]/90 border border-[#1b5f6d] rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Query / Locality or College */}
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search city, college (e.g. COEP, MIT) or locality..."
                className="w-full pl-10 pr-3 py-3 bg-[#082227] border border-teal-800/80 rounded-xl text-white placeholder-teal-300/50 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Max Rent Selector */}
            <div className="sm:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <select
                value={filters.maxRent || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value ? Number(e.target.value) : null }))}
                className="w-full pl-10 pr-3 py-3 bg-[#082227] border border-teal-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                <option value="">Budget: Any Rent</option>
                <option value="6000">Rent ≤ ₹6,000</option>
                <option value="8000">Rent ≤ ₹8,000 (Popular)</option>
                <option value="10000">Rent ≤ ₹10,000</option>
                <option value="15000">Rent ≤ ₹15,000</option>
              </select>
            </div>

            {/* Gender Preference */}
            <div className="sm:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-400">
                <Users className="w-4 h-4" />
              </div>
              <select
                value={filters.genderType || 'All'}
                onChange={(e) => setFilters(prev => ({ ...prev, genderType: e.target.value }))}
                className="w-full pl-9 pr-2 py-3 bg-[#082227] border border-teal-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="BOYS">Boys PG</option>
                <option value="GIRLS">Girls PG</option>
                <option value="COED">Co-ed</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-2">
              <button
                onClick={onSearchClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group"
              >
                <span>Find PGs</span>
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick filter badges from Slide 3 */}
          <div className="mt-3 pt-3 border-t border-teal-800/50 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-300/80">
            <span className="font-medium text-teal-200">Quick Filters:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilters(p => ({ ...p, maxRent: p.maxRent === 8000 ? null : 8000 }))}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filters.maxRent === 8000 ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold' : 'border-teal-700/60 bg-[#082227] hover:border-teal-500'
                }`}
              >
                Rent ≤ ₹8,000
              </button>

              <button
                onClick={() => setFilters(p => ({ ...p, hasAc: !p.hasAc }))}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filters.hasAc ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold' : 'border-teal-700/60 bg-[#082227] hover:border-teal-500'
                }`}
              >
                AC Rooms
              </button>

              <button
                onClick={() => setFilters(p => ({ ...p, hasWifi: !p.hasWifi }))}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filters.hasWifi ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold' : 'border-teal-700/60 bg-[#082227] hover:border-teal-500'
                }`}
              >
                Wi-Fi
              </button>

              <button
                onClick={() => setFilters(p => ({ ...p, foodIncluded: !p.foodIncluded }))}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filters.foodIncluded ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold' : 'border-teal-700/60 bg-[#082227] hover:border-teal-500'
                }`}
              >
                Food Included
              </button>

              <button
                onClick={() => setFilters(p => ({ ...p, isVerified: !p.isVerified }))}
                className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  filters.isVerified ? 'bg-teal-400 text-slate-950 border-teal-400 font-semibold' : 'border-teal-700/60 bg-[#082227] hover:border-teal-500 text-teal-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
