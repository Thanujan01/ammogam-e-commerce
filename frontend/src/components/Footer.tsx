import { Link } from 'react-router-dom';
import {
  FaFacebook, FaInstagram,
  FaShieldAlt, FaTruck, FaHeadset, FaShoppingBag
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';

// Assuming you have these images in your project:
// visa-logo.png, mastercard-logo.png, amex-logo.png, discover-logo.png
import visaLogo from '../assets/visa-logo.png';
import mastercardLogo from '../assets/mastercard-logo.png';
import amexLogo from '../assets/amex-logo.png';
import discoverLogo from '../assets/discover-logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const trustBadges = [
    { icon: <FaShieldAlt className="text-xl" />, text: 'Secure Payment', color: 'text-green-500' },
    { icon: <FaTruck className="text-xl" />, text: 'Safe Delivery', color: 'text-amber-500' },
    { icon: <FaHeadset className="text-xl" />, text: '24/7 Support', color: 'text-blue-500' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, link: 'https://www.facebook.com/profile.php?id=61585485344842', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: <FaInstagram />, link: 'https://www.instagram.com/ammogam_eworld/', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: <FaTiktok />, link: 'https://www.tiktok.com/@ammogam_eworld', color: 'hover:bg-black', label: 'TikTok' },
  ];

  const paymentMethods = [
    { 
      icon: <img src={visaLogo} alt="Visa" className="h-6 w-auto object-contain" />, 
      name: 'Visa' 
    },
    { 
      icon: <img src={mastercardLogo} alt="Mastercard" className="h-6 w-auto object-contain" />, 
      name: 'Mastercard' 
    },
    { 
      icon: <img src={amexLogo} alt="American Express" className="h-6 w-auto object-contain" />, 
      name: 'American Express' 
    },
    { 
      icon: <img src={discoverLogo} alt="Discover" className="h-6 w-auto object-contain" />, 
      name: 'Discover' 
    },
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
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 sm:gap-6 mb-8">
          {/* Company Info - Now takes 2 columns on medium screens */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaShoppingBag className="text-2xl text-white" />
                </div>
                <div>
                  {/* Company Name with responsive text size */}
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent text-center md:text-left">
                    <span className="block">AMMOGAM E WORLD &</span>
                    <span className="block">COMPANY INC</span>
                  </h3>
                </div>
              </div>
              <p className="text-gray-300 text-sm text-center md:text-left max-w-md">
                Your trusted online destination for quality products at amazing prices.
              </p>
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
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/wishlist" 
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm block py-1"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-800/30">We Accept</h4>
            <div className="space-y-4">
              <div className="flex flex-nowrap gap-2 justify-start items-center overflow-x-auto pb-2">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors duration-300 flex items-center justify-center flex-shrink-0 w-16 h-10"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg p-3 md:p-4 border border-amber-800/30">
                <p className="text-xs md:text-sm text-gray-300">
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-xs md:text-sm">
                © {currentYear} <span className="text-amber-500 font-semibold">AMMOGAM</span>. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-amber-400 text-xs transition-colors px-2"
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-amber-400 text-xs transition-colors px-2"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}