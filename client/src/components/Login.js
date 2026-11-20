import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-[#008ECC] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student &amp; Staff Login</h1>
          <p className="text-xs text-slate-500 mt-1">Access the official College Lost &amp; Found portal</p>
        </div>

        {error && (
          <div className="error-message mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Roll / ID Number
            </label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. student001"
              className="form-input"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400">Default: Uppercase roll no</span>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. STUDENT001"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-2"
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
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2">
            Quick Demo Accounts
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('student001', 'STUDENT001')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border border-slate-200 transition-colors"
            >
              student001
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('student002', 'STUDENT002')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border border-slate-200 transition-colors"
            >
              student002
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('faculty001', 'FACULTY001')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-[#008ECC] text-slate-700 border border-slate-200 transition-colors"
            >
              faculty001
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          New on campus?{' '}
          <Link to="/register" className="font-bold text-[#008ECC] hover:underline">
            Register your Roll Number
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
