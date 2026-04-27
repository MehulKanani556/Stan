import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

const ContactUs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      enqueueSnackbar('Please fill all required fields.', { variant: 'error' });
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      enqueueSnackbar('Your message has been sent successfully! We will get back to you soon.', { variant: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 sm:p-16 text-white font-sans bg-[#0a0a0f] relative overflow-hidden" 
         style={{ background: 'radial-gradient(circle at top left, rgba(63, 94, 251, 0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(252, 70, 107, 0.15), transparent 40%), #0a0a0f' }}>
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] bg-[#141419]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_24px_40px_rgba(0,0,0,0.5)]">
        
        {/* Contact Info Section */}
        <div className="flex-1 p-8 sm:p-16 bg-gradient-to-br from-[#1a1a24] to-[#101016] flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-[#a0a0b0] text-lg leading-relaxed mb-12">
              We'd love to hear from you! Whether you have a question about our products, need support, or just want to share feedback, our team is ready to help.
            </p>

            <div className="flex items-center mb-8 hover:translate-x-2 transition-transform duration-300 ease-in-out">
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[#00f2fe] text-2xl flex-shrink-0">
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
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[#00f2fe] text-2xl flex-shrink-0">
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
              <div className="w-[50px] h-[50px] rounded-xl bg-white/5 flex items-center justify-center mr-6 border border-white/10 text-[#00f2fe] text-2xl flex-shrink-0">
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
              <a href="#" className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#4facfe] hover:to-[#00f2fe] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,242,254,0.3)] transition-all duration-300" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#4facfe] hover:to-[#00f2fe] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,242,254,0.3)] transition-all duration-300" aria-label="Discord">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
              <a href="#" className="w-[45px] h-[45px] rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-gradient-to-br hover:from-[#4facfe] hover:to-[#00f2fe] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,242,254,0.3)] transition-all duration-300" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.20 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
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
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a] focus:bg-white/10 focus:border-[#00f2fe] focus:ring-4 focus:ring-[#00f2fe]/10" 
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
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a] focus:bg-white/10 focus:border-[#00f2fe] focus:ring-4 focus:ring-[#00f2fe]/10" 
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
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a] focus:bg-white/10 focus:border-[#00f2fe] focus:ring-4 focus:ring-[#00f2fe]/10" 
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="relative flex-1">
              <textarea 
                name="message"
                className="w-full min-h-[150px] resize-y p-4 bg-white/5 border border-white/10 rounded-xl text-white text-base outline-none transition-all duration-300 placeholder-[#6a6a7a] focus:bg-white/10 focus:border-[#00f2fe] focus:ring-4 focus:ring-[#00f2fe]/10" 
                placeholder="Write your message here... *"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="mt-4 p-4 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,242,254,0.4)] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed group" disabled={loading}>
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
