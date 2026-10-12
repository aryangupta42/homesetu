import React, { useState } from 'react';
import { Home, Compass, GitCompare, HelpCircle, User, Shield, LogOut, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, compareList, openCompareModal, openAuthModal }) {
  const { currentUser, logout, switchUserRole } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#092227]/95 backdrop-blur-md border-b border-[#144852] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-teal-100 to-amber-300 bg-clip-text text-transparent">
                HomeSetu
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50 font-medium">
                Student Living
              </span>
            </div>
            <p className="text-[11px] text-teal-300/80 hidden md:block">
              Connecting Students with the Right Place to Stay
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0d343c]/80 p-1.5 rounded-full border border-[#17525e]">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#144852]'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover PGs
          </button>

          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'how-it-works'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#144852]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            How It Works
          </button>

          <button
            onClick={() => setActiveTab('problem-solution')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'problem-solution'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#144852]'
            }`}
          >
            <Shield className="w-4 h-4" />
            Why HomeSetu
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Compare Button */}
          <button
            onClick={openCompareModal}
            className="relative px-3.5 py-2 rounded-xl bg-[#113e47] hover:bg-[#17525e] border border-teal-700/40 text-slate-200 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Compare</span>
            {compareList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center animate-pulse">
                {compareList.length}
              </span>
            )}
          </button>

          {/* User Status / Role Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#113e47] border border-teal-700/40 hover:border-teal-500 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                    {currentUser.fullName}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal uppercase ${
                      currentUser.role === 'OWNER' ? 'bg-orange-900/60 text-orange-300 border border-orange-700/40' :
                      currentUser.role === 'ADMIN' ? 'bg-purple-900/60 text-purple-300 border border-purple-700/40' :
                      'bg-teal-900/60 text-teal-300 border border-teal-700/40'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-teal-300/70 truncate max-w-[130px]">
                    {currentUser.college || currentUser.city || currentUser.email}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0a2930] rounded-xl border border-teal-700/50 shadow-2xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-teal-800/60">
                    <p className="text-xs text-teal-400 font-medium">Logged in as:</p>
                    <p className="font-semibold text-white truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-teal-300/70">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'STUDENT' && (
                      <button
                        onClick={() => { setActiveTab('student-dashboard'); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-900/40 flex items-center gap-2 text-teal-100"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        Student Dashboard & Bookings
                      </button>
                    )}

                    {currentUser.role === 'OWNER' && (
                      <button
                        onClick={() => { setActiveTab('owner-dashboard'); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-900/40 flex items-center gap-2 text-teal-100"
                      >
                        <Building className="w-4 h-4 text-orange-400" />
                        PG Owner Dashboard & Requests
                      </button>
                    )}

                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => { setActiveTab('admin'); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-teal-900/40 flex items-center gap-2 text-teal-100"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        Admin Verification Portal
                      </button>
                    )}
                  </div>

                  <div className="border-t border-teal-800/60 pt-2 px-3 pb-1">
                    <p className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider mb-1.5">
                      Demo Persona Switch:
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => { switchUserRole('leader'); setShowUserDropdown(false); }}
                        className={`text-[11px] py-1 px-1 rounded text-center transition-colors ${
                          currentUser.fullName === 'Arsh Mittal' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-teal-900/60 text-teal-200 hover:bg-teal-800'
                        }`}
                        title="Arsh Mittal (Team Leader)"
                      >
                        Arsh 👑
                      </button>
                      <button
                        onClick={() => { switchUserRole('student'); setShowUserDropdown(false); }}
                        className={`text-[11px] py-1 px-1 rounded text-center transition-colors ${
                          currentUser.fullName === 'Aryan Gupta' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-teal-900/60 text-teal-200 hover:bg-teal-800'
                        }`}
                        title="Aryan Gupta (Student)"
                      >
                        Aryan
                      </button>
                      <button
                        onClick={() => { switchUserRole('owner'); setShowUserDropdown(false); }}
                        className={`text-[11px] py-1 px-1 rounded text-center transition-colors ${
                          currentUser.role === 'OWNER' ? 'bg-orange-500 text-white font-semibold' : 'bg-teal-900/60 text-teal-200 hover:bg-teal-800'
                        }`}
                      >
                        Owner
                      </button>
                      <button
                        onClick={() => { switchUserRole('admin'); setShowUserDropdown(false); }}
                        className={`text-[11px] py-1 px-1 rounded text-center transition-colors ${
                          currentUser.role === 'ADMIN' ? 'bg-purple-500 text-white font-semibold' : 'bg-teal-900/60 text-teal-200 hover:bg-teal-800'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-teal-800/60 mt-2 pt-1">
                    <button
                      onClick={() => { logout(); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-300 hover:text-red-200 flex items-center gap-2 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-amber-500/20"
            >
              Sign In
            </button>
          )}

          {/* Quick Dashboard shortcut button */}
          {currentUser && (
            <button
              onClick={() => {
                if (currentUser.role === 'STUDENT') setActiveTab('student-dashboard');
                else if (currentUser.role === 'OWNER') setActiveTab('owner-dashboard');
                else if (currentUser.role === 'ADMIN') setActiveTab('admin');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-sm transition-all shadow-md"
            >
              <span>{currentUser.role === 'OWNER' ? 'Owner Portal' : currentUser.role === 'ADMIN' ? 'Admin Portal' : 'My Requests'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
