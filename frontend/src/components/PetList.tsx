import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2, MapPin, Zap } from 'lucide-react';
import { Pet } from '../types';

interface PetListProps {
  pets: Pet[];
  onSelectPetForMatch: (pet: Pet) => void;
}

export const PetList: React.FC<PetListProps> = ({ pets, onSelectPetForMatch }) => {
  const [filterSpecies, setFilterSpecies] = useState<'ALL' | 'DOG' | 'CAT'>('ALL');

  const filteredPets = pets.filter((pet) => {
    if (filterSpecies === 'ALL') return true;
    return pet.species === filterSpecies;
  });

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Mascotas en Adopción
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Cada una con su historia, personalidad y esperando a su familia ideal.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setFilterSpecies('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterSpecies === 'ALL'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({pets.length})
          </button>
          <button
            onClick={() => setFilterSpecies('DOG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterSpecies === 'DOG'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐶 Perros
          </button>
          <button
            onClick={() => setFilterSpecies('CAT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterSpecies === 'CAT'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐱 Gatos
          </button>
        </div>
      </div>

      {/* Grid of Pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src={pet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'}
                alt={pet.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur text-slate-900 shadow-sm">
                  {pet.species === 'DOG' ? 'Perro' : 'Gato'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-sm">
                  {pet.status === 'AVAILABLE' ? 'Disponible' : pet.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">{pet.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                    {pet.ageMonths ? `${Math.round(pet.ageMonths / 12)} años` : 'Joven'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500 mt-1">{pet.breed || 'Mestizo'}</p>

                <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {pet.description}
                </p>

                {/* Health & Energy Badges */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  {pet.isVaccinated && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Vacunado
                    </span>
                  )}
                  {pet.isNeutered && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Castrado
                    </span>
                  )}
                  {pet.energyLevel && (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      <Zap className="w-3.5 h-3.5" /> Energía {pet.energyLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPetForMatch(pet)}
                className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluar Adopción con IA</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
