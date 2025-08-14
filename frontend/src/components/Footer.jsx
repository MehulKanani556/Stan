import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import stanLogo from "../images/stan-logo.svg"

const Footer = () => {
  return (
    <footer className="container bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Company Info */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src={stanLogo} alt="logo" className="w-6 h-6 sm:w-8 sm:h-8" />
                <h3 className='text-white text-xl sm:text-2xl font-bold'>STAN</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs sm:max-w-none">
                Your ultimate gaming destination. Discover, play, and connect with gamers worldwide through our innovative platform.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">
                  <FaFacebook size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">
                  <FaTwitter size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">
                  <FaInstagram size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">
                  <FaLinkedin size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">
                  <FaYoutube size={18} className="sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-white font-semibold text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Games</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Clubs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Store</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Rewards</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">About Us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-white font-semibold text-base sm:text-lg">Support</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Contact Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors text-xs sm:text-sm">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-white font-semibold text-base sm:text-lg">Contact Us</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <IoLocationOutline className="text-[#ab99e1] flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">123 Gaming Street, Digital City, DC 12345</p>
                </div>
                <div className="flex items-center gap-3">
                  <IoCallOutline className="text-[#ab99e1] flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-gray-400 text-xs sm:text-sm">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <IoMailOutline className="text-[#ab99e1] flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-gray-400 text-xs sm:text-sm">support@stan.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                © 2024 STAN Gaming. All rights reserved.
              </p>
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-[#ab99e1] transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 