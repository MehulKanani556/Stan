import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { createcontactUs } from '../Redux/Slice/contactUs.slice';
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";

const ContactUs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contactUs);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      enqueueSnackbar('Please fill all required fields.', { variant: 'error' });
      return;
    }

    const resultAction = await dispatch(createcontactUs(formData));
    if (createcontactUs.fulfilled.match(resultAction)) {
      enqueueSnackbar(resultAction.payload.message || 'Your message has been sent successfully!', { variant: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 sm:p-16 text-white font-sans  relative overflow-hidden" 
        >
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] bg-[#141419]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_24px_40px_rgba(0,0,0,0.5)]">

        {/* Contact Info Section */}
        <div className="flex-1 p-8 sm:p-16 bg-gradient-to-br from-[#1a1a24] to-[#101016] flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4  text-[var(--color-change)]">
              Get in Touch
            </h2>
            <p className="text-[#a0a0b0] text-lg leading-relaxed mb-12">
              We'd love to hear from you! Whether you have a question about our products, need support, or just want to share feedback, our team is ready to help.
            </p>

            <div className="flex items-center mb-8 hover:translate-x-2 transition-transform duration-300 ease-in-out">
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[var(--color-change)] text-2xl flex-shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h4 className="m-0 mb-1 text-lg font-semibold text-white">Address</h4>
                <span className="text-[#8a8a9a] text-base">123 Gaming Street, NY 10001</span>
              </div>
            </div>

            <div className="flex items-center mb-8 hover:translate-x-2 transition-transform duration-300 ease-in-out">
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[var(--color-change)] text-2xl flex-shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <h4 className="m-0 mb-1 text-lg font-semibold text-white">Phone</h4>
                <span className="text-[#8a8a9a] text-base">+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="flex items-center mb-8 hover:translate-x-2 transition-transform duration-300 ease-in-out">
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[var(--color-change)] text-2xl flex-shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="m-0 mb-1 text-lg font-semibold text-white">Email</h4>
                <span className="text-[#8a8a9a] text-base">support@stangames.com</span>
              </div>
            </div>

            <div className="flex gap-4 mt-10 relative z-10">
              <a href="https://x.com/"  target='_blank' className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#fede4f] hover:to-[var(--color-change)] hover:-translate-y-1   transition-all duration-300" aria-label="Twitter">
               <FaXTwitter className='text-2xl' />
              </a>
              <a href="https://www.facebook.com/"  target='_blank' className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#fede4f] hover:to-[var(--color-change)] hover:-translate-y-1   transition-all duration-300" aria-label="Facebook">
               <FaFacebookF className='text-2xl' />
              </a>
              <a href="https://www.instagram.com/" target='_blank' className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#fede4f] hover:to-[var(--color-change)] hover:-translate-y-1   transition-all duration-300" aria-label="Instagram">
                <FaInstagram className='text-2xl' />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="flex-[1.2] p-8 sm:p-16 relative">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="name"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a] " 
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="email"
                  name="email"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a]  " 
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                name="subject"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a]  " 
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="relative flex-1">
              <textarea
                name="message"
                className="w-full min-h-[150px] resize-y p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a]  " 
                placeholder="Write your message here... *"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="mt-4 p-4 style_btn_color text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed group" disabled={loading}>
              {loading ? 'Sending...' : (
                <>
                  <span>Send Message</span>
                  <svg className="transform group-hover:translate-x-1 transition-transform" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
