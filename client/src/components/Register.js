import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || '';
      const { data } = await axios.post(`${API_URL}/api/users/register`, {
        rollNumber: rollNumber.trim().toLowerCase()
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. Roll number may already be registered.'
      );
    } finally {
      setLoading(false);
    }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register Roll Number</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Create your verified student or staff account</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium mb-5 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Registration successful! Loading your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Roll / ID Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 21cs101 or student011"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#008ECC] focus:ring-2 focus:ring-sky-100 transition-all text-slate-900"
                required
              />
            </div>
            
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 mt-3 text-[11px] text-sky-950 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-[#0074A6]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Automated Campus Password</span>
              </p>
              <p className="text-slate-600">
                Your initial login password will automatically be your roll number in <strong>UPPERCASE</strong> (e.g. <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-[#008ECC] font-bold font-mono">21CS101</code>).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-4 active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Student Account...</span>
              </>
            ) : (
              <span>Register &amp; Enter Portal &rarr;</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/" className="font-bold text-[#008ECC] hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
