import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { IoArrowBack, IoChevronForward, IoChevronUp, IoHome, IoTrash, IoSend, IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { FaRegListAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Support() {
  const navigate = useNavigate()
  
  const [openKey, setOpenKey] = useState(null)

  const toggle = (k) => setOpenKey(prev => (prev === k ? null : k))

  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      author: 'support',
      text: "Hello there! Need help? Reach out to us right here, and we'll get back to you as soon as we can!",
      at: new Date().toISOString()
    }
  ])
  const [chatInput, setChatInput] = useState('')

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [otherReasonText, setOtherReasonText] = useState('')

  const formatMessageTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = () => {
    const trimmed = chatInput.trim()
    if (!trimmed) return
    setChatMessages(prev => ([...prev, {
      id: `${Date.now()}`,
      author: 'user',
      text: trimmed,
      at: new Date().toISOString()
    }]))
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      
      <header className="flex items-center gap-3 px-4 py-4 sticky top-0 z-20 bg-black/30 backdrop-blur-xl shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold tracking-wide">⚙️ Settings</h1>
      </header>

      
      <main className="px-4 py-8 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

        
        <motion.div
          whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative group rounded-3xl overflow-hidden cursor-pointer self-start"
        >
          
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 blur-[2px] transition" />

          
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl h-full shadow-2xl flex flex-col">

            
            <div onClick={() => toggle("myAccount")} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <IoHome className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg">My Account</span>
              </div>
              {openKey === 'myAccount' ? <IoChevronUp /> : <IoChevronForward />}
            </div>

            
            <AnimatePresence>
              {openKey === 'myAccount' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 space-y-4"
                >
                  <NavLink to="/manageAddress" className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2">
                      <IoHome /> <span>Manage Address</span>
                    </div>
                    <IoChevronForward />
                  </NavLink>

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                    onClick={() => setIsDeleteModalOpen(true)}>
                    <div className="flex items-center gap-2">
                      <IoTrash /> <span>Delete Account</span>
                    </div>
                    <IoChevronForward />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        
        <motion.div whileHover={{ scale: 1.05, rotateX: -5, rotateY: 5 }}
          className="relative group rounded-3xl overflow-hidden cursor-pointer self-start">
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 blur-[2px]" />
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col">
            <div onClick={() => toggle("payments")} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaRegListAlt className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Payments & Refunds</span>
              </div>
              {openKey === 'payments' ? <IoChevronUp /> : <IoChevronForward />}
            </div>
            <AnimatePresence>
              {openKey === 'payments' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    onClick={() => navigate("/transaction")}
                  >
                    <span>Payment History</span>
                    <IoChevronForward />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        
        <motion.div whileHover={{ scale: 1.05 }}
          className="relative group rounded-3xl overflow-hidden cursor-pointer self-start">
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 blur-[2px]" />
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col">
            <div onClick={() => toggle("help")} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BiSupport className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Help & Support</span>
              </div>
              {openKey === 'help' ? <IoChevronUp /> : <IoChevronForward />}
            </div>
            <AnimatePresence>
              {openKey === 'help' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <div className="flex items-center gap-2">
                      <BiSupport className="w-5 h-5 text-white" />
                      <span>Contact Us</span>
                    </div>
                    <IoChevronForward />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Legal Section */}
        <motion.div whileHover={{ scale: 1.05 }}
          className="relative group rounded-3xl overflow-hidden cursor-pointer self-start">
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-green-500 to-blue-500 opacity-80 group-hover:opacity-100 blur-[2px]" />
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col">
            <div onClick={() => toggle("legal")} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <FaRegListAlt className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Legal & Privacy</span>
              </div>
              {openKey === 'legal' ? <IoChevronUp /> : <IoChevronForward />}
            </div>
            <AnimatePresence>
              {openKey === 'legal' && (
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 space-y-2"
                >
                  <NavLink to="/terms" className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2">
                      <FaRegListAlt className="w-5 h-5 text-white" />
                      <span>Terms of Service</span>
                    </div>
                    <IoChevronForward />
                  </NavLink>
                  <NavLink to="/privacy" className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2">
                      <FaRegListAlt className="w-5 h-5 text-white" />
                      <span>Privacy Policy</span>
                    </div>
                    <IoChevronForward />
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isContactModalOpen && (
          <>
            
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsContactModalOpen(false)}
            />

            
            <div className="fixed bottom-0 left-0 right-0 z-50 w-full sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:max-w-sm">
              <div
                className="rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-[70vh] relative 
                   bg-black/50 backdrop-blur-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 sticky top-0">
                  <button
                    className="text-white hover:scale-110 transition"
                    aria-label="Go back"
                    onClick={() => setIsContactModalOpen(false)}
                  >
                    <IoArrowBack className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-lg">💬 Chat With Us</span>
                    <span className="text-white/70 text-xs">Replies within a few hours</span>
                  </div>
                </div>

                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[80%] sm:max-w-[75%]">
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-lg 
                    ${msg.author === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                              : 'bg-white/10 backdrop-blur-md text-gray-200 border border-white/10 rounded-bl-none'}`}
                        >
                          {msg.author !== 'user' && (
                            <div className="text-xs text-blue-300 mb-1">Support</div>
                          )}
                          <div className="text-sm whitespace-pre-wrap break-words">{msg.text}</div>
                        </div>
                        <div className={`mt-1 text-[10px] text-gray-400 ${msg.author === 'user' ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(msg.at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                
                <div className="border-t border-white/10 p-3 bg-black/40 backdrop-blur-xl sticky bottom-0">
                  <div className="flex items-center gap-2">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault(); handleSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-28 text-sm"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 shadow-lg transition disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <IoSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isDeleteModalOpen && (
          <>
            
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsDeleteModalOpen(false)}
            />

            
            <div className="fixed bottom-0 left-0 right-0 z-50 w-full sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:max-w-sm">
              <div
                className="rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-[70vh] relative bg-black/50 backdrop-blur-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                
                <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/10 sticky top-0">
                  <button
                    className="text-white hover:scale-110 transition"
                    aria-label="Go back"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    <IoArrowBack className="w-6 h-6" />
                  </button>
                  <h2 className="text-white font-semibold text-lg">Account Deletion</h2>
                </div>

                
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  <div className="text-white text-xl font-semibold leading-snug">
                    Select a reason for deleting the account
                  </div>

                  <div className="space-y-5">
                    {[
                      "I don’t use Stan anymore",
                      "App is not working properly",
                      "I have a technical issue",
                      "Other",
                    ].map((reason) => (
                      <div
                        key={reason}
                        className="flex items-center gap-3 text-white cursor-pointer"
                        onClick={() => setDeleteReason(reason)}
                      >
                        {deleteReason === reason ? (
                          <IoRadioButtonOn className="w-6 h-6 text-white/90" />
                        ) : (
                          <IoRadioButtonOff className="w-6 h-6 text-white/60" />
                        )}
                        <span className="text-lg font-semibold">{reason}</span>
                      </div>
                    ))}

                    {deleteReason === 'Other' && (
                      <textarea
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        placeholder="Tell us a bit more..."
                        className="w-full mt-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    )}
                  </div>
                </div>

                
                <div className="p-4 bg-black/40 border-t border-white/10 sticky bottom-0">
                  <button
                    onClick={() => {
                      
                      console.log('Delete requested with reason:', deleteReason, otherReasonText)
                      setIsDeleteModalOpen(false)
                    }}
                    disabled={!deleteReason}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 text-black font-semibold px-4 py-3 disabled:opacity-60"
                  >
                    <IoTrash className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  )
}
