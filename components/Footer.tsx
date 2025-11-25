import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, Send } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="relative bg-melon-900 text-white pt-20 pb-10 overflow-hidden">

            {/* 1. VISUAL: Efek Gelombang (Wave) di bagian atas agar tidak kaku */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-white">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* KOLOM 1: Brand & Filosofi */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            {/* Logo Icon Sederhana */}
                            <div className="bg-white p-2 rounded-lg">
                                <span className="text-melon-800 font-bold text-xl">🌱</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-wider">Central Melon</h2>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Kebanggaan bumi Jawa Timur. Kami menghubungkan keahlian petani lokal dengan teknologi modern untuk menghadirkan rasa manis terbaik di meja makan Anda.
                        </p>

                        {/* Newsletter Mini */}
                        <div className="pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-melon-300 mb-2">Berlangganan Info Panen</p>
                            <div className="flex bg-melon-800 rounded-lg overflow-hidden border border-melon-700 focus-within:ring-2 ring-melon-400">
                                <input
                                    type="email"
                                    placeholder="Email Anda..."
                                    className="bg-transparent px-4 py-2 w-full text-sm outline-none placeholder-melon-500 text-white"
                                />
                                <button className="bg-melon-500 hover:bg-melon-400 px-3 py-2 transition-colors">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM 2: Navigasi Cepat */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-melon-300">Jelajahi</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Katalog Melon', path: '/catalog' },
                                { name: 'Jasa Greenhouse', path: '/services' },
                                { name: 'Mitra Tani', path: '/partners' },
                                { name: 'Cerita Kami', path: '/about' },
                                { name: 'Pusat Bantuan', path: '/help' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-300 hover:text-white hover:translate-x-2 transform transition-all duration-300 flex items-center"
                                    >
                                        <span className="w-1.5 h-1.5 bg-melon-500 rounded-full mr-2"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* KOLOM 3: Kontak */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-melon-300">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-300">
                                <MapPin className="h-5 w-5 text-melon-400 mt-1 flex-shrink-0" />
                                <span>Jl. Ijen Besar No. 45,<br />Malang, Jawa Timur, Indonesia</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                <Mail className="h-5 w-5 text-melon-400 flex-shrink-0" />
                                <span>support@centralmelon.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                                <Phone className="h-5 w-5 text-melon-400 flex-shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex space-x-4 mt-6">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <a key={idx} href="#" className="bg-melon-800 p-2 rounded-full hover:bg-white hover:text-melon-900 transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* KOLOM 4: GOOGLE MAPS (INTERAKTIF) */}
                    <div className="bg-white p-1 rounded-xl shadow-2xl overflow-hidden h-64 lg:h-auto">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63245.97077055835!2d112.6068868128456!3d-7.978469457816827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822063dc2fb%3A0x78879446481a4da2!2sMalang%2C%20Malang%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1708925203399!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '200px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                            title="Lokasi Central Melon"
                        ></iframe>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-melon-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; 2025 Central Melon Indonesia. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};