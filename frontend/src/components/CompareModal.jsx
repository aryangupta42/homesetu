import React from 'react';
import { X, Check, Minus, Star, ShieldCheck, IndianRupee, Trash2, ArrowRight, Award, Navigation, Calculator } from 'lucide-react';
import { calculateTrustScore, calculateGeoDistance, calculateCommuteOptions, MASTER_COLLEGES } from '../featuresData';

export default function CompareModal({ compareList, removeFromCompare, onSelectPg, onClose, selectedCollege }) {
  const targetCollege = selectedCollege || MASTER_COLLEGES[0];

  if (compareList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full p-6 text-center text-white space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold">No PGs in Comparison</h3>
          <p className="text-xs text-teal-300/80">
            Click the comparison icon on any PG card to compare up to 3 accommodations side-by-side!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const comparisonRows = [
    { label: "Starting Rent", render: (pg) => <span className="font-bold text-amber-400 text-base">₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo</span> },
    { 
      label: "Total Est. Living Cost", 
      render: (pg) => {
        const dist = calculateGeoDistance(
          pg.latitude || pg.lat || 18.5074,
          pg.longitude || pg.lng || 73.8077,
          targetCollege.lat,
          targetCollege.lng
        );
        const options = calculateCommuteOptions(dist, { bikeMileage: 45, fuelPrice: 96.72, workingDays: 24 });
        const rent = pg.monthlyRent || 8000;
        const food = pg.foodIncluded ? 0 : 3500;
        const travel = options.BIKE.monthlyCost;
        const misc = 1500;
        const total = rent + food + travel + misc;
        return (
          <div className="p-2 rounded-xl bg-[#082227] border border-amber-500/40 text-center">
            <div className="font-extrabold text-amber-300 text-base">₹{total.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-teal-300/70">/mo</span></div>
            <div className="text-[9px] text-teal-300/80 mt-0.5">Rent+Food+Travel+Misc</div>
          </div>
        );
      }
    },
    { 
      label: "HomeSetu Trust Score", 
      render: (pg) => {
        const score = calculateTrustScore(pg);
        return (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
              score >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              score >= 80 ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' :
              'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {score} / 100
            </span>
            <span className="text-[10px] text-teal-300/70">
              {score >= 90 ? "Top Trust" : score >= 80 ? "Verified Partner" : "Standard"}
            </span>
          </div>
        );
      }
    },
    {
      label: `Distance to ${targetCollege.name?.split(' ')[0] || "College"}`,
      render: (pg) => {
        const dist = calculateGeoDistance(
          pg.latitude || pg.lat || 18.5074,
          pg.longitude || pg.lng || 73.8077,
          targetCollege.lat,
          targetCollege.lng
        );
        return (
          <div className="flex flex-col items-center">
            <span className="font-bold text-white text-sm">{dist} km</span>
            <span className="text-[10px] text-teal-400/80">Commute route</span>
          </div>
        );
      }
    },
    {
      label: "Monthly Commute (Bike)",
      render: (pg) => {
        const dist = calculateGeoDistance(
          pg.latitude || pg.lat || 18.5074,
          pg.longitude || pg.lng || 73.8077,
          targetCollege.lat,
          targetCollege.lng
        );
        const options = calculateCommuteOptions(dist, { bikeMileage: 45, fuelPrice: 96.72, workingDays: 24 });
        return (
          <div className="flex flex-col items-center">
            <span className="font-bold text-amber-400 text-sm">₹{options.BIKE.monthlyCost.toLocaleString('en-IN')}/mo</span>
            <span className="text-[10px] text-teal-300/70">~{options.BIKE.durationMins} mins / trip</span>
          </div>
        );
      }
    },
    { label: "Security Deposit", render: (pg) => <span>₹{pg.securityDeposit?.toLocaleString('en-IN') || "15,000"}</span> },
    { label: "Location", render: (pg) => <span>{pg.locality}, {pg.city}</span> },
    { label: "PG Type", render: (pg) => <span className="font-semibold">{pg.genderType}</span> },
    { label: "Verified Status", render: (pg) => pg.isVerified ? <span className="text-teal-400 font-bold flex items-center justify-center gap-1"><ShieldCheck className="w-4 h-4" /> Verified</span> : <span className="text-slate-400">Standard</span> },
    { label: "Student Rating", render: (pg) => <div className="flex items-center justify-center gap-1 text-amber-400 font-bold"><Star className="w-4 h-4 fill-amber-400" /> {pg.rating} ({pg.totalReviews})</div> },
    { label: "Air Conditioning", render: (pg) => pg.hasAc ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-500 mx-auto" /> },
    { label: "High-Speed Wi-Fi", render: (pg) => pg.hasWifi ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-500 mx-auto" /> },
    { label: "Food / Meals", render: (pg) => pg.foodIncluded ? <span className="text-emerald-400 font-semibold">{pg.foodType || "Included"}</span> : <span className="text-slate-400">Not Included</span> },
    { label: "Laundry Facility", render: (pg) => pg.hasLaundry ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-500 mx-auto" /> },
    { label: "Attached Washroom", render: (pg) => pg.hasAttachedBath ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-500 mx-auto" /> },
    { label: "CCTV & Security", render: (pg) => pg.hasCctv ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-500 mx-auto" /> },
    { label: "Gate Closing Time", render: (pg) => <span className="text-amber-300 font-semibold">{pg.gateClosingTime || "10:30 PM"}</span> },
    { label: "Notice Period", render: (pg) => <span>{pg.noticePeriodDays || 30} Days</span> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-5xl w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              Compare Student Accommodations
            </h3>
            <p className="text-xs text-teal-300/80">
              Side-by-side evaluation matrix — Transparent rents, amenities & rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-teal-800">
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-teal-300/80 w-1/4">
                  Feature / Detail
                </th>
                {compareList.map(pg => (
                  <th key={pg.id} className="p-3 min-w-[200px]">
                    <div className="relative mb-2">
                      <img
                        src={pg.coverImage}
                        alt={pg.name}
                        className="w-full h-28 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeFromCompare(pg.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-white">{pg.name}</h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="border-b border-teal-800/50 hover:bg-teal-900/20 text-xs">
                  <td className="p-3 text-left font-semibold text-teal-200">
                    {row.label}
                  </td>
                  {compareList.map(pg => (
                    <td key={pg.id} className="p-3 text-teal-100">
                      {row.render(pg)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4"></td>
                {compareList.map(pg => (
                  <td key={pg.id} className="p-4">
                    <button
                      onClick={() => { onClose(); onSelectPg(pg); }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Select & Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
