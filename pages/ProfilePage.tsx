import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Save, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../App';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, login } = useAppContext();

  // State
  const [username, setUsername] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Isi data awal saat halaman dimuat
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setPreviewImage(user.picture || '');
    }
  }, [user]);

  // --- LOGIKA UPLOAD GAMBAR (File -> Base64) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Validasi Ukuran (Maks 1MB agar database tidak berat)
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar! Maksimal 1MB.");
        return;
      }

      // 2. Baca File sebagai Data URL (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        // Hasilnya adalah string "data:image/jpeg;base64,..."
        setPreviewImage(reader.result as string);
        toast.success("Foto berhasil dipilih. Jangan lupa klik Simpan!", { icon: '📸' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper untuk memicu klik input file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- LOGIKA SIMPAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      // Kita kirim previewImage (yang berisi Base64 atau URL lama)
      await api.updateProfile(token, {
        username,
        picture: previewImage || ''
      });

      // Refresh data user di aplikasi
      await login(token);

      toast.success('Profil berhasil diperbarui!', {
        icon: '🍈',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });

    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-melon-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* === BAGIAN KIRI: FOTO PROFIL (Gradient Background) === */}
        <div className="md:w-5/12 bg-gradient-to-br from-melon-600 to-melon-800 p-8 text-white flex flex-col items-center justify-center text-center relative">

          {/* Dekorasi Pattern Halus */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>

          <div className="relative group z-10 mb-4">
            {/* Lingkaran Foto */}
            <div className="w-40 h-40 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                  }}
                />
              ) : (
                <User className="w-20 h-20 text-white/50" />
              )}
            </div>

            {/* Overlay Tombol Kamera (Muncul saat Hover) */}
            <button
              onClick={triggerFileInput}
              type="button"
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-10 h-10 text-white drop-shadow-md" />
              <span className="sr-only">Ganti Foto</span>
            </button>

            {/* Input File Tersembunyi */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
          </div>

          <h2 className="text-xl font-bold z-10">{username || 'User'}</h2>
          <p className="text-melon-100 text-sm z-10 mb-4">{user.email}</p>
          <button onClick={triggerFileInput} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors z-10">
            Ubah Foto
          </button>
        </div>

        {/* === BAGIAN KANAN: FORM === */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Profil</h1>
            <p className="text-gray-500 text-sm">Perbarui informasi akunmu di sini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Input Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-melon-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="Nama Pengguna"
                />
              </div>
            </div>

            {/* Input Email (Read Only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi
              </p>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-melon-200 text-sm font-bold text-white bg-melon-600 hover:bg-melon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-melon-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};