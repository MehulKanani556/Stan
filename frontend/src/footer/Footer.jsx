import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { ReactComponent as YOYO_LOGO } from "../images/YOYO-LOGO.svg";

const Footer = () => {
  const [showGoUp, setShowGoUp] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setShowGoUp(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Go to Top Button */}
      {showGoUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 p-3 md:p-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg animate-pulse hover:scale-110 hover:animate-none transition-all duration-300"
          title="Go to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        {/* Glowing circles background */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative max-w-[90%] md:max-w-[85%] mx-auto z-10">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div className="space-y-4">
            <YOYO_LOGO className="svg-current-color h-12 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
              <p className="text-gray-300 text-sm leading-relaxed">
                Your ultimate gaming destination. Discover, play, and connect with gamers worldwide.
              </p>
              <div className="flex space-x-4">
                {[
                  { Icon: FaFacebook, href: "#" },
                  { Icon: FaTwitter, href: "#" },
                  { Icon: FaInstagram, href: "#" },
                  { Icon: FaLinkedin, href: "#" },
                  { Icon: FaYoutube, href: "#" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="p-2 rounded-full bg-white/10 hover:bg-[#ab99e1] hover:text-black transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Home", "Games", "Clubs", "Store", "Rewards", "About Us"].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#ab99e1] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Support
              </h4>
              <ul className="space-y-2">
                {["Help Center", "Contact Support", "FAQ", "Terms of Service", "Privacy Policy", "Cookie Policy"].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#ab99e1] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Contact Us
              </h4>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex gap-3">
                  <IoLocationOutline className="text-[#ab99e1] mt-1" />
                  <p>123 Gaming Street, Digital City, DC 12345</p>
                </div>
                <div className="flex gap-3">
                  <IoCallOutline className="text-[#ab99e1]" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex gap-3">
                  <IoMailOutline className="text-[#ab99e1]" />
                  <p>support@stan.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 py-6 text-gray-400 text-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>© 2024 STAN Gaming. All rights reserved.</p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Cookies"].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:text-[#ab99e1] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
