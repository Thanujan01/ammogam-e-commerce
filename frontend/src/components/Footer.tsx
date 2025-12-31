import { Link } from 'react-router-dom';
import {
  FaFacebook, FaInstagram, FaLinkedin, FaYoutube,
  FaShieldAlt, FaTruck, FaHeadset, FaShoppingBag,
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const trustBadges = [
    { icon: <FaShieldAlt className="text-xl" />, text: 'Secure Payment', color: 'text-green-500' },
    { icon: <FaTruck className="text-xl" />, text: 'Safe Delivery', color: 'text-amber-500' },
    { icon: <FaHeadset className="text-xl" />, text: '24/7 Support', color: 'text-blue-500' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, link: 'https://facebook.com/ammogam', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: <FaInstagram />, link: 'https://instagram.com/ammogam', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: <FaLinkedin />, link: 'https://linkedin.com/company/ammogam', color: 'hover:bg-blue-700', label: 'LinkedIn' },
    { icon: <FaYoutube />, link: 'https://youtube.com/ammogam', color: 'hover:bg-red-600', label: 'YouTube' },
  ];

  const paymentMethods = [
    { icon: <FaCcVisa className="text-2xl" />, name: 'Visa', color: 'text-blue-600' },
    { icon: <FaCcMastercard className="text-2xl" />, name: 'Mastercard', color: 'text-red-600' },
    { icon: <FaCcAmex className="text-2xl" />, name: 'American Express', color: 'text-blue-800' },
    { icon: <FaCcPaypal className="text-2xl" />, name: 'PayPal', color: 'text-blue-500' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-amber-900/20 via-amber-800/20 to-amber-900/20 border-y border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 ${badge.color} flex-shrink-0`}>
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{badge.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 mb-8">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShoppingBag className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  AMMOGAM
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Your trusted online destination for quality products at amazing prices.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-center md:justify-start">
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
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-800/30">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-800/30">We Accept</h4>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors duration-300 ${method.color} flex items-center justify-center`}
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg p-4 border border-amber-800/30">
                <p className="text-sm text-gray-300 text-center md:text-left">
                  All transactions are secured with SSL encryption. Your payment information is protected with the highest security standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left order-2 sm:order-1">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-amber-500 font-semibold">AMMOGAM</span>. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 order-1 sm:order-2 mb-4 sm:mb-0">
              <Link to="/terms" className="text-gray-400 hover:text-amber-400 text-xs transition-colors px-2">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-xs transition-colors px-2">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}