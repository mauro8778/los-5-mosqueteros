import React, { useState } from 'react';
import { HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import { DonationCampaign } from '../types';

interface DonationsProps {
  campaigns: DonationCampaign[];
  onDonateToCampaign: (campaignId: string, amount: number) => void;
}

export const Donations: React.FC<DonationsProps> = ({ campaigns, onDonateToCampaign }) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('5000');
  const [donated, setDonated] = useState(false);

  const handleDonate = (id: string, amount: number) => {
    onDonateToCampaign(id, amount);
    setDonated(true);
    setTimeout(() => {
      setDonated(false);
      setSelectedCampaignId(null);
    }, 2500);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
          Crowdfunding Veterinario
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Campañas de Rescate & Cirugías
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Cada aporte permite financiar tratamientos médicos de urgencia, cirugías ortopédicas y medicamentos para los animales rescatados de la calle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {campaigns.map((c) => {
          const progressPercent = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="h-56 bg-slate-100 rounded-2xl overflow-hidden mb-6 relative">
                  <img
                    src={c.imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c'}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                    Meta: ${c.targetAmount.toLocaleString('es-AR')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.description}</p>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-orange-600">Recaudado: ${c.raisedAmount.toLocaleString('es-AR')}</span>
                    <span className="text-slate-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Donation Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Aporte Rápido:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleDonate(c.id, amt)}
                      className="py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-orange-950 font-bold text-xs transition"
                    >
                      ${amt.toLocaleString('es-AR')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {donated && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-bold text-sm">¡Aporte registrado con éxito!</p>
            <p className="text-xs text-emerald-100">Muchas gracias por apoyar a Los 5 Mosqueteros 🐾</p>
          </div>
        </div>
      )}
    </section>
  );
};
