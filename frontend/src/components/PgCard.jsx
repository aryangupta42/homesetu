import React from 'react';
import { Star, ShieldCheck, MapPin, IndianRupee, Users, Wifi, Wind, Utensils, Bed, GitCompare, Eye, Check } from 'lucide-react';

export default function PgCard({ pg, onSelect, isCompared, toggleCompare }) {
  return (
    <div className="bg-[#0c3139] border border-[#17525e] hover:border-amber-400/60 rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-950/40 flex flex-col group">
      {/* Image with badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={pg.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"}
          alt={pg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c3139] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {pg.isVerified && (
            <span className="px-2.5 py-1 rounded-full bg-teal-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Stay
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${
            pg.genderType === 'GIRLS' ? 'bg-pink-900/80 text-pink-200 border border-pink-700/50' :
            pg.genderType === 'BOYS' ? 'bg-blue-900/80 text-blue-200 border border-blue-700/50' :
            'bg-purple-900/80 text-purple-200 border border-purple-700/50'
          }`}>
            {pg.genderType} PG
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{pg.rating?.toFixed(1) || "4.3"}</span>
          <span className="text-slate-400 text-[10px]">({pg.totalReviews || 12})</span>
        </div>

        {/* Available Rooms Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-[#092227]/90 border border-teal-700/50 text-teal-300 text-xs font-medium flex items-center gap-1">
          <Bed className="w-3.5 h-3.5 text-amber-400" />
          <span>{pg.availableRooms || 3} rooms available</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onSelect(pg)} 
              className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer"
            >
              {pg.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-teal-300/80 mt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-teal-200">{pg.locality}, {pg.city}</span>
          </div>

          {pg.nearbyColleges && (
            <p className="text-[11px] text-teal-300/60 mt-2 line-clamp-1">
              🎓 {pg.nearbyColleges}
            </p>
          )}

          {/* Key Amenities preview */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {pg.hasAc && (
              <span className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800 text-[11px] text-teal-300 flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> AC
              </span>
            )}
            {pg.hasWifi && (
              <span className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800 text-[11px] text-teal-300 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" /> Wi-Fi
              </span>
            )}
            {pg.foodIncluded && (
              <span className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800 text-[11px] text-teal-300 flex items-center gap-1">
                <Utensils className="w-3 h-3 text-amber-400" /> Meals
              </span>
            )}
            {pg.hasAttachedBath && (
              <span className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800 text-[11px] text-teal-300">
                Attached Bath
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-teal-800/60 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-teal-300/70">Starting at</div>
            <div className="text-xl font-extrabold text-white flex items-center">
              <span>₹{pg.monthlyRent?.toLocaleString('en-IN') || "7,500"}</span>
              <span className="text-xs font-normal text-teal-300/70 ml-1">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(pg); }}
              title="Add to Comparison matrix"
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-[#092227] text-teal-300 border-teal-700/60 hover:border-amber-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>

            {/* View Details */}
            <button
              onClick={() => onSelect(pg)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <span>View & Book</span>
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
