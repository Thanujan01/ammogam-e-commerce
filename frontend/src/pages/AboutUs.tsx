import { Link } from 'react-router-dom';
import {
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  
  FaShoppingBag,
  
  FaCheckCircle,
  FaGlobe,
  FaHeadset
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';

const AboutUs = () => {
  const socialLinks = [
    { 
      icon: <FaFacebook />, 
      link: 'https://www.facebook.com/profile.php?id=61585485344842', 
      label: 'Facebook',
      bgColor: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      icon: <FaInstagram />, 
      link: 'https://www.instagram.com/ammogam_eworld/', 
      label: 'Instagram',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    },
    { 
      icon: <FaTiktok />, 
      link: 'https://www.tiktok.com/@ammogam_eworld', 
      label: 'TikTok',
      bgColor: 'bg-gray-900 hover:bg-black'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Custom Colors */}
      <div className="bg-gradient-to-r from-[#d97706] via-[#d97706] to-[#d97706] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-white/30">
              <FaUserShield className="text-white text-2xl sm:text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
              AMMOGAM E WORLD
            </h1>
            {/* <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto">
              Your Premier Destination for Quality Products & Secure Shopping Experience
            </p> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* About Our Shop Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 sm:px-6 py-4 border-b">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Welcome to Our Online Store
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              {/* <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center mb-6">
                At AMMOGAM E WORLD, we're more than just an online store - we're your trusted partner 
                for discovering exceptional products that enhance your life.
              </p> */}
              
              {/* Shop Features */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <FaShieldAlt className="text-[#d97706] text-lg" />
                  <span className="text-gray-700 font-medium">Secure SSL Encrypted Transactions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <FaTruck className="text-[#d97706] text-lg" />
                  <span className="text-gray-700 font-medium">Fast Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <FaStar className="text-[#d97706] text-lg" />
                  <span className="text-gray-700 font-medium">Premium Quality Products</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <FaAward className="text-[#d97706] text-lg" />
                  <span className="text-gray-700 font-medium">Trusted by Thousands</span>
                </div>
              </div> */}
            </div>
            
            {/* Shop Highlights */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 sm:p-5 border border-amber-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
                Why Shop With Us?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-1">100%</div>
                  <div className="text-sm text-gray-700">Authentic Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-1">24/7</div>
                  <div className="text-sm text-gray-700">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B4513] mb-1">30-Day</div>
                  <div className="text-sm text-gray-700">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 sm:mb-8">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#d97706] to-[#d97706] text-white px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <FaUserShield className="text-white text-lg sm:text-xl" />
                  </div>
                  {/* <div className="absolute -top-1 -right-1 bg-[#d97706] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    DPO
                  </div> */}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Contact Information</h2>
                  <p className="text-sm text-amber-100">Data Protection Officer & Privacy Team</p>
                </div>
              </div>
              {/* <div className="bg-[#d97706] text-white text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto mt-2 sm:mt-0">
                Section 7
              </div> */}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              {/* <p className="text-gray-700">
                If you have questions or comments about our privacy policy, you may contact our Data Protection Officer (DPO) or our privacy team at:
              </p> */}
            </div>

            {/* Contact Details */}
            <div className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-600 text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Email</h3>
                  <a 
                    href="mailto:ammogameworld@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 font-medium break-all text-base sm:text-lg"
                  >
                    ammogameworld@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    For privacy concerns and policy questions
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-green-600 text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Phone</h3>
                  <a 
                    href="tel:+14169919591" 
                    className="text-green-600 hover:text-green-800 font-medium text-base sm:text-lg"
                  >
                    +1 416 9919591
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Privacy Hotline (Available during business hours)
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 sm:gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-[#d97706] text-xl sm:text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Address</h3>
                  <div className="text-gray-800 space-y-1">
                    <p className="font-medium">165, HERTFORD CRESCENT</p>
                    <p>MARKHAM, ONTARIO</p>
                    <p>L3S3R3</p>
                    <p className="font-semibold">CANADA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">Stay Connected</h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-600 text-center sm:text-left">
                  Follow us for updates, new arrivals, and exclusive offers
                </p>
                <div className="flex justify-center sm:justify-end gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.bgColor} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-md`}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#d97706] to-[#d97706] rounded-lg flex items-center justify-center">
              <FaGlobe className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">AMMOGAM E WORLD & COMPANY INC</h3>
              {/* <p className="text-gray-600 text-sm sm:text-base">Global E-Commerce Excellence</p> */}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FaCheckCircle className="text-[#d97706] text-base" />
              <span className="text-gray-700">Data Protection Compliant</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FaGlobe className="text-[#d97706] text-base" />
              <span className="text-gray-700">Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FaHeadset className="text-[#d97706] text-base" />
              <span className="text-gray-700">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FaCheckCircle className="text-[#d97706] text-base" />
              <span className="text-gray-700">Secure Payments</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Ready to Discover Amazing Products?
            </h3>
            {/* <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our curated collection of premium products with complete peace of mind
            </p> */}
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#8B4513] hover:from-[#b45305] hover:to-[#d97706] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <FaShoppingBag />
            <span className="text-base sm:text-lg">Start Shopping Now</span>
          </Link>
          {/* <p className="text-sm text-gray-500 mt-3">
            Secure checkout • Free shipping on orders over $50 • 30-day returns
          </p> */}
        </div>

        {/* Footer */}
        {/* <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#d97706] rounded-full"></div>
            <span className="text-gray-700 font-medium">Trusted E-Commerce Partner</span>
            <div className="w-2 h-2 bg-[#d97706] rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            © {new Date().getFullYear()} AMMOGAM E WORLD & COMPANY INC. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Registered in Ontario, Canada • Business Registration #: 134857632
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AboutUs;