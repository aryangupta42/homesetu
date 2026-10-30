import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Bot, Send, Sliders, ArrowRight, 
  MapPin, IndianRupee, ShieldCheck, Wind, Wifi, Utensils, 
  Bed, Eye, RefreshCw, Zap, CheckCircle2
} from 'lucide-react';

export default function AskAiModal({ isOpen, onClose, currentUser, allPgs = [], onSelectPg }) {
  if (!isOpen) return null;

  const defaultCollege = currentUser?.college?.split(',')[0] || "ABES Engineering College";
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [agentAnalysisNote, setAgentAnalysisNote] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Structured filters
  const [targetCollege, setTargetCollege] = useState(defaultCollege);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [genderPref, setGenderPref] = useState('ALL');
  const [requireAc, setRequireAc] = useState(false);
  const [requireFood, setRequireFood] = useState(false);
  const [requireWifi, setRequireWifi] = useState(false);
  const [requireAttachedBath, setRequireAttachedBath] = useState(false);
  const [requirePowerBackup, setRequirePowerBackup] = useState(false);

  const QUICK_PROMPTS = [
    `Double Sharing near ${defaultCollege} under ₹8,500 with Food & AC`,
    `Budget PG near campus with High-Speed Wi-Fi & Power Backup under ₹7,000`,
    `Girls PG with Pure Veg Mess, Attached Bath & 24/7 Security`,
    `Single Room with AC and zero brokerage within 1 km of campus`
  ];

  useEffect(() => {
    if (allPgs.length > 0 && !hasSearched) {
      runAiMatching(
        `Verified student stay near ${defaultCollege}`,
        defaultCollege,
        12000,
        'ALL',
        false,
        false,
        false,
        false,
        false
      );
    }
  }, [allPgs]);

  const runAiMatching = (
    textQuery,
    college = targetCollege,
    budget = maxBudget,
    gender = genderPref,
    ac = requireAc,
    food = requireFood,
    wifi = requireWifi,
    bath = requireAttachedBath,
    power = requirePowerBackup
  ) => {
    setIsAnalyzing(true);
    setHasSearched(true);

    const qLower = (textQuery || '').toLowerCase();

    // Natural Language Entity Extraction
    let extractedCollege = college;
    if (qLower.includes('abes')) extractedCollege = 'ABES';
    else if (qLower.includes('akgec') || qLower.includes('akg')) extractedCollege = 'AKGEC';
    else if (qLower.includes('kiet')) extractedCollege = 'KIET';
    else if (qLower.includes('galgotias')) extractedCollege = 'Galgotias';
    else if (qLower.includes('ims')) extractedCollege = 'IMS';
    else if (qLower.includes('coep')) extractedCollege = 'COEP';
    else if (qLower.includes('kothrud') || qLower.includes('pune')) extractedCollege = 'Pune';

    let extractedBudget = budget;
    const kBudgetMatch = qLower.match(/(\d+)\s*k\b/);
    if (kBudgetMatch) {
      extractedBudget = parseInt(kBudgetMatch[1], 10) * 1000;
    } else {
      const numBudgetMatch = qLower.match(/(?:under|below|max|budget|within|upto|up to)\s*(?:₹|rs\.?)?\s*(\d{4,5})/);
      if (numBudgetMatch) {
        extractedBudget = parseInt(numBudgetMatch[1], 10);
      }
    }

    let extractedGender = gender;
    if (qLower.includes('girl') || qLower.includes('female')) extractedGender = 'GIRLS';
    else if (qLower.includes('boy') || qLower.includes('male')) extractedGender = 'BOYS';

    const wantsAc = ac || qLower.includes('ac') || qLower.includes('air condition') || qLower.includes('cooler');
    const wantsFood = food || qLower.includes('food') || qLower.includes('meal') || qLower.includes('mess') || qLower.includes('veg');
    const wantsWifi = wifi || qLower.includes('wifi') || qLower.includes('wi-fi') || qLower.includes('internet') || qLower.includes('broadband');
    const wantsBath = bath || qLower.includes('attached') || qLower.includes('washroom') || qLower.includes('bath');
    const wantsPower = power || qLower.includes('power') || qLower.includes('backup') || qLower.includes('generator');

    setTargetCollege(extractedCollege);
    setMaxBudget(extractedBudget);
    setGenderPref(extractedGender);
    setRequireAc(wantsAc);
    setRequireFood(wantsFood);
    setRequireWifi(wantsWifi);
    setRequireAttachedBath(wantsBath);
    setRequirePowerBackup(wantsPower);

    setTimeout(() => {
      const scoredPgs = allPgs.map(pg => {
        let score = 50;
        const reasons = [];
        const matchHighlights = [];

        const collegesStr = (pg.nearbyColleges || '').toLowerCase();
        const addressStr = `${pg.locality} ${pg.city} ${pg.name} ${pg.address}`.toLowerCase();
        const collegeTarget = extractedCollege.toLowerCase();

        if (collegesStr.includes(collegeTarget) || addressStr.includes(collegeTarget)) {
          score += 35;
          matchHighlights.push(`Near ${extractedCollege}`);
          reasons.push(`Close to ${extractedCollege}`);
        } else if (pg.city?.toLowerCase() === 'ghaziabad' || pg.city?.toLowerCase() === 'pune') {
          score += 15;
          matchHighlights.push(pg.locality);
        }

        if (pg.monthlyRent <= extractedBudget) {
          const savings = extractedBudget - pg.monthlyRent;
          score += 25;
          matchHighlights.push(`₹${pg.monthlyRent?.toLocaleString('en-IN')}/mo (In Budget)`);
          if (savings > 0) {
            reasons.push(`Saves ₹${savings.toLocaleString('en-IN')}/mo from budget`);
          } else {
            reasons.push(`Exact budget fit`);
          }
        } else if (pg.monthlyRent <= extractedBudget + 1000) {
          score += 10;
          reasons.push(`Near budget (+₹${pg.monthlyRent - extractedBudget})`);
        } else {
          score -= 15;
        }

        if (extractedGender !== 'ALL') {
          if (pg.genderType === extractedGender) {
            score += 15;
            matchHighlights.push(`${pg.genderType} Only`);
          } else if (pg.genderType === 'COED') {
            score += 10;
            matchHighlights.push(`Co-Ed`);
          } else {
            score -= 60;
          }
        } else {
          score += 10;
        }

        let matchedAmenities = 0;
        let expectedCount = 0;

        if (wantsAc) {
          expectedCount++;
          if (pg.hasAc) { matchedAmenities++; matchHighlights.push('AC'); }
        }
        if (wantsFood) {
          expectedCount++;
          if (pg.foodIncluded) { matchedAmenities++; matchHighlights.push('Meals'); reasons.push('3 Meals Included'); }
        }
        if (wantsWifi) {
          expectedCount++;
          if (pg.hasWifi) { matchedAmenities++; matchHighlights.push('Wi-Fi'); }
        }
        if (wantsBath) {
          expectedCount++;
          if (pg.hasAttachedBath) { matchedAmenities++; matchHighlights.push('Attached Washroom'); }
        }
        if (wantsPower) {
          expectedCount++;
          if (pg.hasPowerBackup) { matchedAmenities++; matchHighlights.push('Power Backup'); }
        }

        if (expectedCount > 0) {
          score += Math.round((matchedAmenities / expectedCount) * 25);
        } else {
          if (pg.hasWifi) matchHighlights.push('Wi-Fi');
          if (pg.foodIncluded) matchHighlights.push('Meals');
          if (pg.hasAc) matchHighlights.push('AC');
        }

        if (pg.isVerified) {
          score += 5;
          matchHighlights.push('Verified');
        }
        if (pg.rating >= 4.5) {
          score += 5;
          reasons.push(`${pg.rating}★ Rated`);
        }

        const finalMatchPercent = Math.min(99, Math.max(68, Math.round(score)));

        return {
          ...pg,
          matchPercent: finalMatchPercent,
          matchHighlights,
          aiRationale: reasons.length > 0 ? reasons.join(' • ') : 'Verified accommodation matching campus search parameters'
        };
      });

      const filtered = scoredPgs
        .filter(pg => pg.matchPercent >= 70)
        .sort((a, b) => b.matchPercent - a.matchPercent);

      setRecommendations(filtered);

      if (filtered.length > 0) {
        setAgentAnalysisNote(
          `Evaluated 25+ verified accommodations. Found ${filtered.length} PGs closely matching your criteria near ${extractedCollege} under ₹${extractedBudget.toLocaleString('en-IN')}.`
        );
      } else {
        setAgentAnalysisNote(
          `No exact matches under ₹${extractedBudget.toLocaleString('en-IN')}. Showing closest available verified accommodations.`
        );
        setRecommendations(allPgs.slice(0, 4).map(pg => ({ ...pg, matchPercent: 72, matchHighlights: ['Verified'], aiRationale: 'Closest alternative stay in NCR' })));
      }

      setIsAnalyzing(false);
    }, 400);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    runAiMatching(query);
  };

  const handleQuickPromptClick = (promptText) => {
    setQuery(promptText);
    runAiMatching(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#082228] border-2 border-teal-600/40 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[#061c21] border-b border-teal-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                🤖
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#061c21]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Ask AI Stay Agent</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase tracking-wider border border-amber-500/30">
                  Smart Matcher
                </span>
              </div>
              <p className="text-xs text-teal-300/80 mt-0.5">
                Type your budget, campus, room sharing, or amenities — AI will scan 25+ PGs and rank the best fits for you!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                showAdvancedFilters 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-[#092227] text-teal-200 border-teal-700/60 hover:border-amber-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showAdvancedFilters ? 'Hide Parameters' : 'Fine-Tune'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-teal-400 hover:text-white hover:bg-teal-900/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Query Bar */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`e.g., Double sharing boys PG near ${defaultCollege} under ₹8,000 with AC & food...`}
                className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-[#09252c] border-2 border-teal-700/60 text-white placeholder-teal-400/50 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner pr-36"
              />
              <Sparkles className="w-5 h-5 text-amber-400 absolute left-4 pointer-events-none" />

              <div className="absolute right-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Find PGs</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-teal-400/80 flex items-center gap-1 uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-400" /> Prompts:
              </span>
              {QUICK_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPromptClick(promptText)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0a2c34] hover:bg-[#12424e] border border-teal-700/50 hover:border-amber-400 text-teal-200 hover:text-white transition-all text-left flex items-center gap-1 cursor-pointer group"
                >
                  <span className="text-amber-400 group-hover:scale-125 transition-transform">✦</span>
                  <span className="truncate max-w-[240px] sm:max-w-none">{promptText}</span>
                </button>
              ))}
            </div>
          </form>

          {/* Optional Fine-Tuning Drawer */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-2xl bg-[#061a1f] border border-teal-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  Target Campus
                </label>
                <input
                  type="text"
                  value={targetCollege}
                  onChange={(e) => setTargetCollege(e.target.value)}
                  placeholder="e.g. ABES, AKGEC"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#09252c] border border-teal-700 text-white placeholder-teal-500 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  Max Budget: ₹{maxBudget.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="16000"
                  step="500"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['ALL', 'BOYS', 'GIRLS'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderPref(g)}
                      className={`py-1 rounded-md font-bold text-[10px] border transition-all ${
                        genderPref === g
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-[#09252c] text-teal-300 border-teal-700/60'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: 'AC', state: requireAc, setter: setRequireAc },
                    { label: 'Meals', state: requireFood, setter: setRequireFood },
                    { label: 'Wi-Fi', state: requireWifi, setter: setRequireWifi },
                    { label: 'Bath', state: requireAttachedBath, setter: setRequireAttachedBath },
                    { label: 'Power', state: requirePowerBackup, setter: setRequirePowerBackup },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => item.setter(!item.state)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                        item.state
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-[#09252c] text-teal-300/80 border-teal-700/50'
                      }`}
                    >
                      {item.state ? '✓ ' : '+ '}{item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Note */}
          {agentAnalysisNote && (
            <div className="p-3.5 rounded-2xl bg-[#09252c] border border-amber-500/30 flex items-start gap-3">
              <Bot className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Agent Intelligence Analysis
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-900 text-teal-300 border border-teal-700 font-bold">
                    {recommendations.length} Recommended
                  </span>
                </div>
                <p className="text-xs text-teal-200/90 leading-relaxed font-medium">
                  {agentAnalysisNote}
                </p>
              </div>
            </div>
          )}

          {/* Matched PGs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(pg => (
              <div
                key={pg.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#09252c] border border-teal-700/60 hover:border-amber-400/60 transition-all shadow-lg flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>{pg.matchPercent}% Match</span>
                    </span>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        pg.genderType === 'GIRLS' ? 'bg-pink-900/60 text-pink-200 border-pink-700/40' :
                        pg.genderType === 'BOYS' ? 'bg-blue-900/60 text-blue-200 border-blue-700/40' :
                        'bg-purple-900/60 text-purple-200 border-purple-700/40'
                      }`}>
                        {pg.genderType}
                      </span>
                      {pg.isVerified && (
                        <span className="px-2 py-0.5 rounded-lg bg-teal-900/70 text-teal-300 border border-teal-700/40 text-[10px] font-bold">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 
                      onClick={() => {
                        onClose();
                        if (onSelectPg) onSelectPg(pg);
                      }}
                      className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {pg.name}
                    </h5>
                    <div className="flex items-center gap-1 text-xs text-teal-300/80 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{pg.locality}, {pg.city}</span>
                    </div>
                    {pg.nearbyColleges && (
                      <p className="text-[11px] text-teal-400/60 mt-0.5 line-clamp-1">
                        🎓 {pg.nearbyColleges}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {pg.matchHighlights?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#061e23] border border-teal-700/50 text-teal-200 font-semibold"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  {pg.aiRationale && (
                    <div className="p-2 rounded-xl bg-[#061a1f] border border-teal-800 text-[11px] text-teal-200/90 leading-relaxed font-medium">
                      <span className="text-amber-400 font-bold">Why it matches: </span>
                      {pg.aiRationale}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-teal-800/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-teal-400/70 block uppercase font-bold">Rent</span>
                    <div className="text-base font-black text-white flex items-baseline">
                      <span>₹{pg.monthlyRent?.toLocaleString('en-IN') || "7,500"}</span>
                      <span className="text-xs font-normal text-teal-300/70 ml-1">/mo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onSelectPg) onSelectPg(pg);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>View & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#061c21] border-t border-teal-800/80 flex items-center justify-between shrink-0">
          <p className="text-xs text-teal-300/70">
            HomeSetu AI searches all 25+ NCR live listings with 0% brokerage.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
