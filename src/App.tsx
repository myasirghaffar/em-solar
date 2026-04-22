import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toastInfo, toastSuccess } from './lib/toast';
import { AosRouteSync } from './components/AosRouteSync';
import { useState, useEffect } from 'react';
import Header from './components/store/Header';
import Footer from './components/store/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/website/Home';
import About from './pages/website/About';
import Contact from './pages/website/Contact';
import Shop from './pages/website/Shop';
import ProductDetail from './pages/website/ProductDetail';
import Checkout from './pages/website/Checkout';
import CartDrawer from './components/store/CartDrawer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import RegisterAdmin from './pages/RegisterAdmin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductCategories from './pages/admin/ProductCategories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminConsultations from './pages/admin/Consultations';
import AdminSettings from './pages/admin/Settings';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminProfile from './pages/admin/Profile';
import AdminSalesTeamPage from './pages/admin/AdminSalesTeamPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import SalesLayout from './components/sales/SalesLayout';
import SalesDashboard from './pages/sales/Dashboard';
import SalesProfile from './pages/sales/Profile';
import LeadsListView from './pages/leads/LeadsListView';
import LeadDetailPage from './pages/leads/LeadDetailPage';
import QuotesPage from './pages/leads/QuotesPage';
import CustomerAccount from './pages/website/CustomerAccount';
import News from './pages/website/News';
import NewsDetail from './pages/website/NewsDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider, type StoreDrawerTab } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<StoreDrawerTab>('cart');

  const openCart = () => {
    setDrawerTab('cart');
    setIsCartOpen(true);
  };
  const openFavoritesDrawer = () => {
    setDrawerTab('favorites');
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  useEffect(() => {
    const savedCart = localStorage.getItem('energymart-cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const addToCart = (product: CartItem, quantity = 1) => {
    const q = Math.max(1, Math.floor(quantity));
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const newCart = existing
        ? prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + q } : item,
          )
        : [...prev, { ...product, quantity: q }];
      localStorage.setItem('energymart-cart', JSON.stringify(newCart));
      return newCart;
    });
    toastSuccess(
      q > 1 ? `Added ${q} × ${product.name} to cart` : `Added “${product.name}” to cart`,
    );
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
    toastInfo('Removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('energymart-cart');
  };

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider
          value={{
            cartItems,
            addToCart,
            updateCartQuantity,
            removeFromCart,
            clearCart,
            isCartOpen,
            drawerTab,
            setDrawerTab,
            openCart,
            openFavoritesDrawer,
            closeCart,
            toggleCart,
          }}
        >
          <BrowserRouter>
            <ToastContainer
              position="top-right"
              autoClose={3200}
              theme="colored"
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              limit={4}
              style={{ zIndex: 99999 }}
            />
            <AosRouteSync />
            <ScrollToTop />
            <CartDrawer />
            <Routes>
              {/* Store Routes */}
              <Route path="/" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Home /><Footer /></>} />
              <Route path="/about" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><About /><Footer /></>} />
              <Route path="/contact" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Contact /><Footer /></>} />
              <Route path="/news" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><News /><Footer /></>} />
              <Route path="/news/:id" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><NewsDetail /><Footer /></>} />
              <Route path="/shop" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Shop /><Footer /></>} />
              <Route path="/product/:id" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><ProductDetail /><Footer /></>} />
              <Route path="/checkout" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><Checkout /><Footer /></>} />
              <Route path="/profile" element={<><Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} /><ProtectedRoute><CustomerAccount /></ProtectedRoute><Footer /></>} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/register-admin" element={<RegisterAdmin />} />

              {/* Admin Routes (admin only) */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/product-categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProductCategories /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/consultations" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminConsultations /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/blogs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminBlogs /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/leads" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><LeadsListView basePath="/admin/leads" /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/leads/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><LeadDetailPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/quotes" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><QuotesPage area="admin" /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/sales-team" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSalesTeamPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute>} />

              <Route path="/salesman" element={<ProtectedRoute allowedRoles={['salesman']}><SalesLayout><SalesDashboard /></SalesLayout></ProtectedRoute>} />
              <Route path="/salesman/leads" element={<ProtectedRoute allowedRoles={['salesman']}><SalesLayout><LeadsListView basePath="/salesman/leads" /></SalesLayout></ProtectedRoute>} />
              <Route path="/salesman/leads/:id" element={<ProtectedRoute allowedRoles={['salesman']}><SalesLayout><LeadDetailPage /></SalesLayout></ProtectedRoute>} />
              <Route path="/salesman/quotes" element={<ProtectedRoute allowedRoles={['salesman']}><SalesLayout><QuotesPage area="salesman" /></SalesLayout></ProtectedRoute>} />
              <Route path="/salesman/profile" element={<ProtectedRoute allowedRoles={['salesman']}><SalesLayout><SalesProfile /></SalesLayout></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;