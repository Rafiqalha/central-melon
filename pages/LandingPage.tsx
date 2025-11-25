import React from 'react';
import { HeroSection } from '../components/HeroSection'; // Hero Parallax
import { GreenhouseShowcase } from '../components/GreenhouseShowcase'; // GSAP
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, TrendingUp } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-melon-50">

      {/* 1. HERO SECTION (PARALLAX FRAMER MOTION) */}
      <HeroSection />

      {/* 2. KEUNGGULAN (CARD NAIK PERLAHAN - AOS) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Kenapa Central Melon?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Standar baru dalam industri melon premium Indonesia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Leaf, title: "100% Organik", desc: "Nutrisi alami tanpa pestisida kimia berbahaya.", delay: "0" },
            { icon: ShieldCheck, title: "Quality Control", desc: "Sortir ketat 3 lapis untuk memastikan grade A.", delay: "200" },
            { icon: TrendingUp, title: "Investasi Cerdas", desc: "ROI tinggi bagi mitra yang bergabung dengan greenhouse kami.", delay: "400" },
          ].map((item, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={item.delay}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 bg-melon-100 rounded-xl flex items-center justify-center mb-6 text-melon-600">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GREENHOUSE STORYTELLING (GSAP) */}
      <GreenhouseShowcase />

      {/* 4. CTA FOOTER */}
      <section className="py-24 bg-melon-900 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto" data-aos="zoom-in">
          <h2 className="text-4xl font-bold text-white mb-6">Siap Merasakan Manisnya?</h2>
          <p className="text-melon-200 mb-10 text-lg">Pesan melon sekarang atau diskusikan pembuatan greenhouse impian Anda.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="px-8 py-4 bg-white text-melon-900 font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
              Beli Melon <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};