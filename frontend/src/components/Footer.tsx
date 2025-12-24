import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaShieldAlt, FaTruck, FaHeadset, 
   FaEnvelope, FaCcVisa, FaCcMastercard, FaCcPaypal,
  FaCcAmex, FaShoppingBag, FaTag, FaFileContract, FaLock, FaUserShield,
  FaStar, FaAward, FaRecycle, 
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const paymentMethods = [
    { icon: <FaCcVisa className="text-2xl text-blue-600" />, name: 'Visa' },
    { icon: <FaCcMastercard className="text-2xl text-red-600" />, name: 'Mastercard' },
    { icon: <FaCcAmex className="text-2xl text-blue-800" />, name: 'Amex' },
    { icon: <FaCcPaypal className="text-2xl text-blue-500" />, name: 'PayPal' },
  ];

  const trustBadges = [
    { icon: <FaShieldAlt className="text-xl" />, text: '100% Secure Payment', color: 'text-green-600' },
    { icon: <FaTruck className="text-xl" />, text: 'Free Shipping', color: 'text-amber-600' },
    { icon: <FaHeadset className="text-xl" />, text: '24/7 Support', color: 'text-blue-600' },
    { icon: <FaRecycle className="text-xl" />, text: 'Easy Returns', color: 'text-purple-600' },
    { icon: <FaLock className="text-xl" />, text: 'SSL Encrypted', color: 'text-red-600' },
    { icon: <FaUserShield className="text-xl" />, text: 'GDPR Compliant', color: 'text-indigo-600' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, link: 'https://facebook.com/ammogam', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: <FaInstagram />, link: 'https://instagram.com/ammogam', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: <FaTwitter />, link: 'https://twitter.com/ammogam', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: <FaLinkedin />, link: 'https://linkedin.com/company/ammogam', color: 'hover:bg-blue-700', label: 'LinkedIn' },
    { icon: <FaYoutube />, link: 'https://youtube.com/ammogam', color: 'hover:bg-red-600', label: 'YouTube' },
  ];

  const legalDocuments = [
    { name: 'Terms & Conditions', path: '/terms', icon: <FaFileContract className="text-amber-400" />, description: 'Platform rules and user agreements' },
    { name: 'Privacy Policy', path: '/privacy', icon: <FaLock className="text-blue-400" />, description: 'How we protect your data' },
  //   { name: 'Cookie Policy', path: '/cookies', icon: <FaFileSignature className="text-green-400" />, description: 'Cookie usage information' },
  //   { name: 'Return Policy', path: '/returns', icon: <FaRecycle className="text-purple-400" />, description: 'Returns and refunds' },
  //   { name: 'Shipping Policy', path: '/shipping', icon: <FaTruck className="text-red-400" />, description: 'Delivery information' },
  //   { name: 'Seller Agreement', path: '/seller-agreement', icon: <FaGavel className="text-indigo-400" />, description: 'Seller terms and conditions' },
  // 
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-amber-900/20 via-amber-800/20 to-amber-900/20 border-y border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 ${badge.color} mb-2`}>
                  {badge.icon}
                </div>
                <div className="font-bold text-xs">{badge.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
                <FaShoppingBag className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  AMMOGAM
                </h3>
                <p className="text-sm text-gray-400">Premium E-Commerce</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted online destination for quality products at amazing prices. 
              We're committed to providing the best shopping experience with secure payments 
              and fast delivery.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${social.color} transition-colors duration-300 hover:scale-110`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-3 border-b border-amber-800/30 flex items-center gap-2">
              <FaTag className="text-amber-500" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="footer-link">
                  Wishlist
                </Link>
              </li>
              {/* <li>
                <Link to="/category/electronics" className="footer-link">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="footer-link">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/home" className="footer-link">
                  Home & Living
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-3 border-b border-amber-800/30 flex items-center gap-2">
              <FaHeadset className="text-amber-500" />
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ & Help Center
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="footer-link">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="footer-link">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Documents */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-3 border-b border-amber-800/30 flex items-center gap-2">
              <FaFileContract className="text-amber-500" />
              Legal Documents
            </h4>
            <ul className="space-y-3">
              {legalDocuments.map((doc, index) => (
                <li key={index}>
                  <Link 
                    to={doc.path} 
                    className="footer-link group"
                    title={doc.description}
                  >
                    <span className="flex items-center gap-2">
                      {doc.icon}
                      {doc.name}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-amber-400 transition-colors duration-300 block ml-6 mt-1">
                      {doc.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Compliance Banner */}
        {/* <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-xl">
                <FaShieldAlt className="text-2xl text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Legal Compliance & Security</h3>
                <p className="text-gray-400 text-sm">
                  AMMOGAM complies with all applicable e-commerce regulations and data protection laws.
                  Your security and privacy are our top priorities.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/terms"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Read Terms
              </Link>
              <Link
                to="/privacy"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300 text-center"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div> */}

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 rounded-2xl p-6 mb-8 border border-amber-800/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FaEnvelope className="text-amber-500" />
                Subscribe to Newsletter
              </h3>
              <p className="text-gray-300">
                Get exclusive deals, new arrivals, and insider updates directly in your inbox.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                By subscribing, you agree to our{' '}
                <Link to="/terms" className="text-amber-400 hover:text-amber-300 underline">
                  Terms
                </Link>{' '}
                and acknowledge our{' '}
                <Link to="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h4 className="text-center text-gray-400 mb-4">We Accept</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors hover:scale-110 duration-300"
                title={method.name}
              >
                {method.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gray-800/50 rounded-xl text-center hover:bg-gray-800/70 transition-colors duration-300">
            <FaAward className="text-3xl text-amber-500 mx-auto mb-2" />
            <div className="font-bold">Trusted Store</div>
            <div className="text-sm text-gray-400">Since 2020</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center hover:bg-gray-800/70 transition-colors duration-300">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <div className="font-bold">4.9/5 Rating</div>
            <div className="text-sm text-gray-400">Customer Reviews</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center hover:bg-gray-800/70 transition-colors duration-300">
            <FaShoppingBag className="text-3xl text-green-500 mx-auto mb-2" />
            <div className="font-bold">10,000+</div>
            <div className="text-sm text-gray-400">Products Sold</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center hover:bg-gray-800/70 transition-colors duration-300">
            <FaTruck className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="font-bold">Islandwide</div>
            <div className="text-sm text-gray-400">Free Shipping</div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} <span className="text-amber-500 font-semibold">AMMOGAM</span>. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Registered e-commerce business in Sri Lanka | VAT No: 123456789
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/terms" className="footer-legal-link group">
                <span className="flex items-center gap-1">
                  <FaFileContract className="text-amber-500 group-hover:text-amber-400 transition-colors" />
                  Terms & Conditions
                </span>
              </Link>
              <Link to="/privacy" className="footer-legal-link group">
                <span className="flex items-center gap-1">
                  <FaLock className="text-blue-500 group-hover:text-blue-400 transition-colors" />
                  Privacy Policy
                </span>
              </Link>
              {/* <Link to="/cookies" className="footer-legal-link">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="footer-legal-link">
                Sitemap
              </Link> */}
            </div>
          </div>
          
          {/* Regulatory Compliance Notice */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              AMMOGAM complies with the Consumer Protection Act and Electronic Transactions Act of Sri Lanka.
              This website is protected by SSL encryption and follows PCI DSS compliance for payment security.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              For any legal inquiries, please contact: legal@ammogam.com
            </p>
          </div>
        </div>
      </div>

      {/* Mobile App Banner */}
      <div className="lg:hidden bg-gradient-to-r from-amber-900 to-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold flex items-center gap-2">
                <FaShoppingBag />
                Get the AMMOGAM App
              </div>
              <div className="text-sm text-amber-100">Shop on the go</div>
            </div>
            <div className="flex gap-2">
              <button 
                className="px-3 py-2 bg-black rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Download on App Store"
              >
                App Store
              </button>
              <button 
                className="px-3 py-2 bg-black rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Get it on Google Play"
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}