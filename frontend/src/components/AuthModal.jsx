import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Building2, School, Sparkles, Check } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register, switchUserRole } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('Pune');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Login failed');
      }
    } else {
      const res = await register({ fullName, email, password, role, phone, college, city });
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const handleQuickDemo = (roleKey) => {
    switchUserRole(roleKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-[#0d383f] border-b border-teal-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {isLogin ? 'Sign In to HomeSetu' : 'Create HomeSetu Account'}
            </h3>
            <p className="text-xs text-teal-300/80">Connecting Students with the Right Place to Stay</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-teal-900/60 text-teal-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher Buttons */}
        <div className="p-4 bg-[#092227] border-b border-teal-800/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick 1-Click Evaluation Logins:
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              onClick={() => handleQuickDemo('leader')}
              className="py-1.5 px-1 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 rounded-lg border border-amber-500/40 font-semibold transition-colors text-center truncate"
              title="Arsh Mittal (Team Leader)"
            >
              Arsh 👑
            </button>
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-1.5 px-1 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 rounded-lg border border-amber-500/40 font-semibold transition-colors text-center truncate"
              title="Aryan Gupta (Student)"
            >
              Aryan
            </button>
            <button
              onClick={() => handleQuickDemo('owner')}
              className="py-1.5 px-1 bg-orange-500/20 hover:bg-orange-500 hover:text-white text-orange-300 rounded-lg border border-orange-500/40 font-semibold transition-colors text-center truncate"
            >
              Owner
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-1 bg-purple-500/20 hover:bg-purple-500 hover:text-white text-purple-300 rounded-lg border border-purple-500/40 font-semibold transition-colors text-center truncate"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">I am a:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      role === 'STUDENT' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-[#082227] text-teal-300 border-teal-800'
                    }`}
                  >
                    🎓 College Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('OWNER')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      role === 'OWNER' ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#082227] text-teal-300 border-teal-800'
                    }`}
                  >
                    🏢 PG Owner
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aryan Gupta"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">College / Institute</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. COEP Pune"
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-teal-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aryan@homesetu.com"
              className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
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
              className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-orange-500/20"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
