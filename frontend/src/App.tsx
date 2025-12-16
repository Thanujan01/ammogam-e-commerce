import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; // single login page
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';

import { AdminDashboardLayout } from './components/AdminDashboardLayout/AdminDashboardLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProfile from './pages/Admin/AdminProfile';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtected from './components/AdminProtected';
import Users from './pages/Admin/Users';
import AdminNotification from './pages/Admin/AdminNotification';
import AdminReports from './pages/Admin/AdminReports';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "flex-1" : "flex-1 container py-6"}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<ProductList/>} />
          <Route path="/products/:id" element={<ProductDetail/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminProtected><AdminDashboardLayout /></AdminProtected>}>
            <Route index element={<AdminDashboard/>} />
            <Route path="products" element={<AdminProducts/>} />
            <Route path="users" element={<Users/>} />
            <Route path="categories" element={<AdminCategories/>} />
            <Route path="orders" element={<AdminOrders/>} /> 
            <Route path='profile' element={<AdminProfile/>}/>
            <Route path="notifications" element={<AdminNotification/>} /> 
            <Route path='reports' element={<AdminReports/>}/>
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;