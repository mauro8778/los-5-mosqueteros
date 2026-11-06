import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Species, PetSize, PetStatus } from '@prisma/client';

export class CreatePetDto {
  @ApiProperty({ example: 'D’Artagnan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Species, example: Species.DOG })
  @IsEnum(Species)
  species: Species;

  @ApiProperty({ example: 'Mestizo de Labrador', required: false })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ example: 14, description: 'Edad en meses' })
  @IsOptional()
  @IsNumber()
  ageMonths?: number;

  @ApiProperty({ enum: PetSize, example: PetSize.MEDIUM })
  @IsEnum(PetSize)
  size: PetSize;

  @ApiProperty({ example: 'MALE', description: 'MALE o FEMALE' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'Cariñoso, juguetón y con mucha energía. Ideal para familias.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @ApiProperty({ enum: PetStatus, example: PetStatus.AVAILABLE, required: false })
  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;

  @ApiProperty({ example: -34.6037, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -58.3816, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isVaccinated?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @ApiProperty({ example: 'HIGH', enum: ['LOW', 'MEDIUM', 'HIGH'], required: false })
  @IsOptional()
  @IsString()
  energyLevel?: string;
}
