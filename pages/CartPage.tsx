import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useAppContext } from '../App';
import { formatRupiah } from '../utils';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// Agar TypeScript tidak protes soal 'snap'
declare global {
  interface Window {
    snap: any;
  }
}

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, user } = useAppContext();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const shipping = subtotal > 150000 ? 0 : 20000;
  const total = subtotal + shipping;

  // --- FUNGSI HELPER GAMBAR (BARU) ---
  const fallbackImage = "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80";

  const getImageUrl = (url: string) => {
    if (!url) return fallbackImage;
    // Tambahkan timestamp agar browser mengambil gambar terbaru
    if (url.includes('images.unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${new Date().getTime()}`;
    }
    return url;
  };
  // ------------------------------------

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Silakan login dulu untuk belanja!");
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('token');

    try {
      if (!token) throw new Error("Token hilang");

      const data = await api.checkout(token, total, cart, user);

      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          toast.success("Pembayaran Berhasil! Pesanan diproses.");
          clearCart();
        },
        onPending: function (result: any) {
          toast("Menunggu pembayaran...", { icon: '⏳' });
        },
        onError: function (result: any) {
          toast.error("Pembayaran Gagal!");
        },
        onClose: function () {
          toast("Yah, kok ditutup? Bayar dulu yuk!");
        }
      });

    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses transaksi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Belanja Kosong</h2>
        <Link to="/catalog" className="inline-flex items-center px-6 py-3 mt-4 bg-melon-600 text-white rounded-full hover:bg-melon-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

              {/* GAMBAR YANG SUDAH DIPERBAIKI */}
              <img
                src={getImageUrl(item.product.imageUrl)}
                alt={item.product.name}
                className="h-24 w-24 object-cover rounded-lg bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />

              <div className="ml-6 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                  <p className="text-lg font-bold text-melon-700">{formatRupiah(item.product.price * item.qty)}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    Qty: <strong>{item.qty}</strong>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id.toString())} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Ongkos Kirim</span><span>{shipping === 0 ? 'Gratis' : formatRupiah(shipping)}</span></div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-xl text-gray-900"><span>Total</span><span>{formatRupiah(total)}</span></div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-melon-600 text-white rounded-xl font-bold text-lg hover:bg-melon-700 transition-colors shadow-lg shadow-melon-200 flex items-center justify-center disabled:opacity-70"
            >
              {isProcessing ? <><Loader2 className="animate-spin mr-2" /> Memproses...</> : <>Bayar Sekarang <ArrowRight className="ml-2 h-5 w-5" /></>}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">Pembayaran Aman didukung oleh Midtrans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};