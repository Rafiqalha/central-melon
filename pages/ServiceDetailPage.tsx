import React, { useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle2, Ruler, FileText, ChevronDown,
    Phone, ArrowRight, Hammer, Droplets, Sprout, BarChart3,
    Calculator
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- 1. DATA MOCKUP (FOKUS BAMBU) ---
const servicesData: any = {
    1: {
        title: "Greenhouse Bambu Premium",
        tagline: "Solusi konstruksi hemat biaya dengan material bambu petung treatment anti-rayap.",
        heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1600",
        description: "Kami menghadirkan greenhouse berbasis bambu yang diolah dengan sistem perendaman khusus (treatment) sehingga tahan lama hingga 3-4 tahun. Solusi terbaik untuk menekan CAPEX (Modal Awal) tanpa mengurangi kualitas hasil panen.",
        stats: [
            { label: "Hemat Biaya", value: "60%" },
            { label: "Suhu Ruang", value: "-2°C" },
            { label: "Ketahanan", value: "3-4 Thn" },
        ],
        features: [
            { title: "Bambu Petung Pilihan", desc: "Diameter besar, tua, dan lurus." },
            { title: "Treatment Pengawetan", desc: "Perendaman boraks-boric agar anti bubuk/rayap." },
            { title: "Plastik UV 14%", desc: "Standar melon, cahaya optimal, tidak mudah sobek." },
            { title: "Insect Net 40 Mesh", desc: "Kerapatan pas, sirkulasi udara tetap lancar." },
            { title: "Sistem Knock-Down", desc: "Sambungan baut/tali ijuk yang kuat dan fleksibel." },
            { title: "Desain Atap Pigura", desc: "Sirkulasi udara maksimal untuk membuang panas." },
        ],
        specs: [
            { item: "Lebar Modul", detail: "6 - 8 meter" },
            { item: "Tinggi Tiang", detail: "3 - 4 meter" },
            { item: "Jenis Bambu", detail: "Petung (Tiang) & Apus (Rangka)" },
            { item: "Pintu", detail: "Sliding Door Kayu/Bambu" },
            { item: "Listrik", detail: "Instalasi Kabel Eterna" },
        ],
        workflow: [
            { step: "01", title: "Survey", desc: "Cek kontur tanah." },
            { step: "02", title: "Treatment", desc: "Pengawetan bambu (7 hari)." },
            { step: "03", title: "Rangka", desc: "Perakitan struktur." },
            { step: "04", title: "Atap", desc: "Pemasangan UV & Net." },
            { step: "05", title: "Finishing", desc: "Bedengan & Irigasi." },
        ],
        pricing: {
            range: "Rp 120.000 - Rp 180.000 / m²",
            note: "Jauh lebih hemat dibanding besi (Rp 450rb/m²)."
        },
        faqs: [
            { q: "Apakah bambu kuat kena angin?", a: "Sangat kuat karena sifat bambu yang fleksibel. Dengan desain konstruksi yang benar, bambu lebih tahan guncangan dibanding kayu kaku." },
            { q: "Berapa lama bambu bertahan?", a: "Bambu biasa hanya 1 tahun. Tapi bambu treatment kami bisa bertahan 3 sampai 4 tahun tergantung perawatan." },
            { q: "Apakah termasuk irigasi?", a: "Harga dasar untuk konstruksi. Paket irigasi tetes dihitung terpisah (Add-on)." },
        ]
    },
    2: {
        title: "Irigasi Tetes (Drip System)",
        tagline: "Penyiraman presisi langsung ke akar. Hemat air dan tenaga kerja.",
        heroImage: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1600",
        description: "Sistem irigasi semi-otomatis menggunakan timer digital. Memastikan setiap tanaman mendapat jatah air dan nutrisi yang sama persis.",
        stats: [
            { label: "Hemat Air", value: "40%" },
            { label: "Tenaga Kerja", value: "1 Org" },
            { label: "Keseragaman", value: "95%" },
        ],
        features: [
            { title: "Selang PE 16mm", desc: "Tahan panas matahari dan awet." },
            { title: "Stick Dripper", desc: "Air menetes pas di perakaran." },
            { title: "Digital Timer", desc: "Jadwal siram otomatis (Tanpa Internet)." },
            { title: "Venturi Injector", desc: "Sedot pupuk otomatis saat menyiram." },
            { title: "Filter Screen", desc: "Mencegah selang mampet kotoran." },
            { title: "Tandon Air", desc: "Penampungan air baku dan nutrisi." },
        ],
        specs: [
            { item: "Pompa", detail: "Simge/Panasonic 125W" },
            { item: "Timer", detail: "Digital (Baterai AAA)" },
            { item: "Debit", detail: "2 Liter / Jam / Tanaman" },
        ],
        workflow: [{ step: "01", title: "Desain" }, { step: "02", title: "Pipa Utama" }, { step: "03", title: "Selang PE" }, { step: "04", title: "Uji Coba" }],
        pricing: {
            range: "Rp 3.000 - Rp 5.000 / Tanaman",
            note: "Tergantung jumlah populasi."
        },
        faqs: [
            { q: "Apakah butuh listrik besar?", a: "Tidak, pompa kecil 125 Watt sudah cukup untuk 1000 tanaman." },
            { q: "Kalau hujan bagaimana?", a: "Di dalam greenhouse tidak kena hujan, jadi irigasi tetap jalan sesuai jadwal." },
        ]
    },
    default: {
        title: "Paket Kemitraan Melon",
        tagline: "Solusi hulu ke hilir untuk petani modern.",
        heroImage: "https://images.unsplash.com/photo-1622383563227-044011358d20?q=80&w=2000",
        description: "Layanan full service dari pembangunan greenhouse bambu, instalasi irigasi, hingga pendampingan budidaya.",
        stats: [{ label: "Mitra", value: "50+" }, { label: "Area", value: "Jatim" }, { label: "Panen", value: "Rutin" }],
        features: [{ title: "Greenhouse Bambu", desc: "Standar produksi." }, { title: "Bibit F1", desc: "Golden/Rock." }, { title: "Pasar", desc: "Ditampung Central Melon." }],
        specs: [{ item: "Luas Min", detail: "200 m²" }, { item: "Lokasi", detail: "Akses Air Mudah" }],
        workflow: [{ step: "01", title: "Survey" }, { step: "02", title: "Kontrak" }, { step: "03", title: "Bangun" }],
        pricing: { range: "Hubungi Kami", note: "Diskusi lebih lanjut." },
        faqs: [{ q: "Apakah hasil panen dibeli?", a: "Ya, kami menerima hasil panen grade A & B sesuai kontrak." }]
    }
};

// --- 2. DEFINISI TYPE & KOMPONEN ---

interface AccordionItemProps {
    q: string;
    a: string;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ q, a, isOpen, onClick }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (isOpen) {
            gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.3 });
        } else {
            gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3 });
        }
    }, [isOpen]);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left focus:outline-none group">
                <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-melon-600' : 'text-gray-800 group-hover:text-melon-600'}`}>{q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
                <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>
            </div>
        </div>
    );
};

