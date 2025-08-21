import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { ReactComponent as YOYO_LOGO } from "../images/YOYO-LOGO.svg"

const Footer = () => {
  const [showGoUp, setShowGoUp] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowGoUp(true);
      } else {
        setShowGoUp(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <>
      {showGoUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 md:p-4 p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg animate-pulse hover:animate-none hover:scale-105 transition-all duration-500"
          title="Go to top"
        >
          <FaArrowUp className="w-4 h-4" />
        </button>
      )}
      <footer className=" backdrop-blur-lg bg-black/30 text-white md:pb-0 pb-14">

        <div className='max-w-[95%] md:max-w-[85%] m-auto w-full'>


          {/* Main Footer Content */}
          <div className="py-8 ">
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

                {/* Company Info */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <YOYO_LOGO className="svg-current-color h-12 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                      {/* <span className='text-[#ab99e1] font-semibold text-4xl'>YOYO</span> */}
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
        </div>
      </footer>
    </>
  );
};

export default Footer; 