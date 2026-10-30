import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { api } from './api';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import PgCard from './components/PgCard';
import PgFilterSidebar from './components/PgFilterSidebar';
import PgDetailsModal from './components/PgDetailsModal';
import CompareModal from './components/CompareModal';
import StudentDashboard from './components/StudentDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import WelcomeScreen from './components/WelcomeScreen';
import FeedbackModal from './components/FeedbackModal';
import Footer from './components/Footer';
import { Search, SlidersHorizontal, ArrowUpDown, Frown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedUser = localStorage.getItem('homesetu_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.role === 'STUDENT') return 'student-dashboard';
        if (u.role === 'OWNER') return 'owner-dashboard';
        if (u.role === 'ADMIN') return 'admin';
      }
    } catch (e) {}
    return 'explore';
  });
  
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(() => {
    // If not logged in, ALWAYS show Welcome Screen as the primary gateway!
    const user = localStorage.getItem('homesetu_user');
    return !user;
  });
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDefaultType, setFeedbackDefaultType] = useState('COMPLAINT');
  const [adminSubTab, setAdminSubTab] = useState('verifications');

  const openFeedbackModal = (type = 'COMPLAINT') => {
    setFeedbackDefaultType(type);
    setShowFeedbackModal(true);
  };

  // Filters state
  const [filters, setFilters] = useState({
    city: 'All', // Show all PGs across Pune, Bengaluru, Delhi & Kota
    locality: 'All',
    query: '',
    maxRent: null,
    genderType: 'All',
    hasAc: false,
    hasWifi: false,
    foodIncluded: false,
    isVerified: false,
    sortBy: 'newest'
  });

  // Comparison list (up to 3 PGs)
  const [compareList, setCompareList] = useState([]);

  // Modals state
  const [selectedPg, setSelectedPg] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'login', role: null });

  const openAuthModal = (mode = 'login', role = null) => {
    setAuthModalConfig({ isOpen: true, mode, role });
  };

  useEffect(() => {
    fetchPgs();
  }, [filters]);

  const fetchPgs = async () => {
    setLoading(true);
    const data = await api.getPgs(filters);
    setPgs(data);
    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      city: 'All',
      locality: 'All',
      query: '',
      maxRent: null,
      genderType: 'All',
      hasAc: false,
      hasWifi: false,
      foodIncluded: false,
      isVerified: false,
      sortBy: 'newest'
    });
  };

  const toggleCompare = (pg) => {
    if (compareList.some(item => item.id === pg.id)) {
      setCompareList(compareList.filter(item => item.id !== pg.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 PGs simultaneously. Please remove one first.");
        return;
      }
      setCompareList([...compareList, pg]);
    }
  };

  const removeFromCompare = (pgId) => {
    setCompareList(compareList.filter(item => item.id !== pgId));
  };

  if (showWelcomeScreen) {
    return (
      <AuthProvider>
        <WelcomeScreen
          onGetStarted={() => {
            openAuthModal('login', null);
          }}
          onSelectRole={(role) => {
            openAuthModal('login', role);
          }}
          onExploreAsGuest={() => {
            setShowWelcomeScreen(false);
            setActiveTab('explore');
          }}
        />
        {authModalConfig.isOpen && (
          <AuthModal
            initialMode={authModalConfig.mode}
            initialRole={authModalConfig.role}
            onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
            onAuthSuccess={(user) => {
              setShowWelcomeScreen(false);
              if (user.role === 'STUDENT') setActiveTab('student-dashboard');
              else if (user.role === 'OWNER') setActiveTab('owner-dashboard');
              else if (user.role === 'ADMIN') setActiveTab('admin');
            }}
          />
        )}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#081d21] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          compareList={compareList}
          openCompareModal={() => setShowCompareModal(true)}
          openAuthModal={openAuthModal}
          onOpenWelcome={() => setShowWelcomeScreen(true)}
          onOpenFeedback={openFeedbackModal}
          onNavigateAdminTab={(subTab) => {
            setActiveTab('admin');
            setAdminSubTab(subTab || 'feedbacks');
          }}
        />

        {/* Main Content Area based on activeTab */}
        <main className="flex-1">
          {activeTab === 'explore' && (
            <div>
              {/* Hero Section with Quick City Filter, Role Gateway, and Search */}
              <HeroSection
                filters={filters}
                setFilters={setFilters}
                onSearchClick={fetchPgs}
                openAuthModal={openAuthModal}
              />

              {/* Listings Search and Discovery Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Sidebar Filters */}
                  <div className="lg:col-span-1">
                    <PgFilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onReset={resetFilters}
                    />
                  </div>

                  {/* Right Results Grid */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Results header with Sorting */}
                    <div className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <span>Verified Accommodations</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold">
                            {pgs.length}
                          </span>
                        </h2>
                        <p className="text-xs text-teal-300/70 mt-0.5">
                          Showing stays in {filters.city === 'All' ? 'all cities' : filters.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-teal-300">Sort by:</span>
                        <select
                          value={filters.sortBy || 'newest'}
                          onChange={(e) => setFilters(p => ({ ...p, sortBy: e.target.value }))}
                          className="bg-[#082227] border border-teal-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="newest">Recommended</option>
                          <option value="price_asc">Rent: Low to High</option>
                          <option value="price_desc">Rent: High to Low</option>
                          <option value="rating_desc">Highest Rated (★)</option>
                        </select>
                      </div>
                    </div>

                    {/* PG Cards Grid */}
                    {loading ? (
                      <div className="py-20 text-center space-y-3">
                        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-teal-300">Loading verified accommodations...</p>
                      </div>
                    ) : pgs.length === 0 ? (
                      <div className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-12 text-center space-y-4">
                        <Frown className="w-12 h-12 text-teal-400 mx-auto" />
                        <h3 className="text-lg font-bold text-white">No accommodations matched your criteria</h3>
                        <p className="text-xs text-teal-300/70 max-w-sm mx-auto">
                          Try adjusting your max rent budget or clearing specific amenity filters.
                        </p>
                        <button
                          onClick={resetFilters}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {pgs.map((pg) => (
                          <PgCard
                            key={pg.id}
                            pg={pg}
                            onSelect={setSelectedPg}
                            isCompared={compareList.some(item => item.id === pg.id)}
                            toggleCompare={toggleCompare}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'how-it-works' && (
            <HowItWorks />
          )}

          {activeTab === 'student-dashboard' && (
            <StudentDashboard
              onExploreClick={(tab) => setActiveTab(tab || 'explore')}
              openAuthModal={openAuthModal}
              onOpenFeedback={openFeedbackModal}
            />
          )}

          {activeTab === 'owner-dashboard' && (
            <OwnerDashboard
              onExploreClick={(tab) => setActiveTab(tab || 'explore')}
              openAuthModal={openAuthModal}
              onOpenFeedback={openFeedbackModal}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPortal
              onExploreClick={(tab) => setActiveTab(tab || 'explore')}
              openAuthModal={openAuthModal}
              initialSubTab={adminSubTab}
              onSubTabChange={setAdminSubTab}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Modal: PG Details View & Booking */}
        {selectedPg && (
          <PgDetailsModal
            pg={selectedPg}
            onClose={() => setSelectedPg(null)}
          />
        )}

        {/* Modal: Compare Matrix */}
        {showCompareModal && (
          <CompareModal
            compareList={compareList}
            removeFromCompare={removeFromCompare}
            onSelectPg={(pg) => setSelectedPg(pg)}
            onClose={() => setShowCompareModal(false)}
          />
        )}

        {/* Floating Compare Action Dock when user has selected PGs */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 bg-[#09252c]/95 backdrop-blur-md border border-amber-500/70 shadow-2xl rounded-2xl p-3 px-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                {compareList.length}
              </span>
              <span className="text-xs font-bold text-white hidden sm:inline">
                {compareList.length === 1 ? '1 PG Selected' : `${compareList.length} PGs Selected`}
              </span>
            </div>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Compare ({compareList.length})</span>
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-teal-300 hover:text-white underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Modal: Login & Registration */}
        {authModalConfig.isOpen && (
          <AuthModal
            initialMode={authModalConfig.mode}
            initialRole={authModalConfig.role}
            onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
            onAuthSuccess={(user) => {
              if (user.role === 'STUDENT') setActiveTab('student-dashboard');
              else if (user.role === 'OWNER') setActiveTab('owner-dashboard');
              else if (user.role === 'ADMIN') setActiveTab('admin');
            }}
          />
        )}

        {/* Modal: Feedback & Grievance Submissions (Direct to Administrator) */}
        {showFeedbackModal && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            defaultType={feedbackDefaultType}
            pgs={pgs}
          />
        )}
      </div>
    </AuthProvider>
  );
}
