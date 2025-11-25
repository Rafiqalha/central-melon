// --- TIPE DATA USER (INI YANG TADI HILANG) ---
export interface User {
  id: number;
  username: string;
  email: string;
  picture?: string; // Opsional karena login biasa gak punya foto
}

// --- TIPE DATA PRODUK ---
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  qualityGrade: string;
  rating: number;
  reviewCount?: number;
  imageUrl: string;
  origin: string;
  harvestDate: string;
  sweetnessBrix: number;
  stock?: number;

  // Info Penjual
  seller?: {
    username: string;
  };
}

// --- TIPE DATA KERANJANG ---
export interface CartItem {
  product: Product;
  qty: number;
}

// --- TIPE DATA AI (Untuk Seller Dashboard) ---
export interface AIAnalysisResult {
  grade: 'A' | 'B' | 'Rejected';
  ripenessScore: number;
  sweetnessPrediction: number;
  defects: string[];
  reasoning: string;
}

export interface ServicePackage {
  id: number;
  name: string;
  description: string;
  pricePerMeter: number;
  material: string;
  features: string; // Disimpan sebagai string panjang dipisah koma
  imageUrl: string;
}