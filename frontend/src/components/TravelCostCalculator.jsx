import React, { useState } from 'react';
import { 
  Car, Bike, Bus, Train, Footprints, Fuel, Calendar, 
  IndianRupee, Calculator, CheckCircle2, Info, ArrowRight, 
  MapPin, Clock, Gauge, ShieldAlert, Sparkles, Sliders
} from 'lucide-react';
import { MASTER_COLLEGES, calculateGeoDistance, calculateCommuteOptions } from '../api';

export default function TravelCostCalculator({ pg, selectedCollege, onSelectCollege }) {
  const [collegeName, setCollegeName] = useState(
    selectedCollege || (MASTER_COLLEGES.find(c => c.city.toLowerCase() === pg.city.toLowerCase())?.name || MASTER_COLLEGES[0].name)
  );
  
  const [selectedMode, setSelectedMode] = useState('BIKE'); // 'AUTO' | 'BIKE' | 'CAB' | 'BUS' | 'METRO' | 'WALK'
  
  // Customization controls
  const [bikeMileage, setBikeMileage] = useState(45); // km/L
  const [fuelPrice, setFuelPrice] = useState(96.72); // ₹/L
  const [workingDays, setWorkingDays] = useState(24); // days/month
  const [otherPersonalExpense, setOtherPersonalExpense] = useState(2000); // ₹/mo
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Find college object
  const collegeObj = MASTER_COLLEGES.find(c => c.name === collegeName) || MASTER_COLLEGES[0];

  // Calculate distance
  const distanceKm = calculateGeoDistance(
    pg.latitude || pg.lat || 18.5074, 
    pg.longitude || pg.lng || 73.8077, 
    collegeObj.lat, 
    collegeObj.lng
  );

  // Commute options
  const commute = calculateCommuteOptions(distanceKm, { bikeMileage, fuelPrice, workingDays });
  const activeOption = commute[selectedMode] || commute.BIKE;

  // Living cost breakdown
  const rent = pg.monthlyRent || 8000;
  const foodCost = pg.foodIncluded ? 0 : 3500;
  const monthlyTravel = activeOption.monthlyCost;
  const totalLivingExpenses = rent + foodCost + monthlyTravel + otherPersonalExpense;

  const handleCollegeChange = (newName) => {
    setCollegeName(newName);
    if (onSelectCollege) onSelectCollege(newName);
  };

  return (
    <div className="bg-[#082227] border border-[#17525e] rounded-2xl p-5 sm:p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-800/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Smart Travel Cost & Living Expense Calculator
            </h4>
          </div>
          <p className="text-xs text-teal-300/80 mt-1">
            Exact distance and daily/monthly commute breakdown from <strong className="text-white">{pg.name}</strong> to your campus.
          </p>
        </div>

        {/* Live vs Estimated Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/60 text-[11px] text-teal-300">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Fares: Standard State RTO & Metro Tariff Rates</span>
        </div>
      </div>

      {/* College Selection Row */}
      <div className="bg-[#0b2b32] border border-teal-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px]">
          <label className="block text-xs font-semibold text-teal-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Select Your College / University:
          </label>
          <select
            value={collegeName}
            onChange={(e) => handleCollegeChange(e.target.value)}
            className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {MASTER_COLLEGES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.locality}, {c.city})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 bg-[#081d21] px-4 py-2.5 rounded-xl border border-teal-800">
          <div>
            <div className="text-[11px] text-teal-300/70">Campus Distance</div>
            <div className="text-lg font-extrabold text-amber-400 flex items-center gap-1">
              <span>{distanceKm} km</span>
            </div>
          </div>
          <div className="h-8 w-px bg-teal-800/80" />
          <div>
            <div className="text-[11px] text-teal-300/70">Est. Travel Time</div>
            <div className="text-lg font-extrabold text-teal-200 flex items-center gap-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{activeOption.timeMin} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Mode Tabs */}
      <div>
        <label className="block text-xs font-semibold text-teal-300 mb-2">
          Choose Commute Mode:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'WALK', label: 'Walk', icon: Footprints, color: 'emerald' },
            { id: 'BIKE', label: 'Own Bike', icon: Bike, color: 'amber' },
            { id: 'BUS', label: 'City Bus', icon: Bus, color: 'cyan' },
            { id: 'METRO', label: 'Metro', icon: Train, color: 'purple' },
            { id: 'AUTO', label: 'Auto', icon: Car, color: 'orange' },
            { id: 'CAB', label: 'Cab', icon: Car, color: 'blue' }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            const modeData = commute[mode.id];
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                    : 'bg-[#0b2b32] border-teal-800 text-teal-300/80 hover:bg-[#0e3740] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-teal-400'}`} />
                <span className="text-xs font-bold">{mode.label}</span>
                <span className="text-[10px] text-teal-200/90 font-medium">
                  ₹{modeData.monthlyCost}/mo
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Mode Detailed Breakdown & Live Rate Note */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0b2b32] p-4 rounded-xl border border-teal-800/80">
          <div className="text-xs text-teal-300/70">One-Way Fare</div>
          <div className="text-2xl font-black text-white mt-1">
            ₹{activeOption.oneWayFare}
          </div>
          <div className="text-[11px] text-teal-300/60 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> ~{activeOption.timeMin} mins commute
          </div>
        </div>

        <div className="bg-[#0b2b32] p-4 rounded-xl border border-teal-800/80">
          <div className="text-xs text-teal-300/70">Daily Round-Trip (2 Trips)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            ₹{activeOption.dailyRoundTrip}
          </div>
          <div className="text-[11px] text-teal-300/60 mt-1">
            To & from college daily
          </div>
        </div>

        <div className="bg-[#0b2b32] p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-[#0b2b32] to-[#12424b]">
          <div className="text-xs text-amber-300 font-semibold flex items-center justify-between">
            <span>Monthly Commute Cost</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              {workingDays} Days
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ₹{activeOption.monthlyCost?.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-teal-200/70 mt-1">
            {activeOption.fareFormulaBadge}
          </div>
        </div>
      </div>

      {/* Customizer Toggle */}
      <div className="border-t border-teal-800/60 pt-3">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showCustomizer ? 'Hide Fuel & Working Days Customizer' : 'Customize Bike Mileage, Fuel Rate & College Days'}</span>
        </button>

        {showCustomizer && (
          <div className="mt-3 p-4 rounded-xl bg-[#0b2b32] border border-teal-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-teal-300 font-medium block mb-1">
                Bike Mileage ({bikeMileage} km/L)
              </label>
              <input
                type="range"
                min="25"
                max="65"
                step="1"
                value={bikeMileage}
                onChange={(e) => setBikeMileage(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-teal-400/70">Standard student 125cc commuter: 45 km/L</span>
            </div>

            <div>
              <label className="text-teal-300 font-medium block mb-1">
                Fuel Price (₹{fuelPrice}/L)
              </label>
              <input
                type="range"
                min="88"
                max="110"
                step="0.5"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-teal-400/70">Current local petrol average</span>
            </div>

            <div>
              <label className="text-teal-300 font-medium block mb-1">
                College Days / Month ({workingDays} Days)
              </label>
              <input
                type="range"
                min="16"
                max="28"
                step="1"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-teal-400/70">Excluding Sundays and holidays</span>
            </div>
          </div>
        )}
      </div>

      {/* Total Monthly Living Expenses Card (Rent + Food + Travel + Personal) */}
      <div className="bg-gradient-to-br from-[#0c363f] to-[#09252b] border-2 border-amber-400/50 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div>
              <h5 className="font-bold text-white text-sm sm:text-base">
                Total Estimated Monthly Living Expenses
              </h5>
              <p className="text-[11px] text-teal-300/80">
                True cost-of-stay comparison factoring in PG Rent, Food, Commute, and Daily Life
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Total Monthly Budget</div>
            <div className="text-2xl font-black text-amber-400">
              ₹{totalLivingExpenses.toLocaleString('en-IN')}
              <span className="text-xs text-teal-300 font-normal"> / month</span>
            </div>
          </div>
        </div>

        {/* 4 Cost Pillars Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#081d21] p-3 rounded-xl border border-teal-800">
            <div className="text-teal-300/70 text-[11px]">1. PG Room Rent</div>
            <div className="font-bold text-white text-sm mt-0.5">₹{rent.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-teal-400/60 mt-0.5">Base accommodation</div>
          </div>

          <div className="bg-[#081d21] p-3 rounded-xl border border-teal-800">
            <div className="text-teal-300/70 text-[11px]">2. Food & Mess</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">
              {pg.foodIncluded ? "₹0 (Included)" : `₹${foodCost.toLocaleString('en-IN')}`}
            </div>
            <div className="text-[10px] text-teal-400/60 mt-0.5">
              {pg.foodIncluded ? "3 Daily Meals Covered" : "External Tiffin Sub."}
            </div>
          </div>

          <div className="bg-[#081d21] p-3 rounded-xl border border-teal-800">
            <div className="text-teal-300/70 text-[11px]">3. Travel to Campus</div>
            <div className="font-bold text-cyan-400 text-sm mt-0.5">
              ₹{monthlyTravel.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-teal-400/60 mt-0.5">
              Via {commute[selectedMode]?.name}
            </div>
          </div>

          <div className="bg-[#081d21] p-3 rounded-xl border border-teal-800">
            <div className="text-teal-300/70 text-[11px]">4. Misc / Laundry</div>
            <div className="font-bold text-purple-300 text-sm mt-0.5">
              ₹{otherPersonalExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-teal-400/60 mt-0.5">
              Supplies & Utilities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
