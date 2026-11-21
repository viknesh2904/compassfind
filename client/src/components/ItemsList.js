import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const search = params.get('search');
    const stat = params.get('status');

    if (cat) setCategoryFilter(cat);
    if (search) setSearchTerm(search);
    if (stat) setStatusFilter(stat);
  }, [location.search]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError('');
        const API_URL = process.env.REACT_APP_API_URL || '';
        let url = `${API_URL}/api/items?`;

        if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
        if (statusFilter !== 'all') url += `status=${statusFilter}&`;
        if (sortBy === 'latest') url += 'sortBy=createdAt&order=desc';
        else if (sortBy === 'oldest') url += 'sortBy=createdAt&order=asc';

        const token = userInfo?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get(url, { headers });
        setItems(data);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to fetch items from campus database'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryFilter, statusFilter, sortBy, userInfo?.token]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === 'all' ||
      item.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
    setSortBy('latest');
    setSearchTerm('');
  };

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all' || locationFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <Link to="/dashboard" className="hover:text-[#008ECC] transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Campus Items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Campus Lost &amp; Found <span className="text-[#008ECC]">Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified lost and found records across all college faculties, labs, and grounds.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/report"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-sm hover:shadow transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Report Item</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter Panel */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-[#008ECC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter Catalog</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#008ECC] hover:text-[#0074A6] font-semibold transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    categoryFilter === 'all' ? 'bg-white text-[#008ECC] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('lost')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    categoryFilter === 'lost' ? 'bg-rose-50 text-rose-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('found')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    categoryFilter === 'found' ? 'bg-sky-50 text-sky-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Report Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
              >
                <option value="all">All Statuses (Open &amp; Resolved)</option>
                <option value="open">Open Reports Only</option>
                <option value="returned">Returned / Resolved Only</option>
              </select>
            </div>

            {/* Campus Location Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Campus Zone</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
              >
                <option value="all">All Campus Locations</option>
                <option value="Library">Central Library</option>
                <option value="Cafeteria">Campus Cafeteria</option>
                <option value="Lecture">Lecture Hall Complex</option>
                <option value="Lab">Computer Science / Labs</option>
                <option value="Sports">Sports Arena / Complex</option>
                <option value="Auditorium">Main Auditorium</option>
                <option value="Workshop">Mechanical Workshop</option>
                <option value="Parking">Campus Parking Lot</option>
                <option value="Bus">Bus Shelter / Gate</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
              >
                <option value="latest">Latest Reports First</option>
                <option value="oldest">Oldest Reports First</option>
              </select>
            </div>

            {/* Security Advisory Box */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-2 text-slate-600">
                <svg className="w-4 h-4 text-[#008ECC] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Items are held securely at security checkpoints or department offices. Bring campus ID to claim.</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Items View */}
        <main className="flex-1 min-w-0">
          
          {/* Active Search & Stats Header Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search items, tags, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-full focus:bg-white text-slate-800 focus:outline-none focus:border-[#008ECC] transition-colors"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  title="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Right Controls: Count & Layout Switcher */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <div className="text-xs font-semibold text-slate-600">
                Showing <span className="font-bold text-[#008ECC]">{filteredItems.length}</span> of {items.length} items
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#008ECC] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-[#008ECC] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {error && (
            <div className="error-message mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-24 text-slate-500 bg-white rounded-2xl border border-slate-200">
              <div className="inline-block w-8 h-8 border-4 border-sky-200 border-t-[#008ECC] rounded-full animate-spin mb-3"></div>
              <p className="font-semibold text-sm">Loading items from campus database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching campus items found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                No items match your active search and filter options. Try resetting your search filters or report a new item if you have found or lost something.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                <Link
                  to="/report"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#008ECC] rounded-full hover:bg-[#0074A6] transition-colors"
                >
                  Report Item Now
                </Link>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Link
                  to={`/items/${item._id}`}
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#008ECC] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col group"
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.category === 'found'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.category === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'returned' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {item.status === 'returned' ? 'RESOLVED' : 'OPEN REPORT'}
                    </span>
                  </div>

                  {/* Image Container */}
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-50 mb-3.5 flex items-center justify-center relative">
                    <img
                      src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 group-hover:text-[#008ECC] transition-colors text-base truncate mb-1" title={item.itemName}>
                    {item.itemName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Location & Metadata */}
                  <div className="mt-auto pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <svg className="w-3.5 h-3.5 text-[#008ECC] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate font-medium text-slate-700">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Reported by: <strong className="text-slate-600">{item.reportedBy}</strong></span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Link
                  to={`/items/${item._id}`}
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#008ECC] hover:shadow-md transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Information Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.category === 'found'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.category === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.status === 'returned'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'returned' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.status === 'returned' ? 'RESOLVED' : 'OPEN'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-[#008ECC] transition-colors text-base truncate mb-1">
                      {item.itemName}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1 truncate">
                        <svg className="w-3.5 h-3.5 text-[#008ECC] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-slate-700 truncate">{item.location}</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <span>Reporter: <strong className="text-slate-700">{item.reportedBy}</strong></span>
                      <span className="text-slate-300">|</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="self-end sm:self-center flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-[#008ECC] bg-sky-50 group-hover:bg-[#008ECC] group-hover:text-white rounded-xl transition-all">
                      <span>View Details</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ItemsList;