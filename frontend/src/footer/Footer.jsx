import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { ReactComponent as YOYO_LOGO } from "../images/YOYO-WITH-TEXT.svg";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
  const { currentUser } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));

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

      <footer className="relative overflow-hidden pb-10 md:pb-0  text-white ">
        {/* <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div> */}
        {/* <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20"></div> */}

        <div className="relative max-w-[95%] md:max-w-[85%] mx-auto ">

          <div className=" py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-[425px]:grid-cols-2">
            <div className="space-y-4 max-[425px]:col-span-2">
              <YOYO_LOGO className="svg-current-color h-9 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
              <p className="text-gray-300 text-sm leading-relaxed">
                A realm where ancient horrors dwell and forgotten heroes rise again. Unleash your legend in the shadows.
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
                      to={link === "Home" ? "/" : link === "Games" ? "/games" : link === "GGtalks" ? isLoggedIn ? "/ggtalks" : "/login"  : link === "Store" ? "/store" : link === "Rewards" ? isLoggedIn ? "/rewards" : "/login"  : "#"}
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
                  <a
                    href="https://maps.google.com/?q=264+Weber+St+W,+Kitchener,+ON+N2H+4A6,+Canada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ab99e1] transition-colors flex items-center"
                  >
                    <IoLocationOutline className="text-[#ab99e1] flex-shrink-0" />
                    <span className="ml-1">
                      264 Weber St W, Kitchener, ON N2H 4A6, Canada
                    </span>
                  </a>
                </div>
                <div className="flex gap-3 items-center ">
                  <a
                    href="tel:180097976361"
                    rel="noopener noreferrer"
                    className="hover:text-[#ab99e1] transition-colors flex items-center"
                  >
                    <IoCallOutline className="text-[#ab99e1]" />
                    <span className="ml-1">
                      1800-9797-6361
                    </span>
                  </a>
                </div>
                <div className="flex gap-3 items-center ">
                  <a
                    href="mailto:info@yoyokhel.com"
                    rel="noopener noreferrer"
                    className="hover:text-[#ab99e1] transition-colors flex items-center"
                  >
                    <IoMailOutline className="text-[#ab99e1]" />
                    <span className="ml-1">
                      info@yoyokhel.com
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='md:pb-0 pb-4'>
             <div className="border-t border-white/10 py-6 text-gray-400 text-sm flex flex-col sm:flex-row justify-center items-center gap-3">
               <p>
                 © 2025 YOYO Khel Pvt. Ltd. All rights reserved.
               </p>
             </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
