import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Truck, ShieldCheck, Award, Loader2 } from 'lucide-react';
import { useAppContext } from '../App';
import { api } from '../services/api';
import { Product } from '../types';
import { formatRupiah } from '../utils';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 1. FUNGSI HELPER GAMBAR (Sama seperti di ProductCard) ---
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
  // -----------------------------------------------------------

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProductDetail(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const [qty, setQty] = useState(1);
  const handleQtyChange = (amount: number) => {
    const newQty = qty + amount;
    if (newQty >= 1) setQty(newQty);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-melon-50">
         <Loader2 className="h-10 w-10 text-melon-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Produk Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-2">{error || "Mungkin produk sudah dihapus petani."}</p>
        <button onClick={() => navigate('/catalog')} className="mt-4 text-melon-600 hover:underline">Kembali ke Katalog</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-melon-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-lg bg-gray-100">
            
            {/* GAMBAR UTAMA YANG SUDAH DIPERBAIKI */}
            <img 
              src={getImageUrl(product.imageUrl)} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />

          </div>
          
          {/* Thumbnails (Opsional - Kita pasang fallback juga biar aman) */}
          <div className="grid grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-transparent hover:border-melon-500 cursor-pointer">
                 <img 
                    src={getImageUrl(product.imageUrl)} 
                    alt="thumbnail" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                 />
               </div>
             ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-melon-100 text-melon-800 rounded-full text-xs font-bold uppercase tracking-wide">
              {product.category}
            </span>
            <div className="flex items-center text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-1 text-gray-700 font-semibold">{product.rating}</span>
              <span className="ml-1 text-gray-400 text-sm">({product.reviewCount || 0} ulasan)</span>
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-xl font-medium text-melon-700">{formatRupiah(product.price)}</p>

          <div className="mt-6 border-t border-b border-gray-100 py-6 space-y-4">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                 <span className="block text-gray-400">Asal Daerah</span>
                 <span className="font-medium text-gray-900">{product.origin}</span>
               </div>
               <div>
                 <span className="block text-gray-400">Tanggal Panen</span>
                 <span className="font-medium text-gray-900">{product.harvestDate}</span>
               </div>
               {product.seller && (
                 <div>
                   <span className="block text-gray-400">Petani Mitra</span>
                   <span className="font-medium text-gray-900 capitalize">{product.seller.username}</span>
                 </div>
               )}
            </div>
          </div>

          {/* AI Badge */}
          <div className="mt-6 bg-gradient-to-r from-melon-50 to-white border border-melon-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-melon-600" />
              <h3 className="font-bold text-gray-900">Verifikasi Kualitas AI</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <span className="text-xs text-gray-500 uppercase">Grade Mutu</span>
                <div className="text-lg font-bold text-melon-700">{product.qualityGrade}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <span className="text-xs text-gray-500 uppercase">Kemanisan (Brix)</span>
                <div className="text-lg font-bold text-melon-700">{product.sweetnessBrix}</div>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
             <div className="flex items-center border border-gray-300 rounded-full">
               <button onClick={() => handleQtyChange(-1)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-full">-</button>
               <span className="px-4 py-2 font-medium text-gray-900">{qty}</span>
               <button onClick={() => handleQtyChange(1)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-full">+</button>
             </div>
             <button 
               onClick={() => addToCart(product, qty)}
               className="flex-1 bg-melon-600 hover:bg-melon-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-melon-200 transition-all transform active:scale-95"
             >
               + Keranjang
             </button>
          </div>

          <div className="mt-8 space-y-3">
             <div className="flex items-center text-sm text-gray-500">
               <Truck className="h-4 w-4 mr-2" />
               Gratis ongkir untuk pembelian di atas Rp 150.000
             </div>
             <div className="flex items-center text-sm text-gray-500">
               <ShieldCheck className="h-4 w-4 mr-2" />
               Garansi 100% Uang Kembali jika buah busuk/rusak.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};