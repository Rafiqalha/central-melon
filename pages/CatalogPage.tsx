import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, Calendar, Truck, Download, Table, Grid,
  ExternalLink, ShoppingCart, CheckCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAppContext } from '../App'; // Import Context
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

interface BulkProduct extends Product {
  brix: number;
  shelfLife: string;
  minOrder: number;
  availableStock: number;
  harvestDate: string;
  b2bCategory: string;
  tiers: { qty: string; price: number }[];
}

export const CatalogPage: React.FC = () => {
  const { addToCart } = useAppContext(); // Ambil fungsi cart
  const [products, setProducts] = useState<BulkProduct[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const categories = ['All', 'Premium Export', 'Supermarket Grade', 'Industrial Grade'];

  // --- 1. IMAGE LOGIC ---
  const getMelonImage = (name: string, originalUrl?: string) => {
    const BACKEND_URL = 'http://localhost:4000';
    if (originalUrl && originalUrl.length > 5) {
      if (originalUrl.startsWith('http')) return originalUrl;
      return `${BACKEND_URL}${originalUrl}`;
    }
    const n = name.toLowerCase();
    if (n.includes('yubari') || n.includes('king')) return "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400";
    if (n.includes('honey') || n.includes('globe')) return "https://images.unsplash.com/photo-1591271300850-22d6784e0a7f?q=80&w=400";
    if (n.includes('golden')) return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400";
    return "https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=400";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400";
    target.onerror = null;
  };

  // --- 2. ANIMASI FLY-TO-CART (THE MAGIC ✨) ---
  const handleAddToCart = (e: React.MouseEvent, product: BulkProduct) => {
    e.preventDefault();

    // 1. Cari elemen gambar produk yang diklik (untuk diambil posisinya)
    // Kita cari tag img terdekat dalam container kartu produk yang sama
    const card = (e.target as HTMLElement).closest('.product-item');
    const imgElement = card?.querySelector('img') as HTMLImageElement;
    const cartIcon = document.getElementById('cart-icon-dest');

    if (imgElement && cartIcon) {
      // 2. Cloning Gambar
      const clone = imgElement.cloneNode(true) as HTMLImageElement;
      const rect = imgElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // 3. Set Style Clone (Posisi awal sama persis dengan gambar asli)
      clone.style.position = 'fixed';
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.borderRadius = '12px';
      clone.style.zIndex = '9999'; // Paling depan
      clone.style.pointerEvents = 'none'; // Biar ga ganggu klik
      clone.style.opacity = '0.8';

      document.body.appendChild(clone);

      // 4. Animasi GSAP (Terbang ke Keranjang)
      gsap.to(clone, {
        x: cartRect.left - rect.left + 10, // Geser X ke arah keranjang
        y: cartRect.top - rect.top + 10,   // Geser Y ke arah keranjang
        width: 20,  // Mengecil
        height: 20, // Mengecil
        opacity: 0, // Menghilang
        duration: 0.8,
        ease: "power3.inOut", // Gerakan smooth (lambat-cepat-lambat)
        onComplete: () => {
          clone.remove(); // Hapus clone dari DOM
          addToCart(product, 100); // Masukkan ke State Cart (Default 100kg buat sample)
          toast.success(`Sampel ${product.name} masuk keranjang!`, {
            icon: '🛒',
            position: 'bottom-right'
          });
        }
      });
    } else {
      // Fallback jika animasi gagal
      addToCart(product, 100);
      toast.success("Berhasil masuk keranjang");
    }
  };

  // --- DATA & LOGIC LAINNYA ---
  const enrichData = (originalData: Product[]): BulkProduct[] => {
    return originalData.map(p => {
      let cat = 'Industrial Grade';
      if (p.qualityGrade?.includes('A+') || p.qualityGrade?.includes('Premium')) cat = 'Premium Export';
      else if (p.qualityGrade?.includes('A')) cat = 'Supermarket Grade';

      return {
        ...p,
        imageUrl: getMelonImage(p.name, p.imageUrl),
        b2bCategory: cat,
        brix: Math.floor(Math.random() * (17 - 11) + 11),
        shelfLife: p.qualityGrade?.includes('A') ? "14-21 Hari" : "7-10 Hari",
        minOrder: 100,
        availableStock: Math.floor(Math.random() * 4000) + 1000,
        harvestDate: "Ready Stock",
        tiers: [
          { qty: "100 - 500 kg", price: p.price },
          { qty: "500 kg - 1 Ton", price: Math.floor(p.price * 0.9) },
          { qty: "> 1 Ton", price: Math.floor(p.price * 0.85) },
        ]
      };
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(enrichData(data));
      } catch (e) {
        console.error(e);
        toast.error("Gagal memuat data supply");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.origin?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.b2bCategory === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // --- ACTIONS LAIN ---
  const handleQuote = (p: BulkProduct) => {
    const phone = "628123456789";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Halo, saya ingin penawaran partai besar untuk ${p.name}...`)}`, '_blank');
  };

  // Animasi List Masuk
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".b2b-header", { y: -30, opacity: 0, duration: 0.8 });
      gsap.fromTo(".product-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, overwrite: true }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading, filteredProducts, viewMode]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse text-melon-600 font-bold">Memuat Data Supply Chain...</div></div>;

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-100 font-sans text-slate-800 pb-20">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 b2b-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider border border-green-200">Wholesale Portal</span>
                <span className="text-xs text-gray-500 flex items-center font-medium"><Calendar size={12} className="mr-1" /> Panen Raya: Nov - Des 2025</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Katalog Supply & Pengadaan</h1>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"><Download size={16} className="mr-2" /> Pricelist (PDF)</button>
              <button className="flex items-center px-4 py-2 bg-melon-600 hover:bg-melon-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"><Truck size={16} className="mr-2" /> Cek Ongkir Logistik</button>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {[
              { l: "Total Kapasitas", v: "25 Ton", sub: "Per Minggu" },
              { l: "Varian Ready", v: products.length + " Jenis", sub: "Grade A & B" },
              { l: "Rata-rata Brix", v: "14 - 16%", sub: "Sweetness Level" },
              { l: "Coverage Area", v: "Jawa - Bali", sub: "Ekspedisi Khusus" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{stat.l}</p>
                <p className="text-lg font-bold text-gray-900">{stat.v}</p>
                <p className="text-[10px] text-gray-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari varietas..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-melon-500 outline-none transition-all" />
            </div>
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Table size={18} /></button>
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Grid size={18} /></button>
            </div>
          </div>
        </div>

        {/* VIEW MODES */}
        {viewMode === 'list' ? (
          /* --- LIST VIEW --- */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-24">Image</th>
                    <th className="px-6 py-4">Varietas & Grade</th>
                    <th className="px-6 py-4">Spesifikasi</th>
                    <th className="px-6 py-4 text-center">Stok</th>
                    <th className="px-6 py-4 text-right">Tier Pricing</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="product-item hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={handleImageError} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <h3 className="font-bold text-gray-900 text-base">{p.name}</h3>
                        <div className="flex gap-2 mt-1.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${p.qualityGrade?.includes('A') ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{p.qualityGrade}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase border border-gray-200">{p.b2bCategory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 text-xs text-gray-600">
                          <p><span className="font-bold text-gray-900">Brix:</span> {p.brix}%</p>
                          <p><span className="font-bold text-gray-900">Origin:</span> {p.origin}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-lg font-black text-gray-900">{p.availableStock.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-500">kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="space-y-1">
                          {p.tiers.map((tier, i) => (
                            <div key={i} className="flex justify-end gap-4 text-xs">
                              <span className="text-gray-500">{tier.qty}</span>
                              <span className="font-mono font-bold text-gray-900">Rp {tier.price.toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleQuote(p)} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg flex items-center justify-center"><ExternalLink size={14} className="mr-2" /> Penawaran</button>

                          {/* TOMBOL CHECKOUT (FLY TO CART) */}
                          <button
                            onClick={(e) => handleAddToCart(e, p)}
                            className="w-full px-4 py-2 border border-melon-500 text-melon-600 hover:bg-melon-50 text-xs font-bold rounded-lg transition-colors flex items-center justify-center"
                          >
                            <ShoppingCart size={14} className="mr-2" /> Checkout (Sample)
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* --- GRID VIEW --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-item bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex p-4 gap-4 border-b border-gray-100">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={handleImageError} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-melon-50 text-melon-700 text-[10px] font-bold rounded border border-melon-200">{p.qualityGrade}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 truncate">{p.origin} • Brix {p.brix}%</p>
                    <div className="text-sm font-bold text-gray-900">Stock: {p.availableStock} kg</div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 flex gap-2">
                  <button onClick={() => handleQuote(p)} className="flex-1 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg">Penawaran</button>

                  {/* TOMBOL CHECKOUT GRID */}
                  <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className="px-3 py-2.5 border border-melon-500 text-melon-600 rounded-lg hover:bg-melon-50"
                    title="Checkout Sample"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};