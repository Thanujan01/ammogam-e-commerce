import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaShieldAlt, FaTruck, FaHeadset, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaClock, FaCcVisa, FaCcMastercard, FaCcPaypal,
  FaCcAmex, FaShoppingBag, FaTag,
  FaGift, FaStar, FaAward, FaRecycle
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
  ];

  const socialLinks = [
    { icon: <FaFacebook />, link: 'https://facebook.com/ammogam', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: <FaInstagram />, link: 'https://instagram.com/ammogam', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: <FaTwitter />, link: 'https://twitter.com/ammogam', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: <FaLinkedin />, link: 'https://linkedin.com/company/ammogam', color: 'hover:bg-blue-700', label: 'LinkedIn' },
    { icon: <FaYoutube />, link: 'https://youtube.com/ammogam', color: 'hover:bg-red-600', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-amber-900/20 via-amber-800/20 to-amber-900/20 border-y border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 ${badge.color}`}>
                  {badge.icon}
                </div>
                <div>
                  <div className="font-bold text-sm">{badge.text}</div>
                  <div className="text-xs text-gray-400">Guaranteed</div>
                </div>
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
            <p className="text-gray-300">
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
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${social.color} transition-colors duration-300`}
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
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="footer-link">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/deals" className="footer-link">
                  <span className="flex items-center gap-2">
                    <FaGift className="text-amber-500" />
                    Hot Deals
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/trending" className="footer-link">
                  <span className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Trending Products
                  </span>
                </Link>
              </li>
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
                <Link to="/shipping" className="footer-link">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link">
                  Returns & Refunds
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
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-3 border-b border-amber-800/30 flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-500" />
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-500 mt-1" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-gray-300 text-sm">
                    123 E-Commerce Street,<br />
                    Colombo 01000,<br />
                    Sri Lanka
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-amber-500" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-300 text-sm">+94 77 123 4567</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-300 text-sm">support@ammogam.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaClock className="text-amber-500" />
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div className="text-gray-300 text-sm">9:00 AM - 8:00 PM (GMT+5:30)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
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
              <div key={index} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                {method.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gray-800/50 rounded-xl text-center">
            <FaAward className="text-3xl text-amber-500 mx-auto mb-2" />
            <div className="font-bold">Trusted Store</div>
            <div className="text-sm text-gray-400">Since 2020</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <div className="font-bold">4.9/5 Rating</div>
            <div className="text-sm text-gray-400">Customer Reviews</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center">
            <FaShoppingBag className="text-3xl text-green-500 mx-auto mb-2" />
            <div className="font-bold">10,000+</div>
            <div className="text-sm text-gray-400">Products Sold</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl text-center">
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
              <p className="text-sm text-gray-500">
                Designed & Developed with ❤️ for premium shopping experience
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/terms" className="footer-legal-link">
                Terms of Service
              </Link>
              <Link to="/privacy" className="footer-legal-link">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="footer-legal-link">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="footer-legal-link">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Banner */}
      <div className="lg:hidden bg-gradient-to-r from-amber-900 to-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Get the AMMOGAM App</div>
              <div className="text-sm">Shop on the go</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-black rounded-lg text-sm font-semibold">
                App Store
              </button>
              <button className="px-3 py-2 bg-black rounded-lg text-sm font-semibold">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}