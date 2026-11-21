import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ helpedUsers: 371, itemsRecovered: 183 });
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = userInfo?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const API_URL = process.env.REACT_APP_API_URL || '';

        // Fetch recent items
        const { data: itemsData } = await axios.get(`${API_URL}/api/items?status=all&sortBy=latest`, { headers });
        setItems(itemsData);

        // Fetch live stats
        try {
          const { data: statsData } = await axios.get(`${API_URL}/api/users/stats`, { headers });
          if (statsData) setStats(statsData);
        } catch (e) {
          // Fallback to initial stats
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo?.token]);

  // Smooth scroll helper for horizontal track
  const scrollTrack = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Hero carousel slides
  const slides = [
    {
      badge: 'OFFICIAL CAMPUS REPOSITORY',
      title: 'SMART CAMPUS RECOVERY.',
      subtitle: 'Official college platform to report, track, and recover misplaced student belongings quickly and securely.',
      highlight: 'UP TO 100% VERIFIED',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      actionText: 'Report an Item',
      actionLink: '/report'
    },
    {
      badge: 'CENTRALIZED DESK',
      title: 'LOST SOMETHING ON CAMPUS?',
      subtitle: 'Browse all items reported today across Library, Cafeteria, Computer Labs, and Seminar Halls.',
      highlight: '370+ HELPED STUDENTS',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      actionText: 'Browse All Items',
      actionLink: '/items'
    }
  ];

  const campusLocations = [
    { name: 'Library', code: 'LIB', query: 'Library', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Cafeteria', code: 'CAF', query: 'Cafeteria', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Lecture Halls', code: 'LEC', query: 'Lecture', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Computer Labs', code: 'LAB', query: 'Lab', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Sports Arena', code: 'SPT', query: 'Sports', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'Auditorium', code: 'AUD', query: 'Auditorium', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'Parking Lot', code: 'PRK', query: 'Parking', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { name: 'Hostels', code: 'HST', query: 'Hostel', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { name: 'Admin Block', code: 'ADM', query: 'Admin', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  ];

  const openItems = items.filter(i => i.status === 'open');
  const returnedItems = items.filter(i => i.status === 'returned');

  // Hero carousel auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-fade-in">

      {/* Hero Carousel Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white shadow-xl min-h-[340px] flex items-center border border-slate-800">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              {slides[activeSlide].badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {slides[activeSlide].title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {slides[activeSlide].subtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={slides[activeSlide].actionLink}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#008ECC] hover:bg-[#0074A6] text-white shadow-lg shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 active:scale-95"
              >
                <span>{slides[activeSlide].actionText}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/items"
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all"
              >
                View Live Reports
              </Link>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="flex-shrink-0 relative hidden sm:block">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr from-sky-600/30 to-slate-800/80 p-3.5 border border-sky-400/30 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center">
              <img
                src={slides[activeSlide].image}
                alt="Campus Recovery"
                className="w-36 h-36 object-cover rounded-2xl shadow-lg mb-3"
              />
              <span className="text-xs font-bold text-sky-300 tracking-wider uppercase">
                {slides[activeSlide].highlight}
              </span>
              <span className="text-[11px] text-slate-300 font-medium mt-0.5">
                {stats.helpedUsers} Students Helped &bull; {stats.itemsRecovered} Recovered
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Chevrons */}
        <button
          onClick={() => setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all ${activeSlide === idx ? 'w-8 bg-[#008ECC]' : 'w-2 bg-white/40'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Item Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <h2 className="section-heading-highlight text-xl sm:text-2xl">
            Recent Lost &amp; Found <span className="highlight-word">Reports</span>
          </h2>
          <div className="flex items-center gap-3">
            <Link to="/items" className="text-sm font-bold text-[#008ECC] hover:underline flex items-center gap-1">
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={() => scrollTrack('left')}
                className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#008ECC] hover:text-[#008ECC] bg-white flex items-center justify-center text-slate-600 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollTrack('right')}
                className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#008ECC] hover:text-[#008ECC] bg-white flex items-center justify-center text-slate-600 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-sky-200 border-t-[#008ECC] rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Loading campus reports...</span>
          </div>
        ) : openItems.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white rounded-3xl border border-slate-200">
            No open reports currently. All items have been recovered.
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-5 overflow-x-auto custom-scrollbar scroll-smooth py-3 px-1"
          >
            {openItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="product-card group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      item.category === 'found'
                        ? 'bg-sky-50 text-[#008ECC] border border-sky-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.category === 'found' ? 'FOUND' : 'LOST'}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Open
                  </span>
                </div>

                {/* Centered Image Container */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 mb-3 flex items-center justify-center">
                  <img
                    src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#008ECC] transition-colors truncate mb-1" title={item.itemName}>
                  {item.itemName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2 truncate">
                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{item.location}</span>
                </p>

                <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>By: <strong className="text-slate-700">{item.reportedBy}</strong></span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Circular Campus Location Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <h2 className="section-heading-highlight text-xl sm:text-2xl">
            Browse by <span className="highlight-word">Campus Location</span>
          </h2>
          <Link to="/items" className="text-sm font-bold text-[#008ECC] hover:underline flex items-center gap-1">
            <span>View All</span>
            <span>&gt;</span>
          </Link>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1">
          {campusLocations.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/items?search=${encodeURIComponent(loc.query)}`)}
              className="category-bubble"
            >
              <div className={`category-bubble-ring shadow-sm font-black text-xs tracking-wider border ${loc.color}`}>
                <span>{loc.code}</span>
              </div>
              <span className="category-bubble-label">{loc.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Recently Returned & Resolved Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <h2 className="section-heading-highlight text-xl sm:text-2xl">
            Recently Returned &amp; <span className="highlight-word">Recovered Items</span>
          </h2>
          <Link to="/helped" className="text-sm font-bold text-[#008ECC] hover:underline flex items-center gap-1">
            <span>View Stats</span>
            <span>&gt;</span>
          </Link>
        </div>

        {returnedItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            No returned items yet. Mark items as returned once retrieved.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {returnedItems.slice(0, 4).map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="surface-card p-4 rounded-2xl hover:border-[#008ECC] hover:shadow-lg transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
                    RESOLVED / RETURNED
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-[#008ECC] transition-colors truncate">
                  {item.itemName}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{item.location}</span>
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Recovered</span>
                  <span className="text-emerald-600 font-semibold">Resolved</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Campus Recovery Guide Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#008ECC] transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#008ECC] flex items-center justify-center flex-shrink-0 border border-sky-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Lost Something?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Search real-time campus reports or submit a lost report with description and contact preference.
            </p>
            <Link to="/report" className="text-xs font-bold text-[#008ECC] hover:underline">
              Submit Lost Report &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#008ECC] transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Found an Item?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Upload a picture, select the location, and let the rightful owner reach out or claim it at the desk.
            </p>
            <Link to="/report" className="text-xs font-bold text-emerald-600 hover:underline">
              Report Found Belonging &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#008ECC] transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Verified Claiming</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Always carry your College ID Card for verification when claiming items at the Campus Security Desk.
            </p>
            <Link to="/helped" className="text-xs font-bold text-amber-600 hover:underline">
              View Recovery Stats &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// Clean Floating Stats Button (No Emojis)
const FloatingHelpedStatsButton = () => (
  <Link
    to="/helped"
    className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#008ECC] hover:bg-[#0074A6] text-white shadow-xl shadow-sky-500/30 border-2 border-white transition-all transform hover:scale-105"
    aria-label="View Till Now Helped Stats"
  >
    <svg className="w-5 h-5 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <div className="text-left hidden sm:block">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-200 leading-none">Campus Impact</p>
      <p className="text-xs font-bold leading-none mt-0.5">Helped Stats</p>
    </div>
  </Link>
);

const DashboardWithFloatingButton = () => (
  <>
    <Dashboard />
    <FloatingHelpedStatsButton />
  </>
);

export default DashboardWithFloatingButton;
