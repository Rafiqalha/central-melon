import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';
import gsap from 'gsap';

// --- 1. DEFINISI TIPE PROPS (Agar TypeScript tidak bingung) ---
interface AccordionItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

// --- 2. KOMPONEN ACCORDION (Sekarang pakai React.FC) ---
const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onClick }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animasi Tinggi Konten (Expand/Collapse)
        if (isOpen) {
            gsap.to(contentRef.current, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
            gsap.to(iconRef.current, { rotation: 180, duration: 0.3 });
        } else {
            gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
            gsap.to(iconRef.current, { rotation: 0, duration: 0.3 });
        }
    }, [isOpen]);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 hover:border-melon-300 transition-colors">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors"
            >
                <span className={`font-bold text-lg ${isOpen ? 'text-melon-700' : 'text-gray-800'}`}>
                    {question}
                </span>
                <div ref={iconRef} className="text-gray-400">
                    <ChevronDown />
                </div>
            </button>

            {/* Konten Jawaban */}
            <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-dashed border-gray-100">
                    {answer}
                </div>
            </div>
        </div>
    );
};

// --- 3. HALAMAN UTAMA HELP PAGE ---
export const HelpPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Default buka no 1

    // Data FAQ
    const faqs = [
        { q: "Bagaimana cara memesan melon?", a: "Anda bisa memesan melalui halaman Katalog. Pilih melon yang diinginkan, masukkan ke keranjang, dan lakukan checkout. Kami melayani pengiriman ke seluruh Jawa Timur." },
        { q: "Berapa lama pengiriman dilakukan?", a: "Untuk area Malang Raya, pengiriman dilakukan di hari yang sama (Sameday). Untuk luar kota, estimasi 1-2 hari kerja menggunakan ekspedisi khusus buah (paking kayu/kardus tebal)." },
        { q: "Apakah ada garansi jika buah rusak?", a: "Tentu! Kami memberikan garansi 100% ganti baru jika buah yang Anda terima busuk, pecah, atau tidak layak makan. Cukup kirimkan video unboxing ke WhatsApp kami." },
        { q: "Apa bedanya Grade A dan Standard?", a: "Grade A adalah melon pilihan terbaik dengan jaring (net) sempurna, bentuk simetris, dan tingkat kemanisan (Brix) di atas 12%. Grade Standard memiliki rasa yang sama enak namun mungkin memiliki sedikit ketidaksempurnaan visual pada kulit." },
        { q: "Apakah Central Melon membuka kemitraan?", a: "Ya, kami membuka program Mitra Tani untuk Anda yang memiliki lahan dan ingin membangun Greenhouse. Silakan cek halaman 'Jasa Greenhouse' untuk detail paket kemitraan." },
    ];

    // Filter FAQ
    const filteredFaqs = faqs.filter(f =>
        f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* HEADER & SEARCH */}
            <div className="bg-melon-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">Pusat Bantuan</h1>
                    <p className="text-melon-100 mb-8 text-lg">Temukan jawaban cepat seputar pemesanan dan layanan kami.</p>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-melon-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari pertanyaan (misal: pengiriman, garansi)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 border-2 border-transparent focus:border-melon-400 focus:ring-4 focus:ring-melon-500/20 outline-none transition-all shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* FAQ LIST */}
            <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2 text-melon-600" />
                        Pertanyaan Umum
                    </h2>

                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-2">
                            {filteredFaqs.map((faq, index) => (
                                <AccordionItem
                                    key={index} // <--- ERROR HILANG KARENA SEKARANG AccordionItem ADALAH React.FC
                                    question={faq.q}
                                    answer={faq.a}
                                    isOpen={openIndex === index}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>Tidak ditemukan hasil untuk "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm('')} className="text-melon-600 font-bold hover:underline mt-2">
                                Lihat semua pertanyaan
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTACT CARDS */}
            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Masih butuh bantuan?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-melon-400 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">WhatsApp Chat</h3>
                        <p className="text-sm text-gray-500 mt-1">Respon cepat (08.00 - 20.00)</p>
                        <p className="text-green-600 font-bold mt-2">+62 812-3456-7890</p>
                    </a>

                    <a href="mailto:support@centralmelon.com" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-melon-400 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">Email Support</h3>
                        <p className="text-sm text-gray-500 mt-1">Untuk kerjasama & komplain</p>
                        <p className="text-blue-600 font-bold mt-2">support@centralmelon.com</p>
                    </a>
                </div>
            </div>

        </div>
    );
};