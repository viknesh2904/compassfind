import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const isReporter = item && userInfo && item.reportedBy.toLowerCase() === userInfo.rollNumber.toLowerCase();

  const handleMarkReturned = async () => {
    if (!item || !userInfo) return;
    setStatusLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.put(
        `${API_URL}/api/items/${item._id}/status`,
        { status: 'returned' },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setItem({ ...item, status: 'returned' });
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const API_URL = process.env.REACT_APP_API_URL || '';
        const token = userInfo?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get(`${API_URL}/api/items/${id}`, { headers });
        setItem(data);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to fetch item details from database'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemDetails();
    }
  }, [id, userInfo?.token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-slate-500">
        <div className="inline-block w-8 h-8 border-4 border-sky-200 border-t-[#008ECC] rounded-full animate-spin mb-3"></div>
        <p className="font-semibold text-sm">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{error || 'Item Not Found'}</h2>
          <p className="text-xs text-slate-500">
            The requested item may have been removed or does not exist in the campus database.
          </p>
          <Link
            to="/items"
            className="inline-block px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] transition-colors"
          >
            &larr; Back to Items Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/dashboard" className="hover:text-[#008ECC]">Dashboard</Link>
          <span>/</span>
          <Link to="/items" className="hover:text-[#008ECC]">Items</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-xs">{item.itemName}</span>
        </div>
        <Link to="/items" className="text-xs font-bold text-[#008ECC] hover:underline flex items-center gap-1">
          <span>&larr; Back to Directory</span>
        </Link>
      </div>

      {/* Main Item Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image with Magnifier */}
          <div className="lg:col-span-5 space-y-3">
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm aspect-[4/3] flex items-center justify-center"
              onClick={() => setImageModalOpen(true)}
            >
              <img
                src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                alt={item.itemName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Click to enlarge photo</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-400">
              Verified campus photo record - Tap image to expand
            </p>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges & Heading */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.category === 'found'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.category === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'returned'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status === 'returned' ? 'RESOLVED / RETURNED' : 'OPEN REPORT'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.itemName}
              </h1>
            </div>

            {/* Reporter Action Button: Mark as Returned */}
            {isReporter && item.status === 'open' && (
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-sky-900">
                  <p className="font-bold">You reported this item!</p>
                  <p className="text-sky-700 text-[11px]">Has this item been returned or recovered by its rightful owner?</p>
                </div>
                <button
                  onClick={handleMarkReturned}
                  disabled={statusLoading}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors whitespace-nowrap"
                >
                  {statusLoading ? 'Updating...' : 'Mark as Returned'}
                </button>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {/* Location & Reported By Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Campus Location</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{item.location}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Reported By</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{item.reportedBy}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({new Date(item.createdAt).toLocaleDateString()})
                  </span>
                </p>
              </div>
            </div>

            {/* Contact & Claim Box */}
            <div className="pt-2">
              {item.category === 'found' && item.status === 'open' && !isReporter && item.contactPreference ? (
                <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Claim This Found Item</h4>
                      <p className="text-xs text-slate-600">The finder agreed to share contact info directly with student claimants.</p>
                    </div>
                    {!showContact && (
                      <button
                        onClick={() => setShowContact(true)}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] rounded-full shadow transition-all"
                      >
                        Reveal Contact Info
                      </button>
                    )}
                  </div>

                  {showContact && (
                    <div className="pt-3 border-t border-sky-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.contactInfo?.email && (
                        <div className="bg-white p-3 rounded-xl border border-sky-200 text-xs">
                          <span className="text-slate-400 font-bold block text-[10px] uppercase">Email Address</span>
                          <a href={`mailto:${item.contactInfo.email}`} className="font-semibold text-[#008ECC] hover:underline">
                            {item.contactInfo.email}
                          </a>
                        </div>
                      )}
                      {item.contactInfo?.phone && (
                        <div className="bg-white p-3 rounded-xl border border-sky-200 text-xs">
                          <span className="text-slate-400 font-bold block text-[10px] uppercase">Phone Number</span>
                          <a href={`tel:${item.contactInfo.phone}`} className="font-semibold text-slate-800">
                            {item.contactInfo.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : item.status === 'returned' ? (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-xs text-emerald-800">
                    <p className="font-bold">Item Successfully Returned</p>
                    <p className="text-[11px] text-emerald-700">This report has been resolved and verified by the campus community.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Standard Campus Desk Verification</p>
                  <p className="text-[11px]">
                    To claim this belonging, visit the <strong>Campus Security Desk (Admin Block Room 102)</strong> with your physical Student ID card.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10"
            >
              X
            </button>
            <img
              src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
              alt={item.itemName}
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ItemDetail;
