import React, { useState, useRef } from 'react';
import {
  Upload, Leaf, DollarSign, Package,
  Info, CheckCircle2, AlertCircle, MapPin,
  ThermometerSun, CalendarClock
} from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [grade, setGrade] = useState('Grade A');
  const [category, setCategory] = useState('Premium Export');
  const [origin, setOrigin] = useState('Malang, Jawa Timur');
  const [brix, setBrix] = useState('14');
  const [description, setDescription] = useState('');

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Buat preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !name || !price) {
      toast.error("Mohon lengkapi data wajib (Foto, Nama, Harga)");
      return;
    }

    setLoading(true);

    // Bungkus data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('qualityGrade', grade);
    formData.append('origin', origin); // Pastikan backend support atau masukkan ke deskripsi
    formData.append('sweetnessBrix', brix); // Pastikan backend support
    formData.append('description', description);

    try {
      await api.createProduct(formData);
      toast.success('Panen berhasil didaftarkan ke sistem!');
      navigate('/catalog'); // Arahkan ke katalog untuk melihat hasil
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Gagal upload produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-slate-800">

      {/* Header Dashboard */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-700">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal Mitra Tani</h1>
              <p className="text-sm text-gray-500">Input data hasil panen untuk supply chain B2B.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- KOLOM KIRI: INPUT FORM --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. INFORMASI UTAMA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={18} className="text-melon-600" /> Informasi Varietas
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Varietas Melon</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Golden Aroma, Honey Globe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Supply</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none bg-white"
                    >
                      <option value="Premium Export">Premium Export (Grade A+)</option>
                      <option value="Supermarket Grade">Supermarket Grade (Grade A)</option>
                      <option value="Industrial Grade">Industrial Grade (Grade B)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Kualitas</label>
                    <select
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none bg-white"
                    >
                      <option value="Grade A+">Grade A+ (Perfect)</option>
                      <option value="Grade A">Grade A (Standard)</option>
                      <option value="Grade B">Grade B (Off-shape)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SPESIFIKASI TEKNIS (BRIX & ORIGIN) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ThermometerSun size={18} className="text-orange-500" /> Spesifikasi Teknis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Kemanisan (Brix)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={brix}
                      onChange={e => setBrix(e.target.value)}
                      className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">*Standar Grade A minimal 12%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kebun (Origin)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. HARGA & STOK */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" /> Penawaran & Stok
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Kg (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Stok Siap Panen (Kg)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tambahan</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Jelaskan kondisi fisik buah, metode tanam (Greenhouse/Open Field), dll..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-melon-500 outline-none"
                ></textarea>
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: UPLOAD FOTO & PREVIEW --- */}
          <div className="lg:col-span-1 space-y-6">

            {/* UPLOAD CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Foto Hasil Panen</h2>

              <div className="relative w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-melon-500 bg-gray-50 transition-all flex flex-col items-center justify-center text-center overflow-hidden group cursor-pointer">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      Ganti Foto
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <div className="w-12 h-12 bg-melon-100 text-melon-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Klik untuk upload</p>
                    <p className="text-xs text-gray-400 mt-1">JPG/PNG Max 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Pastikan foto terang dan memperlihatkan jaring (net) melon dengan jelas.
              </p>
            </div>

            {/* PREVIEW CARD (SIMULASI B2B) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 opacity-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Preview Katalog</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold rounded uppercase text-gray-500">B2B View</span>
              </div>

              {/* Mockup Card */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="flex p-3 gap-3 border-b border-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {imagePreview && <img src={imagePreview} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      <span className="text-[8px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{grade}</span>
                    </div>
                    <p className="font-bold text-sm text-gray-900 leading-tight">{name || 'Nama Melon...'}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{origin} • Brix {brix}%</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium"> 1 Ton</span>
                    <span className="font-bold text-gray-900">Rp {(parseInt(price || '0') * 0.85).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-melon-600 hover:bg-melon-700 text-white font-bold rounded-xl shadow-lg shadow-melon-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Menyimpan Data...</>
              ) : (
                <><Package size={20} /> Tayangkan Produk Supply</>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};