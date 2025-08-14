import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { IoChevronForward, IoChevronUp } from "react-icons/io5";
import { IoHome, IoTrash } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { FaRegListAlt } from "react-icons/fa";

export default function Support() {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    myAccount: true,
    payments: false,
    help: false
  })

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
     

      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-[#141416]">
        <button className="text-white" onClick={handleBack}>
          <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold">Settings</h1>
      </div>

      {/* Settings Options */}
      <div className="px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {/* My Account Section */}
          <div className="bg-[#1c142b] rounded-lg overflow-hidden h-fit">
            <div 
              className="p-3 sm:p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('myAccount')}
            >
              <span className="text-white font-semibold text-sm sm:text-base">My Account</span>
              {expandedSections.myAccount ? (
                <IoChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <IoChevronForward className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            {expandedSections.myAccount && (
              <div className="border-t border-gray-700">
                <NavLink to="/manageAddress" className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-2">
                    <IoHome className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm sm:text-base">Manage Address</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 text-gray-400" />
                </NavLink>
                <div className="p-3 sm:p-4 flex items-center justify-between border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <IoTrash className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm sm:text-base">Delete My Account</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Payments & Refunds Section */}
          <div className="bg-[#1c142b] rounded-lg overflow-hidden h-fit">
            <div 
              className="p-3 sm:p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('payments')}
            >
              <span className="text-white font-semibold text-sm sm:text-base">Payments & Refunds</span>
              {expandedSections.payments ? (
                <IoChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <IoChevronForward className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            {expandedSections.payments && (
              <div className="border-t border-gray-700">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaRegListAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm sm:text-base">Payment History</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Help & Support Section */}
          <div className="bg-[#1c142b] rounded-lg overflow-hidden h-fit">
            <div 
              className="p-3 sm:p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('help')}
            >
              <span className="text-white font-semibold text-sm sm:text-base">Help & Support</span>
              {expandedSections.help ? (
                <IoChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <IoChevronForward className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            {expandedSections.help && (
              <div className="border-t border-gray-700">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BiSupport className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm sm:text-base">Contact Us</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
