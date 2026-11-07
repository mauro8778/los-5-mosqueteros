import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiMatchService } from '../ai-match/ai-match.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus, PetStatus } from '@prisma/client';

@Injectable()
export class AdoptionsService {
  constructor(
    private prisma: PrismaService,
    private aiMatch: AiMatchService,
  ) {}

  async evaluateCompatibilityOnly(petId: string, dto: CreateApplicationDto) {
    let pet: any = null;
    try {
      pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    } catch {
      // Si la BD no está disponible, usamos datos enviados o por defecto
    }

    const petData = dto.petData;
    const petProfile = pet || petData || {
      name: 'Mascota',
      species: 'DOG',
      size: 'MEDIUM',
      energyLevel: 'MEDIUM',
      description: 'Mascota en adopción responsable.',
    };

    return this.aiMatch.evaluateCompatibility(dto, {
      name: petProfile.name,
      species: petProfile.species || 'DOG',
      size: petProfile.size || 'MEDIUM',
      energyLevel: petProfile.energyLevel || 'MEDIUM',
      description: petProfile.description || 'Mascota en proceso de adopción.',
    });
  }

  async submitApplication(petId: string, userId: string, dto: CreateApplicationDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException('La mascota indicada no existe');
    }

    if (pet.status === PetStatus.ADOPTED) {
      throw new BadRequestException('Esta mascota ya ha sido adoptada');
    }

    // Evaluación con IA
    const aiResult = await this.aiMatch.evaluateCompatibility(dto, {
      name: pet.name,
      species: pet.species,
      size: pet.size,
      energyLevel: pet.energyLevel || 'MEDIUM',
      description: pet.description,
    });

    const application = await this.prisma.adoptionApplication.create({
      data: {
        petId,
        userId,
        homeType: dto.homeType,
        hasYard: dto.hasYard,
        hoursAlonePerDay: dto.hoursAlonePerDay,
        hasOtherPets: dto.hasOtherPets,
        childrenAtHome: dto.childrenAtHome,
        experienceWithPets: dto.experienceWithPets,
        additionalNotes: dto.additionalNotes,
        aiCompatibilityScore: aiResult.score,
        aiAnalysisReport: aiResult.analysis,
        status: ApplicationStatus.SUBMITTED,
      },
      include: {
        pet: { select: { id: true, name: true, photos: true, species: true } },
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    return application;
  }

  async findByUserId(userId: string) {
    return this.prisma.adoptionApplication.findMany({
      where: { userId },
      include: { pet: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.adoptionApplication.findMany({
      include: { pet: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    const app = await this.prisma.adoptionApplication.findUnique({ where: { id } });
    if (!app) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const updated = await this.prisma.adoptionApplication.update({
      where: { id },
      data: { status },
    });

    if (status === ApplicationStatus.APPROVED) {
      await this.prisma.pet.update({
        where: { id: app.petId },
        data: { status: PetStatus.ADOPTED },
      });
    }

    return updated;
  }
}
