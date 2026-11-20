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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/dashboard" className="hover:text-[#008ECC]">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Campus Items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Campus Lost &amp; Found <span className="text-[#008ECC]">Directory</span>
          </h1>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <span>+</span>
          <span>Report Item</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter Panel */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <svg className="w-4 h-4 text-[#008ECC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter Catalog</span>
              </h3>
              {(categoryFilter !== 'all' || statusFilter !== 'all' || locationFilter !== 'all' || searchTerm !== '') && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#008ECC] hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    categoryFilter === 'all' ? 'bg-white text-[#008ECC] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('lost')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    categoryFilter === 'lost' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('found')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    categoryFilter === 'found' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC]"
              >
                <option value="all">All Statuses (Open &amp; Returned)</option>
                <option value="open">Open Reports Only</option>
                <option value="returned">Returned to Owner</option>
              </select>
            </div>

            {/* Campus Location Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Campus Zone</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC]"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008ECC]"
              >
                <option value="latest">Latest Reports First</option>
                <option value="oldest">Oldest Reports First</option>
              </select>
            </div>

            {/* Tips Box */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
              <p><strong>Note:</strong> Report lost valuables with clear distinguishing marks for fast verification.</p>
            </div>
          </div>
        </aside>

        {/* Main Items Grid */}
        <main className="flex-1">
          
          {/* Active Search & Stats Header Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Type to filter items in list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-full focus:bg-white text-slate-800 focus:outline-none focus:border-[#008ECC]"
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
                >
                  X
                </button>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-600 self-start sm:self-auto">
              Found <span className="font-bold text-[#008ECC]">{filteredItems.length}</span> items
            </div>
          </div>

          {error && (
            <div className="error-message mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
              <div className="inline-block w-8 h-8 border-4 border-sky-200 border-t-[#008ECC] rounded-full animate-spin mb-3"></div>
              <p className="font-semibold text-sm">Loading items from campus database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching campus items found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No items match your active search and filter options. Try resetting your filters or search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 text-xs font-bold text-white bg-[#008ECC] rounded-full hover:bg-[#0074A6] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Link
                  to={`/items/${item._id}`}
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#008ECC] hover:shadow-xl transition-all duration-300 p-4 flex flex-col group"
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
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status === 'returned' ? 'RESOLVED' : 'OPEN REPORT'}
                    </span>
                  </div>

                  {/* Image Container with Zoom */}
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-50 mb-3.5 flex items-center justify-center">
                    <img
                      src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          )}
        </main>
      </div>
    </div>
  );
};

export default ItemsList;
