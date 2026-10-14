import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, UploadCloud, FileText, Check, ArrowLeft, ArrowRight, Shield, Building, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ initialMode = 'login', initialRole = null, onClose, onAuthSuccess }) {
  const { login, register } = useAuth();
  
  // If initialRole was passed (e.g. from a specific button), jump straight to form. Otherwise show role gateway!
  const [step, setStep] = useState(initialRole ? 'form' : 'select-role'); // 'select-role' | 'form'
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

  // Select a role from the gateway and move to form
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

      // Strict login requiring correct credentials and matching role
      const res = await login(email, password, selectedRole);
      if (res.success) {
        setSuccessMsg(`Login verified! Welcome ${res.user?.fullName || selectedRole}.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 600);
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
        phone: mobileNumber || '+91 98765 00000',
        college: selectedRole === 'STUDENT' ? collegeName : '',
        studentId: selectedRole === 'STUDENT' ? studentId : '',
        propertyName: selectedRole === 'OWNER' ? propertyName : '',
        address: selectedRole === 'OWNER' ? pgAddress : '',
        verificationDoc: selectedRole === 'OWNER' ? uploadedDocName : '',
        verificationStatus: selectedRole === 'OWNER' ? 'PENDING' : 'VERIFIED',
        city: 'Pune'
      };

      const res = await register(payload);
      if (res.success) {
        setSuccessMsg(`Account created successfully as ${selectedRole}! Logging you in...`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 800);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
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
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

        {/* ================= STEP 1: ROLE SELECTION GATEWAY ================= */}
        {step === 'select-role' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#545ced]">Authentication Gateway</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Who Are You?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your role to access your dedicated, secure portal.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Role Selection Cards */}
            <div className="space-y-3">
              {/* Option 1: Student */}
              <div
                onClick={() => handleSelectRole('STUDENT', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-[#545ced] hover:bg-[#545ced]/5 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#545ced] transition-colors">
                      College Student
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Find & book verified PGs, schedule zero-cost visits, and download official Confirmation IDs.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#545ced] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 2: PG Owner */}
              <div
                onClick={() => handleSelectRole('OWNER', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-[#545ced] hover:bg-[#545ced]/5 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#545ced] transition-colors">
                      PG Property Owner
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Publish accommodations, upload ownership & safety documents, and review student booking requests.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#545ced] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 3: Admin */}
              <div
                onClick={() => handleSelectRole('ADMIN', 'login')}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                      Platform Administrator
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Audit electricity meter bills, verify host government proofs, and grant 100% Verified badges.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 pt-2">
              Strict Role Governance • Only registered credentials can open their authorized portal
            </p>
          </div>
        )}

        {/* ================= STEP 2: EXACT SCREENSHOT FORM (LOGIN / CREATE ACCOUNT) ================= */}
        {step === 'form' && (
          <div>
            {/* Top Bar with Back to Role selection and Close */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <button
                type="button"
                onClick={() => { setStep('select-role'); setError(''); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Role ({getRoleName()})</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content matching exact Image 2 / 3 / 4 */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
              {/* Header Icon & Title */}
              <div>
                <div className="text-4xl mb-2">{getRoleIcon()}</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isLogin ? `Login - ${getRoleName()}` : `Create Account - ${getRoleName()}`}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isLogin ? 'Enter your registered details.' : 'Create your HomeSetu account.'}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Role Credentials Hint with 1-Click Auto-fill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-slate-700 font-semibold">
                    {getRoleName()} Demo ID: <span className="font-mono text-[#545ced] font-bold">{selectedRole === 'STUDENT' ? 'student@homesetu.com' : selectedRole === 'OWNER' ? 'owner@homesetu.com' : 'admin@homesetu.com'}</span>
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Password: <span className="font-mono font-bold text-slate-800">{selectedRole === 'ADMIN' ? 'admin123' : '123456'}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRole === 'STUDENT') {
                      setEmail('student@homesetu.com');
                      setPassword('123456');
                    } else if (selectedRole === 'OWNER') {
                      setEmail('owner@homesetu.com');
                      setPassword('123456');
                    } else if (selectedRole === 'ADMIN') {
                      setEmail('admin@homesetu.com');
                      setPassword('admin123');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#545ced]/10 hover:bg-[#545ced]/20 text-[#545ced] font-bold text-xs border border-[#545ced]/30 transition-all cursor-pointer shadow-sm"
                >
                  ⚡ Auto-fill
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ================= LOGIN FORM (Exact match for media_1791983287152_d2250a3d.png) ================= */}
                {isLogin ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
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
                        <span>Remember Me</span>
                      </label>
                      <span className="text-[#545ced] hover:underline cursor-pointer">Forgot password?</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#545ced] hover:bg-[#434bd8] text-white font-bold text-sm transition-all shadow-md shadow-[#545ced]/30 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>🔐</span>
                      <span>{loading ? `Verifying ${getRoleName()}...` : 'Login'}</span>
                    </button>
                  </>
                ) : (
                  /* ================= SIGN UP FORMS (Images 3 & 4) ================= */
                  <>
                    {/* Row 1: Full Name & Mobile Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
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
                          placeholder="10 digit mobile"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                      />
                    </div>

                    {/* STUDENT SPECIFIC FIELDS (Image 3) */}
                    {selectedRole === 'STUDENT' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            College Name
                          </label>
                          <input
                            type="text"
                            required
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            placeholder="College name"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Student ID
                          </label>
                          <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Student ID (e.g. COEP-2024-91)"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* PG OWNER SPECIFIC FIELDS (Image 4 + Document Upload) */}
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
                            placeholder="Your PG name"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            PG Address
                          </label>
                          <input
                            type="text"
                            required
                            value={pgAddress}
                            onChange={(e) => setPgAddress(e.target.value)}
                            placeholder="Full PG address"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Owner Verification Status
                          </label>
                          <select
                            value={verificationStatus}
                            onChange={(e) => setVerificationStatus(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                          >
                            <option value="Verification Pending">Verification Pending (Requires Document Upload)</option>
                            <option value="Documents Uploaded for Audit">Documents Uploaded for Audit</option>
                          </select>
                        </div>

                        {/* DOCUMENT UPLOAD (Requested explicitly by user) */}
                        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                              <UploadCloud className="w-4 h-4 text-[#545ced]" />
                              <span>Owner Property Document Upload</span>
                            </label>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                              Required for Verification
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-500">
                            Upload Electricity Bill, Property Deed, or Aadhaar Card for Admin verification.
                          </p>

                          <div className="flex items-center gap-3">
                            <label className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#545ced] text-[#545ced] font-bold text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1.5 shrink-0">
                              <UploadCloud className="w-4 h-4" />
                              <span>Choose Document</span>
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>

                            {hasUploadedDoc && (
                              <div className="flex-1 flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-xs">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-semibold text-slate-800 truncate">{uploadedDocName}</span>
                                  <span className="text-slate-400 text-[10px]">({uploadedDocSize})</span>
                                </div>
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* ADMIN SPECIFIC FIELDS */}
                    {selectedRole === 'ADMIN' && (
                      <div>
                        <label className="block text-xs font-bold uppercase text-purple-700 tracking-wider mb-1.5">
                          Admin Security Passcode
                        </label>
                        <input
                          type="password"
                          required
                          value={adminPasscode}
                          onChange={(e) => setAdminPasscode(e.target.value)}
                          placeholder="Enter security passcode (e.g. admin123 or ADMIN2026)"
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-sm font-medium transition-all"
                        />
                      </div>
                    )}

                    {/* Row 4: Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                            placeholder="Create password"
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

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#545ced] focus:ring-2 focus:ring-[#545ced]/20 text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#545ced] hover:bg-[#434bd8] text-white font-bold text-sm transition-all shadow-md shadow-[#545ced]/30 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>📝</span>
                      <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    </button>
                  </>
                )}

                {/* Footer switcher matching Images 2, 3, 4 */}
                <div className="text-center pt-3 border-t border-slate-100">
                  {isLogin ? (
                    <p className="text-sm text-slate-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                        className="text-[#545ced] font-bold border border-[#545ced] px-2 py-0.5 rounded-lg hover:bg-[#545ced]/10 transition-colors inline-block ml-1"
                      >
                        Create Account
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                        className="text-[#545ced] font-bold border border-[#545ced] px-2 py-0.5 rounded-lg hover:bg-[#545ced]/10 transition-colors inline-block ml-1"
                      >
                        Login
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
