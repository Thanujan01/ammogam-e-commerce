import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtected from './components/AdminProtected';
import SellerProtected from './components/SellerProtected';
import { AdminDashboardLayout } from './components/AdminDashboardLayout/AdminDashboardLayout';
import { SellerDashboardLayout } from './components/SellerDashboardLayout/SellerDashboardLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
// const PaymentSimulator = lazy(() => import('./pages/PaymentSimulator'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AboutUs = lazy(() => import('./pages/AboutUs'));

// Legal/Policy Pages
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/Admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));
const AdminProfile = lazy(() => import('./pages/Admin/AdminProfile'));
const AdminSellers = lazy(() => import('./pages/Admin/AdminSellers'));
const AdminSellerDetails = lazy(() => import('./pages/Admin/AdminSellerDetails'));
const Users = lazy(() => import('./pages/Admin/Users'));
const AdminNotification = lazy(() => import('./pages/Admin/AdminNotification'));
const AdminReports = lazy(() => import('./pages/Admin/AdminReports'));

// Seller Pages
const SellerDashboard = lazy(() => import('./pages/Seller/SellerDashboard'));
const SellerProducts = lazy(() => import('./pages/Seller/SellerProducts'));
const SellerOrders = lazy(() => import('./pages/Seller/SellerOrders'));
const SellerProfile = lazy(() => import('./pages/Seller/SellerProfile'));
const SellerNotifications = lazy(() => import('./pages/Seller/SellerNotifications'));

const Loading = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isPublicLayout = !isAdminRoute && !isSellerRoute;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      {isPublicLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Legal/Policy Routes */}
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* User Protected Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:orderId"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-failed/:orderId"
              element={
                <ProtectedRoute>
                  <PaymentFailed />
                </ProtectedRoute>
              }
            />

            {/* Seller Routes */}
            <Route
              path="/seller"
              element={
                <SellerProtected>
                  <SellerDashboardLayout />
                </SellerProtected>
              }
            >
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="notifications" element={<SellerNotifications />} />
              <Route path="profile" element={<SellerProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtected>
                  <AdminDashboardLayout />
                </AdminProtected>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<Users />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="notifications" element={<AdminNotification />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="sellers/:id" element={<AdminSellerDetails />} />
            </Route>

            {/* Category Routes */}
            <Route path="/category/:category" element={<ProductList />} />
            <Route path="/category/:category/:subcategory" element={<ProductList />} />

            {/* Additional Policy Routes */}
            <Route path="/shipping" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
                  <p className="text-gray-600">Coming Soon</p>
                  <Link to="/" className="mt-4 inline-block text-amber-600 hover:text-amber-800 font-semibold">
                    Back to Home
                  </Link>
                </div>
              </div>
            } />
            <Route path="/returns" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Returns & Refunds Policy</h1>
                  <p className="text-gray-600">Coming Soon</p>
                  <Link to="/" className="mt-4 inline-block text-amber-600 hover:text-amber-800 font-semibold">
                    Back to Home
                  </Link>
                </div>
              </div>
            } />
            <Route path="/cookies" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
                  <p className="text-gray-600">Coming Soon</p>
                  <Link to="/" className="mt-4 inline-block text-amber-600 hover:text-amber-800 font-semibold">
                    Back to Home
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
      {isPublicLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

export default App;