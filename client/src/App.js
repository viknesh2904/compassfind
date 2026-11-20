import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import DashboardWithFloatingButton from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ItemsList from './components/ItemsList';
import ItemDetail from './components/ItemDetail';
import HelpedStats from './components/HelpedStats';

// Header with Search and Navigation
const NavigationHeader = ({ user, handleLogout }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/items');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Main Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">
          
          {/* Brand Logo & Name */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-[#008ECC] flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Campus<span className="text-[#008ECC]">Find</span>
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-slate-500 tracking-wider uppercase -mt-1">
                College Lost &amp; Found
              </span>
            </div>
          </Link>

          {/* Center Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search lost items, roll numbers, locations (e.g. AirPods, Library)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-300 rounded-full focus:bg-white focus:outline-none focus:border-[#008ECC] focus:ring-2 focus:ring-sky-100 transition-all text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 text-xs font-semibold bg-[#008ECC] hover:bg-[#0074A6] text-white rounded-full transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Links & User Status */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'text-[#008ECC]' : 'text-slate-600 hover:text-[#008ECC]'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/items"
              className={`text-sm font-semibold transition-colors ${isActive('/items') ? 'text-[#008ECC]' : 'text-slate-600 hover:text-[#008ECC]'}`}
            >
              Browse Items
            </Link>
            <Link
              to="/helped"
              className={`text-sm font-semibold transition-colors ${isActive('/helped') ? 'text-[#008ECC]' : 'text-slate-600 hover:text-[#008ECC]'}`}
            >
              Helped Stats
            </Link>

            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#008ECC] hover:bg-[#0074A6] rounded-full shadow-sm hover:shadow transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Report Item
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-[#008ECC] font-bold text-xs flex items-center justify-center border border-sky-200">
                    {user.rollNumber ? user.rollNumber.substring(0, 2).toUpperCase() : 'ST'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">{user.rollNumber}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">Verified Student</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 rounded transition-colors"
                  title="Sign out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link to="/" className="text-xs font-bold text-[#008ECC] hover:underline px-2 py-1">
                  Login
                </Link>
                <Link to="/register" className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Link
                to="/report"
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#008ECC] rounded-full"
              >
                + Report
              </Link>
            )}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search items, location, roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-50 border border-slate-300 rounded-full focus:bg-white text-slate-800"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 text-xs font-semibold bg-[#008ECC] text-white rounded-full"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile dropdown menu */}
        {isNavOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200">
            <nav className="flex flex-col space-y-2">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setIsNavOpen(false)}>
                Dashboard
              </Link>
              <Link to="/items" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setIsNavOpen(false)}>
                Browse All Items
              </Link>
              <Link to="/report" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setIsNavOpen(false)}>
                Report Lost / Found Item
              </Link>
              <Link to="/helped" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setIsNavOpen(false)}>
                Helped Stats
              </Link>
              {user ? (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                  <span className="text-xs font-semibold text-slate-600">Logged in as: <strong>{user.rollNumber}</strong></span>
                  <button
                    onClick={() => { handleLogout(); setIsNavOpen(false); }}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2 border-t border-slate-100 px-3">
                  <Link to="/" className="text-xs font-bold text-[#008ECC]" onClick={() => setIsNavOpen(false)}>Login</Link>
                  <Link to="/register" className="text-xs font-bold text-slate-700" onClick={() => setIsNavOpen(false)}>Register</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Category Pills Bar with Clean SVG Badges (No Emojis) */}
      <div className="border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            <Link to="/items" className="category-pill active">
              <span>All Reports</span>
            </Link>
            <Link to="/items?category=lost" className="category-pill">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Lost Items</span>
            </Link>
            <Link to="/items?category=found" className="category-pill">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Found Items</span>
            </Link>
            <Link to="/items?search=Library" className="category-pill">
              <span>Central Library</span>
            </Link>
            <Link to="/items?search=Cafeteria" className="category-pill">
              <span>Cafeteria</span>
            </Link>
            <Link to="/items?search=Lecture" className="category-pill">
              <span>Lecture Halls</span>
            </Link>
            <Link to="/items?search=Lab" className="category-pill">
              <span>Computer Labs</span>
            </Link>
            <Link to="/items?search=Sports" className="category-pill">
              <span>Sports Arena</span>
            </Link>
            <Link to="/items?search=Auditorium" className="category-pill">
              <span>Auditorium</span>
            </Link>
            <Link to="/items?search=Parking" className="category-pill">
              <span>Parking Lot</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// Formal Template Mega Blue Footer with Clean SVG Icons
const MegaFooter = () => (
  <footer className="bg-[#008ECC] text-white mt-auto pt-14 pb-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-sky-400/40">
        
        {/* Brand & Contact Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white text-[#008ECC] flex items-center justify-center font-black">
              CF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CampusFind</span>
          </div>
          <p className="text-sm text-sky-100 mb-4 leading-relaxed">
            The official centralized platform for reporting, recovering, and tracking misplaced student belongings across college grounds.
          </p>
          <div className="space-y-2.5 text-xs text-sky-100">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Campus Security &amp; Lost Desk, Admin Block Room 102</span>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Campus Helpline: +91 98765 00000</span>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>lostfound@campus.edu</span>
            </p>
          </div>
        </div>

        {/* Quick Portal Links */}
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-white">Quick Navigation</h4>
          <ul className="space-y-2 text-sm text-sky-100">
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
            <li><Link to="/items" className="hover:text-white transition-colors">Browse Reported Items</Link></li>
            <li><Link to="/report" className="hover:text-white transition-colors">Report Lost / Found Belonging</Link></li>
            <li><Link to="/helped" className="hover:text-white transition-colors">Campus Helped Statistics</Link></li>
            <li><Link to="/items?category=lost" className="hover:text-white transition-colors">Active Lost Items</Link></li>
            <li><Link to="/items?category=found" className="hover:text-white transition-colors">Recovered &amp; Found Items</Link></li>
          </ul>
        </div>

        {/* Campus Recovery Guidelines */}
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-white">Campus Guidelines</h4>
          <ul className="space-y-2 text-sm text-sky-100">
            <li>- Present valid College ID card to claim belongings</li>
            <li>- Found valuables must be surrendered within 24 hours</li>
            <li>- Unclaimed items held safely for 30 academic days</li>
            <li>- Electronics require unlock or serial verification</li>
            <li>- Direct contact with student reporter where permitted</li>
          </ul>
        </div>

        {/* Campus Hours & Verification */}
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase mb-4 text-white">Lost &amp; Found Desk Hours</h4>
          <div className="bg-sky-700/50 p-4 rounded-xl border border-sky-400/30 text-xs text-sky-100 space-y-2">
            <p><strong>Monday - Friday:</strong> 08:30 AM - 06:00 PM</p>
            <p><strong>Saturday:</strong> 09:00 AM - 01:00 PM</p>
            <p><strong>Sunday &amp; Holidays:</strong> Security Main Gate Desk</p>
            <div className="pt-2 border-t border-sky-400/30 text-[11px] text-sky-200">
              Emergency lost item report? Contact Campus Security Dispatch immediately.
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-200 gap-3">
        <p>&copy; {new Date().getFullYear()} College Campus Lost &amp; Found Platform. All rights reserved.</p>
        <p className="flex gap-4">
          <span className="hover:text-white cursor-pointer">Security Protocol</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Privacy Guidelines</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Campus Terms</span>
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        <NavigationHeader user={user} handleLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />}
            />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardWithFloatingButton /> : <Navigate to="/" />} 
            />
            <Route
              path="/helped"
              element={user ? <HelpedStats /> : <Navigate to="/" />}
            />
            <Route 
              path="/report" 
              element={user ? <ReportForm user={user} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/items" 
              element={user ? <ItemsList /> : <Navigate to="/" />} 
            />
            <Route 
              path="/items/:id" 
              element={user ? <ItemDetail /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
          </Routes>
        </main>

        <MegaFooter />
      </div>
    </Router>
  );
}

export default App;
