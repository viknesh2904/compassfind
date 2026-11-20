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
    'Central Library',
    'Campus Cafeteria',
    'Lecture Hall Complex',
    'Computer Science Lab',
    'Sports Arena',
    'Main Auditorium',
    'Mechanical Workshop',
    'Parking Lot Gate 2',
    'Bus Shelter'
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setError('Please upload an image of the item or representative photo');
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
          : 'Failed to submit report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Report <span className="text-[#008ECC]">Campus Belonging</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit details to broadcast across the college lost &amp; found network.
            </p>
          </div>
          <Link to="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-[#008ECC]">
            &larr; Cancel
          </Link>
        </div>

        {error && (
          <div className="error-message mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Toggle Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Report Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('lost')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  category === 'lost'
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">I Lost an Item</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Misplaced my belongings</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('found')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  category === 'found'
                    ? 'border-[#008ECC] bg-sky-50/60 ring-2 ring-sky-200'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-sky-100 text-[#008ECC] flex items-center justify-center font-bold text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">I Found an Item</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Found someone's property</p>
                </div>
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Apple AirPods Pro (2nd Gen), Casio fx-991EX, Student ID"
              className="form-input"
              required
            />
          </div>

          {/* Location with Quick Suggestions */}
          <div>
            <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campus Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Library 2nd Floor Reading Room"
              className="form-input mb-2"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Suggestions:</span>
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

          {/* Photo Upload */}
          <div>
            <label htmlFor="photo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Item Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#008ECC] rounded-2xl p-5 text-center bg-slate-50 transition-colors">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label htmlFor="photo" className="cursor-pointer block">
                {preview ? (
                  <div className="space-y-3">
                    <img
                      src={preview}
                      alt="Selected item preview"
                      className="max-h-48 mx-auto rounded-xl object-contain shadow-sm border border-slate-200"
                    />
                    <p className="text-xs font-semibold text-[#008ECC] hover:underline">Click to change photo</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-700">Click to upload or drag photo here</p>
                    <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5 MB</p>
                  </div>
                )}
              </label>
            </div>
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
              placeholder="Provide color, brand, unique scratches, stickers, case design, or exact time noticed..."
              className="form-input"
              required
            />
          </div>

          {/* Contact Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="form-input text-xs"
                />
              </div>
            </div>

            {category === 'found' && (
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactPreference}
                    onChange={(e) => setContactPreference(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
                  />
                  <span className="text-xs text-slate-600">
                    <strong>Direct Student Contact:</strong> Allow claimants to view my email/phone directly to claim this item.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing Campus Report...</span>
                </>
              ) : (
                <span>Publish Item Report &rarr;</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportForm;
