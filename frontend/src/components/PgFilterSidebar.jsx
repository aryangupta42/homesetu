import React from 'react';
import { Filter, RotateCcw, ShieldCheck, IndianRupee, MapPin } from 'lucide-react';

export default function PgFilterSidebar({ filters, setFilters, onReset }) {
  const cities = ["All", "Pune", "Bengaluru", "Delhi", "Kota", "Mumbai"];

  const handleCheckboxChange = (field) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <aside className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-5 text-white space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-teal-800/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-teal-200">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
          City
        </label>
        <select
          value={filters.city || "All"}
          onChange={(e) => setFilters(p => ({ ...p, city: e.target.value }))}
          className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
        >
          {cities.map(c => (
            <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
          ))}
        </select>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
            Max Rent
          </label>
          <span className="text-xs font-bold text-amber-400">
            {filters.maxRent ? `₹${filters.maxRent.toLocaleString('en-IN')}/mo` : "Any Rent"}
          </span>
        </div>
        <input
          type="range"
          min="4000"
          max="20000"
          step="500"
          value={filters.maxRent || 20000}
          onChange={(e) => setFilters(p => ({ ...p, maxRent: Number(e.target.value) }))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-teal-400/60 mt-1">
          <span>₹4,000</span>
          <span>₹12,000</span>
          <span>₹20,000</span>
        </div>
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
          PG Type / Gender
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "All", label: "All Types" },
            { id: "BOYS", label: "Boys Only" },
            { id: "GIRLS", label: "Girls Only" },
            { id: "COED", label: "Co-ed" }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilters(p => ({ ...p, genderType: item.id }))}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                (filters.genderType || "All") === item.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-[#082227] text-teal-300 border-teal-800/80 hover:border-teal-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Stays Toggle */}
      <div className="pt-2 border-t border-teal-800/60">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Verified Stays Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={!!filters.isVerified}
            onChange={() => handleCheckboxChange('isVerified')}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Amenities */}
      <div className="pt-2 border-t border-teal-800/60 space-y-2.5">
        <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
          Amenities & Facilities
        </label>

        {[
          { key: 'hasAc', label: 'Air Conditioner (AC)' },
          { key: 'hasWifi', label: 'High-Speed Wi-Fi' },
          { key: 'foodIncluded', label: 'Food / Meals Included' },
          { key: 'hasLaundry', label: 'Laundry Service' },
          { key: 'hasAttachedBath', label: 'Attached Washroom' },
          { key: 'hasPowerBackup', label: 'Power Backup' },
          { key: 'hasGym', label: 'Gym Facility' }
        ].map(amenity => (
          <label key={amenity.key} className="flex items-center justify-between text-xs text-teal-200/90 cursor-pointer hover:text-white">
            <span>{amenity.label}</span>
            <input
              type="checkbox"
              checked={!!filters[amenity.key]}
              onChange={() => handleCheckboxChange(amenity.key)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
