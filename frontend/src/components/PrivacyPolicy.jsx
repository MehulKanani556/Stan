import React from 'react';
import { FaShieldAlt, FaDatabase, FaEye, FaLock, FaUser, FaCog } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto md:max-w-[85%] max-w-[95%] py-8 md:py-10">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
            <FaShieldAlt className="text-purple-400 text-2xl" />
            Your Privacy Matters
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            At YOYO Gaming Platform, we are committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our gaming platform,
            website, and services.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Table of Contents</h3>
          <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base">
            <li>• <a href="#information" className="text-blue-400 hover:text-blue-300">Information We Collect</a></li>
            <li>• <a href="#usage" className="text-blue-400 hover:text-blue-300">How We Use Your Information</a></li>
            <li>• <a href="#sharing" className="text-blue-400 hover:text-blue-300">Information Sharing</a></li>
            <li>• <a href="#security" className="text-blue-400 hover:text-blue-300">Data Security</a></li>
            <li>• <a href="#cookies" className="text-blue-400 hover:text-blue-300">Cookies & Tracking</a></li>
            <li>• <a href="#rights" className="text-blue-400 hover:text-blue-300">Your Rights</a></li>
            <li>• <a href="#children" className="text-blue-400 hover:text-blue-300">Children's Privacy</a></li>
            <li>• <a href="#changes" className="text-blue-400 hover:text-blue-300">Policy Changes</a></li>
            <li>• <a href="#contact" className="text-blue-400 hover:text-blue-300">Contact Us</a></li>
          </ul>
        </div>

        {/* Information We Collect */}
        <div id="information" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-purple-300">
            <FaDatabase className="text-purple-400 text-2xl md:text-xl" />
            1. Information We Collect
          </h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Date of birth and age verification</li>
                <li>Payment and billing information</li>
                <li>Profile pictures and user preferences</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Usage Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Game preferences and play history</li>
                <li>Device information and IP addresses</li>
                <li>Chat logs and communication data</li>
                <li>Performance metrics and achievements</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Technical Information</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Browser type and operating system</li>
                <li>Device identifiers and hardware information</li>
                <li>Network connection details</li>
                <li>Crash reports and error logs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div id="usage" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-purple-300">
            <FaEye className="text-purple-400 text-2xl md:text-xl" />
            2. How We Use Your Information
          </h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Service Provision</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain our gaming platform</li>
                <li>Process payments and manage subscriptions</li>
                <li>Personalize your gaming experience</li>
                <li>Enable multiplayer and social features</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Communication</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Send important service updates</li>
                <li>Provide customer support</li>
                <li>Send promotional offers (with consent)</li>
                <li>Notify about security issues</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Improvement & Analytics</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Analyze platform usage and performance</li>
                <li>Develop new features and games</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div id="sharing" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-purple-300">3. Information Sharing</h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you explicitly give us permission to share your information</li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div id="security" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-purple-300">
            <FaLock className="text-purple-400 text-xl" />
            4. Data Security
          </h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-xs md:text-sm text-gray-400 mt-4">
              While we strive to protect your information, no method of transmission over the internet is 100% secure.
              We cannot guarantee absolute security but we continuously work to improve our security measures.
            </p>
          </div>
        </div>

        {/* Cookies & Tracking */}
        <div id="cookies" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-purple-300">5. Cookies & Tracking Technologies</h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              We use cookies and similar technologies to enhance your gaming experience:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Essential Cookies</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs md:text-sm">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Basic platform functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Analytics Cookies</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs md:text-sm">
                  <li>Usage statistics and performance metrics</li>
                  <li>Feature improvement insights</li>
                  <li>User behavior analysis</li>
                </ul>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-400 mt-4">
              You can control cookie preferences through your browser settings, though disabling certain cookies may affect platform functionality.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div id="rights" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-purple-300">
            <FaUser className="text-purple-400 text-xl" />
            6. Your Rights & Choices
          </h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              You have the following rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Access & Control</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs md:text-sm">
                  <li>Access your personal data</li>
                  <li>Update or correct information</li>
                  <li>Delete your account</li>
                  <li>Export your data</li>
                </ul>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-medium text-purple-200 mb-1 md:mb-2">Communication Preferences</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs md:text-sm">
                  <li>Opt-out of marketing emails</li>
                  <li>Control notification settings</li>
                  <li>Manage privacy preferences</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-400 mt-4">
              To exercise these rights, contact us at privacy@YOYO.com. We will respond to your request within 30 days.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div id="children" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-purple-300">7. Children's Privacy</h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <h4 className="text-base md:text-lg font-medium text-yellow-200 mb-1 md:mb-2">For Users Under 18</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs md:text-sm">
                <li>Parental consent is required for account creation</li>
                <li>Parents can review and delete their child's information</li>
                <li>We implement additional safeguards for minor users</li>
                <li>Contact us immediately if you believe we have collected information from a child under 13</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Policy Changes */}
        <div id="changes" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-purple-300">
            <FaCog className="text-purple-400 text-2xl md:text-xl" />
            8. Changes to This Policy
          </h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
              When we make changes, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Update the "Last updated" date at the top of this policy</li>
              <li>Notify you of significant changes via email or platform notification</li>
              <li>Provide a summary of key changes</li>
              <li>Continue to protect your information according to the updated policy</li>
            </ul>
            <p className="text-xs md:text-sm text-gray-400 mt-4">
              Your continued use of our platform after any changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </div>
        </div>

        {/* Contact Us */}
        <div id="contact" className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-700 scroll-mt-24 md:scroll-mt-32">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-purple-300">9. Contact Us</h3>
          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4 text-xs md:text-sm">
              <p><strong>Email:</strong> privacy@YOYO.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@YOYO.com</p>
              <p><strong>Support Hours:</strong> 24/7</p>
              <p><strong>Response Time:</strong> Within 24-48 hours</p>
            </div>
            <p className="text-xs md:text-sm text-gray-400 mt-4">
              For data subject requests or privacy concerns, please include "Privacy Request" in your email subject line.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-purple-500/30">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center text-purple-200">Your Privacy is Our Priority</h3>
          <p className="text-gray-300 text-center leading-relaxed text-sm md:text-base">
            We are committed to transparency and protecting your privacy. This Privacy Policy explains how we handle your information
            and your rights regarding your personal data. By using our platform, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
          <div className="text-center mt-4 md:mt-6">
            <p className="text-xs md:text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}