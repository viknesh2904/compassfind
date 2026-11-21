import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePill, setActivePill] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const API_URL = process.env.REACT_APP_API_URL || '';
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        rollNumber: rollNumber.trim().toLowerCase(),
        password
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Invalid roll number or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (roll, pass) => {
    setRollNumber(roll);
    setPassword(pass);
    setActivePill(roll);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 w-full max-w-md relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-200/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0074A6] via-[#008ECC] to-sky-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/25">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student &amp; Staff Login</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Access the official College Lost &amp; Found portal</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Roll / ID Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. student001"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#008ECC] focus:ring-2 focus:ring-sky-100 transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Default: Uppercase roll no</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. STUDENT001"
                className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#008ECC] focus:ring-2 focus:ring-sky-100 transition-all text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-3 active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to CampusFind &rarr;</span>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            1-Click Demo Accounts
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoCredentials('student001', 'STUDENT001')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activePill === 'student001'
                  ? 'bg-[#008ECC] text-white border-[#008ECC] shadow-sm'
                  : 'bg-slate-50 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border-slate-200'
              }`}
            >
              student001
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('student002', 'STUDENT002')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activePill === 'student002'
                  ? 'bg-[#008ECC] text-white border-[#008ECC] shadow-sm'
                  : 'bg-slate-50 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border-slate-200'
              }`}
            >
              student002
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin001', 'ADMIN001')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activePill === 'admin001'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              admin001
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('faculty001', 'FACULTY001')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activePill === 'faculty001'
                  ? 'bg-[#008ECC] text-white border-[#008ECC] shadow-sm'
                  : 'bg-slate-50 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border-slate-200'
              }`}
            >
              faculty001
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500 font-medium">
          New student on campus?{' '}
          <Link to="/register" className="font-bold text-[#008ECC] hover:underline">
            Register your Roll Number
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
