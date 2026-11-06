import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export interface ApplicantProfile {
  homeType: string;
  hasYard: boolean;
  hoursAlonePerDay: number;
  hasOtherPets: boolean;
  childrenAtHome: boolean;
  experienceWithPets: string;
  additionalNotes?: string;
}

export interface PetProfile {
  name: string;
  species: string;
  size: string;
  energyLevel: string;
  description: string;
}

export interface AiEvaluationResult {
  score: number; // 0 to 100
  analysis: string;
  isRecommended: boolean;
}

@Injectable()
export class AiMatchService {
  private readonly logger = new Logger(AiMatchService.name);
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async evaluateCompatibility(applicant: ApplicantProfile, pet: PetProfile): Promise<AiEvaluationResult> {
    // Si la API key está configurada, evaluamos con Gemini 2.0 Flash
    if (this.ai) {
      try {
        const prompt = `
Eres un etólogo y experto en bienestar animal del refugio "Los 5 Mosqueteros".
Tu tarea es evaluar la compatibilidad entre una persona adoptante y una mascota rescatada.

DATOS DE LA MASCOTA:
- Nombre: ${pet.name}
- Especie: ${pet.species}
- Tamaño: ${pet.size}
- Nivel de energía: ${pet.energyLevel}
- Descripción: ${pet.description}

DATOS DEL POSTULANTE:
- Tipo de vivienda: ${applicant.homeType} (Tiene patio/jardín: ${applicant.hasYard ? 'Sí' : 'No'})
- Horas que la mascota pasaría sola al día: ${applicant.hoursAlonePerDay} horas
- ¿Convive con otros animales?: ${applicant.hasOtherPets ? 'Sí' : 'No'}
- ¿Hay niños pequeños en el hogar?: ${applicant.childrenAtHome ? 'Sí' : 'No'}
- Experiencia previa con animales: ${applicant.experienceWithPets}
- Notas adicionales: ${applicant.additionalNotes || 'Ninguna'}

Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "score": <número entero entre 0 y 100>,
  "analysis": "<análisis profesional detallado de 2 párrafos sobre fortalezas, precauciones y recomendación>",
  "isRecommended": <true o false>
}
`;
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
            analysis: parsed.analysis || 'Evaluación generada con éxito.',
            isRecommended: Boolean(parsed.isRecommended),
          };
        }
      } catch (err: any) {
        this.logger.warn(`Fallback a motor algorítmico local de compatibilidad: ${err.message}`);
      }
    }

    // Motor determinístico local de compatibilidad
    return this.calculateLocalMatch(applicant, pet);
  }

  private calculateLocalMatch(applicant: ApplicantProfile, pet: PetProfile): AiEvaluationResult {
    let score = 70;

    // Horas en soledad
    if (applicant.hoursAlonePerDay > 8) score -= 25;
    else if (applicant.hoursAlonePerDay > 5) score -= 10;
    else score += 10;

    // Espacio vs Tamaño & Energía
    if (pet.energyLevel === 'HIGH' && !applicant.hasYard) score -= 20;
    if (pet.energyLevel === 'HIGH' && applicant.hasYard) score += 15;
    if (pet.size === 'LARGE' && applicant.homeType.toLowerCase().includes('departamento') && !applicant.hasYard) {
      score -= 15;
    }

    // Experiencia
    if (applicant.experienceWithPets.length > 20) score += 10;

    const finalScore = Math.min(100, Math.max(10, score));
    const isRecommended = finalScore >= 70;

    const analysis = isRecommended
      ? `El perfil del adoptante cuenta con las condiciones adecuadas para el nivel de actividad de ${pet.name}. La disponibilidad horaria y el entorno habitacional garantizan una adaptación armónica.`
      : `Se detectan posibles desafíos en la disponibilidad horaria o el espacio físico para la energía de ${pet.name}. Se sugiere una entrevista previa o evaluar una mascota más calma.`;

    return {
      score: finalScore,
      analysis,
      isRecommended,
    };
  }
}
