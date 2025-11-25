import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Sprout, User, LogOut,
  ClipboardList, LayoutDashboard, ChevronDown
} from 'lucide-react';
import { useAppContext } from '../App';
import { Footer } from './Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin agar tidak error
gsap.registerPlugin(ScrollTrigger);

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { cart, user, isAuthenticated, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ref untuk Header
  const headerRef = useRef<HTMLElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // --- GSAP HEADER ANIMATION (Sticky Shrink) ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header mengecil
      gsap.to(headerRef.current, {
        scrollTrigger: {
          start: "top top",
          end: "+=100",
          scrub: true,
        },
        height: "64px",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        duration: 0.1
      });

      // Logo mengecil dikit
      gsap.to(logoTextRef.current, {
        scrollTrigger: {
          start: "top top",
          end: "+=100",
          scrub: true,
        },
        fontSize: "1.1rem",
        duration: 0.1
      });
    });

    return () => ctx.revert();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-melon-600 font-bold' : 'text-slate-600 font-medium hover:text-melon-600';

  return (
    <div className="flex flex-col min-h-screen bg-melon-50 font-sans text-slate-800">

      {/* HEADER */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-transparent transition-all h-20 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">

            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
              <div className="bg-melon-500 p-1.5 rounded-lg shadow-sm group-hover:bg-melon-600 transition-colors">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span ref={logoTextRef} className="font-bold text-xl tracking-tight text-melon-900 hidden sm:block transition-all group-hover:text-melon-700">
                Central Melon
              </span>
            </Link>

            {/* NAVIGASI TENGAH */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Beranda</Link>
              <Link to="/catalog" className={isActive('/catalog')}>Katalog</Link>
              <Link to="/services" className={isActive('/services')}>Jasa Greenhouse</Link>
              <Link to="/about" className={isActive('/about')}>Tentang Kami</Link>
              <Link to="/help" className={isActive('/help')}>Bantuan</Link>
            </nav>

            {/* KANAN (CART, USER) */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/seller" className="hidden lg:flex items-center px-3 py-1.5 bg-melon-50 text-melon-700 text-xs font-bold rounded-full border border-melon-200 hover:bg-melon-100 transition-colors">
                <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                Mode Petani
              </Link>

              {/* CART ICON DENGAN ID UNTUK TARGET ANIMASI */}
              <Link
                to="/cart"
                id="cart-icon-dest" // <--- INI KUNCI ANIMASI FLY-TO-CART
                className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-melon-600 transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* USER DROPDOWN */}
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-melon-200 bg-gray-100 flex items-center justify-center">
                      {user.picture ? <img src={user.picture} alt={user.username} className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-melon-400" />}
                    </div>
                    <div className="text-right hidden xl:block">
                      <div className="text-xs text-gray-500">Halo,</div>
                      <div className="text-sm font-bold text-melon-700 leading-none max-w-[100px] truncate">{user.username}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 hidden xl:block transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in origin-top-right z-50">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400">Login sebagai</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-melon-50 hover:text-melon-700"><User className="h-4 w-4 mr-2" /> Edit Profil</Link>
                      <Link to="/orders" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-melon-50 hover:text-melon-700"><ClipboardList className="h-4 w-4 mr-2" /> Riwayat Pesanan</Link>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4 mr-2" /> Keluar</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center px-5 py-2 bg-melon-600 text-white text-sm font-bold rounded-full hover:bg-melon-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Masuk</Link>
              )}

              {/* Mobile Menu Toggle */}
              <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg border-b border-gray-100 p-4 animate-fade-in-down">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Beranda</Link>
              <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Katalog</Link>
              <Link to="/services" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Jasa Greenhouse</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Tentang Kami</Link>
              <Link to="/help" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">Bantuan</Link>

              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="mt-2 px-4 py-3 bg-melon-600 text-white text-center rounded-lg font-bold text-sm">Masuk Sekarang</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};