import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../App';
import { formatRupiah } from '../utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

  // === 1. DEFINISI URL BACKEND ===
  // Ini kunci agar gambar bisa muncul
  const BASE_URL = 'http://localhost:4000';

  // === 2. LOGIKA PEMROSESAN GAMBAR ===
  // Jika url dimulai dengan "http", biarkan (mungkin dari Unsplash).
  // Jika tidak (misal: "/uploads/abc.jpg"), tempelkan BASE_URL di depannya.
  const imageUrl = product.imageUrl && product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${BASE_URL}${product.imageUrl}`;

  const getGradeColor = (grade: string) => {
    if (grade && grade.includes('A')) return 'bg-melon-500';
    return 'bg-yellow-500';
  };

  // Gambar cadangan
  const fallbackImage = "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden">

        {/* GUNAKAN VARIABEL 'imageUrl' YANG SUDAH KITA OLAH DI ATAS */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded shadow-sm backdrop-blur-sm bg-opacity-90 ${getGradeColor(product.qualityGrade)}`}>
          Grade {product.qualityGrade}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-medium text-melon-600 uppercase tracking-wider">{product.category}</p>
          <div className="flex items-center text-yellow-400 text-xs">
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-1 text-gray-500">{product.rating || 'New'}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-melon-600 transition-colors line-clamp-1">{product.name}</h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-lg font-bold text-gray-900">
            {formatRupiah(product.price)}
          </span>

          <button
            onClick={() => addToCart(product, 1)}
            className="p-2 bg-gray-100 hover:bg-melon-600 hover:text-white rounded-full transition-all duration-200 transform active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};