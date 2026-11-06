import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Campaña de Vacunación y Cirugías para D’Artagnan y Athos' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Recaudación para cubrir gastos veterinarios urgentes y medicamentos.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 450000.0 })
  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
