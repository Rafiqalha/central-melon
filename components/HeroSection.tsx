import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
    const ref = useRef(null);

    // Hook untuk mendeteksi posisi scroll
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax Effect: Background bergerak lebih lambat (y: 0 -> 300px)
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    // Text Effect: Text bergerak sedikit lebih cepat dan memudar
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">

            {/* 1. BACKGROUND PARALLAX */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay Gelap */}
                <img
                    src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2000"
                    alt="Greenhouse Hero"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* 2. KONTEN UTAMA (Framer Motion Fade In) */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-20 text-center px-4 max-w-4xl mx-auto"
            >
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="inline-block py-1 px-3 rounded-full bg-melon-500/20 border border-melon-400 text-melon-100 text-sm font-semibold mb-6 backdrop-blur-md"
                >
                    🌱 Revolusi Pertanian Modern Jawa Timur
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
                >
                    Panen Melon Premium <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-melon-300 to-yellow-300">Setiap Musim</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Kami membangun ekosistem greenhouse cerdas dan menghubungkan Anda langsung dengan hasil panen terbaik grade A+.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/catalog" className="px-8 py-4 bg-melon-600 hover:bg-melon-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-melon-500/50 transform hover:-translate-y-1">
                        Lihat Katalog
                    </Link>
                    <Link to="/services" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/30 transition-all hover:border-white">
                        Jasa Greenhouse
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/70"
            >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </motion.div>
        </div>
    );
};