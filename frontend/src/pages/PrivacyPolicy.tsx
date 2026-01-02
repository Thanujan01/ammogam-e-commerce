import { Link, useLocation } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserShield, 
  FaDatabase, 
  FaCookie, 
  FaEnvelope, 
  FaPhone, 
  FaEye, 
  FaTrash, 
  FaEdit,
 
  FaGlobe,
  FaUserCheck
} from 'react-icons/fa';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  const location = useLocation();

  // INSTANTLY scroll to top when component mounts (no smooth animation)
  useEffect(() => {
    window.scrollTo(0, 0); // INSTANT scroll to top
  }, [location]);

  // Handle smooth scrolling to sections (only for navigation within page)
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth' // Smooth only for section navigation
      });

      // Update URL hash
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl mb-4">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mt-2">
            Protecting your privacy is our top priority
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
            <FaEye className="text-blue-600" />
            Quick Navigation
          </h3>
          <div className="flex flex-wrap gap-3">
            <a 
              href="#data-collection" 
              onClick={(e) => handleSectionClick(e, 'data-collection')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Data Collection
            </a>
            <a 
              href="#data-use" 
              onClick={(e) => handleSectionClick(e, 'data-use')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Data Usage
            </a>
            <a 
              href="#data-protection" 
              onClick={(e) => handleSectionClick(e, 'data-protection')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Data Protection
            </a>
            <a 
              href="#cookies" 
              onClick={(e) => handleSectionClick(e, 'cookies')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Cookies
            </a>
            <a 
              href="#your-rights" 
              onClick={(e) => handleSectionClick(e, 'your-rights')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Your Rights
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleSectionClick(e, 'contact')}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Welcome to <span className="font-semibold text-amber-700">AMMOGAM E WORLD & COMPANY INC</span> ("we," "our," or "us"). 
                We are committed to protecting your personal information and your right to privacy. 
                If you have any questions or concerns about this privacy policy or our practices 
                with regard to your personal information, please contact us at ammogameworld@gmail.com
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website  or use our services. 
                Please read this privacy policy carefully. If you do not agree with the terms of this 
                privacy policy, please do not access the site or use our services.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section id="data-collection" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaDatabase className="text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              <p>We collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register for an account (customer, seller, or admin)</li>
                <li>Make a purchase or attempt to make a purchase</li>
                <li>Contact our customer support</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or promotions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">Types of Personal Data Collected</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Account Information</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Full name and contact details</li>
                    <li>• Email address and phone number</li>
                    <li>• Shipping and billing addresses</li>
                    <li>• Account credentials (encrypted)</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Transaction Information</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Purchase history and order details</li>
                    <li>• Payment information (processed securely)</li>
                    <li>• Delivery preferences and addresses</li>
                    <li>• Returns and refund information</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">Automatically Collected Information</h3>
              <p>
                We automatically collect certain information when you visit, use, or navigate the Platform. 
                This information does not reveal your specific identity but may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device and usage information (IP address, browser type)</li>
                <li>Location information (general location based on IP)</li>
                <li>Platform interaction data (pages visited, time spent)</li>
                <li>Error logs and performance data</li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section id="data-use" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FaEdit className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>We use the information we collect for various business purposes, including:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <FaUserCheck className="text-blue-600" />
                    Service Delivery
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Process and fulfill your orders
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Manage your account and preferences
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Provide customer support
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Send order confirmations and updates
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <FaGlobe className="text-green-600" />
                    Platform Improvement
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      Improve and optimize our Platform
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      Develop new products and services
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      Analyze usage patterns and trends
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      Personalize your shopping experience
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8">Marketing Communications</h3>
              <p>
                With your consent, we may send you marketing emails about new products, special offers, 
                or other information we think you may find interesting. You can opt-out of these 
                communications at any time by clicking the "unsubscribe" link in the email or updating 
                your preferences in your account settings.
              </p>
            </div>
          </section>

          {/* Data Protection */}
          <section id="data-protection" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaLock className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Data Protection & Security</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We implement appropriate technical and organizational security measures designed to 
                protect the security of any personal information we process. However, please also 
                remember that we cannot guarantee that the internet itself is 100% secure.
              </p>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Security Measures Include:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaLock className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Encryption</h4>
                      <p className="text-sm text-gray-600">
                        SSL/TLS encryption for data in transit, Bcrypt for password hashing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaShieldAlt className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Access Control</h4>
                      <p className="text-sm text-gray-600">
                        Role-based access controls and JWT authentication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaUserShield className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Regular Audits</h4>
                      <p className="text-sm text-gray-600">
                        Security assessments and vulnerability testing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FaDatabase className="text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Data Backup</h4>
                      <p className="text-sm text-gray-600">
                        Regular encrypted backups and disaster recovery plans
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl">
                <FaCookie className="text-amber-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Cookies and Tracking Technologies</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We use cookies and similar tracking technologies to collect and store information 
                about your interaction with our Platform. Cookies are small data files that are 
                placed on your device when you visit our website.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 mt-6 border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-800 mb-4">Types of Cookies We Use</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-amber-700">Essential Cookies</h4>
                    <p className="text-sm text-amber-800">
                      Required for the Platform to function properly (e.g., login session, shopping cart)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700">Analytics Cookies</h4>
                    <p className="text-sm text-amber-800">
                      Help us understand how visitors interact with our Platform
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700">Preferences Cookies</h4>
                    <p className="text-sm text-amber-800">
                      Remember your settings and preferences for a better experience
                    </p>
                  </div>
                </div>
                
                {/* <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Cookie Management</h4>
                  <p className="text-sm text-gray-700">
                    You can control cookies through your browser settings. Most browsers allow you to 
                    refuse cookies or delete existing cookies. However, disabling essential cookies 
                    may affect the functionality of our Platform.
                  </p>
                  <Link 
                    to="/cookies" 
                    onClick={() => window.scrollTo(0, 0)} // INSTANT scroll to top
                    className="inline-block mt-3 text-sm font-semibold text-amber-600 hover:text-amber-800 underline"
                  >
                    Learn more about our Cookie Policy →
                  </Link>
                </div> */}
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="your-rights" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FaUserShield className="text-indigo-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Your Data Protection Rights</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Depending on your location, you may have the following rights regarding your personal data:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                    <FaEye className="text-indigo-600" />
                    Access & Portability
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">✓</span>
                      Right to access your personal data
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">✓</span>
                      Right to data portability
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">✓</span>
                      Right to receive your data in a readable format
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <FaTrash className="text-red-600" />
                    Control & Deletion
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      Right to correct inaccurate data
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      Right to delete your personal data
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      Right to restrict or object to processing
                    </li>
                  </ul>
                </div>
              </div>

              {/* <div className="mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Exercising Your Rights</h3>
                <p className="text-gray-700">
                  To exercise any of these rights, please contact our Data Protection Officer at 
                  <span className="font-medium ml-1">privacy@ammogam.com</span>. We will respond to 
                  your request within 30 days and may ask for additional information to verify your identity.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <FaDownload className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    You can download your personal data from your account dashboard
                  </span>
                </div>
              </div> */}
            </div>
          </section>

          {/* Contact Information */}
         {/* Contact Information */}
<section id="contact" className="scroll-mt-24 pt-8 border-t border-gray-200">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-teal-100 rounded-xl">
      <FaEnvelope className="text-teal-600 text-xl" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900">7. Contact Information</h2>
  </div>
  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
    <p>
      If you have questions or comments about this policy, you may contact our 
      Data Protection Officer (DPO) or our privacy team at:
    </p>

    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mt-6 border border-teal-200">
      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-100 rounded-lg">
            <FaEnvelope className="text-teal-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Email</h4>
            <p className="text-blue-600">ammogameworld@gmail.com</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-100 rounded-lg">
            <FaPhone className="text-teal-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Phone</h4>
            <p>+1 416 9919591 (Privacy Hotline)</p>
          </div>
        </div>

        {/* Address - Now with location icon */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-100 rounded-lg">
            {/* Location icon added */}
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Address</h4>
            <p className="text-gray-700">
              165,HERTFORD  CRESCENT,<br />
              MARKHAM,<br />
              ONTARIO,<br />
              L3S3R3.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

          {/* Policy Updates */}
          <section className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gray-100 rounded-xl">
                <FaEdit className="text-gray-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Policy Updates</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                We may update this Privacy Policy from time to time. The updated version will be 
                indicated by an updated "Last Updated" date and the updated version will be 
                effective as soon as it is accessible.
              </p>
              <p>
                We encourage you to review this Privacy Policy frequently to be informed of how 
                we are protecting your information. If we make material changes to this Privacy 
                Policy, we will notify you either by prominently posting a notice of such changes 
                or by directly sending you a notification.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Notification of Changes</h3>
                <p className="text-sm text-gray-700">
                  You will be notified of significant changes via:
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
                  <li>Email notification to your registered email address</li>
                  <li>In-app notifications or banners on the Platform</li>
                  <li>Update notices in your account dashboard</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  onClick={() => window.scrollTo(0, 0)} // INSTANT scroll to top
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FaShieldAlt className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-lg mb-2">Compliance Statement</h3>
              <p className="text-green-700">
                AMMOGAM E WORLD & COMPANY INC complies with applicable data protection laws including:
              </p>
              <ul className="list-disc pl-6 text-green-700 mt-2 space-y-1">
                <li>General Data Protection Regulation (GDPR) for EU customers</li>
                <li>California Consumer Privacy Act (CCPA) for California residents</li>
                <li>Personal Data Protection Act of Sri Lanka</li>
                <li>Electronic Transactions Act No. 19 of 2006 (Sri Lanka)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Top Button - INSTANT scroll */}
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => window.scrollTo(0, 0)} // INSTANT scroll to top
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}