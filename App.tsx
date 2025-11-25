import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- ANIMATION IMPORTS (FIXED) ---
import AOS from 'aos'; // <--- KAMU LUPA IMPORT INI TADI
import 'aos/dist/aos.css';

// Components & Pages
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { OrdersPage } from './pages/OrdersPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';

// Services & Types
import { api } from './services/api';
import { CartItem, Product, User } from './types';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

export default function App() {
  // --- 1. INISIALISASI AOS (ANIMASI) ---
  useEffect(() => {
    AOS.init({
      once: true, // Animasi hanya terjadi sekali saat scroll ke bawah
      duration: 800, // Durasi default
      easing: 'ease-out-cubic', // Gaya animasi smooth
      offset: 100, // Jarak trigger animasi dari bawah layar
    });
  }, []);

  // --- 2. STATE KERANJANG (CART) ---
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id.toString() !== productId.toString()));
  };

  const clearCart = () => setCart([]);

  // --- 3. STATE AUTHENTICATION ---
  const [user, setUser] = useState<User | null>(null);

  // Cek Token saat Refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      // console.log("🔄 [App] Cek Token di Storage:", token); 

      if (token) {
        try {
          const data = await api.getProfile(token);
          // console.log("✅ [App] Data Profil dari Backend:", data);

          if (data && data.userData) {
            setUser(data.userData);
          } else {
            console.warn("⚠️ [App] Struktur data salah, userData tidak ditemukan:", data);
          }
        } catch (error) {
          console.error("❌ [App] Token tidak valid/Sesi habis:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    initAuth();
  }, []);

  // Fungsi Login
  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      const data = await api.getProfile(token);
      if (data && data.userData) {
        setUser(data.userData);
      }
    } catch (error) {
      console.error("❌ [App] Gagal load user setelah login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      user, isAuthenticated: !!user, login, logout
    }}>
      {/* Toast Notification (Pop-up Sukses/Gagal) */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #86efac',
            padding: '16px',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          }
        }}
      />

      {/* Routing Halaman */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="seller" element={<SellerDashboard />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}