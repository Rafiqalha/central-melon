import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sprout, Droplets, Sun, ArrowRight, CheckCircle2,
    BarChart3, Hammer
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export const ServicesPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- FUNGSI FALLBACK GAMBAR (ANTI RUSAK) ---
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        // Ganti ke gambar placeholder hijau yang netral dan aman
        target.src = "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800";
        target.onerror = null;
    };

    const services = [
        {
            id: 1, icon: Hammer, title: "Konstruksi Greenhouse",
            desc: "Rangka baja galvanis anti-karat dengan desain aerodinamis tahan badai.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            id: 2, icon: Droplets, title: "Smart Irrigation",
            desc: "Sistem irigasi tetes presisi (Drip System) berbasis IoT & sensor kelembaban.",
            color: "bg-cyan-50 text-cyan-600"
        },
        {
            id: 3, icon: Sprout, title: "Bibit & Nutrisi",
            desc: "Suplay bibit melon F1 import dan racikan nutrisi AB Mix premium.",
            color: "bg-melon-50 text-melon-600"
        },
        {
            id: 4, icon: BarChart3, title: "Konsultasi & Monitoring",
            desc: "Pendampingan agronomis dari tanam hingga panen raya pertama.",
            color: "bg-purple-50 text-purple-600"
        }
    ];

    const steps = [
        { title: "Survey Lokasi", desc: "Analisis tanah, air, dan iklim mikro." },
        { title: "Desain & RAB", desc: "Perancangan struktur 3D sesuai budget." },
        { title: "Fabrikasi & Instalasi", desc: "Pemasangan rangka dan sistem irigasi." },
        { title: "Training Tanam", desc: "Edukasi SOP budidaya melon premium." }
    ];

    // URL Gambar Galeri (Sudah dipilih yang stabil)
    const galleryImages = [
        "https://images.unsplash.com/photo-1591271300850-22d6784e0a7f?q=80&w=500",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=500",
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=500",
        "https://images.unsplash.com/photo-1557234195-67f1c8186355?q=80&w=500"
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animations (Hero, Services, Timeline, Showcase)
            gsap.from(".char", { y: 100, opacity: 0, rotateX: -90, stagger: 0.02, duration: 1, ease: "back.out(1.7)" });
            gsap.from(".hero-desc", { opacity: 0, y: 20, duration: 0.8, delay: 0.5 });
            gsap.from(".hero-img-container", { scale: 0.8, opacity: 0, duration: 1.2, delay: 0.2, ease: "power2.out" });

            gsap.set(".service-card", { y: 100, opacity: 0 });
            ScrollTrigger.batch(".service-card", {
                onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", overwrite: true }),
                start: "top 90%",
            });

            const tlTimeline = gsap.timeline({
                scrollTrigger: { trigger: ".timeline-section", start: "top 70%", end: "bottom 80%", scrub: 1 }
            });
            tlTimeline.fromTo(".timeline-line", { height: "0%" }, { height: "100%", duration: 1 });

            gsap.utils.toArray(".timeline-item").forEach((item: any, i) => {
                gsap.fromTo(item,
                    { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 85%" } }
                );
            });

            gsap.to(".parallax-bg", {
                scrollTrigger: { trigger: ".showcase-section", start: "top bottom", end: "bottom top", scrub: true },
                yPercent: 30, ease: "none"
            });
            gsap.fromTo(".showcase-content", { y: 50, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: ".showcase-section", start: "top 70%" }
            });

            gsap.fromTo(".cta-bg", { filter: "blur(10px)", scale: 1.1 }, {
                filter: "blur(0px)", scale: 1, duration: 1.5, scrollTrigger: { trigger: ".cta-section", start: "top 80%" }
            });
            gsap.fromTo(".cta-btn", { scale: 0, opacity: 0 }, {
                scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.5, scrollTrigger: { trigger: ".cta-section", start: "top 70%" }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white overflow-hidden">

            {/* HERO */}
            <section className="relative min-h-[90vh] bg-melon-900 flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-melon-500 rounded-full blur-[150px] opacity-30"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-melon-800 border border-melon-700 text-melon-300 text-xs font-bold mb-6">
                            <Sun className="w-4 h-4 mr-2 animate-spin-slow" /> Teknologi Pertanian Masa Depan
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 overflow-hidden">
                            <SplitText className="text-white">Bangun</SplitText> <br />
                            <SplitText className="text-transparent bg-clip-text bg-gradient-to-r from-melon-300 to-yellow-300">Greenhouse</SplitText> <br />
                            <SplitText className="text-white">Impianmu</SplitText>
                        </h1>
                        <p className="hero-desc text-gray-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
                            Solusi end-to-end pembuatan smart greenhouse modern. Tingkatkan hasil panen melon hingga 300% dengan teknologi presisi.
                        </p>
                        <div className="hero-desc flex gap-4">
                            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-melon-500 hover:bg-melon-400 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-melon-500/50">
                                Lihat Layanan
                            </button>
                        </div>
                    </div>
                    <div className="hero-img-container relative h-[500px] w-full hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000"
                            alt="Smart Greenhouse"
                            className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 z-10"
                            onError={handleImageError} // <--- PENERAPAN FALLBACK
                        />
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs animate-bounce-slow">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-green-100 p-3 rounded-full"><CheckCircle2 className="text-green-600 w-6 h-6" /></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Efisiensi Air</p>
                                    <p className="text-gray-900 font-bold text-xl">Hemat 70%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" className="services-section py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Layanan Terintegrasi</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Kami tidak hanya membangun rangka, tapi membangun ekosistem pertanian.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((srv) => (
                            <div key={srv.id} className="service-card bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${srv.color} group-hover:scale-110 transition-transform`}>
                                    <srv.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{srv.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{srv.desc}</p>
                                <Link to={`/services/${srv.id}`} className="inline-flex items-center text-sm font-bold text-melon-600 hover:text-melon-800">
                                    Pelajari Detail <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="timeline-section py-24 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Alur Pengerjaan</h2>
                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 transform md:-translate-x-1/2">
                            <div className="timeline-line w-full bg-gradient-to-b from-melon-400 to-melon-600 origin-top"></div>
                        </div>
                        <div className="space-y-12">
                            {steps.map((step, i) => (
                                <div key={i} className={`timeline-item relative flex items-center justify-between md:justify-normal ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="absolute left-4 md:left-1/2 w-5 h-5 bg-white border-4 border-melon-500 rounded-full transform md:-translate-x-1/2 z-10 shadow-lg"></div>
                                    <div className="w-full md:w-5/12 ml-12 md:ml-0 md:px-6">
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:border-melon-200 transition-colors">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-500 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOWCASE PARALLAX */}
            <section className="showcase-section relative py-32 overflow-hidden flex items-center justify-center bg-gray-900">
                <div className="absolute inset-0 z-0 h-[140%] -top-[20%]">
                    <img
                        src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000"
                        alt="Greenhouse Dark"
                        className="parallax-bg w-full h-full object-cover filter brightness-50"
                        onError={handleImageError} // <--- PENERAPAN FALLBACK
                    />
                </div>
                <div className="showcase-content relative z-10 text-center max-w-4xl px-4">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold mb-6">✨ Hasil Nyata</div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Kualitas Panen <br /><span className="text-melon-300">Standar Internasional</span></h2>
                    <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">Greenhouse kami didesain untuk memaksimalkan BRIX (tingkat kemanisan) dan keseragaman buah.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((imgUrl, index) => (
                            <div key={index} className="h-40 rounded-xl overflow-hidden bg-gray-800 shadow-lg group border border-white/10">
                                <img
                                    src={imgUrl}
                                    alt={`Gallery ${index}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    onError={handleImageError} // <--- PENERAPAN FALLBACK DI GALERI
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section relative py-32 px-4 overflow-hidden">
                <div className="cta-bg absolute inset-0 bg-gradient-to-br from-melon-50 to-white z-0">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Mulai Proyek Greenhouse Anda</h2>
                    <p className="text-gray-600 text-lg mb-10">Konsultasikan kebutuhan lahan dan budget Anda.</p>
                    <button className="cta-btn group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-melon-600 font-pj rounded-full hover:bg-melon-700 hover:scale-105 shadow-xl">
                        Hubungi WhatsApp Kami
                    </button>
                </div>
            </section>

        </div>
    );
};