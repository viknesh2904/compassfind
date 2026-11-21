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
  const [statusLoading, setStatusLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const isReporter = item && userInfo && item.reportedBy.toLowerCase() === userInfo.rollNumber.toLowerCase();

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

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
      <div className="container mx-auto px-4 py-24 text-center text-slate-500">
        <div className="inline-block w-9 h-9 border-4 border-sky-100 border-t-[#008ECC] rounded-full animate-spin mb-3"></div>
        <p className="font-semibold text-sm text-slate-600">Retrieving item details from database...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center animate-fade-in">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{error || 'Item Not Found'}</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested item record may have been resolved, removed, or is inaccessible in the repository.
          </p>
          <Link
            to="/items"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] transition-all shadow-sm"
          >
            &larr; Back to Items Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl animate-fade-in">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/dashboard" className="hover:text-[#008ECC] transition-colors font-medium">Dashboard</Link>
          <span>/</span>
          <Link to="/items" className="hover:text-[#008ECC] transition-colors font-medium">Items</Link>
          <span>/</span>
          <span className="font-bold text-slate-900 truncate max-w-xs">{item.itemName}</span>
        </div>
        <Link to="/items" className="text-xs font-bold text-[#008ECC] hover:underline flex items-center gap-1.5 transition-colors">
          <span>&larr; Back to Directory</span>
        </Link>
      </div>

      {/* Main Item Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image with Magnifier */}
          <div className="lg:col-span-5 space-y-3">
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-[4/3] flex items-center justify-center"
              onClick={() => setImageModalOpen(true)}
              title="Click to zoom in"
            >
              <img
                src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                alt={item.itemName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-2 backdrop-blur-[2px]">
                <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span>Click to expand</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-400 font-medium">
              Verified campus photo record &bull; Click to view in full resolution
            </p>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges & Heading */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    item.category === 'found'
                      ? 'bg-sky-50 text-[#008ECC] border border-sky-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.category === 'found' ? 'bg-[#008ECC]' : 'bg-rose-500'}`}></span>
                  {item.category === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    item.status === 'returned'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'returned' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                  {item.status === 'returned' ? 'RESOLVED / RECOVERED' : 'OPEN CAMPUS REPORT'}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {item.itemName}
              </h1>
            </div>

            {/* Reporter Action Button: Mark as Returned */}
            {isReporter && item.status === 'open' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="text-xs text-sky-950">
                  <p className="font-bold text-sm text-sky-950">You reported this item!</p>
                  <p className="text-sky-700 text-xs mt-0.5">Has this belonging been handed over or recovered by its owner?</p>
                </div>
                <button
                  onClick={handleMarkReturned}
                  disabled={statusLoading}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
                >
                  {statusLoading ? 'Updating Status...' : 'Mark as Returned'}
                </button>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details &amp; Distinct Marks</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {item.description}
              </p>
            </div>

            {/* Location & Reported By Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Campus Spot Found/Lost</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#008ECC] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{item.location}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reported By Student</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{item.reportedBy}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    &bull; {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            {/* User Entered Phone Number & Email Details */}
            <div className="pt-2">
              <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50/50 p-5 rounded-3xl border border-sky-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sky-200/60">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#008ECC] text-white flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span>Direct Contact Details</span>
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {item.category === 'lost' 
                        ? 'Details entered by the owner. Contact if you have found or secured this belonging.' 
                        : 'Details entered by the finder. Reach out to coordinate handover and verification.'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white rounded-full text-[#008ECC] border border-sky-200 shadow-sm">
                    {item.reportedBy}
                  </span>
                </div>

                {/* Contact Cards: Phone & Email with Copy & Quick-Dial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Phone Number Box */}
                  <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Phone Number
                      </span>
                      {item.contactInfo?.phone && (
                        <button
                          onClick={() => handleCopy(item.contactInfo.phone, 'phone')}
                          className="text-[10px] font-bold text-[#008ECC] hover:underline"
                        >
                          {copiedField === 'phone' ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>

                    {item.contactInfo?.phone ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-slate-900 font-mono">
                          {item.contactInfo.phone}
                        </span>
                        <a
                          href={`tel:${item.contactInfo.phone}`}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] transition-colors"
                        >
                          Call
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No phone number provided</p>
                    )}
                  </div>

                  {/* Email Address Box */}
                  <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Email Address
                      </span>
                      {item.contactInfo?.email && (
                        <button
                          onClick={() => handleCopy(item.contactInfo.email, 'email')}
                          className="text-[10px] font-bold text-[#008ECC] hover:underline"
                        >
                          {copiedField === 'email' ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>

                    {item.contactInfo?.email ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate" title={item.contactInfo.email}>
                          {item.contactInfo.email}
                        </span>
                        <a
                          href={`mailto:${item.contactInfo.email}`}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold text-[#008ECC] bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors flex-shrink-0"
                        >
                          Email
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No email provided</p>
                    )}
                  </div>
                </div>

                {/* Status Notice */}
                {item.status === 'returned' && (
                  <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Item Resolved:</strong> This property has already been returned to its owner.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campus Safe Handover Advisory */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Campus Verification Advice</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                When collecting or returning items, meet at public campus locations (Library Entrance, Security Gate 1, or Department Office) and inspect the student's college ID card.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden border border-slate-200" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10 transition-colors shadow-md"
              title="Close modal (Esc)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
              alt={item.itemName}
              className="max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ItemDetail;
