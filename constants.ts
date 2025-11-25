import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Yubari King Special',
    description: 'Raja dari segala melon. Kulit berjaring sempurna dengan daging buah oranye yang sangat manis dan lumer di mulut.',
    price: 850000,
    category: 'Premium',
    qualityGrade: 'A+',
    rating: 4.9,
    reviewCount: 128,
    imageUrl: 'https://akcdn.detik.net.id/community/media/visual/2019/09/10/b2001cfb-54e9-49d0-9e84-c9056b9693a3.jpeg?w=700&q=90',
    origin: 'Blitar, Jawa Timur (Bibit Jepang)',
    harvestDate: '2024-03-19',
    sweetnessBrix: 18,
    stock: 50 
  },
  {
    id: 2,
    name: 'Emerald Musk Melon',
    description: 'Melon hijau klasik dengan aroma harum yang kuat (Musk) dan tekstur daging yang lembut namun renyah.',
    price: 125000,
    category: 'Standard',
    qualityGrade: 'A',
    rating: 4.7,
    reviewCount: 85,
    imageUrl: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/224/2024/08/28/WhatsApp-Image-2024-08-28-at-142331-3544749927.jpeg',
    origin: 'Banyuwangi, Jawa Timur',
    harvestDate: '2024-03-20',
    sweetnessBrix: 15,
    stock: 100 
  },
  {
    id: 3,
    name: 'Honey Globe Organic',
    description: 'Melon berkulit putih/emas tanpa pestisida. Daging buah sangat padat, renyah, dan manis seperti madu.',
    price: 95000,
    category: 'Organic',
    qualityGrade: 'A',
    rating: 4.8,
    reviewCount: 64,
    imageUrl: 'https://rumahbuah.com/wp-content/uploads/2015/04/Rumbu_-Melon01-631x449.jpg',
    origin: 'Malang, Jawa Timur',
    harvestDate: '2024-03-18',
    sweetnessBrix: 17,
    stock: 30 
  },
  {
    id: 4,
    name: 'Golden Apollo',
    description: 'Melon kuning lonjong dengan rasa manis yang menyegarkan. Favorit keluarga untuk hidangan penutup.',
    price: 65000,
    category: 'Budget',
    qualityGrade: 'B+',
    rating: 4.5,
    reviewCount: 42,
    imageUrl: 'http://www.frutas-hortalizas.com/img/fruites_verdures/presentacio/19.jpg',
    origin: 'Lamongan, Jawa Timur',
    harvestDate: '2024-03-21',
    sweetnessBrix: 14,
    stock: 200 
  }
];