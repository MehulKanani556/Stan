


import React, { useState } from 'react';
 
// Main Guides component that renders the SupportPage
function Guides() {
  return (
    <div className=" p-4 sm:p-8 font-inter">
      <SupportPage />
    </div>
  );
}
 
// SupportPage component for the game store
const SupportPage = () => {
  // State to manage active FAQ section (optional, for simple accordion if needed)
  const [activeSection, setActiveSection] = useState(null);
 
  // Function to toggle FAQ sections
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };
 
  return (
    <div className=" mx-auto   p-6 sm:p-10 ">
      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 text-center drop-shadow-lg">
        Game Store Support
      </h1>
 
      <p className="text-gray-300 text-lg mb-10 text-center leading-relaxed">
        Welcome to the support center! Find answers to common questions and get help with your game store experience.
      </p>
 
      {/* --- Getting Started Section --- */}
      <div className="mb-10 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
        <h2 className="text-3xl font-bold text-blue-300 mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          Getting Started
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
          <li>
            <strong className="text-white">Browsing Games:</strong> Use the search bar or category filters to discover new titles. Click on a game to view details, screenshots, and reviews.
          </li>
          <li>
            <strong className="text-white">Purchasing Games:</strong> Add desired games to your cart and proceed to checkout. We accept various payment methods, including credit cards and digital wallets.
          </li>
          <li>
            <strong className="text-white">Downloading & Installing:</strong> After purchase, your games will appear in your 'Library'. Click 'Download' and follow the on-screen prompts to install.
          </li>
        </ul>
      </div>
 
      {/* --- Troubleshooting Section --- */}
      <div className="mb-10 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
        <h2 className="text-3xl font-bold text-purple-300 mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Troubleshooting Common Issues
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
          <li>
            <strong className="text-white">Download Issues:</strong> Check your internet connection. If problems persist, try pausing and resuming the download, or clearing your browser cache.
          </li>
          <li>
            <strong className="text-white">Game Won't Launch/Crashes:</strong> Ensure your system meets the minimum requirements. Update your graphics drivers. Try verifying game files through your 'Library' options.
          </li>
          <li>
            <strong className="text-white">Payment Failed:</strong> Double-check your payment details. Contact your bank or payment provider. Try an alternative payment method if available.
          </li>
        </ul>
      </div>
 
      {/* --- Account Management Section --- */}
      <div className="mb-10 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
        <h2 className="text-3xl font-bold text-green-300 mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Account Management
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
          <li>
            <strong className="text-white">Creating an Account:</strong> Click 'Sign Up' and follow the simple steps to create your profile.
          </li>
          <li>
            <strong className="text-white">Updating Profile:</strong> Log in to your account and navigate to 'Settings' to change your email, password, or other preferences.
          </li>
          <li>
            <strong className="text-white">Password Recovery:</strong> If you forget your password, use the 'Forgot Password?' link on the login page to reset it.
          </li>
        </ul>
      </div>
 
      {/* --- Refund Policy Section --- */}
      <div className="mb-10 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
        <h2 className="text-3xl font-bold text-red-300 mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Refund Policy
        </h2>
        <p className="text-gray-300 leading-relaxed">
          We offer refunds for games purchased within <strong className="text-white">14 days</strong> if played for less than <strong className="text-white">2 hours</strong>. For more details or to request a refund, please visit our dedicated <a href="#" className="text-red-400 hover:underline font-semibold">Refund Policy Page</a>.
        </p>
      </div>
 
      {/* --- Contact Us Section --- */}
      <div className="p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
        <h2 className="text-3xl font-bold text-yellow-300 mb-4 flex items-center">
          <svg className="w-8 h-8 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 6h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Still Need Help?
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          If you can't find the answer to your question, our support team is here to help!
        </p>
        <div className="space-y-3">
          <p className="text-gray-300">
            <strong className="text-white">Email:</strong> <a href="mailto:support@yourgamestore.com" className="text-yellow-400 hover:underline">support@yourgamestore.com</a>
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Live Chat:</strong> Available Monday to Friday, 9 AM - 5 PM (Your Local Time)
          </p>
          <p className="text-gray-300">
            <strong className="text-white">FAQ:</strong> Visit our detailed <a href="#" className="text-yellow-400 hover:underline">FAQ Page</a> for more in-depth articles.
          </p>
        </div>
      </div>
 
    </div>
  );
};
 
export default Guides;
 
 