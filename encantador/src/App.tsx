import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute requireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}