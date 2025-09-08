import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { ReactComponent as YOYO_LOGO } from "../images/YOYO-LOGO.svg";
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const [showGoUp, setShowGoUp] = React.useState(false);
  const location = useLocation();

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
      {/* {showGoUp && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-28 right-6 md:bottom-6 md:right-20 z-30 p-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg animate-pulse hover:scale-110 hover:animate-none transition-all duration-300"
          title="Go to top"
        >
          <FaArrowUp className="" />
        </button>   
      )} */}

      <footer className="relative overflow-hidden pb-10 md:pb-0 bg-black text-white ">
        {/* <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div> */}
        {/* <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20"></div> */}

        <div className="relative max-w-[90%] md:max-w-[85%] mx-auto z-10">

          <div className=" py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-[425px]:grid-cols-2">
            <div className="space-y-4 max-[425px]:col-span-2">
              <YOYO_LOGO className="svg-current-color h-12 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
              <p className="text-gray-300 text-sm leading-relaxed">
                Your ultimate gaming destination. Discover, play, and connect with gamers worldwide.
              </p>
              <div className="flex justify-center md:justify-start gap-3 sm:gap-4 md:gap-5 flex-wrap ">
                {[
                  { Icon: FaFacebook, href: "https://www.facebook.com" },
                  { Icon: FaTwitter, href: "https://www.twitter.com" },
                  { Icon: FaInstagram, href: "https://www.instagram.com" },
                  { Icon: FaLinkedin, href: "https://www.linkedin.com" },
                  { Icon: FaYoutube, href: "https://www.youtube.com" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2  xl:p-2.5 rounded-full bg-white/10 hover:bg-[#ab99e1] hover:text-black transition-all duration-300 flex items-center justify-center"
                  >
                    <Icon className="text-sm sm:text-base md:text-lg lg:text-xl" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Home", "GGtalks", "Games", "Rewards", "Store"].map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link === "Home" ? "/" : link === "Games" ? "/games" : link === "GGtalks" ? "/GGTalks" : link === "Store" ? "/store" : link === "Rewards" ? "/rewards" : "#"}
                      className={` hover:text-[#ab99e1] transition-colors text-sm ${location.pathname === (link === "Home" ? "/" : link === "Games" ? "/games" : link === "GGtalks" ? "/GGTalks" : link === "Store" ? "/store" : link === "Rewards" ? "/rewards" : "#") ? "font-semibold text-[#ab99e1]" : "text-gray-300"}`}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Support
              </h4>
              <ul className="space-y-2">
                {["FAQs", "Guides", "Terms of Service", "Privacy Policy"].map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link === "FAQs" ? "/faqs" : link === "Guides" ? "/guides" : link === "Terms of Service" ? "/terms" : link === "Privacy Policy" ? "/privacy" : "#"}
                      className={` hover:text-[#ab99e1] transition-colors text-sm ${location.pathname === (link === "FAQs" ? "/faqs" : link === "Guides" ? "/guides" : link === "Terms of Service" ? "/terms" : link === "Privacy Policy" ? "/privacy" : "#") ? "font-semibold text-[#ab99e1]" : "text-gray-300"}`}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-[425px]:col-span-2">
              <h4 className="text-white font-semibold text-lg mb-4 relative after:content-[''] after:w-12 after:h-[2px] after:bg-[#ab99e1] after:absolute after:-bottom-2 after:left-0">
                Contact Us
              </h4>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex gap-3 items-center ">
                  <IoLocationOutline className="text-[#ab99e1] flex-shrink-0" />
                  <a href="https://maps.app.goo.gl/Rm9PcQeQUdoSXuKYA" target="_blank" rel="noopener noreferrer" className='hover:text-[#ab99e1]'>123 Gaming Street, Digital City, DC 12345</a>
                </div>
                <div className="flex gap-3 items-center ">
                  <IoCallOutline className="text-[#ab99e1]" />
                  <a href="tel:+919876543210" target="_blank" rel="noopener noreferrer" className='hover:text-[#ab99e1]'>+91 9876543210</a>
                </div>
                <div className="flex gap-3 items-center ">
                  <IoMailOutline className="text-[#ab99e1]" />
                  <a href="mailto:support@YOYO.com" target="_blank" rel="noopener noreferrer" className='hover:text-[#ab99e1]'>support@YOYO.com</a> 
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 py-6 text-gray-400 text-sm flex flex-col sm:flex-row justify-center items-center gap-3">
            <p>© 2025 YOYO Gaming. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
