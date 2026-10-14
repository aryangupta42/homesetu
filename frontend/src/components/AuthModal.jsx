import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Building2, School, Sparkles, Shield, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register, switchUserRole } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'OWNER' | 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('Pune');
  const [propertyName, setPropertyName] = useState('');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRegisteredSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } else {
      // Validate Admin passcode
      if (role === 'ADMIN' && adminPasscode !== 'admin123' && adminPasscode !== 'ADMIN2026') {
        setError('Invalid Admin Security Passcode. (Hint: use admin123 or ADMIN2026)');
        setLoading(false);
        return;
      }

      const res = await register({
        fullName,
        email,
        password,
        role,
        phone,
        college: role === 'STUDENT' ? college : '',
        city,
        propertyName: role === 'OWNER' ? propertyName : '',
        govtIdNumber: role === 'OWNER' ? govtIdNumber : ''
      });

      if (res.success) {
        setRegisteredSuccessMsg('Account created successfully! Welcome to HomeSetu.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.message || 'Registration failed.');
      }
    }
    setLoading(false);
  };

  const handleQuickDemo = (roleKey) => {
    switchUserRole(roleKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d383f] to-[#0a282e] border-b border-teal-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {isLogin ? 'Sign In to HomeSetu' : 'Create HomeSetu Account'}
            </h3>
            <p className="text-xs text-teal-300/80">Student-Centric PG Discovery & Direct Connect</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-teal-900/60 text-teal-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Roles Quick 1-Click Evaluation Switcher */}
        <div className="p-4 bg-[#092227] border-b border-teal-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Role Login:
            </span>
            <span className="text-[10px] text-teal-400/80 font-mono">3 Core Roles</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-2 px-2 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 rounded-xl border border-amber-500/40 font-bold transition-all text-center flex flex-col items-center gap-0.5"
              title="Student Login (Rahul Verma)"
            >
              <span className="text-sm">🎓</span>
              <span>Student</span>
            </button>
            <button
              onClick={() => handleQuickDemo('owner')}
              className="py-2 px-2 bg-orange-500/20 hover:bg-orange-500 hover:text-white text-orange-300 rounded-xl border border-orange-500/40 font-bold transition-all text-center flex flex-col items-center gap-0.5"
              title="PG Owner Login (Ramesh Sharma)"
            >
              <span className="text-sm">🏢</span>
              <span>PG Owner</span>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-2 bg-purple-500/20 hover:bg-purple-500 hover:text-white text-purple-300 rounded-xl border border-purple-500/40 font-bold transition-all text-center flex flex-col items-center gap-0.5"
              title="Admin Portal Login"
            >
              <span className="text-sm">🛡️</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {registeredSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{registeredSuccessMsg}</span>
            </div>
          )}

          {/* Registration Role Selection */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-teal-300">Select Your Account Type:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    role === 'STUDENT' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md' : 'bg-[#082227] text-teal-300 border-teal-800 hover:bg-teal-900/40'
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('OWNER')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    role === 'OWNER' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-[#082227] text-teal-300 border-teal-800 hover:bg-teal-900/40'
                  }`}
                >
                  🏢 PG Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    role === 'ADMIN' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-[#082227] text-teal-300 border-teal-800 hover:bg-teal-900/40'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}

          {/* Registration specific fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'STUDENT' ? "e.g. Rahul Verma" : role === 'OWNER' ? "e.g. Ramesh Sharma" : "e.g. Admin Official"}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">College / Institute Name</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. College of Engineering Pune (COEP)"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {role === 'OWNER' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1">PG / Property Name</label>
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder="e.g. Sunrise Luxury PG"
                      className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-teal-300 mb-1">Owner Govt ID (Aadhaar / PAN for Verification)</label>
                    <input
                      type="text"
                      required
                      value={govtIdNumber}
                      onChange={(e) => setGovtIdNumber(e.target.value)}
                      placeholder="e.g. 12-digit Aadhaar or 10-digit PAN"
                      className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {role === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">Admin Security Passcode</label>
                  <input
                    type="password"
                    required
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter admin passcode (e.g. admin123)"
                    className="w-full bg-[#082227] border border-purple-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Kota">Kota</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-semibold text-teal-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isLogin ? "student@homesetu.com / owner@homesetu.com" : "youremail@example.com"}
              className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-teal-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-orange-500/20"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In to HomeSetu' : 'Complete Registration'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setRegisteredSuccessMsg(''); }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {isLogin ? "New to HomeSetu? Create an account" : "Already registered? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
