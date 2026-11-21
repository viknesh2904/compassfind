import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportForm = ({ user }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('lost');
  const [contactPreference, setContactPreference] = useState(false);

  const navigate = useNavigate();

  const campusSuggestions = [
    'Central Library (1st Floor)',
    'Campus Cafeteria',
    'Lecture Hall Complex',
    'Computer Science Lab 3',
    'Main Sports Arena',
    'University Auditorium',
    'Mechanical Workshop Block',
    'Main Gate Bus Terminal',
    'East Campus Parking Lot'
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB');
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setError('Please upload an image or representative photo of the item');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('itemName', itemName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('photo', photo);
      formData.append('contactInfo', JSON.stringify({ email, phone }));
      formData.append('reportedBy', user.rollNumber);
      formData.append('category', category);
      if (category === 'found') {
        formData.append('contactPreference', contactPreference ? 'true' : 'false');
      }

      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.post(`${API_URL}/api/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      navigate('/items');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to submit report. Please verify connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl animate-fadeIn">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/dashboard" className="hover:text-[#008ECC] transition-colors">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <Link to="/items" className="hover:text-[#008ECC] transition-colors">Campus Items</Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">New Report</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-100 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#008ECC] border border-sky-100 mb-2">
              CAMPUS COMMUNITY BULLETIN
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report <span className="text-[#008ECC]">Belonging</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit official details to broadcast across our campus network.
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs font-semibold text-slate-500 hover:text-[#008ECC] flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Cancel</span>
          </Link>
        </div>

        {error && (
          <div className="error-message mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Classification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-[#008ECC] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Report Classification</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('lost')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  category === 'lost'
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">I Lost an Item</p>
                  <p className="text-xs text-slate-500 mt-0.5">Misplaced a personal possession on campus</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('found')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  category === 'found'
                    ? 'border-[#008ECC] bg-sky-50/60 ring-2 ring-sky-200'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#008ECC] flex items-center justify-center flex-shrink-0 font-bold">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">I Found an Item</p>
                  <p className="text-xs text-slate-500 mt-0.5">Found unattended property on campus grounds</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Item Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-[#008ECC] text-white text-[11px] font-bold flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Item Information &amp; Photo</h3>
            </div>

            {/* Item Title */}
            <div>
              <label htmlFor="itemName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Apple AirPods Pro (2nd Gen), Casio Scientific Calculator, Dell Charger"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:outline-none focus:border-[#008ECC] transition-colors"
                required
              />
            </div>

            {/* Location & Quick Chips */}
            <div>
              <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-2.5">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central Library 2nd Floor Reading Room or Main Cafeteria"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-slate-800 focus:bg-white focus:outline-none focus:border-[#008ECC] transition-colors"
                  required
                />
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Quick Select:</span>
                {campusSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLocation(sug)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-sky-50 hover:text-[#008ECC] rounded-lg text-slate-600 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload Container */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Photo Upload <span className="text-red-500">*</span>
              </label>
              
              {preview ? (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    <img src={preview} alt="Selected item" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <p className="text-xs font-bold text-slate-800">{photo?.name}</p>
                    <p className="text-[11px] text-slate-500">{(photo?.size / 1024).toFixed(1)} KB uploaded</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                      <label htmlFor="photo" className="text-xs font-semibold text-[#008ECC] hover:underline cursor-pointer">
                        Change Photo
                      </label>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-[#008ECC] rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label htmlFor="photo" className="cursor-pointer block space-y-2">
                    <div className="w-12 h-12 rounded-full bg-sky-50 text-[#008ECC] flex items-center justify-center mx-auto border border-sky-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose photo or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-400">
                      JPEG, PNG, WEBP files up to 5 MB accepted
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brand, color, stickers, unique scratches, protective case, or specific serial details..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:outline-none focus:border-[#008ECC] transition-colors"
                required
              />
            </div>
          </div>

          {/* Section 3: Contact & Privacy */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-[#008ECC] text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact &amp; Handover Details</h3>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#008ECC]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#008ECC]"
                  />
                </div>
              </div>

              {category === 'found' && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactPreference}
                      onChange={(e) => setContactPreference(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      <strong>Direct Student Contact:</strong> Allow verified claimants to view my phone/email directly to claim this item. If unchecked, handover will be coordinated via campus security.
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Broadcasting Report to Campus...</span>
                </>
              ) : (
                <>
                  <span>Publish Item Report</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportForm;