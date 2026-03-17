import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/store/Header';
import Footer from './components/store/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/website/Home';
import About from './pages/website/About';
import Contact from './pages/website/Contact';
import Shop from './pages/website/Shop';
import ProductDetail from './pages/website/ProductDetail';
import Cart from './pages/website/Cart';
import Checkout from './pages/website/Checkout';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminConsultations from './pages/admin/Consultations';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('energymart-cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const addToCart = (product: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const newCart = existing
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem('energymart-cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(prev => {
      const newCart = quantity === 0
        ? prev.filter(item => item.id !== id)
        : prev.map(item => item.id === id ? { ...item, quantity } : item);
      localStorage.setItem('energymart-cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('energymart-cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('energymart-cart');
  };

  return (
    <AuthProvider>
      <CartProvider value={{ cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Store Routes */}
            <Route path="/" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Home /><Footer /></>} />
            <Route path="/about" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><About /><Footer /></>} />
            <Route path="/contact" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Contact /><Footer /></>} />
            <Route path="/shop" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Shop /><Footer /></>} />
            <Route path="/product/:id" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><ProductDetail /><Footer /></>} />
            <Route path="/cart" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Cart /><Footer /></>} />
            <Route path="/checkout" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Checkout /><Footer /></>} />
            
            {/* Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/consultations" element={<ProtectedRoute><AdminLayout><AdminConsultations /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;