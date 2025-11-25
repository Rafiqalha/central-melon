import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// Komponen Angka yang naik sendiri (Animated Number)
const AnimatedNumber = ({ end, suffix = '' }: { end: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            onEnter: () => {
                let startObj = { val: 0 };
                gsap.to(startObj, {
                    val: end,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        setCount(Math.floor(startObj.val));
                    }
                });
            },
            once: true
        });
    }, [end]);

    return <span ref={elementRef}>{count}{suffix}</span>;
};

export const GreenhouseShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const blueprintRef = useRef<HTMLImageElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Animasi Blueprint Reveal (Membuka lebar)
            gsap.fromTo(blueprintRef.current,
                { width: "0%" },
                {
                    width: "100%",
                    duration: 1.5,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "center center",
                        scrub: 1, // Animasi ngikutin scroll mouse
                    }
                }
            );

            // 2. Animasi Timeline Line (Garis turun ke bawah)
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    duration: 1,
                    scrollTrigger: {
                        trigger: ".timeline-container",
                        start: "top center",
                        end: "bottom center",
                        scrub: 1
                    }
                }
            );

            // 3. Card Timeline muncul satu per satu
            gsap.utils.toArray('.timeline-card').forEach((card: any, i) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert(); // Cleanup saat unmount
    }, []);

    return (
        <div ref={sectionRef} className="py-20 bg-gray-900 text-white overflow-hidden relative">

            {/* SECTION 1: BLUEPRINT REVEAL */}
            <div className="max-w-7xl mx-auto px-4 mb-32">
                <div className="text-center mb-12" data-aos="fade-down">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-melon-300">Konstruksi Presisi</h2>
                    <p className="text-gray-400">Teknologi Greenhouse Level Industri</p>
                </div>

                <div className="relative h-[300px] md:h-[500px] border border-melon-500/30 rounded-2xl bg-gray-800/50 overflow-hidden mx-auto shadow-[0_0_50px_rgba(52,211,153,0.1)]">
                    {/* Gambar Blueprint (Pastikan cari gambar sketsa bangunan/blueprint) */}
                    <div ref={blueprintRef} className="absolute left-0 top-0 h-full bg-melon-900 overflow-hidden border-r-2 border-melon-400">
                        <img
                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000" // Ganti dengan gambar arsitektur/blueprint
                            alt="Blueprint"
                            className="h-full w-full object-cover opacity-80 mix-blend-luminosity"
                            style={{ width: '100vw', maxWidth: 'none' }} // Trick agar gambar tetap diam saat container melebar
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h3 className="text-4xl md:text-8xl font-black text-white/10 uppercase tracking-widest">Blueprint</h3>
                    </div>
                </div>
            </div>

            {/* SECTION 2: STATISTIK (GROWTH) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-32 border-y border-gray-800 py-12">
                {[
                    { label: 'Proyek Selesai', val: 150, suf: '+' },
                    { label: 'Petani Bermitra', val: 500, suf: '' },
                    { label: 'Ton Panen/Thn', val: 1200, suf: 'T' },
                    { label: 'Kepuasan Klien', val: 99, suf: '%' },
                ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-melon-400 mb-2">
                            <AnimatedNumber end={stat.val} suffix={stat.suf} />
                        </div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* SECTION 3: TIMELINE PEMBANGUNAN */}
            <div className="timeline-container max-w-4xl mx-auto px-4 relative">
                <h2 className="text-3xl font-bold text-center mb-16" data-aos="fade-up">Proses Pengerjaan</h2>

                {/* Garis Tengah */}
                <div className="absolute left-4 md:left-1/2 top-24 bottom-0 w-1 bg-gray-700 transform md:-translate-x-1/2">
                    <div ref={lineRef} className="w-full bg-melon-500 origin-top"></div>
                </div>

                {/* Timeline Items */}
                {[
                    { step: "01", title: "Survey & Analisis", desc: "Tim ahli mengukur pH tanah, arah angin, dan intensitas cahaya lokasi Anda." },
                    { step: "02", title: "Desain Struktural", desc: "Pembuatan blueprint 3D custom sesuai budget dan target hasil panen." },
                    { step: "03", title: "Instalasi Rangka", desc: "Pemasangan baja galvanis anti-karat dengan presisi tinggi." },
                    { step: "04", title: "Smart Irrigation", desc: "Pemasangan IoT sensor dan irigasi tetes otomatis." },
                ].map((item, i) => (
                    <div key={i} className={`timeline-card relative flex items-center justify-between md:justify-normal mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                        {/* Titik di Tengah */}
                        <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-melon-400 rounded-full border-4 border-gray-900 transform md:-translate-x-1/2 z-10 mt-1.5"></div>

                        <div className="w-full md:w-5/12 ml-12 md:ml-0 md:px-4">
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-melon-500 transition-colors">
                                <span className="text-melon-500 font-bold text-xl mb-2 block">Step {item.step}</span>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};