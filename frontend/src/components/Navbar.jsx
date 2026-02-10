// src/components/Navbar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaCar, FaTools, FaCalendarAlt, FaHome, FaInfoCircle,
  FaServicestack, FaShoppingCart, FaUser, FaSignOutAlt,
  FaBars, FaTimes
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { itemsCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative py-2 transition-all duration-300 flex items-center gap-2 group ${isActive
      ? "text-blue-500 font-bold"
      : (scrolled || location.pathname !== '/' ? "text-gray-700 hover:text-blue-600 font-medium" : "text-white/90 hover:text-white font-medium")
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 text-lg font-medium border-b border-gray-100 transition-colors ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
    }`;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled || isOpen
      ? "bg-white/90 backdrop-blur-lg shadow-lg py-3"
      : "bg-transparent py-5"
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black flex items-center gap-2 tracking-tighter z-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FaCar className="text-white text-xl" />
            </div>
            <span className={`${scrolled || isOpen || location.pathname !== '/' ? 'text-gray-900' : 'text-white'}`}>
              Prime<span className="text-blue-600">Auto</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            {[
              { to: "/", label: "Home", icon: <FaHome /> },
              { to: "/products", label: "Spare Parts", icon: <FaTools /> },
              { to: "/services", label: "Services", icon: <FaServicestack /> },
              { to: "/about", label: "About", icon: <FaInfoCircle /> },
            ].map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                <span className="text-xs group-hover:scale-110 transition-transform">{link.icon}</span>
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 ${location.pathname === link.to ? 'scale-x-100' : ''}`}></span>
              </NavLink>
            ))}

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {/* Cart Icon */}
            <Link to="/cart" className={`relative p-2 transition-all ${scrolled || location.pathname !== '/' ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}>
              <FaShoppingCart className="text-xl" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className={`flex items-center gap-2 text-sm font-bold transition-all hover:text-blue-500 ${scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}`}>
                  <FaUser className="text-blue-500" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${scrolled || location.pathname !== '/' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              >
                Sign In
              </Link>
            )}

            <NavLink
              to="/booking"
              className="ml-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
            >
              <FaCalendarAlt />
              Book Now
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className={`relative p-2 ${scrolled || isOpen || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}`}>
              <FaShoppingCart className="text-xl" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {itemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className={`text-2xl focus:outline-none transition-colors ${scrolled || isOpen || location.pathname !== '/' ? 'text-gray-900' : 'text-white'}`}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-24 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
        <div className="flex flex-col space-y-1">
          {[
            { to: "/", label: "Home", icon: <FaHome /> },
            { to: "/products", label: "Spare Parts", icon: <FaTools /> },
            { to: "/services", label: "Services", icon: <FaServicestack /> },
            { to: "/about", label: "About", icon: <FaInfoCircle /> },
            { to: "/booking", label: "Book Service", icon: <FaCalendarAlt /> },
          ].map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileNavLinkClass}>
              <span className="text-blue-500 text-xl">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          <div className="p-6 border-t border-gray-100 mt-4">
            {isAuthenticated ? (
              <div className="space-y-4">
                <Link to="/profile" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">View Profile</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" className="flex justify-center items-center py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50">
                  Sign In
                </Link>
                <Link to="/register" className="flex justify-center items-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


