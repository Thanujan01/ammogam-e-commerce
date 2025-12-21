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
import UserDashboard from './pages/UserDashboard';
import PaymentSimulator from './pages/PaymentSimulator';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailed from './pages/PaymentFailed';
import OrderDetails from './pages/OrderDetails';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist';

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
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <PaymentSimulator />
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
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotification />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="sellers/:id" element={<AdminSellerDetails />} />
          </Route>

          {/* Additional routes for categories */}
          <Route path="/category/:category" element={<ProductList />} />
          <Route path="/category/:category/:subcategory" element={<ProductList />} />
        </Routes>
      </main>
      {(!isAdminRoute && !isSellerRoute) && <Footer />}
    </div>
  );
}

export default App;