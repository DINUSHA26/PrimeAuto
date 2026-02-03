// src/components/Navbar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaCar, FaTools, FaCalendarAlt, FaHome, FaInfoCircle, FaServicestack, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
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

  const navLinkClass = ({ isActive }) =>
    `relative py-2 transition-all duration-300 flex items-center gap-2 group ${isActive ? "text-blue-500 font-bold" : (scrolled || location.pathname !== '/' ? "text-gray-700 hover:text-blue-600 font-medium" : "text-white/90 hover:text-white font-medium")
    }`;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-white/80 backdrop-blur-lg shadow-lg py-3"
      : "bg-transparent py-5"
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black flex items-center gap-2 tracking-tighter"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FaCar className="text-white text-xl" />
            </div>
            <span className={`${scrolled || location.pathname !== '/' ? 'text-gray-900' : 'text-white'}`}>
              Prime<span className="text-blue-600">Auto</span>
            </span>
          </Link>

          {/* Navigation Links */}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


