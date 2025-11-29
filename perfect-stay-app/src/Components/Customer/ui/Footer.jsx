import React from 'react';
import { Hotel, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Hotel className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">PerfectStay</span>
            </div>
            <p className="text-gray-200 text-sm">
              Experience world-class hospitality and create unforgettable memories at PerfectStay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('find-booking')}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  Find Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('bookings')}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  My Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('profile')}
                  className="text-gray-200 hover:text-white transition-colors text-sm"
                >
                  Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-200 text-sm">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                +1 (234) 567-8900
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                support@perfectstay.com
              </li>
              <li className="flex items-start text-gray-200 text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                <span>123 Paradise Avenue<br />Cebu City, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-100" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-100" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-100" />
              </a>
            </div>
            <p className="text-gray-200 text-sm mt-4">
              Stay updated with our latest offers and news
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm">
              © 2025 PerfectStay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-200 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-200 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-200 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
