const BASE_URL = 'http://localhost:4000/api';

export const api = {

  register: async (username: string, pass: string) => {
    // Koreksi: tambah /auth
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: pass }),
    });
    return res.json();
  },

  login: async (username: string, pass: string) => {
    // Koreksi: tambah /auth
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: pass }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  getServicePackages: async () => {
    const res = await fetch(`${BASE_URL}/services/packages`);
    if (!res.ok) throw new Error('Gagal mengambil data paket');
    return res.json();
  },

  getServiceDetail: async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/packages/${id}`);
    if (!res.ok) throw new Error('Paket tidak ditemukan');
    return res.json();
  },

  sendServiceRequest: async (data: any) => {
    const res = await fetch(`${BASE_URL}/services/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Gagal mengirim permintaan');
    return res.json();
  },


  getProfile: async (token: string) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, { // Pastikan ada /auth
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil profil");
    return res.json();
  },

  loginWithGoogle: async (credential: string) => {
    // Koreksi: tambah /auth
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) throw new Error('Google Login failed');
    return res.json();
  },

  // --- PRODUCTS (Langsung /products) ---

  getProductDetail: async (id: string) => {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Melon tidak ditemukan');
    return res.json();
  },

  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Gagal mengambil data melon');
    return res.json();
  },

  // --- INI YANG BARU (Untuk Seller Dashboard) ---
  createProduct: async (formData: FormData) => {
    // 1. Ambil token dari penyimpanan browser
    // Pastikan nama key 'token' ini sama dengan yang kamu pakai saat login (cek Local Storage)
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error("Gagal: Kamu belum login.");
    }

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        // PENTING: Authorization harus ada supaya lolos dari satpam backend
        'Authorization': `Bearer ${token}`,

        // CATATAN: Jangan set 'Content-Type' secara manual saat pakai FormData
        // Biarkan browser yang mengurusnya.
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Gagal upload produk');
    return res.json();
  },

  updateProfile: async (token: string, data: { username: string; picture: string }) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT', // Pakai PUT untuk update
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal update profil');
    }
    return res.json();
  },
  checkout: async (token: string, total: number, items: any[], user: any) => {
    const res = await fetch(`${BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ total, customer: user }),
    });
    if (!res.ok) throw new Error('Gagal checkout');
    return res.json();
  },
};


