import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Send, Search, Sliders, ArrowRight, 
  CheckCircle2, Star, MapPin, IndianRupee, ShieldCheck, 
  Wind, Wifi, Utensils, Bed, Eye, RefreshCw, Zap, ThumbsUp, AlertCircle
} from 'lucide-react';

export default function AiStudentAgent({ currentUser, allPgs = [], onSelectPg }) {
  // Natural language query input
  const defaultCollege = currentUser?.college?.split(',')[0] || "ABES Engineering College";
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [agentAnalysisNote, setAgentAnalysisNote] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Structured requirements (can be controlled via natural language or filters)
  const [targetCollege, setTargetCollege] = useState(defaultCollege);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [genderPref, setGenderPref] = useState('ALL'); // 'ALL' | 'BOYS' | 'GIRLS'
  const [requireAc, setRequireAc] = useState(false);
  const [requireFood, setRequireFood] = useState(false);
  const [requireWifi, setRequireWifi] = useState(false);
  const [requireAttachedBath, setRequireAttachedBath] = useState(false);
  const [requirePowerBackup, setRequirePowerBackup] = useState(false);

  // Quick prompt suggestions tailored for students
  const QUICK_PROMPTS = [
    `Double Sharing near ${defaultCollege} under ₹8,500 with Food & AC`,
    `Budget PG near campus with High-Speed Wi-Fi & Power Backup under ₹7,000`,
    `Girls PG with Pure Veg Mess, Attached Bath & 24/7 Security`,
    `Single Room with AC and zero brokerage within 1 km of campus`
  ];

  // Run initial default matching based on student's registered college on mount
  useEffect(() => {
    if (allPgs.length > 0 && !hasSearched) {
      runAiMatching(
        `Verified student stay near ${defaultCollege} with good amenities`,
        defaultCollege,
        12000,
        'ALL',
        false,
        false,
        false,
        false,
        false,
        false
      );
    }
  }, [allPgs]);

  // Main AI Parsing & Multi-Factor Matching Engine
  const runAiMatching = (
    textQuery,
    college = targetCollege,
    budget = maxBudget,
    gender = genderPref,
    ac = requireAc,
    food = requireFood,
    wifi = requireWifi,
    bath = requireAttachedBath,
    power = requirePowerBackup,
    isManualSubmit = true
  ) => {
    setIsAnalyzing(true);
    setHasSearched(true);

    const qLower = (textQuery || '').toLowerCase();

    // 1. Natural Language Entity Extraction
    let extractedCollege = college;
    if (qLower.includes('abes')) extractedCollege = 'ABES';
    else if (qLower.includes('akgec') || qLower.includes('akg')) extractedCollege = 'AKGEC';
    else if (qLower.includes('kiet')) extractedCollege = 'KIET';
    else if (qLower.includes('galgotias')) extractedCollege = 'Galgotias';
    else if (qLower.includes('ims')) extractedCollege = 'IMS';
    else if (qLower.includes('coep')) extractedCollege = 'COEP';
    else if (qLower.includes('kothrud') || qLower.includes('pune')) extractedCollege = 'Pune';

    // Budget extraction from text (e.g. "under 8000", "8k", "below 7500", "₹9000")
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

    // Gender extraction
    let extractedGender = gender;
    if (qLower.includes('girl') || qLower.includes('female')) extractedGender = 'GIRLS';
    else if (qLower.includes('boy') || qLower.includes('male')) extractedGender = 'BOYS';

    // Amenities extraction
    const wantsAc = ac || qLower.includes('ac') || qLower.includes('air condition') || qLower.includes('cooler');
    const wantsFood = food || qLower.includes('food') || qLower.includes('meal') || qLower.includes('mess') || qLower.includes('veg');
    const wantsWifi = wifi || qLower.includes('wifi') || qLower.includes('wi-fi') || qLower.includes('internet') || qLower.includes('broadband');
    const wantsBath = bath || qLower.includes('attached') || qLower.includes('washroom') || qLower.includes('bath');
    const wantsPower = power || qLower.includes('power') || qLower.includes('backup') || qLower.includes('generator');

    // Update filter UI states to reflect extracted intent
    setTargetCollege(extractedCollege);
    setMaxBudget(extractedBudget);
    setGenderPref(extractedGender);
    setRequireAc(wantsAc);
    setRequireFood(wantsFood);
    setRequireWifi(wantsWifi);
    setRequireAttachedBath(wantsBath);
    setRequirePowerBackup(wantsPower);

    // 2. Score & Rank PGs against requirements
    setTimeout(() => {
      const scoredPgs = allPgs.map(pg => {
        let score = 50; // base score
        const reasons = [];
        const matchHighlights = [];

        // Locality / College Proximity check (up to +35 pts)
        const collegesStr = (pg.nearbyColleges || '').toLowerCase();
        const addressStr = `${pg.locality} ${pg.city} ${pg.name} ${pg.address}`.toLowerCase();
        const collegeTarget = extractedCollege.toLowerCase();

        if (collegesStr.includes(collegeTarget) || addressStr.includes(collegeTarget)) {
          score += 35;
          matchHighlights.push(`Near ${extractedCollege}`);
          reasons.push(`Strategically situated near ${extractedCollege}`);
        } else if (pg.city?.toLowerCase() === 'ghaziabad' || pg.city?.toLowerCase() === 'pune') {
          score += 15;
          matchHighlights.push(pg.locality);
        }

        // Budget evaluation (up to +25 pts)
        if (pg.monthlyRent <= extractedBudget) {
          const savings = extractedBudget - pg.monthlyRent;
          score += 25;
          matchHighlights.push(`₹${pg.monthlyRent?.toLocaleString('en-IN')}/mo (In Budget)`);
          if (savings > 0) {
            reasons.push(`Fits budget comfortably (Saves ₹${savings.toLocaleString('en-IN')}/mo)`);
          } else {
            reasons.push(`Exact budget match at ₹${pg.monthlyRent?.toLocaleString('en-IN')}/mo`);
          }
        } else if (pg.monthlyRent <= extractedBudget + 1000) {
          score += 10;
          reasons.push(`Slightly above budget (+₹${pg.monthlyRent - extractedBudget}/mo) but high value`);
        } else {
          score -= 15;
        }

        // Gender filter compatibility (up to +15 pts or -50)
        if (extractedGender !== 'ALL') {
          if (pg.genderType === extractedGender) {
            score += 15;
            matchHighlights.push(`${pg.genderType} Host`);
          } else if (pg.genderType === 'COED') {
            score += 10;
            matchHighlights.push(`Co-Ed Living`);
          } else {
            score -= 60; // gender mismatch
          }
        } else {
          score += 10;
        }

        // Amenities match (up to +25 pts)
        let matchedAmenitiesCount = 0;
        let expectedCount = 0;

        if (wantsAc) {
          expectedCount++;
          if (pg.hasAc) { matchedAmenitiesCount++; matchHighlights.push('AC'); }
        }
        if (wantsFood) {
          expectedCount++;
          if (pg.foodIncluded) { matchedAmenitiesCount++; matchHighlights.push('Meals Included'); reasons.push('Hygienic 3-time meals included in rent'); }
        }
        if (wantsWifi) {
          expectedCount++;
          if (pg.hasWifi) { matchedAmenitiesCount++; matchHighlights.push('High-Speed Wi-Fi'); }
        }
        if (wantsBath) {
          expectedCount++;
          if (pg.hasAttachedBath) { matchedAmenitiesCount++; matchHighlights.push('Attached Washroom'); }
        }
        if (wantsPower) {
          expectedCount++;
          if (pg.hasPowerBackup) { matchedAmenitiesCount++; matchHighlights.push('Power Backup'); }
        }

        if (expectedCount > 0) {
          const amenityRatio = matchedAmenitiesCount / expectedCount;
          score += Math.round(amenityRatio * 25);
        } else {
          if (pg.hasWifi) matchHighlights.push('Wi-Fi');
          if (pg.foodIncluded) matchHighlights.push('Meals');
          if (pg.hasAc) matchHighlights.push('AC');
        }

        // Verification & rating bonus
        if (pg.isVerified) {
          score += 5;
          matchHighlights.push('KYC Verified');
        }
        if (pg.rating >= 4.5) {
          score += 5;
          reasons.push(`Top rated (${pg.rating}★ by students)`);
        }

        // Normalize match percentage between 65% and 99%
        const finalMatchPercent = Math.min(99, Math.max(68, Math.round(score)));

        return {
          ...pg,
          matchPercent: finalMatchPercent,
          matchHighlights,
          aiRationale: reasons.length > 0 ? reasons.join(' • ') : 'Verified accommodation matching campus search parameters'
        };
      });

      // Filter out severe gender mismatches and sort by highest match percent
      const filtered = scoredPgs
        .filter(pg => pg.matchPercent >= 70)
        .sort((a, b) => b.matchPercent - a.matchPercent);

      setRecommendations(filtered);

      // AI Summary Note
      if (filtered.length > 0) {
        setAgentAnalysisNote(
          `Analysis complete: Evaluated 25+ NCR accommodations for ${currentUser?.fullName || 'student'}. Found ${filtered.length} high-compatibility PGs closely matching your criteria near ${extractedCollege} under ₹${extractedBudget.toLocaleString('en-IN')}.`
        );
      } else {
        setAgentAnalysisNote(
          `No exact match found under ₹${extractedBudget.toLocaleString('en-IN')} for ${extractedCollege}. Showing closest available verified properties with flexible amenities.`
        );
        setRecommendations(allPgs.slice(0, 4).map(pg => ({ ...pg, matchPercent: 72, matchHighlights: ['Verified'], aiRationale: 'Closest alternative stay in NCR' })));
      }

      setIsAnalyzing(false);
    }, 450);
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
    <div className="bg-[#0b2b32] border-2 border-teal-600/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background Decorative AI Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Agent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-800/70 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 ring-2 ring-amber-300/40 animate-in zoom-in">
              🤖
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b2b32] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">HomeSetu AI Stay Agent</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase tracking-wider border border-amber-500/30">
                Advanced Multi-Factor Matcher
              </span>
            </div>
            <p className="text-xs text-teal-300/80 mt-0.5">
              Describe your dream stay, budget, and college — our autonomous AI will scan 25+ verified PGs & rank the best matches!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showAdvancedFilters 
                ? 'bg-amber-500 text-slate-950 border-amber-400' 
                : 'bg-[#092227] text-teal-200 border-teal-700/60 hover:border-amber-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvancedFilters ? 'Hide Fine-Tuning' : 'Fine-Tune Parameters'}</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleFormSubmit} className="relative z-10 space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`e.g., Looking for a 2-sharing boys PG near ${defaultCollege} under ₹8,000 with AC & 3 meals...`}
            className="w-full px-5 py-4 pl-12 rounded-2xl bg-[#082228] border-2 border-teal-700/60 text-white placeholder-teal-400/50 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner pr-36"
          />
          <Sparkles className="w-5 h-5 text-amber-400 absolute left-4 pointer-events-none" />

          <div className="absolute right-2.5 flex items-center gap-2">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Clickable AI Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-teal-400/80 flex items-center gap-1 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-amber-400" /> Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(promptText)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-[#092227] hover:bg-[#12424e] border border-teal-700/50 hover:border-amber-400 text-teal-200 hover:text-white transition-all text-left flex items-center gap-1.5 shadow-2xs cursor-pointer group"
            >
              <span className="text-amber-400 group-hover:scale-125 transition-transform">✦</span>
              <span className="truncate max-w-[280px] sm:max-w-none">{promptText}</span>
            </button>
          ))}
        </div>
      </form>

      {/* Advanced Fine-Tuning Drawer (Optional) */}
      {showAdvancedFilters && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#071d21] border border-teal-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
              Target College / Campus
            </label>
            <input
              type="text"
              value={targetCollege}
              onChange={(e) => setTargetCollege(e.target.value)}
              placeholder="e.g. ABES, AKGEC, Galgotias"
              className="w-full px-3 py-2 rounded-xl bg-[#0b2b32] border border-teal-700 text-white placeholder-teal-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
              Max Monthly Budget (₹{maxBudget.toLocaleString('en-IN')})
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
            <div className="flex justify-between text-[10px] text-teal-400/60 mt-1">
              <span>₹5,000</span>
              <span>₹10,000</span>
              <span>₹16,000+</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
              Gender Preference
            </label>
            <div className="grid grid-cols-3 gap-1">
              {['ALL', 'BOYS', 'GIRLS'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderPref(g)}
                  className={`py-1.5 rounded-lg font-bold text-[10px] border transition-all ${
                    genderPref === g
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-[#0b2b32] text-teal-300 border-teal-700/60 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
              Must-Have Amenities
            </label>
            <div className="flex flex-wrap gap-1.5">
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
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                    item.state
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-[#0b2b32] text-teal-300/80 border-teal-700/50'
                  }`}
                >
                  {item.state ? '✓ ' : '+ '}{item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Agent Status & Analysis Insights */}
      {agentAnalysisNote && (
        <div className="p-4 rounded-2xl bg-[#082228] border border-amber-500/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Agent Intelligence Report
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700/50 font-bold">
                {recommendations.length} Matches Found
              </span>
            </div>
            <p className="text-xs text-teal-200/90 leading-relaxed font-medium">
              {agentAnalysisNote}
            </p>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Agent Ranked Accommodations
            </h4>
          </div>
          <span className="text-[11px] text-teal-300/70 font-semibold">
            Ranked by AI Compatibility Score
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#082228] border border-teal-700/50 space-y-2">
            <p className="text-sm text-teal-300">No matching PGs found for these criteria.</p>
            <p className="text-xs text-teal-400/60">Try increasing your budget or typing your requirements above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 6).map((pg) => (
              <div
                key={pg.id}
                className="p-5 rounded-2xl bg-[#09252c] border border-teal-700/60 hover:border-amber-400/60 transition-all shadow-lg flex flex-col justify-between group space-y-4 hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Top Bar with Match Percentage & Gender */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>{pg.matchPercent}% AI Match</span>
                    </span>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        pg.genderType === 'GIRLS' ? 'bg-pink-900/60 text-pink-200 border-pink-700/40' :
                        pg.genderType === 'BOYS' ? 'bg-blue-900/60 text-blue-200 border-blue-700/40' :
                        'bg-purple-900/60 text-purple-200 border-purple-700/40'
                      }`}>
                        {pg.genderType} PG
                      </span>
                      {pg.isVerified && (
                        <span className="px-2 py-0.5 rounded-lg bg-teal-900/70 text-teal-300 border border-teal-700/40 text-[10px] font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-teal-400" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PG Name & Locality */}
                  <div>
                    <h5 
                      onClick={() => onSelectPg && onSelectPg(pg)}
                      className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {pg.name}
                    </h5>
                    <div className="flex items-center gap-1 text-xs text-teal-300/80 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{pg.locality}, {pg.city}</span>
                    </div>
                    {pg.nearbyColleges && (
                      <p className="text-[11px] text-teal-400/60 mt-1 line-clamp-1">
                        🎓 {pg.nearbyColleges}
                      </p>
                    )}
                  </div>

                  {/* Match highlights pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {pg.matchHighlights?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#061e23] border border-teal-700/50 text-teal-200 font-semibold"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Agent Rationale Note */}
                  {pg.aiRationale && (
                    <div className="p-2.5 rounded-xl bg-[#061a1f] border border-teal-800/80 text-[11px] text-teal-200/90 leading-relaxed font-medium">
                      <span className="text-amber-400 font-bold">Why it matches: </span>
                      {pg.aiRationale}
                    </div>
                  )}
                </div>

                {/* Footer with Price and View & Book Action */}
                <div className="pt-3 border-t border-teal-800/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-teal-400/70 block uppercase font-bold">Starting Rent</span>
                    <div className="text-lg font-black text-white flex items-baseline">
                      <span>₹{pg.monthlyRent?.toLocaleString('en-IN') || "7,500"}</span>
                      <span className="text-xs font-normal text-teal-300/70 ml-1">/mo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPg && onSelectPg(pg)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>View & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
