import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { Users, Sprout, Award, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- KOMPONEN HELPER: ANGKA BERJALAN (OPTIMIZED) ---
// Perubahan: Tidak lagi pakai useState untuk animasi angka agar ringan
const Counter = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = spanRef.current;
        if (!el) return;

        // Objek dummy untuk dianimasikan nilainya
        const counterObj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: "top 90%", // Memicu lebih awal (saat elemen hampir masuk layar)
            once: true,       // Hanya jalan sekali
            onEnter: () => {
                gsap.to(counterObj, {
                    val: end,
                    duration: 2.5,
                    ease: "power2.out",
                    // PENTING: Update teks langsung ke DOM tanpa re-render React
                    onUpdate: () => {
                        if (spanRef.current) {
                            spanRef.current.innerText = Math.floor(counterObj.val).toString() + suffix;
                        }
                    }
                });
            }
        });
    }, [end, suffix]);

    // Render awal angka 0
    return <span ref={spanRef} className="tabular-nums">0{suffix}</span>;
};

// Helper Split Text
const SplitText = ({ children, className }: { children: string, className?: string }) => {
    return (
        <span className={`inline-block ${className}`}>
            {children.split("").map((char, index) => (
                <span key={index} className="char inline-block whitespace-pre">
                    {char}
                </span>
            ))}
        </span>
    );
};

export const AboutPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { id: 1, icon: Sprout, val: 6, suffix: " Thn", label: "Pengalaman" },
        { id: 2, icon: Users, val: 120, suffix: "+", label: "Mitra Petani" },
        { id: 3, icon: MapPin, val: 15, suffix: " Ha", label: "Luas Lahan" },
        { id: 4, icon: Award, val: 50, suffix: "+", label: "Penghargaan" },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // 1. HERO ANIMATION
            gsap.to(".parallax-bg", {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.from(".char", {
                y: 50, opacity: 0, stagger: 0.03, duration: 1, ease: "back.out(1.7)", delay: 0.2
            });

            // 2. STORY SECTION
            gsap.from(".story-img", {
                scrollTrigger: { trigger: ".story-section", start: "top 80%" },
                scale: 0.9, opacity: 0, duration: 1.2, ease: "power2.out"
            });

            gsap.from(".story-text", {
                scrollTrigger: { trigger: ".story-section", start: "top 80%" },
                x: 50, opacity: 0, duration: 1, delay: 0.2
            });

            // 3. DIVIDER
            gsap.fromTo(".divider-line",
                { width: "0%" },
                {
                    width: "100%", duration: 1.5, ease: "power2.inOut",
                    scrollTrigger: { trigger: ".divider-section", start: "top 85%" }
                }
            );

            // 4. STATS ANIMATION (Memastikan card muncul)
            // Kita gunakan .fromTo agar state awal dan akhir jelas
            gsap.fromTo(".stat-card",
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".stats-section",
                        start: "top 85%" // Memicu animasi saat bagian atas section masuk 85% viewport
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white overflow-hidden">

            {/* SECTION 1: HERO */}
            <section className="hero-section relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=2000"
                        alt="About Hero"
                        className="parallax-bg w-full h-[140%] object-cover -mt-20 filter brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <p className="text-melon-300 font-bold tracking-widest uppercase mb-4 text-sm">Cerita Kami</p>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <SplitText>Menanam Dengan Hati</SplitText>
                    </h1>
                    <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                        Perjalanan Central Melon menghadirkan manisnya buah lokal kualitas dunia.
                    </p>
                </div>
            </section>

            {/* SECTION 2: STORY */}
            <section className="story-section py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="story-img relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                        <img
                            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000"
                            alt="Petani Melon"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px]">
                            <p className="text-melon-800 font-bold text-lg">"Quality First"</p>
                            <p className="text-gray-500 text-xs">Filosofi utama kami sejak 2018</p>
                        </div>
                    </div>

                    <div className="story-text">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Bermula dari Lahan <br /> <span className="text-melon-600">Sederhana di Malang</span>
                        </h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Central Melon didirikan dengan satu misi: membuktikan bahwa melon lokal Indonesia bisa bersaing dengan buah impor.
                            </p>
                            <p>
                                Kami memadukan kearifan lokal petani Jawa Timur dengan teknologi <strong>Smart Greenhouse</strong>. Hasilnya adalah buah dengan tingkat kemanisan (Brix) tinggi yang konsisten sepanjang tahun.
                            </p>
                            <p>
                                Kini, kami tidak hanya menjual buah, tapi juga memberdayakan mitra petani untuk naik kelas melalui edukasi dan teknologi.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100" alt="Founder" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Budi Santoso</p>
                                    <p className="text-sm text-melon-600">Founder Central Melon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: DIVIDER */}
            <section className="divider-section py-10 px-4 max-w-7xl mx-auto flex items-center justify-center">
                <div className="divider-line h-[2px] bg-gradient-to-r from-transparent via-melon-300 to-transparent w-full"></div>
            </section>

            {/* SECTION 4: STATS (DIOPTIMALKAN) */}
            <section className="stats-section py-20 bg-melon-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dampak Kami</h2>
                        <p className="text-gray-500">Angka yang bicara tentang dedikasi kami.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.id} className="stat-card bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all text-center border border-melon-100">
                                <div className="inline-flex p-3 bg-melon-100 text-melon-600 rounded-full mb-4">
                                    <stat.icon size={24} />
                                </div>
                                {/* Komponen Counter yang sudah diringankan */}
                                <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                                    <Counter end={stat.val} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};