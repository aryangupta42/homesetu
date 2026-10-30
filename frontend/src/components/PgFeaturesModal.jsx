import React, { useState } from 'react';
import { X, Sparkles, Check, Plus, Trash2, Wifi, Wind, Zap, Bath, Shield, Shirt, Dumbbell, Utensils, Droplets, ArrowUpCircle, Fingerprint, Car, Flame, Brush, Clock, Save } from 'lucide-react';
import { api } from '../api';

export default function PgFeaturesModal({ isOpen, onClose, pg, onUpdateSuccess }) {
  if (!isOpen || !pg) return null;

  // Initialize amenity states from the PG
  const [hasWifi, setHasWifi] = useState(pg.hasWifi ?? true);
  const [hasAc, setHasAc] = useState(pg.hasAc ?? false);
  const [hasPowerBackup, setHasPowerBackup] = useState(pg.hasPowerBackup ?? true);
  const [hasAttachedBath, setHasAttachedBath] = useState(pg.hasAttachedBath ?? true);
  const [hasCctv, setHasCctv] = useState(pg.hasCctv ?? true);
  const [hasLaundry, setHasLaundry] = useState(pg.hasLaundry ?? true);
  const [hasGym, setHasGym] = useState(pg.hasGym ?? false);
  const [foodIncluded, setFoodIncluded] = useState(pg.foodIncluded ?? false);
  const [foodType, setFoodType] = useState(pg.foodType || 'Veg & Non-Veg');
  const [hasRoWater, setHasRoWater] = useState(pg.hasRoWater ?? true);
  const [hasLift, setHasLift] = useState(pg.hasLift ?? false);
  const [hasBiometric, setHasBiometric] = useState(pg.hasBiometric ?? false);
  const [hasParking, setHasParking] = useState(pg.hasParking ?? true);
  const [hasGeyser, setHasGeyser] = useState(pg.hasGeyser ?? true);
  const [hasHousekeeping, setHasHousekeeping] = useState(pg.hasHousekeeping ?? true);
  const [gateClosingTime, setGateClosingTime] = useState(pg.gateClosingTime || '10:30 PM');
  const [noticePeriodDays, setNoticePeriodDays] = useState(pg.noticePeriodDays || 30);
  const [houseRules, setHouseRules] = useState(pg.houseRules || '');

  // Parse existing custom features tags
  const initialCustomFeatures = () => {
    if (!pg.customFeatures) return [];
    if (Array.isArray(pg.customFeatures)) return pg.customFeatures;
    return pg.customFeatures.split(',').map(s => s.trim()).filter(Boolean);
  };

  const [customFeatures, setCustomFeatures] = useState(initialCustomFeatures);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddCustomFeature = (e) => {
    e?.preventDefault();
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    if (!customFeatures.includes(trimmed)) {
      setCustomFeatures([...customFeatures, trimmed]);
    }
    setNewFeatureText('');
  };

  const handleRemoveCustomFeature = (featureToRemove) => {
    setCustomFeatures(customFeatures.filter(f => f !== featureToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedData = {
      ...pg,
      hasWifi,
      hasAc,
      hasPowerBackup,
      hasAttachedBath,
      hasCctv,
      hasLaundry,
      hasGym,
      foodIncluded,
      foodType,
      hasRoWater,
      hasLift,
      hasBiometric,
      hasParking,
      hasGeyser,
      hasHousekeeping,
      gateClosingTime,
      noticePeriodDays: Number(noticePeriodDays),
      houseRules,
      customFeatures: customFeatures.join(', ')
    };

    try {
      const savedPg = await api.updatePg(pg.id, updatedData);
      setSavedSuccess(true);
      if (onUpdateSuccess) {
        onUpdateSuccess(savedPg || updatedData);
      }
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Failed to update PG features:", err);
      // Fallback
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedData);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const amenities = [
    { label: 'High-Speed Wi-Fi', state: hasWifi, setter: setHasWifi, icon: Wifi },
    { label: 'Air Conditioning (AC)', state: hasAc, setter: setAc => setHasAc(setAc), icon: Wind },
    { label: '100% Power Backup', state: hasPowerBackup, setter: setHasPowerBackup, icon: Zap },
    { label: 'Attached Washroom', state: hasAttachedBath, setter: setHasAttachedBath, icon: Bath },
    { label: '24/7 CCTV Security', state: hasCctv, setter: setHasCctv, icon: Shield },
    { label: 'Laundry & Washer', state: hasLaundry, setter: setHasLaundry, icon: Shirt },
    { label: 'In-House Fitness Gym', state: hasGym, setter: setHasGym, icon: Dumbbell },
    { label: 'Daily Meals / Mess', state: foodIncluded, setter: setFoodIncluded, icon: Utensils },
    { label: 'RO Drinking Water', state: hasRoWater, setter: setHasRoWater, icon: Droplets },
    { label: 'Elevator / Lift', state: hasLift, setter: setHasLift, icon: ArrowUpCircle },
    { label: 'Biometric Access', state: hasBiometric, setter: setHasBiometric, icon: Fingerprint },
    { label: 'Vehicle Parking', state: hasParking, setter: setHasParking, icon: Car },
    { label: 'Geyser / Hot Water', state: hasGeyser, setter: setHasGeyser, icon: Flame },
    { label: 'Daily Housekeeping', state: hasHousekeeping, setter: setHasHousekeeping, icon: Brush },
  ];

  const suggestedFeatures = [
    '300 Mbps Fiber WiFi',
    'Study Table & Ergonomic Chair',
    'Rooftop Student Lounge',
    '24/7 Resident Warden',
    'Personal Refrigerator',
    'Microwave & Electric Kettle',
    'Balcony View Rooms',
    'Table Tennis & Gaming Area',
    'Solar Water Heating',
    'Late-Night Library / Reading Room'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Manage Separate Features for Property
              </h3>
              <p className="text-xs text-amber-400 font-semibold truncate max-w-md">
                {pg.name} ({pg.locality || pg.city})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Standard Amenities Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-200 text-sm">1. Toggle Standard Amenities</h4>
              <span className="text-[11px] text-teal-400">Click to enable / disable for this PG</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenities.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.setter(!item.state)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      item.state
                        ? 'bg-teal-900/60 border-teal-500/80 text-white shadow-sm'
                        : 'bg-[#082227] border-teal-900/80 text-teal-500 hover:bg-[#0c2f37]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${item.state ? 'text-amber-400' : 'text-teal-600'}`} />
                    <span className="text-xs font-medium truncate flex-1">{item.label}</span>
                    {item.state ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-teal-800 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Mess & Meal Options */}
          <div className="p-4 rounded-2xl bg-[#082227] border border-teal-800/80 space-y-3">
            <h4 className="font-bold text-teal-200 text-sm flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              2. Food & Kitchen Policy for this PG
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-teal-300 font-medium mb-1">Meal Provision</label>
                <select
                  value={foodIncluded ? 'YES' : 'NO'}
                  onChange={(e) => setFoodIncluded(e.target.value === 'YES')}
                  className="w-full bg-[#0b2b32] border border-teal-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="YES">Meals Included in Rent</option>
                  <option value="NO">No Meals / Self Cooking</option>
                </select>
              </div>

              <div>
                <label className="block text-teal-300 font-medium mb-1">Kitchen Type</label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-full bg-[#0b2b32] border border-teal-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Veg & Non-Veg">Veg & Non-Veg (Separate kitchens)</option>
                  <option value="Pure Veg">Pure Veg Only (Satvik / No Onion-Garlic option)</option>
                  <option value="Veg Only">Veg Only</option>
                  <option value="No Meals">No Meals Provided</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Custom Features & Facility Tags */}
          <div className="p-4 rounded-2xl bg-[#082227] border border-teal-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                3. Add Custom Features & USPs for this PG
              </h4>
              <span className="text-[11px] text-amber-400 font-mono">{customFeatures.length} Added</span>
            </div>

            <p className="text-teal-300/80 text-[11px]">
              Add any unique selling point for this property (e.g., 300 Mbps Fiber, Terrace Garden, Solar Geyser).
            </p>

            {/* Input to add tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomFeature(); } }}
                placeholder="Type a custom feature (e.g. Study Table & Ergonomic Chair)..."
                className="flex-1 bg-[#0b2b32] border border-teal-700 rounded-xl px-3 py-2 text-white placeholder-teal-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Current Custom Tags */}
            {customFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {customFeatures.map(feat => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/90 text-teal-200 border border-teal-700 text-xs font-semibold"
                  >
                    <span>✨ {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomFeature(feat)}
                      className="text-teal-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-teal-900/60">
              <span className="text-[11px] text-teal-400 block mb-1.5 font-medium">Quick Suggestions (Click to Add):</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedFeatures.map(sug => {
                  const alreadyAdded = customFeatures.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => !alreadyAdded && setCustomFeatures([...customFeatures, sug])}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                        alreadyAdded
                          ? 'opacity-40 bg-teal-950 border-teal-900 text-teal-600 cursor-not-allowed'
                          : 'bg-[#0d343c] hover:bg-[#154752] border-teal-700 text-teal-300'
                      }`}
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Timings & Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-teal-300 font-semibold mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Gate Closing Time
              </label>
              <input
                type="text"
                value={gateClosingTime}
                onChange={(e) => setGateClosingTime(e.target.value)}
                placeholder="e.g. 10:30 PM or No Curfew"
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-teal-300 font-semibold mb-1">Notice Period (Days)</label>
              <input
                type="number"
                value={noticePeriodDays}
                onChange={(e) => setNoticePeriodDays(e.target.value)}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-teal-300 font-semibold mb-1">House Rules & Safety Norms</label>
            <textarea
              rows="2"
              value={houseRules}
              onChange={(e) => setHouseRules(e.target.value)}
              placeholder="e.g. Visitors permitted till 7 PM. Quiet study hours after 10 PM. Biometric scan required."
              className="w-full bg-[#082227] border border-teal-800 rounded-xl p-2.5 text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Features Saved to PG!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes to PG...' : 'Save Features for this PG'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-teal-900 text-teal-300 font-bold text-xs hover:bg-teal-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
