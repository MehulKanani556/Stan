import React from 'react';
import { FaShieldAlt, FaGamepad, FaCreditCard, FaComments, FaUser, FaExclamationTriangle } from 'react-icons/fa';

export default function TermsService() {
  return (
    <div className="min-h-screen  text-white">
      <div className=" mx-auto md:max-w-[85%] max-w-[95%]  py-10 ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaShieldAlt className="text-purple-400" />
            Welcome to YOYO Gaming Platform
          </h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the YOYO gaming platform, including our website,
            mobile applications, and services. By accessing or using our platform, you agree to be bound by these Terms.
            If you disagree with any part of these terms, you may not access our service.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Table of Contents</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <a href="#definitions" className="text-blue-400 hover:text-blue-300">Definitions</a></li>
            <li>• <a href="#account" className="text-blue-400 hover:text-blue-300">Account Registration & Management</a></li>
            <li>• <a href="#games" className="text-blue-400 hover:text-blue-300">Games & Content</a></li>
            <li>• <a href="#payments" className="text-blue-400 hover:text-blue-300">Payments & Transactions</a></li>
            <li>• <a href="#chat" className="text-blue-400 hover:text-blue-300">Chat & Communication</a></li>
            <li>• <a href="#rewards" className="text-blue-400 hover:text-blue-300">Rewards & Loyalty</a></li>
            <li>• <a href="#conduct" className="text-blue-400 hover:text-blue-300">User Conduct</a></li>
            <li>• <a href="#intellectual" className="text-blue-400 hover:text-blue-300">Intellectual Property</a></li>
            <li>• <a href="#privacy" className="text-blue-400 hover:text-blue-300">Privacy & Data</a></li>
            <li>• <a href="#termination" className="text-blue-400 hover:text-blue-300">Termination</a></li>
            <li>• <a href="#disclaimer" className="text-blue-400 hover:text-blue-300">Disclaimers</a></li>
            <li>• <a href="#contact" className="text-blue-400 hover:text-blue-300">Contact Information</a></li>
          </ul>
        </div>

        {/* Definitions */}
        <div id="definitions" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">1. Definitions</h3>
          <div className="space-y-3 text-gray-300">
            <p><strong>"Platform"</strong> refers to the YOYO gaming website, mobile applications, and related services.</p>
            <p><strong>"User"</strong> refers to any individual who accesses or uses our platform.</p>
            <p><strong>"Account"</strong> refers to the user profile and associated data created during registration.</p>
            <p><strong>"Content"</strong> refers to games, videos, images, text, and other materials available on our platform.</p>
            <p><strong>"Services"</strong> refers to all features, functionality, and content provided by YOYO.</p>
          </div>
        </div>

        {/* Account Registration */}
        <div id="account" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaUser className="text-purple-400" />
            2. Account Registration & Management
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Registration Requirements</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You must be at least 13 years old to create an account</li>
                <li>Users under 18 require parental consent</li>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your login credentials</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Account Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Keep your account information updated</li>
                <li>One account per person is allowed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Games & Content */}
        <div id="games" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaGamepad className="text-purple-400" />
            3. Games & Content
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Game Access & Usage</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Games are provided "as is" without warranties</li>
                <li>Some games may require additional purchases or subscriptions</li>
                <li>Game availability may vary by region</li>
                <li>We reserve the right to modify or remove games</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Content Guidelines</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Respect intellectual property rights</li>
                <li>Do not attempt to reverse engineer games</li>
                <li>Follow age ratings and content warnings</li>
                <li>Report inappropriate or harmful content</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payments & Transactions */}
        <div id="payments" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaCreditCard className="text-purple-400" />
            4. Payments & Transactions
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Payment Terms</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All prices are in local currency unless specified</li>
                <li>Payments are processed through secure third-party providers</li>
                <li>Refunds are subject to our refund policy</li>
                <li>Subscription fees are billed automatically</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Transaction Security</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We do not store your payment information</li>
                <li>All transactions are encrypted and secure</li>
                <li>Report any suspicious transactions immediately</li>
                <li>We are not responsible for third-party payment issues</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat & Communication */}
        <div id="chat" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaComments className="text-purple-400" />
            5. Chat & Communication
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Communication Guidelines</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Be respectful and courteous to other users</li>
                <li>No harassment, bullying, or hate speech</li>
                <li>No sharing of personal information</li>
                <li>No spamming or advertising</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Moderation</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We monitor chat for inappropriate content</li>
                <li>Violations may result in temporary or permanent bans</li>
                <li>Report abusive behavior to our support team</li>
                <li>We reserve the right to moderate all communications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rewards & Loyalty */}
        <div id="rewards" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">6. Rewards & Loyalty Program</h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Program Details</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Rewards are earned through platform engagement</li>
                <li>Reward values and availability may change</li>
                <li>Rewards have no cash value and are non-transferable</li>
                <li>We may modify or discontinue the program at any time</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Redemption & Expiration</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Rewards may expire if not used within specified timeframes</li>
                <li>Redemption is subject to availability</li>
                <li>We are not responsible for lost or stolen rewards</li>
                <li>Rewards cannot be combined with other promotions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Conduct */}
        <div id="conduct" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400" />
            7. User Conduct
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Prohibited Activities</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cheating, hacking, or exploiting game mechanics</li>
                <li>Creating multiple accounts to gain unfair advantages</li>
                <li>Sharing account credentials with others</li>
                <li>Attempting to access restricted areas or features</li>
                <li>Using automated tools or bots</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-purple-200 mb-2">Consequences</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>First offense: Warning and temporary suspension</li>
                <li>Second offense: Extended suspension</li>
                <li>Third offense: Permanent account termination</li>
                <li>Serious violations may result in immediate termination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div id="intellectual" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">8. Intellectual Property</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              All content on our platform, including games, graphics, text, and software, is owned by YOYO or our
              licensors and is protected by copyright, trademark, and other intellectual property laws. You may not
              copy, reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p>
              User-generated content remains your property, but you grant us a worldwide, non-exclusive license to
              use, reproduce, and distribute such content in connection with our services.
            </p>
          </div>
        </div>

        {/* Privacy & Data */}
        <div id="privacy" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">9. Privacy & Data Protection</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our
              Privacy Policy, which is incorporated into these Terms by reference. By using our platform, you
              consent to our collection and use of information as described in our Privacy Policy.
            </p>
            <p>
              We implement appropriate security measures to protect your data, but no method of transmission over
              the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>
        </div>

        {/* Termination */}
        <div id="termination" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">10. Account Termination</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              You may terminate your account at any time by contacting our support team. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your account will be deactivated immediately</li>
              <li>Unused rewards and credits may be forfeited</li>
              <li>Your data will be retained as required by law</li>
              <li>You will lose access to all platform features</li>
            </ul>
            <p>
              We may terminate or suspend your account at any time for violations of these Terms or for any other
              reason at our sole discretion.
            </p>
          </div>
        </div>

        {/* Disclaimers */}
        <div id="disclaimer" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">11. Disclaimers & Limitations</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong>Service Availability:</strong> We strive to provide uninterrupted service but cannot guarantee
              that our platform will be available at all times. We may perform maintenance or updates that temporarily
              affect availability.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, YOYO shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages arising from your use
              of our platform.
            </p>
            <p>
              <strong>Third-Party Services:</strong> Our platform may contain links to third-party websites or
              services. We are not responsible for the content or practices of these third parties.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div id="contact" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">12. Contact Information</h3>
          <div className="space-y-4 text-gray-300">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p><strong>Email:</strong> support@YOYO.com</p>
              <p><strong>Support Hours:</strong> 24/7</p>
              <p><strong>Response Time:</strong> Within 24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Final Notice */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-semibold mb-4 text-center text-purple-200">Important Notice</h3>
          <p className="text-gray-300 text-center leading-relaxed">
            By continuing to use the YOYO gaming platform, you acknowledge that you have read, understood, and
            agree to be bound by these Terms of Service. These terms may be updated from time to time, and your
            continued use of the platform constitutes acceptance of any changes.
          </p>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
