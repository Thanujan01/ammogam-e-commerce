import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
// import PaymentSimulator from './pages/PaymentSimulator';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailed from './pages/PaymentFailed';
import OrderDetails from './pages/OrderDetails';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist';

// Legal/Policy Pages
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import { AdminDashboardLayout } from './components/AdminDashboardLayout/AdminDashboardLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminSellers from './pages/Admin/AdminSellers';
import AdminSellerDetails from './pages/Admin/AdminSellerDetails';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtected from './components/AdminProtected';
import Users from './pages/Admin/Users';
import AdminNotification from './pages/Admin/AdminNotification';
import AdminReports from './pages/Admin/AdminReports';

import SellerProtected from './components/SellerProtected';
import { SellerDashboardLayout } from './components/SellerDashboardLayout/SellerDashboardLayout';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerProfile from './pages/Seller/SellerProfile';
import SellerNotifications from './pages/Seller/SellerNotifications';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSellerRoute = location.pathname.startsWith('/seller');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {(!isAdminRoute && !isSellerRoute) && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          
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
          {/* <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <PaymentSimulator />
              </ProtectedRoute>
            }
          /> */}
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
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotification />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="sellers/:id" element={<AdminSellerDetails />} />
          </Route>

          {/* Category Routes */}
          <Route path="/category/:category" element={<ProductList />} />
          <Route path="/category/:category/:subcategory" element={<ProductList />} />
          
          {/* Additional Policy Routes (Placeholders for future implementation) */}
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
      </main>
      {(!isAdminRoute && !isSellerRoute) && <Footer />}
    </div>
  );
}

// Add this import if not already present
import { Link } from 'react-router-dom';

export default App;