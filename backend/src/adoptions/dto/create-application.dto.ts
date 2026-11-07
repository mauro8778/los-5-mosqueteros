import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Departamento con balcón' })
  @IsString()
  @IsNotEmpty()
  homeType: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasYard: boolean;

  @ApiProperty({ example: 4, description: 'Horas al día que la mascota pasaría sin compañía humana' })
  @IsNumber()
  @Min(0)
  @Max(24)
  hoursAlonePerDay: number;

  @ApiProperty({ example: true, description: '¿Hay otros animales actualmente en el hogar?' })
  @IsBoolean()
  hasOtherPets: boolean;

  @ApiProperty({ example: false, description: '¿Hay niños menores de 10 años?' })
  @IsBoolean()
  childrenAtHome: boolean;

  @ApiProperty({ example: 'Tuve perros mestizos durante 12 años, conozco sobre planes de vacunación y paseos diarios.' })
  @IsString()
  @IsNotEmpty()
  experienceWithPets: string;

  @ApiProperty({ example: 'Trabajo remoto la mayor parte de la semana.', required: false })
  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @ApiProperty({ required: false, description: 'Datos de la mascota para evaluación IA' })
  @IsOptional()
  petData?: {
    name?: string;
    species?: string;
    size?: string;
    energyLevel?: string;
    description?: string;
  };
}
