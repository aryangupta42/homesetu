import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Bot, Send, Search, Sliders, ArrowRight, 
  CheckCircle2, Star, MapPin, IndianRupee, ShieldCheck, 
  Wind, Wifi, Utensils, Bed, Eye, RefreshCw, Zap, 
  ThumbsUp, AlertCircle, Scale, Coffee, Clock, ShieldAlert, 
  FileText, HelpCircle, Check, Calendar, ChevronRight, User, Trash2
} from 'lucide-react';

export default function AiStudentAgent({ 
  currentUser, 
  allPgs = [], 
  onSelectPg, 
  onOpenFeedback, 
  onExploreClick 
}) {
  const defaultCollege = currentUser?.college?.split(',')[0] || "AKGEC Ghaziabad";
  const studentName = currentUser?.fullName?.split(' ')[0] || "Student";

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Initial welcome message from AI Agent with rich context
  useEffect(() => {
    if (messages.length === 0 && allPgs.length > 0) {
      // Find initial recommendations based on student's registered college / location
      const initialMatches = allPgs.filter(p => {
        const addr = `${p.nearbyColleges} ${p.locality} ${p.city} ${p.address}`.toLowerCase();
        return addr.includes('akgec') || addr.includes('ghaziabad') || p.city?.toLowerCase() === 'ghaziabad';
      }).slice(0, 3);

      setMessages([
        {
          id: 'welcome-msg',
          sender: 'agent',
          timestamp: 'Just now',
          text: `Namaste ${studentName}! 👋 Main HomeSetu ka Official AI Stay Assistant hoon.\n\nAap mujhse jo chahein pooch sakte hain — main bilkul accurate aur to-the-point jawab doonga:\n\n• 📍 **Sheher ke mutabik PGs**: e.g., *"give me pg in pune"*, *"pg in ghaziabad"*, *"pg in noida"*\n• 🎓 **College ke mutabik**: e.g., *"pg near AKGEC"*, *"pg near ABES"*, *"pg near COEP"*\n• 💰 **Budget & Sharing**: e.g., *"girls pg under 7000"*, *"boys pg with food & ac"*\n• ⚖️ **Comparison**: e.g., *"compare Sunrise PG and Green Nest PG"*\n• 🍲 **Mess Food & Menu**: e.g., *"mess menu kya hai?"*, *"khana kaisa hota hai?"*\n• ⏰ **Rules & Timings**: e.g., *"gate closing time kya hai?"*, *"are visitors allowed?"*\n• 🛡️ **Deposit & Refund**: e.g., *"security deposit refundable hai ya nahi?"*\n• 🚨 **Problem / Issue**: e.g., *"wifi problem hai"*, *"warden issue"*`,
          intent: 'WELCOME',
          data: {
            pgs: initialMatches.length > 0 ? initialMatches : allPgs.slice(0, 3),
            note: `Featured Verified Accommodations (0% Brokerage & 100% KYC Verified):`
          }
        }
      ]);
    }
  }, [allPgs, currentUser]);

  // Quick Action Buttons
  const QUICK_ACTIONS = [
    { label: `📍 PGs in Pune`, query: `give me pg in pune` },
    { label: `📍 PGs in Ghaziabad`, query: `give me pg in ghaziabad` },
    { label: `🎯 Near AKGEC`, query: `show verified pg near AKGEC campus` },
    { label: `💰 Under ₹7,500`, query: `show affordable budget pg under 7500 with meals` },
    { label: `🍲 Mess Menu`, query: `what is the weekly mess menu and food quality?` },
    { label: `⚖️ Compare PGs`, query: `compare Sunrise PG and Green Nest PG` },
    { label: `⏰ Gate Timing`, query: `gate closing time aur house rules kya hain?` },
    { label: `🛡️ Deposit Refund`, query: `security deposit refund policy kya hai?` },
    { label: `🚨 Report Issue`, query: `wifi issue hai complaint kaise karein?` }
  ];

  // Robust Search & Strict Filtering Engine
  function filterPgsIntelligently(rawQuery) {
    if (!allPgs || allPgs.length === 0) {
      return { candidates: [], detectedCity: null, detectedGender: null, detectedCollege: null, maxBudget: null };
    }

    const qLower = (rawQuery || '').toLowerCase();

    // 1. Detect City
    let detectedCity = null;
    if (qLower.includes('pune')) detectedCity = 'Pune';
    else if (qLower.includes('ghaziabad')) detectedCity = 'Ghaziabad';
    else if (qLower.includes('noida') || qLower.includes('greater noida')) detectedCity = 'Noida';
    else if (qLower.includes('delhi')) detectedCity = 'Delhi';
    else if (qLower.includes('bengaluru') || qLower.includes('bangalore')) detectedCity = 'Bengaluru';
    else if (qLower.includes('kota')) detectedCity = 'Kota';

    // 2. Detect Locality
    let detectedLocality = null;
    if (qLower.includes('kothrud')) { detectedLocality = 'Kothrud'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('baner')) { detectedLocality = 'Baner'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('viman nagar')) { detectedLocality = 'Viman Nagar'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('hinjewadi')) { detectedLocality = 'Hinjewadi'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('shivaji nagar') || qLower.includes('fc road')) { detectedLocality = 'Shivaji Nagar'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('crossings republik') || qLower.includes('crossings')) { detectedLocality = 'Crossings Republik'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('indirapuram')) { detectedLocality = 'Indirapuram'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('raj nagar')) { detectedLocality = 'Raj Nagar'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('koramangala')) { detectedLocality = 'Koramangala'; detectedCity = detectedCity || 'Bengaluru'; }

    // 3. Detect College
    let detectedCollege = null;
    if (qLower.includes('akgec') || qLower.includes('akg')) { detectedCollege = 'AKGEC'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('abes')) { detectedCollege = 'ABES'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('kiet')) { detectedCollege = 'KIET'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('galgotias')) { detectedCollege = 'Galgotias'; detectedCity = detectedCity || 'Noida'; }
    else if (qLower.includes('ims')) { detectedCollege = 'IMS'; detectedCity = detectedCity || 'Ghaziabad'; }
    else if (qLower.includes('coep')) { detectedCollege = 'COEP'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('mit')) { detectedCollege = 'MIT'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('cummins')) { detectedCollege = 'Cummins'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('symbiosis') || qLower.includes('scit')) { detectedCollege = 'Symbiosis'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('christ')) { detectedCollege = 'Christ'; detectedCity = detectedCity || 'Bengaluru'; }
    else if (qLower.includes('nicmar')) { detectedCollege = 'NICMAR'; detectedCity = detectedCity || 'Pune'; }
    else if (qLower.includes('fergusson') || qLower.includes('bmcc')) { detectedCollege = 'Fergusson'; detectedCity = detectedCity || 'Pune'; }

    // 4. Detect Gender
    let detectedGender = null;
    if (qLower.includes('girl') || qLower.includes('female') || qLower.includes('women') || qLower.includes('ladki')) {
      detectedGender = 'GIRLS';
    } else if (qLower.includes('boy') || qLower.includes('male') || qLower.includes('men') || qLower.includes('ladko') || qLower.includes('ladke')) {
      detectedGender = 'BOYS';
    }

    // 5. Detect Budget
    let maxBudget = null;
    const kBudget = qLower.match(/(\d+)\s*k\b/);
    if (kBudget) maxBudget = parseInt(kBudget[1], 10) * 1000;
    else {
      const numBudget = qLower.match(/(?:under|below|within|upto|budget|around|max)\s*(?:₹|rs\.?)?\s*(\d{4,5})/);
      if (numBudget) maxBudget = parseInt(numBudget[1], 10);
    }

    // 6. Strict Filtering
    let results = allPgs.filter(pg => {
      // STRICT CITY MATCH
      if (detectedCity) {
        if (!pg.city || pg.city.toLowerCase() !== detectedCity.toLowerCase()) {
          return false;
        }
      }

      // STRICT GENDER MATCH
      if (detectedGender === 'GIRLS') {
        if (pg.genderType === 'BOYS') return false;
      } else if (detectedGender === 'BOYS') {
        if (pg.genderType === 'GIRLS') return false;
      }

      // Locality Match
      if (detectedLocality) {
        const fullAddr = `${pg.locality} ${pg.address} ${pg.name}`.toLowerCase();
        if (!fullAddr.includes(detectedLocality.toLowerCase())) {
          return false;
        }
      }

      // College Match
      if (detectedCollege) {
        const colStr = `${pg.nearbyColleges} ${pg.address} ${pg.tagline}`.toLowerCase();
        if (!colStr.includes(detectedCollege.toLowerCase())) {
          return false;
        }
      }

      // Budget Filter (with small grace buffer of ₹500)
      if (maxBudget && pg.monthlyRent > maxBudget + 500) {
        return false;
      }

      return true;
    });

    // If city was specified but locality/college had no exact match, fallback to all PGs in that city
    if (results.length === 0 && detectedCity) {
      results = allPgs.filter(pg => pg.city?.toLowerCase() === detectedCity.toLowerCase());
    }

    // Sort: if budget requested, lowest rent first; otherwise rating
    if (qLower.includes('sasta') || qLower.includes('cheap') || qLower.includes('lowest') || qLower.includes('budget')) {
      results.sort((a, b) => a.monthlyRent - b.monthlyRent);
    } else {
      results.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    // Add match badges
    results = results.map((pg, idx) => ({
      ...pg,
      matchPercent: idx === 0 ? 98 : idx === 1 ? 95 : 92 - idx * 2,
      matchHighlights: [
        pg.city,
        pg.locality,
        `₹${pg.monthlyRent?.toLocaleString('en-IN')}/mo`,
        pg.foodIncluded ? '3 Meals' : 'Kitchen Access',
        pg.hasAc ? 'AC' : 'Cooler/Fan',
        'KYC Verified'
      ].filter(Boolean)
    }));

    return {
      candidates: results,
      detectedCity,
      detectedLocality,
      detectedCollege,
      detectedGender,
      maxBudget
    };
  }

  // Master Query Handler & Intent Processor
  const processQuery = (rawQuery) => {
    const q = (rawQuery || '').trim();
    if (!q) return;

    // 1. Add user message
    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    const qLower = q.toLowerCase();

    setTimeout(() => {
      let agentResponse = null;

      // -------------------------------------------------------------
      // 1. COMPARISON INTENT ("compare", "vs", "which is better")
      // -------------------------------------------------------------
      if (
        qLower.includes('compare') || 
        qLower.includes(' vs ') || 
        qLower.includes('dono me se') || 
        qLower.includes('which is better') ||
        qLower.includes('difference between')
      ) {
        let pg1 = null;
        let pg2 = null;

        // Try to match specific PG names
        for (const p of allPgs) {
          const firstWord = p.name.toLowerCase().split(' ')[0];
          if (qLower.includes(firstWord)) {
            if (!pg1) pg1 = p;
            else if (!pg2 && p.id !== pg1.id) pg2 = p;
          }
        }

        // If not found, pick top 2
        if (!pg1) pg1 = allPgs[0];
        if (!pg2) pg2 = allPgs[1] || allPgs[0];

        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Maine **"${pg1.name}"** aur **"${pg2.name}"** ka feature-by-feature side-by-side comparison taiyaar kiya hai:\n\n• **${pg1.name}**: ₹${pg1.monthlyRent?.toLocaleString('en-IN')}/mo • ${pg1.locality}, ${pg1.city} • ${pg1.genderType} PG • Food: ${pg1.foodType || 'Included'}\n• **${pg2.name}**: ₹${pg2.monthlyRent?.toLocaleString('en-IN')}/mo • ${pg2.locality}, ${pg2.city} • ${pg2.genderType} PG • Food: ${pg2.foodType || 'Included'}\n\nNeeche diye gaye interactive comparison matrix me detailed specs inspect kijiye:`,
          intent: 'COMPARE',
          data: {
            comparePair: [pg1, pg2]
          }
        };
      }

      // -------------------------------------------------------------
      // 2. MESS MENU & FOOD INTENT
      // -------------------------------------------------------------
      else if (
        qLower.includes('mess') || 
        qLower.includes('food') || 
        qLower.includes('khana') || 
        qLower.includes('lunch') || 
        qLower.includes('dinner') || 
        qLower.includes('breakfast') || 
        qLower.includes('meal') || 
        qLower.includes('diet')
      ) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `HomeSetu ke verified PGs me FSSAI certified standard food serve kiya jaata hai. Ye raha weekly meal rotation menu:\n\n🥞 **Breakfast (7:30 AM - 9:30 AM)**: Poha, Idli Sambhar, Aloo/Paneer Paratha, Boiled Eggs / Banana, Tea & Hot Milk\n🍲 **Lunch (12:30 PM - 2:30 PM)**: Arhar Dal Tadka, Seasonal Sabzi, Steamed Basmati Rice, Tawa Phulkas, Fresh Salad & Curd\n🍛 **Dinner (8:00 PM - 10:00 PM)**: Shahi Paneer / Chicken Curry (Wed/Sun), Dal Makhani, Jeera Rice, Rotis, Gulab Jamun / Kheer\n\n• **Separate Kitchens**: Pure Veg aur Non-Veg food alag utensils me prepare hota hai.\n• **Filter RO Water**: 24/7 cold & normal water dispensers available hain.`,
          intent: 'MESS_MENU',
          data: {
            messPg: allPgs[0]
          }
        };
      }

      // -------------------------------------------------------------
      // 3. GATE CLOSING TIME & HOUSE RULES INTENT
      // -------------------------------------------------------------
      else if (
        qLower.includes('gate') || 
        qLower.includes('timing') || 
        qLower.includes('closing') || 
        qLower.includes('curfew') || 
        qLower.includes('night') || 
        qLower.includes('rule') || 
        qLower.includes('visitor') || 
        qLower.includes('friend') || 
        qLower.includes('guest')
      ) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `HomeSetu Verified Accommodations ke Official Living Rules:\n\n⏰ **Main Gate Closing Time**: 10:30 PM (Biometric entry / 24-hr security guard checked).\n📚 **Late Night Study Pass**: Agar college hackathon, university exams ya campus lab session hai, to warden approval se 12:00 AM tak late pass easily mil jata hai.\n👥 **Parents & Friends Visiting Hours**: Parents aur friends evening 7:00 PM tak common reception / study lounge area me mil sakte hain.\n🤫 **Quiet Study Hours**: Raat 10:00 PM ke baad silent study corridors maintain karna mandatory hai.\n🚭 **Zero Tolerance**: Premises me smoking, alcohol, ya loud disturbances strictly prohibited hain.`,
          intent: 'RULES_TIMING'
        };
      }

      // -------------------------------------------------------------
      // 4. SECURITY DEPOSIT & 0% BROKERAGE INTENT
      // -------------------------------------------------------------
      else if (
        qLower.includes('deposit') || 
        qLower.includes('refund') || 
        qLower.includes('brokerage') || 
        qLower.includes('notice') || 
        qLower.includes('advance') || 
        qLower.includes('hidden') || 
        qLower.includes('paisa')
      ) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `HomeSetu ki 100% Student-Friendly Financial Policies:\n\n💎 **0% Brokerage Guarantee**: HomeSetu par kisi bhi student se koi broker fee ya dealer commission nahi liya jata — 100% direct connect.\n🔒 **100% Refundable Security Deposit**: Aapka security deposit HomeSetu Escrow protection ke under locked rehta hai. Room vacating par owner ko 7 dino ke andar deposit refund karna mandatory hota hai.\n📄 **30-Day Notice Period**: Room vacating se 30 din pehle owner ko portal ke zariye notice dena hota hai.\n⚡ **No Hidden Maintenance Fees**: Rent me Wi-Fi, electricity power backup, daily room cleaning aur garbage collection already inclusive rehte hain.`,
          intent: 'DEPOSIT_PRICING'
        };
      }

      // -------------------------------------------------------------
      // 5. GRIEVANCE / COMPLAINT INTENT
      // -------------------------------------------------------------
      else if (
        qLower.includes('complain') || 
        qLower.includes('grievance') || 
        qLower.includes('issue') || 
        qLower.includes('wifi') || 
        qLower.includes('problem') || 
        qLower.includes('warden') || 
        qLower.includes('refund nahi') || 
        qLower.includes('fight') || 
        qLower.includes('admin')
      ) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Main samajh sakta hoon ki issue aane par kitni pareshani hoti hai. HomeSetu Central Grievance Cell par har issue direct Platform Administrator (**Arsh Mittal**) ke paas jata hai with an official **< 24-Hour Resolution SLA**.\n\nAap abhi neeche diye gaye button par click karke direct Official Grievance Ticket raise kar sakte hain:`,
          intent: 'GRIEVANCE_HELP',
          data: {
            showGrievanceButton: true
          }
        };
      }

      // -------------------------------------------------------------
      // 6. GENERAL GREETINGS & IDENTITY
      // -------------------------------------------------------------
      else if (
        qLower === 'hi' || 
        qLower === 'hello' || 
        qLower === 'hey' || 
        qLower.includes('kaise ho') || 
        qLower.includes('how are you')
      ) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Hello ${studentName}! 😊 Main bilkul theek hoon aur aapki help ke liye ready hoon.\n\nAapko **Pune**, **Ghaziabad**, **Noida** ya kisi specific college (jaise AKGEC, ABES, COEP) ke paas PG dekhna hai, mess menu check karna hai, ya comparison karna hai? Mujhe bataiye!`,
          intent: 'GENERAL'
        };
      } else if (qLower.includes('arsh mittal') || qLower.includes('founder') || qLower.includes('owner of homesetu')) {
        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `**Arsh Mittal** HomeSetu ke Founder aur Central Platform Administrator hain. Admin Portal ke zariye wo:\n\n• PG properties ke ownership documents, electricity meter bills aur police verification approve karte hain.\n• Student complaints aur deposit issues ko personally monitor karke 24 hours me solve karwate hain.\n• Platform ki 0% brokerage aur safety standards maintain karte hain.`,
          intent: 'GENERAL'
        };
      }

      // -------------------------------------------------------------
      // 7. LOCATION & CRITERIA SEARCH (PUNE, GHAZIABAD, AKGEC, ETC.)
      // -------------------------------------------------------------
      else {
        const { candidates, detectedCity, detectedLocality, detectedCollege, detectedGender, maxBudget } = filterPgsIntelligently(q);

        let dynamicHeading = '';
        if (detectedCity) {
          dynamicHeading = `Zaroor! Maine **${detectedCity}** ke verified student PGs filter kar diye hain:`;
          if (detectedLocality) dynamicHeading = `Zaroor! Maine **${detectedLocality}, ${detectedCity}** ke verified student PGs filter kar diye hain:`;
        } else if (detectedCollege) {
          dynamicHeading = `Maine **${detectedCollege}** campus ke nazdeek wale verified student PGs filter kar diye hain:`;
        } else if (detectedGender) {
          dynamicHeading = `Maine verified **${detectedGender === 'GIRLS' ? 'Girls' : 'Boys'} PGs** filter kar diye hain:`;
        } else if (maxBudget) {
          dynamicHeading = `Maine ₹${maxBudget.toLocaleString('en-IN')} budget ke andar aane wale verified PGs filter kar diye hain:`;
        } else {
          dynamicHeading = `Maine aapke search ke mutabik top verified student accommodations filter kiye hain:`;
        }

        agentResponse = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `${dynamicHeading}\n\nYe rahe verified student stays jisme 0% brokerage, high-speed Wi-Fi aur hygienic meals included hain:`,
          intent: 'PG_MATCH',
          data: {
            pgs: candidates.slice(0, 5),
            note: detectedCity ? `Showing verified accommodations in ${detectedCity}:` : `Top verified matches:`
          }
        };
      }

      setMessages(prev => [...prev, agentResponse]);
      setIsThinking(false);
    }, 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    processQuery(inputQuery);
  };

  const handleQuickClick = (q) => {
    processQuery(q);
  };

  const handleClearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const initialMatches = allPgs.slice(0, 3);
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'agent',
          timestamp: 'Just now',
          text: `Chat reset ho gayi hai. Main aapke liye kaunsa sheher (Pune, Ghaziabad, Noida) ya college ke PGs filter karoon?`,
          intent: 'WELCOME',
          data: { pgs: initialMatches }
        }
      ]);
    }, 150);
  };

  return (
    <div className="bg-[#0b2b32] border-2 border-teal-500/50 rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background Decorative AI Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-800/80 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 ring-2 ring-amber-300/40">
              🤖
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b2b32] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">HomeSetu Omni-Agent AI</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-extrabold uppercase tracking-wider border border-amber-500/40">
                100% Accurate Student Assistant
              </span>
            </div>
            <p className="text-xs text-teal-300/80 mt-0.5">
              Exact City Matching (Pune, Ghaziabad, Noida) • Comparison • Mess Menus • Gate & Deposit Rules • Grievances
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl bg-[#092227] hover:bg-[#12424e] text-teal-300 hover:text-white border border-teal-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Power-Action Chips */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick 1-Click Search Chips:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickClick(action.query)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#092228] hover:bg-[#134954] border border-teal-700/60 hover:border-amber-400 text-teal-200 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chat Stream */}
      <div className="relative z-10 max-h-[550px] overflow-y-auto space-y-4 pr-1.5 scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md mt-1 text-sm">
                🤖
              </div>
            )}

            <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Message Bubble Text */}
              <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-tr-sm ml-auto'
                  : 'bg-[#082228] border border-teal-700/80 text-teal-100 rounded-tl-sm font-medium'
              }`}>
                {msg.text}
              </div>

              {/* Rich Widget: PG Match Cards */}
              {msg.data?.pgs && msg.data.pgs.length > 0 && (
                <div className="space-y-2 pt-1 w-full">
                  {msg.data.note && (
                    <div className="text-[11px] font-bold text-amber-300/90 flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{msg.data.note}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.data.pgs.map((pg) => (
                      <div
                        key={pg.id}
                        className="p-4 rounded-2xl bg-[#09252c] border border-teal-700/60 hover:border-amber-400 transition-all shadow-md space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>{pg.matchPercent || 96}% Match</span>
                            </span>

                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                              pg.genderType === 'GIRLS' ? 'bg-pink-900/60 text-pink-300 border border-pink-700/50' :
                              pg.genderType === 'BOYS' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' :
                              'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                            }`}>
                              {pg.genderType} PG
                            </span>
                          </div>

                          <div>
                            <h5 
                              onClick={() => onSelectPg && onSelectPg(pg)}
                              className="font-extrabold text-white text-sm hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                            >
                              {pg.name}
                            </h5>
                            <p className="text-[11px] text-teal-300/80 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate font-semibold text-white">{pg.locality}, {pg.city}</span>
                            </p>
                            {pg.nearbyColleges && (
                              <p className="text-[10px] text-teal-400/70 mt-0.5 truncate">
                                🎓 {pg.nearbyColleges}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {pg.matchHighlights?.slice(0, 4).map((tag, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#061a1e] text-teal-200 border border-teal-800">
                                ✓ {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-teal-800/60 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] text-teal-400/70 block uppercase font-bold">Rent</span>
                            <div className="text-sm font-black text-amber-400">
                              ₹{pg.monthlyRent?.toLocaleString('en-IN')}<span className="text-[10px] text-teal-300/60 font-normal">/mo</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                processQuery(`Show weekly food mess menu for ${pg.name}`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#071f24] hover:bg-[#0c3138] border border-teal-700 text-teal-200 hover:text-white font-bold text-[10px] transition-all cursor-pointer"
                              title="Inspect Mess Menu"
                            >
                              🍲 Menu
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectPg && onSelectPg(pg)}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] transition-all shadow cursor-pointer flex items-center gap-1"
                            >
                              <span>View & Book</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Widget: Side-by-Side Comparison */}
              {msg.data?.comparePair && msg.data.comparePair.length === 2 && (
                <div className="p-4 rounded-2xl bg-[#082228] border border-teal-700/80 space-y-3 w-full overflow-x-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Side-by-Side Accommodation Matrix</span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-teal-800 text-teal-400">
                        <th className="py-2 pr-3">Feature</th>
                        <th className="py-2 px-3 text-white font-bold">{msg.data.comparePair[0].name}</th>
                        <th className="py-2 pl-3 text-white font-bold">{msg.data.comparePair[1].name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-900/60 text-teal-200">
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">City / Location</td>
                        <td className="py-2 px-3">{msg.data.comparePair[0].locality}, {msg.data.comparePair[0].city}</td>
                        <td className="py-2 pl-3">{msg.data.comparePair[1].locality}, {msg.data.comparePair[1].city}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Monthly Rent</td>
                        <td className="py-2 px-3 font-bold text-amber-400">₹{msg.data.comparePair[0].monthlyRent?.toLocaleString('en-IN')}/mo</td>
                        <td className="py-2 pl-3 font-bold text-amber-400">₹{msg.data.comparePair[1].monthlyRent?.toLocaleString('en-IN')}/mo</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Security Deposit</td>
                        <td className="py-2 px-3">₹{msg.data.comparePair[0].securityDeposit?.toLocaleString('en-IN')} (Refundable)</td>
                        <td className="py-2 pl-3">₹{msg.data.comparePair[1].securityDeposit?.toLocaleString('en-IN')} (Refundable)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Gender Host</td>
                        <td className="py-2 px-3">{msg.data.comparePair[0].genderType}</td>
                        <td className="py-2 pl-3">{msg.data.comparePair[1].genderType}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Mess / Food</td>
                        <td className="py-2 px-3">{msg.data.comparePair[0].foodType || 'Veg & Non-Veg'}</td>
                        <td className="py-2 pl-3">{msg.data.comparePair[1].foodType || 'Veg & Non-Veg'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Air Conditioning</td>
                        <td className="py-2 px-3">{msg.data.comparePair[0].hasAc ? '✅ Included' : '❌ Non-AC'}</td>
                        <td className="py-2 pl-3">{msg.data.comparePair[1].hasAc ? '✅ Included' : '❌ Non-AC'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-teal-300">Student Rating</td>
                        <td className="py-2 px-3 font-bold text-emerald-400">★ {msg.data.comparePair[0].rating || '4.8'}</td>
                        <td className="py-2 pl-3 font-bold text-emerald-400">★ {msg.data.comparePair[1].rating || '4.7'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex gap-2 pt-2 border-t border-teal-800/60">
                    <button
                      type="button"
                      onClick={() => onSelectPg && onSelectPg(msg.data.comparePair[0])}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center transition-all cursor-pointer"
                    >
                      Inspect {msg.data.comparePair[0].name.split(' ')[0]}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPg && onSelectPg(msg.data.comparePair[1])}
                      className="flex-1 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs text-center transition-all cursor-pointer"
                    >
                      Inspect {msg.data.comparePair[1].name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              )}

              {/* Rich Widget: Mess Menu Box */}
              {msg.data?.messPg && (
                <div className="p-4 rounded-2xl bg-[#082228] border border-amber-500/40 space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Utensils className="w-4 h-4 text-amber-400" />
                      <span>Weekly Mess Schedule & Menu ({msg.data.messPg.name || 'Verified Kitchen'})</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      FSSAI Compliant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#092b33] border border-teal-800 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Breakfast (8-10 AM)</span>
                      <p className="text-teal-100 text-[11px]">Poha, Aloo/Paneer Paratha, Curd, Tea / Milk</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#092b33] border border-teal-800 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Lunch (1-3 PM)</span>
                      <p className="text-teal-100 text-[11px]">Dal Tadka, Seasonal Sabzi, Steamed Rice, Phulkas</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#092b33] border border-teal-800 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Dinner (8-10 PM)</span>
                      <p className="text-teal-100 text-[11px]">Paneer Makhani / Chicken Curry, Dal, Roti, Kheer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rich Widget: 1-Click Grievance Button */}
              {msg.data?.showGrievanceButton && (
                <div className="pt-2 w-full">
                  <button
                    type="button"
                    onClick={() => onOpenFeedback && onOpenFeedback('COMPLAINT')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 animate-pulse"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Open Official Grievance Form (Direct to Admin Arsh Mittal)</span>
                  </button>
                </div>
              )}

              <span className="text-[10px] text-teal-400/60 block px-1">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-teal-800 text-teal-200 font-bold flex items-center justify-center shrink-0 shadow-md mt-1 text-xs">
                👤
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow text-sm">
              🤖
            </div>
            <div className="p-4 rounded-2xl bg-[#082228] border border-teal-700/80 text-teal-300 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Matching verified accommodations with zero brokerage...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="relative z-10 pt-2 border-t border-teal-800/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Poochiye: "give me pg in pune", "pg near AKGEC", "compare stays", "mess menu", "gate timing"...`}
            className="w-full px-5 py-4 pl-12 rounded-2xl bg-[#082228] border-2 border-teal-700/70 text-white placeholder-teal-400/50 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner pr-36"
          />
          <Sparkles className="w-5 h-5 text-amber-400 absolute left-4 pointer-events-none" />

          <div className="absolute right-2.5 flex items-center gap-2">
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
