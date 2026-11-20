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
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-[#008ECC] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register Roll Number</h1>
          <p className="text-xs text-slate-500 mt-1">Create your verified student account</p>
        </div>

        {error && (
          <div className="error-message mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message mb-5 text-center">
            Registration successful! Redirecting to campus dashboard...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 2023cs108 or student009"
              className="form-input"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Your initial password will automatically be your roll number in <strong>UPPERCASE</strong> (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[#008ECC]">STUDENT009</code>).
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-4"
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

        <div className="text-center mt-6 text-xs text-slate-500">
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
