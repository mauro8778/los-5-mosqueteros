import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'pet-uuid-1', required: false })
  @IsOptional()
  @IsString()
  petId?: string;

  @ApiProperty({ example: 'D’Artagnan' })
  @IsString()
  @IsNotEmpty()
  petName: string;

  @ApiProperty({ example: 'Vacunación Séxtuple y Control General' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: '2026-11-20T14:30:00.000Z' })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: 'Presenta ligero rascado en la oreja derecha', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
