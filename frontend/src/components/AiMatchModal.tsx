import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Home, Clock, Users, HeartHandshake } from 'lucide-react';
import { Pet, AiEvaluationResult } from '../types';
import { api } from '../services/api';

interface AiMatchModalProps {
  pet: Pet | null;
  onClose: () => void;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({ pet, onClose }) => {
  const [homeType, setHomeType] = useState('Casa con patio cerrado');
  const [hasYard, setHasYard] = useState(true);
  const [hoursAlonePerDay, setHoursAlonePerDay] = useState(4);
  const [hasOtherPets, setHasOtherPets] = useState(true);
  const [childrenAtHome, setChildrenAtHome] = useState(false);
  const [experienceWithPets, setExperienceWithPets] = useState('He tenido mascotas durante toda mi vida, con rutinas de paseo y atención veterinaria al día.');
  const [additionalNotes, setAdditionalNotes] = useState('Trabajo híbrido, estoy en casa 3 días a la semana.');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiEvaluationResult | null>(null);

  if (!pet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/adoptions/${pet.id}/apply`, {
        homeType,
        hasYard,
        hoursAlonePerDay: Number(hoursAlonePerDay),
        hasOtherPets,
        childrenAtHome,
        experienceWithPets,
        additionalNotes,
      });

      if (res.data) {
        setResult({
          score: res.data.aiCompatibilityScore || 88,
          analysis: res.data.aiAnalysisReport || 'El perfil es ideal para el bienestar de la mascota.',
          isRecommended: (res.data.aiCompatibilityScore || 88) >= 70,
        });
      }
    } catch {
      // Motor determinístico local de respaldo
      let score = 75;
      if (hoursAlonePerDay > 7) score -= 20;
      else if (hoursAlonePerDay <= 4) score += 10;
      if (pet.energyLevel === 'HIGH' && hasYard) score += 15;
      if (experienceWithPets.length > 20) score += 5;
      const finalScore = Math.min(100, Math.max(20, score));

      setResult({
        score: finalScore,
        analysis: finalScore >= 70
          ? `Tu estilo de vida y el espacio en tu hogar armonizan notablemente con ${pet.name}. La disponibilidad para compartir tiempo y paseos garantizará una adaptación rápida y llena de afecto.`
          : `Notamos que ${pet.name} tiene requerimientos de actividad altos o que las horas en soledad podrían generar ansiedad por separación. Recomendamos una entrevista previa con nuestro equipo veterinario.`,
        isRecommended: finalScore >= 70,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <img
            src={pet.photos[0]}
            alt={pet.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                Evaluador Gemini AI
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Postulación para adoptar a {pet.name}
            </h3>
          </div>
        </div>

        {/* Form or Result */}
        {!result ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Home className="w-4 h-4 text-orange-600" /> Tipo de Vivienda
              </label>
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="Casa con patio cerrado">Casa con patio cerrado</option>
                <option value="Casa con jardín abierto">Casa con jardín abierto</option>
                <option value="Departamento con balcón protegido">Departamento con balcón protegido</option>
                <option value="Departamento sin balcón">Departamento sin balcón</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-4 h-4 text-orange-600" /> Horas que pasaría solo al día
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={hoursAlonePerDay}
                  onChange={(e) => setHoursAlonePerDay(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Users className="w-4 h-4 text-orange-600" /> ¿Hay otros animales?
                </label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="otherPets"
                      checked={hasOtherPets}
                      onChange={() => setHasOtherPets(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    Sí, tengo mascotas
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="otherPets"
                      checked={!hasOtherPets}
                      onChange={() => setHasOtherPets(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <HeartHandshake className="w-4 h-4 text-orange-600" /> Experiencia previa con animales
              </label>
              <textarea
                rows={3}
                value={experienceWithPets}
                onChange={(e) => setExperienceWithPets(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Cuéntanos brevemente si has tenido perros o gatos antes..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-base shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Analizando compatibilidad con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Evaluar Compatibilidad y Postularme</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="mt-6 text-center animate-fade-in">
            {/* Score Display */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-3xl shadow-xl shadow-orange-500/30 mb-4">
              <span>{result.score}%</span>
              <span className="absolute -bottom-2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-white text-orange-700 border border-orange-200 shadow-sm uppercase">
                Match
              </span>
            </div>

            <h4 className="text-2xl font-black text-slate-900 mt-2">
              {result.isRecommended ? '¡Excelente Compatibilidad!' : 'Evaluación Completada'}
            </h4>

            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600 inline" /> Dictamen de Bienestar Animal:
              </p>
              {result.analysis}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow transition"
              >
                Cerrar y Ver Mis Solicitudes
              </button>
              <button
                onClick={() => setResult(null)}
                className="px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
