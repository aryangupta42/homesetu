import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, UploadCloud, FileText, Check, ArrowLeft, ArrowRight, Shield, Building, User, Lock, Sparkles, Key, ExternalLink } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export default function AuthModal({ initialMode = 'login', initialRole = null, onClose, onAuthSuccess }) {
  const { login, register } = useAuth();
  
  // Steps: 'select-role' | 'form' | 'demo'
  const [step, setStep] = useState(initialRole ? 'form' : 'select-role');
  const [selectedRole, setSelectedRole] = useState(initialRole || 'STUDENT'); // 'STUDENT' | 'OWNER' | 'ADMIN'
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Student specific
  const [collegeName, setCollegeName] = useState('');
  const [studentId, setStudentId] = useState('');

  // PG Owner specific
  const [propertyName, setPropertyName] = useState('');
  const [pgAddress, setPgAddress] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Verification Pending');
  const [uploadedDocName, setUploadedDocName] = useState('electricity_bill_deed.pdf');
  const [uploadedDocSize, setUploadedDocSize] = useState('1.8 MB');
  const [hasUploadedDoc, setHasUploadedDoc] = useState(true);

  // Admin specific
  const [adminPasscode, setAdminPasscode] = useState('');

  // Status & Errors
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Select a role from gateway
  const handleSelectRole = (roleKey, mode = 'login') => {
    setSelectedRole(roleKey);
    setIsLogin(mode === 'login');
    setError('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setMobileNumber('');
    setCollegeName('');
    setStudentId('');
    setPropertyName('');
    setPgAddress('');
    setAdminPasscode('');
    setStep('form');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
      setUploadedDocSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
      setHasUploadedDoc(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        setLoading(false);
        return;
      }

      const res = await login(email, password, selectedRole);
      if (res.success) {
        setSuccessMsg(`Login verified! Welcome ${res.user?.fullName || selectedRole}.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 500);
      } else {
        setError(res.message || 'Invalid email or password. Please verify your credentials.');
      }
    } else {
      // Registration Validation
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-check.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      if (selectedRole === 'ADMIN' && adminPasscode !== 'admin123' && adminPasscode !== 'ADMIN2026') {
        setError('Invalid Admin Security Passcode. (Hint: use admin123 or ADMIN2026)');
        setLoading(false);
        return;
      }

      const payload = {
        fullName,
        email,
        password,
        role: selectedRole,
        phone: mobileNumber || '+91 98111 00000',
        college: selectedRole === 'STUDENT' ? collegeName : '',
        studentId: selectedRole === 'STUDENT' ? studentId : '',
        propertyName: selectedRole === 'OWNER' ? propertyName : '',
        address: selectedRole === 'OWNER' ? pgAddress : '',
        verificationDoc: selectedRole === 'OWNER' ? (uploadedDocName || 'electricity_bill_deed.pdf') : '',
        city: selectedRole === 'OWNER' && pgAddress && pgAddress.includes(',') ? pgAddress.split(',').pop().trim() : 'Ghaziabad'
      };

      const res = await register(payload);
      if (res.success) {
        if (selectedRole === 'OWNER') {
          setSuccessMsg(`Account & "${propertyName || 'PG Property'}" registered! Awaiting platform administrator verification...`);
        } else {
          setSuccessMsg(`Account created successfully as ${selectedRole}! Redirecting to dashboard...`);
        }
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 700);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  // Quick Demo Login Handler (triggers actual backend API authentication)
  const handleQuickDemoLogin = async (acc, role) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const res = await login(acc.email, acc.password, role);
    if (res.success) {
      setSuccessMsg(`Demo authenticated as ${acc.fullName}! Opening ${role === 'OWNER' ? 'Owner' : role === 'ADMIN' ? 'Admin' : 'Student'} Dashboard...`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }, 500);
    } else {
      setError(res.message || "Failed to log in with demo account.");
    }
    setLoading(false);
  };

  const getRoleIcon = () => {
    if (selectedRole === 'STUDENT') return '🎓';
    if (selectedRole === 'OWNER') return '🏢';
    return '🛡️';
  };

  const getRoleName = () => {
    if (selectedRole === 'STUDENT') return 'Student';
    if (selectedRole === 'OWNER') return 'PG Owner';
    return 'Admin';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

        {/* ================= STEP 1: ROLE SELECTION GATEWAY (3 PERSONAS ONLY) ================= */}
        {step === 'select-role' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#545ced]">Role Selection Gateway</span>
                <h2 className="text-2xl font-black text-slate-900 mt-0.5">Choose Your Persona</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your role to access your dedicated portal with pre-loaded demo accounts.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Persona Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Option 1: College Student */}
              <div
                onClick={() => handleSelectRole('STUDENT', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform ring-1 ring-amber-300">
                    🎓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                        College Student
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        0% Brokerage
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Discover verified PGs near your campus, compare amenities, send booking requests & track confirmation IDs.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 2: PG Property Owner */}
              <div
                onClick={() => handleSelectRole('OWNER', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform ring-1 ring-orange-300">
                    🏢
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-orange-700 transition-colors">
                        PG Property Owner
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                        Owner Portal
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Publish accommodations, update vacant bed counts, review student applications and approve bookings.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 3: Administrator */}
              <div
                onClick={() => handleSelectRole('ADMIN', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform ring-1 ring-purple-300">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                        Administrator
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                        Admin Audit
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Audit property deeds, verify owner credentials, resolve grievance tickets, and monitor all platform activity.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

            </div>

            <p className="text-center text-[11px] text-slate-400 pt-1">
              Protected with Spring Data JPA & MySQL • Role-based access control strictly enforced
            </p>
          </div>
        )}

        {/* ================= STEP 2: ROLE FORM (LOGIN / REGISTER WITH DIRECT DEMO CARDS) ================= */}
        {step === 'form' && (
          <div>
            {/* Top Bar with Back and Close */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <button
                type="button"
                onClick={() => { setStep('select-role'); setError(''); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Persona ({getRoleName()})</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Persona Pill & Login/Register Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getRoleIcon()}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authenticated Portal</span>
                    <h2 className="text-xl font-black text-slate-900">{getRoleName()} Access</h2>
                  </div>
                </div>

                {selectedRole !== 'ADMIN' && (
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback messages */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ROLE-SPECIFIC 1-CLICK DEMO ACCOUNTS (Visible only for this persona) */}
              {isLogin && selectedRole === 'STUDENT' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                        1-Click Student Demo Accounts
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                      5 Pre-loaded Students
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-950/80">
                    Click any student below to immediately log in and explore student dashboard & campus PGs:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {DEMO_USERS.students.map((st, idx) => (
                      <button
                        key={st.email}
                        type="button"
                        disabled={loading}
                        onClick={() => handleQuickDemoLogin(st, 'STUDENT')}
                        className="p-2.5 rounded-xl border border-amber-200 bg-white hover:border-amber-500 hover:bg-amber-100/60 transition-all text-left flex items-center justify-between group shadow-2xs hover:shadow-sm cursor-pointer"
                      >
                        <div className="min-w-0 pr-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900 group-hover:text-amber-800 truncate">
                              {st.fullName}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                              S{idx + 1}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {st.college.split(',')[0]}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white px-2 py-1 rounded-lg transition-colors shrink-0">
                          Login →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLogin && selectedRole === 'OWNER' && (
                <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-orange-900">
                        1-Click PG Owner Demo Accounts
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 font-bold">
                      5 Owners (25 PGs)
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-950/80">
                    Click any owner below to manage accommodations, customize features & review bookings:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {DEMO_USERS.owners.map((ow, idx) => (
                      <button
                        key={ow.email}
                        type="button"
                        disabled={loading}
                        onClick={() => handleQuickDemoLogin(ow, 'OWNER')}
                        className="p-2.5 rounded-xl border border-orange-200 bg-white hover:border-orange-500 hover:bg-orange-100/60 transition-all text-left flex items-center justify-between group shadow-2xs hover:shadow-sm cursor-pointer"
                      >
                        <div className="min-w-0 pr-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900 group-hover:text-orange-800 truncate">
                              {ow.fullName}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-orange-100 text-orange-800 font-mono font-bold">
                              O{idx + 1}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {ow.propertyName.replace(/\(.*?\)/g, '').trim()}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white px-2 py-1 rounded-lg transition-colors shrink-0">
                          Login →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedRole === 'ADMIN' && (
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                        1-Click Administrator Demo
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                      Full Access
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-950/80">
                    Audit deeds, resolve grievance tickets, and monitor all platform activities:
                  </p>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemoLogin(DEMO_USERS.admin, 'ADMIN')}
                    className="w-full p-3 rounded-xl border border-purple-200 bg-white hover:border-purple-600 hover:bg-purple-100/50 transition-all text-left flex items-center justify-between group shadow-2xs hover:shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        🛡️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-900">
                            {DEMO_USERS.admin.fullName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-semibold">
                            {DEMO_USERS.admin.email}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Pre-verified credentials • Audit deeds & grievances hub
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-white bg-purple-600 group-hover:bg-purple-700 px-3 py-1.5 rounded-xl transition-all shadow-sm">
                      Login →
                    </span>
                  </button>
                </div>
              )}

              {/* Divider if in Login mode */}
              {isLogin && (
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Sign In With Custom Credentials
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* LOGIN FORM */}
                {isLogin ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Email Address / Login ID
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedRole === 'STUDENT' ? 'student1@homesetu.demo' :
                          selectedRole === 'OWNER' ? 'owner1@homesetu.demo' : 'arshm2772@gmail.com'
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-[#545ced] focus:ring-[#545ced]"
                        />
                        <span>Remember credentials</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedRole === 'STUDENT') {
                            setEmail('student1@homesetu.demo');
                            setPassword('Student@123');
                          } else if (selectedRole === 'OWNER') {
                            setEmail('owner1@homesetu.demo');
                            setPassword('Owner@123');
                          } else if (selectedRole === 'ADMIN') {
                            setEmail('arshm2772@gmail.com');
                            setPassword('123456');
                          }
                        }}
                        className="text-[#545ced] font-bold hover:underline"
                      >
                        Auto-fill Demo
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#545ced] hover:bg-[#434bd8] text-white font-bold text-sm transition-all shadow-md shadow-[#545ced]/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{loading ? `Verifying ${getRoleName()}...` : `Login as ${getRoleName()}`}</span>
                    </button>
                  </>
                ) : (
                  /* REGISTRATION FORM */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          {selectedRole === 'OWNER' ? 'Owner Name' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="10-digit mobile"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@college.edu or gmail"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                      />
                    </div>

                    {/* Student Specific Fields */}
                    {selectedRole === 'STUDENT' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            College / University Name
                          </label>
                          <input
                            type="text"
                            required
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            placeholder="e.g. ABES EC / AKGEC"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Student ID / Roll No.
                          </label>
                          <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="e.g. ABES-2023-CS-042"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* PG Owner Specific Fields */}
                    {selectedRole === 'OWNER' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            PG / Property Name
                          </label>
                          <input
                            type="text"
                            required
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                            placeholder="e.g. Chauhan Luxury Residency"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Property Address & Locality
                          </label>
                          <input
                            type="text"
                            required
                            value={pgAddress}
                            onChange={(e) => setPgAddress(e.target.value)}
                            placeholder="e.g. Crossings Republik / Indirapuram, Ghaziabad"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs flex items-start gap-2.5">
                          <UploadCloud className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-orange-950">Ownership & Verification Document</p>
                            <p className="text-orange-800 text-[11px] mt-0.5">
                              Attached: <span className="font-mono font-semibold">{uploadedDocName}</span> (Electricity bill/deed).
                              Admins audit this before issuing the Verified Badge.
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#545ced] hover:bg-[#434bd8] text-white font-bold text-sm transition-all shadow-md shadow-[#545ced]/30 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{loading ? 'Creating Account...' : `Register as ${getRoleName()}`}</span>
                    </button>
                  </>
                )}
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
