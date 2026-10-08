import React from 'react';
import { AlertCircle, CheckCircle2, ShieldOff, Zap, Shield, FileCheck2, Wallet, Users, Compass, Building2, MapPin } from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    {
      num: 1,
      title: "New City, No Central Hub",
      desc: "Lack of reliable, centralized PG information leaves students overwhelmed when landing in an unfamiliar place.",
      icon: MapPin
    },
    {
      num: 2,
      title: "Broker Exploitation & High Fees",
      desc: "Heavy dependence on aggressive middlemen demanding huge commissions without guaranteeing room quality.",
      icon: ShieldOff
    },
    {
      num: 3,
      title: "Hard to Compare Value",
      desc: "Difficulty comparing rent, hidden electricity charges, food inclusion, and distance to college across dozens of fragmented listings.",
      icon: AlertCircle
    },
    {
      num: 4,
      title: "Confusing Listings & Wasted Visits",
      desc: "Physical visits in scorching heat only to find rooms are already occupied or look nothing like photos.",
      icon: Building2
    },
    {
      num: 5,
      title: "Time Wastage & Risk of Scams",
      desc: "Outdated numbers, fake deposit claims, and uncertainty about safety and house rules.",
      icon: AlertCircle
    }
  ];

  const objectives = [
    {
      title: "No Brokers, No Middlemen",
      desc: "Students connect directly with verified PG owners — 0% commission, 0 broker hassle, 0 fake listings.",
      icon: ShieldCheckIcon,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Easy & Fast for Students",
      desc: "Search, filter, and compare top student stays in minutes instead of exhausting days of door-to-door physical visits.",
      icon: Zap,
      color: "from-teal-400 to-emerald-500"
    },
    {
      title: "Complete Transparency",
      desc: "Clear itemized rent, security deposit, amenities, food menus, and gate rules upfront — no hidden surprises.",
      icon: FileCheck2,
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Safe & Verified Stays",
      desc: "Carefully verified owners and photo-checked properties build trust for outstation students and parents alike.",
      icon: Shield,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Structured Booking Flow",
      desc: "A formal Request ➔ Owner Review ➔ Confirmation ID process, not an informal or unreliable random chat.",
      icon: FileCheck2,
      color: "from-amber-400 to-orange-600"
    },
    {
      title: "Affordable & Convenient",
      desc: "Budget-friendly options with facility-based filtering, specifically suited to student financial needs.",
      icon: Wallet,
      color: "from-cyan-400 to-blue-500"
    }
  ];

  function ShieldCheckIcon(props) {
    return <Shield {...props} />;
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Problem Statement Section (Slide 2) */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Problem Statement
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Moving to a New City Starts With One Question:{' '}
            <span className="text-amber-400">Where Will I Stay?</span>
          </h2>
          <p className="text-teal-200/80 mt-3 text-sm sm:text-base">
            Every semester, thousands of students relocate to education hubs like Pune, Bengaluru, and Delhi facing stressful accommodation challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.num} 
                className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all hover:-translate-y-1 group"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                <div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center mb-3">
                    {p.num}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-amber-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-teal-200/70 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Objectives & Proposed Solution Section (Slide 3 & 4) */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Objectives & Proposed Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            What <span className="text-amber-400">HomeSetu</span> Sets Out to Achieve
          </h2>
          <p className="text-teal-200/80 mt-3 text-sm sm:text-base">
            A practical, feasible open-source platform connecting students directly with genuine PG owners through verifiable booking workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <div
                key={i}
                className="bg-gradient-to-b from-[#0c3139] to-[#092227] border border-[#17525e] rounded-2xl p-6 hover:border-teal-400/60 transition-all hover:shadow-xl hover:shadow-teal-900/30 flex gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${obj.color} flex items-center justify-center text-slate-950 shrink-0 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {obj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-200/70 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
