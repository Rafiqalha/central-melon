import React, { useState, useEffect, useRef } from 'react';
import {
    Package, Truck, CheckCircle, Clock, ChevronRight,
    X, FileText, MapPin, Calendar, Weight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- TIPE DATA ORDER (B2B) ---
type OrderStatus = 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';

interface OrderItem {
    name: string;
    grade: string;
    qty: number; // kg
    price: number;
}

interface Order {
    id: string;
    date: string;
    totalAmount: number;
    totalWeight: number;
    status: OrderStatus;
    resi?: string;
    items: OrderItem[];
    timeline: { step: string; date: string; active: boolean }[];
}

// --- HELPER STATUS COLOR ---
const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'Menunggu Pembayaran': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Dikirim': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
        case 'Dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600';
    }
};

// --- MOCK DATA GENERATOR (Simulasi Database) ---
const generateMockOrders = (): Order[] => {
    return [
        {
            id: "INV-B2B-20251124-001",
            date: "24 Nov 2025",
            totalAmount: 8500000,
            totalWeight: 1000, // 1 Ton
            status: "Diproses",
            items: [
                { name: "Honey Globe Organic", grade: "Grade A", qty: 500, price: 4250000 },
                { name: "Golden Aroma", grade: "Grade B", qty: 500, price: 4250000 },
            ],
            timeline: [
                { step: "Pesanan Dibuat", date: "24 Nov 08:00", active: true },
                { step: "Pembayaran Diverifikasi", date: "24 Nov 09:30", active: true },
                { step: "Persiapan Muatan (Gudang)", date: "Sedang Berjalan", active: true },
                { step: "Diserahkan ke Logistik", date: "-", active: false },
                { step: "Pesanan Tiba", date: "-", active: false },
            ]
        },
        {
            id: "INV-B2B-20251120-882",
            date: "20 Nov 2025",
            totalAmount: 120000,
            totalWeight: 10, // Sample
            status: "Selesai",
            resi: "JP-882991002",
            items: [
                { name: "Yubari King Special", grade: "Premium", qty: 10, price: 120000 },
            ],
            timeline: [
                { step: "Pesanan Dibuat", date: "20 Nov 10:00", active: true },
                { step: "Pembayaran Diverifikasi", date: "20 Nov 10:05", active: true },
                { step: "Persiapan Muatan", date: "20 Nov 13:00", active: true },
                { step: "Dalam Pengiriman", date: "21 Nov 08:00", active: true },
                { step: "Diterima oleh: Budi", date: "22 Nov 15:30", active: true },
            ]
        },
        {
            id: "INV-B2B-20251122-455",
            date: "22 Nov 2025",
            totalAmount: 45000000,
            totalWeight: 5000, // 5 Ton
            status: "Menunggu Pembayaran",
            items: [
                { name: "Golden Melon", grade: "Industrial", qty: 5000, price: 45000000 },
            ],
            timeline: [
                { step: "Pesanan Dibuat", date: "22 Nov 14:20", active: true },
                { step: "Menunggu Pembayaran", date: "Pending", active: true },
                { step: "Persiapan Muatan", date: "-", active: false },
                { step: "Dalam Pengiriman", date: "-", active: false },
                { step: "Selesai", date: "-", active: false },
            ]
        }
    ];
};

export const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const containerRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        // Simulasi Fetch Data
        setOrders(generateMockOrders());
    }, []);

    // Animasi List Masuk
    useEffect(() => {
        if (orders.length > 0) {
            gsap.fromTo(".order-card",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [orders]);

    // Animasi Modal Open
    useEffect(() => {
        if (selectedOrder) {
            gsap.fromTo(modalRef.current,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
            );
        }
    }, [selectedOrder]);

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Riwayat Pesanan</h1>
                        <p className="text-gray-500 mt-1">Pantau status pengiriman stok melon Anda.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600 hidden md:block">
                        Total Transaksi: <span className="font-bold text-melon-600">{orders.length}</span>
                    </div>
                </div>

                {/* --- LIST CARD VIEW --- */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="order-card bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-melon-300 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            {/* Status Strip kiri */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'Selesai' ? 'bg-green-500' : order.status === 'Diproses' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                                {/* Info Utama */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-sm font-bold text-gray-500">#{order.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                        <Package className="text-melon-600 w-5 h-5" />
                                        {order.items[0].name}
                                        {order.items.length > 1 && <span className="text-gray-400 text-sm font-normal">+{order.items.length - 1} lainnya</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <Calendar size={14} /> {order.date} &bull; <Weight size={14} /> Total Berat: <strong>{order.totalWeight >= 1000 ? `${order.totalWeight / 1000} Ton` : `${order.totalWeight} Kg`}</strong>
                                    </p>
                                </div>

                                {/* Harga & Action */}
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Tagihan</p>
                                    <p className="text-xl font-black text-gray-900 mb-2">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                    <button className="text-sm text-melon-600 font-bold flex items-center justify-end hover:underline group-hover:translate-x-1 transition-transform">
                                        Lihat Detail Tracking <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DETAIL MODAL (TIMELINE UI) --- */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                        <div
                            ref={modalRef}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent close on click inside
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
                                    <p className="text-sm text-gray-500 font-mono">ID: {selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">

                                {/* 1. TIMELINE TRACKING */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Truck size={16} /> Status Pengiriman
                                    </h3>
                                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                        {selectedOrder.timeline.map((step, i) => (
                                            <div key={i} className="relative">
                                                {/* Dot Indicator */}
                                                <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${step.active ? 'bg-melon-500 border-melon-200 ring-4 ring-melon-50' : 'bg-gray-200 border-gray-300'
                                                    }`}></div>

                                                <div className={`${step.active ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                                    <p className="font-bold text-gray-900 text-sm">{step.step}</p>
                                                    <p className="text-xs text-gray-500 font-mono mt-1">{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. ITEM LIST (Table) */}
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Package size={16} /> Rincian Barang
                                    </h3>
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
                                            <tr>
                                                <th className="pb-2">Produk</th>
                                                <th className="pb-2 text-center">Grade</th>
                                                <th className="pb-2 text-center">Qty</th>
                                                <th className="pb-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-3 font-medium text-gray-900">{item.name}</td>
                                                    <td className="py-3 text-center">
                                                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{item.grade}</span>
                                                    </td>
                                                    <td className="py-3 text-center text-gray-600">{item.qty} kg</td>
                                                    <td className="py-3 text-right font-mono font-medium">Rp {item.price.toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="font-bold text-gray-600">Total Pembayaran</span>
                                        <span className="font-bold text-xl text-melon-600">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {/* 3. ACTION BUTTONS */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                                        <FileText size={18} /> Unduh Invoice
                                    </button>
                                    <button className="py-3 rounded-xl bg-melon-600 font-bold text-white hover:bg-melon-700 flex items-center justify-center gap-2">
                                        <CheckCircle size={18} /> Bantuan Pesanan
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};