const SplitText = ({ children }: { children: string }) => (
    <span className="inline-block">
        {children.split("").map((char, i) => (
            <span key={i} className="char inline-block whitespace-pre">{char}</span>
        ))}
    </span>
);

const ROICalculator = () => {
    const [populasi, setPopulasi] = useState(1000);
    const modalTanam = populasi * 15000;
    const estimasiOmzet = populasi * 1.5 * 12000;
    const estimasiProfit = estimasiOmzet - modalTanam;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-melon-100 text-melon-600 rounded-full"><Calculator size={24} /></div>
                <h3 className="text-2xl font-bold text-gray-900">Simulasi Usaha</h3>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                        <span>Jumlah Tanaman</span>
                        <span className="text-melon-600">{populasi} Batang</span>
                    </label>
                    <input type="range" min="500" max="5000" step="100" value={populasi} onChange={(e) => setPopulasi(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-melon-600" />
                </div>
            </div>
            <div className="mt-8 p-6 bg-gray-900 rounded-2xl text-white">
                <div className="flex justify-between items-end mb-2 border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-sm">Biaya Operasional</span>
                    <span className="text-sm font-mono text-red-400">Rp {modalTanam.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end mb-4 border-b border-gray-700 pb-4">
                    <span className="text-gray-400 text-sm">Estimasi Omzet</span>
                    <span className="text-sm font-mono text-green-400">Rp {estimasiOmzet.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Potensi Profit / Musim</span>
                    <div className="text-3xl font-extrabold text-white mt-2">Rp {estimasiProfit.toLocaleString('id-ID')}</div>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">*Hitungan kasar per musim (70 hari). Belum termasuk penyusutan greenhouse.</p>
        </div>
    );
};

// --- PERBAIKAN TABEL PERBANDINGAN (Overflow Visible agar badge tidak kepotong) ---
const ComparisonTable = () => (
    <div className="overflow-visible">
        <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-0">
            <thead className="text-xs text-gray-700 uppercase">
                <tr>
                    <th className="px-6 py-5 bg-gray-50 rounded-tl-2xl border-b border-gray-200">Faktor</th>
                    <th className="px-6 py-5 text-center bg-gray-50 text-gray-500 border-b border-gray-200">Greenhouse Besi</th>
                    {/* Kolom Unggulan dengan Desain Pop-out */}
                    <th className="px-6 py-5 text-center bg-melon-600 text-white rounded-t-2xl relative shadow-lg transform scale-105 origin-bottom z-10 border-none">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
                            SMART CHOICE
                        </div>
                        Greenhouse Bambu
                    </th>
                </tr>
            </thead>
            <tbody>
                {[
                    { f: "Biaya Investasi", bad: "Mahal (400rb++/m²)", good: "Hemat (150rb/m²)" },
                    { f: "Suhu Ruangan", bad: "Panas (Menyerap Kalor)", good: "Sejuk (Alami)" },
                    { f: "Return on Investment", bad: "Lama (> 2 Tahun)", good: "Cepat (< 1 Tahun)" },
                    { f: "Ketahanan", bad: "10-15 Tahun", good: "3-4 Tahun (Cukup)" },
                    { f: "Perawatan", bad: "Cat Ulang/Las", good: "Ganti Tiang Mudah" },
                ].map((row, i, arr) => (
                    <tr key={i} className="group">
                        <td className={`px-6 py-4 font-medium text-gray-900 bg-white border-b border-gray-100 ${i === arr.length - 1 ? 'rounded-bl-2xl' : ''}`}>
                            {row.f}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-500 bg-gray-50/50 border-b border-gray-100 border-l border-r">
                            {row.bad}
                        </td>
                        {/* Kolom Highlight */}
                        <td className={`px-6 py-4 text-center font-bold text-melon-700 bg-melon-50 border-b border-l border-r border-melon-200 shadow-md relative z-10 ${i === arr.length - 1 ? 'rounded-b-2xl' : ''}`}>
                            {row.good}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// --- 3. MAIN PAGE ---
export const ServiceDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const serviceId = id ? parseInt(id) : 1;
    const data = servicesData[serviceId] || servicesData.default;

    // Nomor WA Baru
    const PHONE_NUMBER = "6285709477872";

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tlHero = gsap.timeline();
            tlHero.from(".char", { y: 80, opacity: 0, rotateX: -90, stagger: 0.02, duration: 0.8, ease: "back.out(1.7)" })
                .from(".hero-tagline", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
                .from(".hero-btn", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out" }, "-=0.2")
                .from(".hero-img", { scale: 1.2, duration: 1.5, ease: "power2.out" }, 0);

            gsap.utils.toArray<HTMLElement>('.animate-up').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: "top 85%" },
                    y: 40, opacity: 0, duration: 0.8, ease: "power2.out"
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, [id]);

    return (
        <div ref={containerRef} className="bg-white min-h-screen pb-20">

            {/* BACK BUTTON */}
            <button onClick={() => navigate('/services')} className="fixed top-24 left-4 z-50 bg-white/90 backdrop-blur shadow-lg border border-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center text-sm font-bold hover:bg-melon-50 hover:text-melon-600 transition-all transform hover:scale-105">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </button>

            {/* 1. HERO */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img src={data.heroImage} alt={data.title} className="hero-img w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <span className="inline-block px-3 py-1 bg-melon-500 text-white text-xs font-bold rounded-full mb-4 tracking-wider uppercase">Solusi Petani Cerdas</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"><SplitText>{data.title}</SplitText></h1>
                    <p className="hero-tagline text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">{data.tagline}</p>
                    <div className="hero-btn flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-melon-600 hover:bg-melon-400 text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] transform hover:scale-105">Lihat Estimasi Biaya</button>
                        <a href={`https://wa.me/${PHONE_NUMBER}`} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all">Konsultasi Gratis</a>
                    </div>
                </div>
            </section>

            {/* 2. STATS */}
            <section className="py-16 bg-white relative -mt-10 z-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-10 items-center animate-up">
                        <div className="md:w-1/2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kenapa Bambu?</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{data.description}</p>
                        </div>
                        <div className="md:w-1/2 w-full grid grid-cols-3 gap-4">
                            {data.stats.map((stat: any, i: number) => (
                                <div key={i} className="text-center p-4 bg-melon-50 rounded-2xl">
                                    <p className="text-2xl md:text-3xl font-extrabold text-melon-600 mb-1">{stat.value}</p>
                                    <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ROI & FEATURES */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
                    <div className="animate-up">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analisa Usaha</h2>
                        <p className="text-gray-500 mb-8">Greenhouse bambu mempercepat Balik Modal (ROI).</p>
                        <ROICalculator />
                    </div>
                    <div className="animate-up">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Spesifikasi Unggulan</h2>
                        <div className="grid gap-6">
                            {data.features.map((feat: any, i: number) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                                    <div className="w-10 h-10 bg-melon-100 text-melon-600 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle2 size={20} /></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{feat.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. COMPARISON TABLE */}
            <section className="py-20 px-4 max-w-5xl mx-auto animate-up">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Investasi Cerdas</h2>
                    <p className="text-gray-500 mt-2">Bandingkan efisiensi greenhouse bambu kami.</p>
                </div>
                <div className="mt-8">
                    <ComparisonTable />
                </div>
            </section>

            {/* 5. SPECS & WORKFLOW */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 animate-up">
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Ruler className="text-melon-400" /> Detail Teknis</h3>
                        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                            {data.specs.map((s: any, i: number) => (
                                <div key={i} className="flex justify-between p-4 border-b border-gray-700 last:border-0">
                                    <span className="text-gray-400">{s.item}</span>
                                    <span className="text-white font-bold">{s.detail}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><FileText className="text-melon-400" /> Alur Pengerjaan</h3>
                        <div className="space-y-6">
                            {data.workflow.map((w: any, i: number) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center font-bold text-melon-400">{w.step}</div>
                                    <div><p className="font-bold text-lg">{w.title}</p><p className="text-sm text-gray-400">{w.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PRICING & FAQ */}
            <section id="pricing" className="py-20 bg-melon-50">
                <div className="max-w-4xl mx-auto px-4 animate-up">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl text-center border border-melon-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Harga Transparan</h2>
                        <div className="py-8">
                            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Estimasi Biaya</p>
                            <div className="text-4xl md:text-5xl font-black text-melon-600 mb-4">{data.pricing.range}</div>
                            <p className="text-gray-500 italic bg-gray-100 inline-block px-4 py-1 rounded-full text-sm">*{data.pricing.note}</p>
                        </div>
                        <div className="max-w-2xl mx-auto text-left mt-10 mb-12">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
                            <div className="space-y-2">
                                {/* FIX: ADDED KEY PROP */}
                                {data.faqs.map((faq: any, i: number) => (
                                    <AccordionItem
                                        key={i}
                                        q={faq.q}
                                        a={faq.a}
                                        isOpen={openFaq === i}
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href={`https://wa.me/${PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center px-8 py-4 bg-melon-600 text-white font-bold rounded-xl hover:bg-melon-700 shadow-lg hover:shadow-melon-500/30 transition-all transform hover:-translate-y-1">
                                <Phone className="w-5 h-5 mr-2" /> Minta Penawaran (RAB)
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};