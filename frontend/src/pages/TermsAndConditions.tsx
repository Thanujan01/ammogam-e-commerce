import { Link, useLocation } from 'react-router-dom';
import { FaFileContract, FaShieldAlt, FaLock, FaCreditCard, FaTruck, FaHeadset, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect } from 'react';

export default function TermsAndConditions() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl mb-4">
            <FaFileContract className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        </div>

        {/* Disclaimer Alert */}
        <div className="mb-10 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <FaExclamationTriangle className="text-amber-600 text-2xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-800 text-lg mb-2">Important Legal Notice</h3>
              <p className="text-amber-700">
                This is a sample terms and conditions document for the AMMOGAM E WORLD & COMPANY INC. 
                For actual legal compliance, please consult with a qualified legal professional.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a 
            href="#acceptance" 
            onClick={(e) => handleSectionClick(e, 'acceptance')}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition-colors"
          >
            1. Acceptance
          </a>
          <a 
            href="#accounts" 
            onClick={(e) => handleSectionClick(e, 'accounts')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            2. User Accounts
          </a>
          <a 
            href="#purchases" 
            onClick={(e) => handleSectionClick(e, 'purchases')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            3. Purchases
          </a>
          <a 
            href="#admin" 
            onClick={(e) => handleSectionClick(e, 'admin')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            4. Admin Access
          </a>
          <a 
            href="#liability" 
            onClick={(e) => handleSectionClick(e, 'liability')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            5. Liability
          </a>
          <a 
            href="#payment" 
            onClick={(e) => handleSectionClick(e, 'payment')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            6. Payment
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleSectionClick(e, 'contact')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            7. Contact
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
          {/* Section 1: Acceptance of Terms */}
          <section id="acceptance" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl">
                <FaFileContract className="text-amber-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                By accessing and using the <span className="font-semibold text-amber-700">AMMOGAM E WORLD & COMPANY INC</span> e-commerce website ("the Platform"), 
                you agree to be bound by these Terms and Conditions ("Terms"), all applicable laws, and regulations. 
                If you do not agree with any part of these Terms, you are prohibited from using the Platform.
              </p>
              <p>
                These Terms apply to all visitors, users, buyers, sellers, and administrators of the Platform. 
                By registering an account or making a purchase, you confirm your acceptance of these Terms.
              </p>
            </div>
          </section>

          {/* Section 2: User Accounts & Security */}
          <section id="accounts" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaLock className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. User Accounts & Security</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Buyer Registration</h3>
              <p>
                You must provide accurate and complete information during registration and keep your login credentials secure. 
                You are responsible for all activities under your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900">Seller Accounts</h3>
              <p>
                Sellers must provide valid business information and comply with all applicable laws regarding product sales, 
                taxes, and consumer protection. AMMOGAM E WORLD & COMPANY INC reserves the right to suspend seller accounts for violations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900">Security Measures</h3>
              <p>
                We implement security measures including password encryption (Bcrypt) and JWT authentication. 
                However, you agree not to circumvent any security or access controls.
              </p>
            </div>
          </section>

          {/* Section 3: Purchasing & Order Fulfillment */}
          <section id="purchases" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaCreditCard className="text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Purchasing & Order Fulfillment</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Product Information</h3>
              <p>
                We strive for accuracy in product descriptions, prices, and stock levels but do not guarantee they are error-free. 
                We reserve the right to correct errors and cancel orders arising from such errors.
              </p>

              <h3 className="text-xl font-semibold text-gray-900">Order Process</h3>
              <p>
                Placing an order constitutes an offer to buy. Acceptance occurs when we send an order confirmation 
                or change the order status to "Packed" or "Shipped" via the Notification Panel.
              </p>

              <h3 className="text-xl font-semibold text-gray-900">Delivery</h3>
              <p>
                You are responsible for providing accurate delivery details. Delivery timelines are estimates and not guaranteed. 
                Please refer to our <Link to="/shipping" onClick={() => window.scrollTo(0, 0)} className="text-amber-600 hover:text-amber-800 font-medium">Shipping Policy</Link> for detailed information.
              </p>
            </div>
          </section>

          {/* Section 4: Admin Dashboard & Management */}
          <section id="admin" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FaShieldAlt className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Admin Dashboard & Management</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Access to the Admin Dashboard is restricted to pre-authorized administrators using fixed credentials. 
                Any unauthorized attempt to access the Admin Dashboard is strictly prohibited and may result in legal action.
              </p>
              <p>
                Authorized administrators are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurately managing product and category information</li>
                <li>Processing user orders responsibly (updating status to "Packed," "Shipped," etc.)</li>
                <li>Maintaining the confidentiality of admin credentials and analytics data</li>
                <li>Ensuring all actions comply with applicable data protection laws</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section id="liability" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                AMMOGAM E WORLD & COMPANY INC, its developers, and hosts will not be liable for any indirect, incidental, or consequential damages arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use the Platform</li>
                <li>Any unauthorized access to or alteration of your transmissions</li>
                <li>The accuracy of business analytics and reports provided in the Admin Dashboard</li>
                <li>Delays or failures in delivery beyond our reasonable control</li>
              </ul>
              <p>
                Business analytics and reports are provided for informational purposes only and should not be relied upon 
                as the sole basis for business decisions.
              </p>
            </div>
          </section>

          {/* Section 6: Payment Processing */}
          <section id="payment" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FaCreditCard className="text-indigo-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Payment Processing</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Online payments are processed via third-party gateways (e.g., Stripe). You agree to their separate terms and conditions. 
                We do not store your full payment card details on our servers.
              </p>
            </div>
          </section>

          {/* Section 7: Contact Information */}
          <section id="contact" className="scroll-mt-24 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-100 rounded-xl">
                <FaHeadset className="text-teal-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Contact Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                For any questions regarding these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4 space-y-3">
                <p className="flex items-center gap-3">
                  <FaHeadset className="text-amber-600" />
                  <span><strong>Email:</strong>ammogameworld@gmail.com</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaTruck className="text-amber-600" />
                  <span><strong>Address:</strong> 165,HERTFORD  CRESCENT, MARKHAM, ONTARIO, L3S3R3</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaHeadset className="text-amber-600" />
                  <span><strong>Phone:</strong> +1 416 9919591</span>
                </p>
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

        {/* Legal Notice Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            This document is governed by the laws of Sri Lanka. Any disputes shall be resolved 
            in the courts of Colombo.
          </p>
          <p className="mt-2">
            AMMOGAM E WORLD & COMPANY INC reserves the right to modify these Terms at any time. Continued use of the 
            Platform constitutes acceptance of any changes.
          </p>
        </div>

        {/* Back to Top Button - INSTANT scroll */}
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => window.scrollTo(0, 0)} // INSTANT scroll to top
            className="p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
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