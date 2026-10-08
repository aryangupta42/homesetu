import React from 'react';
import { X, Check, Minus, Star, ShieldCheck, IndianRupee, Trash2, ArrowRight } from 'lucide-react';

export default function CompareModal({ compareList, removeFromCompare, onSelectPg, onClose }) {
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
