import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Mail, ChevronDown, Menu, X, ArrowRight, LogIn, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';

export default function Header({ onOpenEnquiry, onOpenPortalLogin }) {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pharmaDropdownOpen, setPharmaDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPharmaDropdownOpen(false);
  }, [location.pathname]);

  const pharmaCategories = [
    { 
      name: 'Tablets', 
      path: '/pharmaceutical-products?category=tablets', 
      desc: 'Film-coated & enteric solid formulations'
    },
    { 
      name: 'Capsules', 
      path: '/pharmaceutical-products?category=capsules', 
      desc: 'Sustained & delayed release pellets'
    },
    { 
      name: 'Syrups', 
      path: '/pharmaceutical-products?category=syrups', 
      desc: 'Palatable paediatric & adult syrups'
    },
    { 
      name: 'Suspensions', 
      path: '/pharmaceutical-products?category=suspensions', 
      desc: 'Antacid & paediatric suspensions'
    }
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-forest-100/70 py-3' 
          : 'bg-[#FCFDFB] py-4 sm:py-5 border-b border-forest-50'
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation matching reference image */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-[13.5px] xl:text-[15px] font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'font-semibold text-terracotta-600' 
                    : 'text-forest-950 hover:text-terracotta-600'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span>Home</span>
                  {isActive && (
                    <motion.span 
                      layoutId="header-active-tab"
                      className="w-full h-[2px] bg-terracotta-500 rounded-full mt-1" 
                    />
                  )}
                </div>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'font-semibold text-terracotta-600' 
                    : 'text-forest-950 hover:text-terracotta-600'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span>About Us</span>
                  {isActive && (
                    <motion.span 
                      layoutId="header-active-tab"
                      className="w-full h-[2px] bg-terracotta-500 rounded-full mt-1" 
                    />
                  )}
                </div>
              )}
            </NavLink>

            {/* Pharmaceutical Products with Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setPharmaDropdownOpen(true)}
              onMouseLeave={() => setPharmaDropdownOpen(false)}
            >
              <NavLink
                to="/pharmaceutical-products"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-1.5 transition-colors duration-200 ${
                    isActive 
                      ? 'font-semibold text-terracotta-600' 
                      : 'text-forest-950 hover:text-terracotta-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span>Pharmaceutical Products</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${pharmaDropdownOpen ? 'rotate-180 text-terracotta-600' : 'text-forest-900/70'}`} />
                    </div>
                    {isActive && (
                      <motion.span 
                        layoutId="header-active-tab"
                        className="w-full h-[2px] bg-terracotta-500 rounded-full mt-1" 
                      />
                    )}
                  </div>
                )}
              </NavLink>

              {/* Clean, Minimal & Elegant Dropdown Menu */}
              <AnimatePresence>
                {pharmaDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 w-80 pt-2.5 z-50"
                  >
                    <div className="bg-white rounded-2xl shadow-xl shadow-forest-950/10 border border-forest-100 p-4 overflow-hidden">
                      
                      {/* Clean Header */}
                      <div className="pb-2.5 mb-2 border-b border-forest-100/70">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-forest-800 block">
                          Formulations Portfolio
                        </span>
                      </div>

                      {/* Clean 4 Categories without clutter */}
                      <div className="space-y-1">
                        {pharmaCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.path}
                            className="block px-3 py-2.5 rounded-xl hover:bg-forest-50/70 transition-all duration-150 group"
                          >
                            <span className="text-sm font-bold text-forest-900 group-hover:text-terracotta-600 transition-colors block">
                              {cat.name}
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-600 block mt-0.5 leading-relaxed">
                              {cat.desc}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Clean Bottom Link */}
                      <div className="mt-3 pt-2.5 border-t border-forest-100/70 text-center">
                        <Link
                          to="/pharmaceutical-products"
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors py-1 group"
                        >
                          <span>View All Formulations</span>
                          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/hygiene-products"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'font-semibold text-terracotta-600' 
                    : 'text-forest-950 hover:text-terracotta-600'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span>Hygiene Products</span>
                  {isActive && (
                    <motion.span 
                      layoutId="header-active-tab"
                      className="w-full h-[2px] bg-terracotta-500 rounded-full mt-1" 
                    />
                  )}
                </div>
              )}
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'font-semibold text-terracotta-600' 
                    : 'text-forest-950 hover:text-terracotta-600'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span>Contact</span>
                  {isActive && (
                    <motion.span 
                      layoutId="header-active-tab"
                      className="w-full h-[2px] bg-terracotta-500 rounded-full mt-1" 
                    />
                  )}
                </div>
              )}
            </NavLink>
          </nav>

          {/* Right Action: Portal Login & Enquiry Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenPortalLogin && onOpenPortalLogin()}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-navy-900 hover:bg-navy-950 text-white text-xs sm:text-sm font-semibold border border-navy-700/80 shadow-xs hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2 cursor-pointer"
              aria-label="PharmaPredict AI Portal Login"
              title="PharmaPredict AI Portal Login (NESFIC-I-09)"
            >
              <Lock className="w-3.5 h-3.5 text-terracotta-400 shrink-0" strokeWidth={2.2} />
              <span className="hidden sm:inline">Portal Login</span>
              <span className="sm:hidden">Portal</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenEnquiry && onOpenEnquiry()}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2 cursor-pointer"
              aria-label="Open trade enquiry form"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enquiry</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-forest-900 hover:bg-forest-50 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-b border-forest-100 shadow-xl overflow-hidden"
          >
            <div className="site-container py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              <nav className="flex flex-col space-y-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive ? 'bg-terracotta-50 text-terracotta-600 font-bold' : 'text-forest-950 hover:bg-forest-50'
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive ? 'bg-terracotta-50 text-terracotta-600 font-bold' : 'text-forest-950 hover:bg-forest-50'
                    }`
                  }
                >
                  About Us
                </NavLink>

                {/* Mobile Pharmaceutical Products Dropdown */}
                <div className="rounded-2xl border border-forest-100 overflow-hidden bg-white">
                  <button
                    onClick={() => setPharmaDropdownOpen(!pharmaDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-forest-950 hover:bg-forest-50 transition-colors"
                  >
                    <span>Pharmaceutical Products</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${pharmaDropdownOpen ? 'rotate-180 text-terracotta-600' : 'text-gray-400'}`} />
                  </button>
                  {pharmaDropdownOpen && (
                    <div className="px-3 pb-3 space-y-1.5 bg-forest-50/40 border-t border-forest-100/60 pt-2.5">
                      {pharmaCategories.map((c) => (
                        <Link
                          key={c.name}
                          to={c.path}
                          className="block p-2.5 rounded-xl bg-white border border-forest-100/70 hover:bg-forest-50 transition-colors"
                        >
                          <span className="text-xs font-bold text-forest-900 block">{c.name}</span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">{c.desc}</span>
                        </Link>
                      ))}
                      <div className="pt-1 text-center">
                        <Link
                          to="/pharmaceutical-products"
                          className="inline-block py-1.5 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors"
                        >
                          View All Formulations &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/hygiene-products"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive ? 'bg-terracotta-50 text-terracotta-600 font-bold' : 'text-forest-950 hover:bg-forest-50'
                    }`
                  }
                >
                  Hygiene Products
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive ? 'bg-terracotta-50 text-terracotta-600 font-bold' : 'text-forest-950 hover:bg-forest-50'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </nav>

              <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortalLogin && onOpenPortalLogin();
                  }}
                  className="w-full py-3 rounded-full bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm border border-navy-700/60"
                >
                  <Lock className="w-4 h-4 text-terracotta-400 shrink-0" strokeWidth={2.2} />
                  <span>PharmaPredict AI Portal Login</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEnquiry && onOpenEnquiry();
                  }}
                  className="w-full py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Submit Commercial Enquiry</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
