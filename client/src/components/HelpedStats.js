import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HelpedStats = () => {
  const [helpedUsers, setHelpedUsers] = useState(371);
  const [itemsRecovered, setItemsRecovered] = useState(183);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const API_URL = process.env.REACT_APP_API_URL || '';

        const { data } = await axios.get(`${API_URL}/api/users/stats`, { headers });
        setItemsRecovered(data.itemsRecovered);
        setHelpedUsers(data.helpedUsers);
      } catch (err) {
        setError('Failed to fetch stats. Displaying campus baseline.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/dashboard" className="hover:text-[#008ECC]">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Campus Impact &amp; Stats</span>
      </div>

      {/* Main Stats Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-10 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
            CAMPUS RECOVERY NETWORK
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Till Now <span className="text-[#008ECC]">Helped &amp; Recovered</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time verified records of lost student property returned to their rightful owners through our community platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message mb-6">
          {error}
        </div>
      )}

      {/* Metric Cards (Formal White & Blue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        
        {/* Card 1: Items Recovered */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center hover:border-[#008ECC] hover:shadow-lg transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#008ECC] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-sky-100">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-5xl font-extrabold text-[#008ECC] mb-2 tracking-tight">
            {loading ? '...' : itemsRecovered}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Items Recovered &amp; Returned
          </h3>
          <p className="text-xs text-slate-500">
            Valuable student electronics, IDs, wallets, keys, and academic notes successfully reunited.
          </p>
        </div>

        {/* Card 2: Helped Users */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center hover:border-emerald-500 hover:shadow-lg transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-emerald-100">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-5xl font-extrabold text-emerald-600 mb-2 tracking-tight">
            {loading ? '...' : helpedUsers}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Helped Students &amp; Faculty
          </h3>
          <p className="text-xs text-slate-500">
            Total registered campus members who recovered their items or helped a peer.
          </p>
        </div>
      </div>

      {/* Community Recovery Highlights */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 mb-10">
        <h2 className="section-heading-highlight text-xl font-bold">
          Campus Recovery <span className="highlight-word">Milestones</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-slate-900 block mb-1">94%</span>
            <span className="text-xs font-semibold text-slate-600">ID Cards &amp; Wallets Returned</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-slate-900 block mb-1">&lt; 48 Hrs</span>
            <span className="text-xs font-semibold text-slate-600">Average Claim Time</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-2xl font-black text-slate-900 block mb-1">100%</span>
            <span className="text-xs font-semibold text-slate-600">Campus Verification Rate</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            <p className="font-bold text-slate-900">Did you find or recover an item today?</p>
            <p className="text-slate-500">Keep our campus safe and connected by reporting found property promptly.</p>
          </div>
          <Link
            to="/report"
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-sm transition-all whitespace-nowrap"
          >
            + Report Belonging
          </Link>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link to="/dashboard" className="text-xs font-bold text-[#008ECC] hover:underline">
          &larr; Back to Campus Dashboard
        </Link>
      </div>

    </div>
  );
};

export default HelpedStats;
