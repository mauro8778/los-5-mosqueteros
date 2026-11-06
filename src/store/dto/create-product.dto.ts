import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Alimento Premium Adultos 15kg' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Nutrición balanceada con proteínas de alto valor biológico.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 34500.0 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'Alimentos' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
