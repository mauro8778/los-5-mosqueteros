import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { FilterPetsDto } from './dto/filter-pets.dto';
import { PetStatus } from '@prisma/client';

@Injectable()
export class PetsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialPets();
  }

  async findAll(filters: FilterPetsDto) {
    const where: any = {};
    if (filters.species) where.species = filters.species;
    if (filters.size) where.size = filters.size;
    if (filters.status) where.status = filters.status;
    if (filters.energyLevel) where.energyLevel = filters.energyLevel;

    return this.prisma.pet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        applications: {
          select: { id: true, status: true, aiCompatibilityScore: true, createdAt: true },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    return pet;
  }

  async create(dto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        name: dto.name,
        species: dto.species,
        breed: dto.breed,
        ageMonths: dto.ageMonths,
        size: dto.size,
        gender: dto.gender,
        description: dto.description,
        photos: dto.photos,
        status: dto.status || PetStatus.AVAILABLE,
        latitude: dto.latitude,
        longitude: dto.longitude,
        isVaccinated: dto.isVaccinated ?? false,
        isNeutered: dto.isNeutered ?? false,
        energyLevel: dto.energyLevel || 'MEDIUM',
      },
    });
  }

  async updateStatus(id: string, status: PetStatus) {
    await this.findOne(id);
    return this.prisma.pet.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Semilla inicial de las 5 mascotas emblemáticas "Los 5 Mosqueteros"
   */
  private async seedInitialPets() {
    try {
      const count = await this.prisma.pet.count();
      if (count > 0) return;

      const mosqueteros: CreatePetDto[] = [
        {
          name: 'D’Artagnan',
          species: 'DOG' as any,
          breed: 'Mestizo Aventurero',
          ageMonths: 18,
          size: 'MEDIUM' as any,
          gender: 'MALE',
          description: 'Valiente, leal y súper juguetón. Rescatado en la zona oeste, listo para conquistar tu corazón.',
          photos: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1'],
          status: 'AVAILABLE' as any,
          isVaccinated: true,
          isNeutered: true,
          energyLevel: 'HIGH',
        },
        {
          name: 'Athos',
          species: 'CAT' as any,
          breed: 'Gato Siamés Mix',
          ageMonths: 24,
          size: 'SMALL' as any,
          gender: 'MALE',
          description: 'Tranquilo, noble y observador. Disfruta de tardes soleadas y mimos tranquilos.',
          photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'],
          status: 'AVAILABLE' as any,
          isVaccinated: true,
          isNeutered: true,
          energyLevel: 'LOW',
        },
        {
          name: 'Porthos',
          species: 'DOG' as any,
          breed: 'Golden Retriever Mix',
          ageMonths: 36,
          size: 'LARGE' as any,
          gender: 'MALE',
          description: 'El bonachón del refugio. Gran apetito, gran corazón y excelente con niños.',
          photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d'],
          status: 'AVAILABLE' as any,
          isVaccinated: true,
          isNeutered: true,
          energyLevel: 'MEDIUM',
        },
        {
          name: 'Aramis',
          species: 'CAT' as any,
          breed: 'Europeo Común Atigrado',
          ageMonths: 12,
          size: 'SMALL' as any,
          gender: 'MALE',
          description: 'Curioso y elegante. Le encantan los rascadores y trepar por las alturas.',
          photos: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5'],
          status: 'AVAILABLE' as any,
          isVaccinated: true,
          isNeutered: true,
          energyLevel: 'MEDIUM',
        },
        {
          name: 'Milady',
          species: 'DOG' as any,
          breed: 'Border Collie Mix',
          ageMonths: 20,
          size: 'MEDIUM' as any,
          gender: 'FEMALE',
          description: 'Inteligente como ninguna. Aprende trucos en minutos y busca una familia activa.',
          photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb'],
          status: 'AVAILABLE' as any,
          isVaccinated: true,
          isNeutered: true,
          energyLevel: 'HIGH',
        },
      ];

      for (const pet of mosqueteros) {
        await this.create(pet);
      }
    } catch {
      // Diferir si la base no está conectada al arrancar
    }
  }
}
