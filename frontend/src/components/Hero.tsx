import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onDonate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onDonate }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-800 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin-slow" />
            <span>Motor de Matching de Adopción con Google Gemini 2.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Cada vida rescatada merece su{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 bg-clip-text text-transparent">
              hogar ideal
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Conoce a <strong>Los 5 Mosqueteros</strong> y a nuestros animales rescatados. Utilizamos inteligencia artificial para evaluar la compatibilidad de adopción, reduciendo el abandono y asegurando vínculos para toda la vida.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-600/25 flex items-center gap-2 group transition"
            >
              <span>Conocer Mascotas</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onDonate}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-sm flex items-center gap-2 transition"
            >
              <HeartHandshake className="w-5 h-5 text-orange-600" />
              <span>Apoyar Campañas Médicas</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 pt-10 border-t border-slate-200/60 max-w-xl mx-auto">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">+120</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Rescates Exitosos</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-orange-600">98%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Compatibilidad IA</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">24/7</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Atención Clínica</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
