// src/components/Footer.jsx
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Prime<span className="text-blue-500">Auto</span></h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your trusted partner for quality auto spare parts and professional
              services. We bring excellence to every repair and part we sell.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/products", label: "Spare Parts" },
                { to: "/services", label: "Services" },
                { to: "/booking", label: "Book Service" }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Support</h3>
            <ul className="space-y-3">
              {[
                { to: "/shipping-policy", label: "Shipping Policy" },
                { to: "/returns-exchanges", label: "Returns & Exchanges" },
                { to: "/faqs", label: "FAQs" },
                { to: "/privacy-policy", label: "Privacy Policy" }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                  <FaPhone size={14} />
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500 font-bold mb-1">Call Us</span>
                  <span className="text-white">+94 72 904 4825</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500 font-bold mb-1">Email Us</span>
                  <span className="text-white">manidudinusha@gmail.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500 font-bold mb-1">Visit Us</span>
                  <span className="text-white">644/B Kajuhena Road, Makola, Sri Lanka</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PrimeAuto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
