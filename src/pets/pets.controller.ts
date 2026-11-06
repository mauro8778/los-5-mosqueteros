import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { FilterPetsDto } from './dto/filter-pets.dto';
import { PetStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Mascotas & Rescate')
@Controller('pets')
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mascotas en adopción o rescate con filtros' })
  async findAll(@Query() filters: FilterPetsDto) {
    return this.petsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle completo de una mascota por ID' })
  async findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SHELTER_VOLUNTEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar una nueva mascota rescatada' })
  async create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SHELTER_VOLUNTEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de adopción (Disponible, En proceso, Adoptado, etc.)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PetStatus,
  ) {
    return this.petsService.updateStatus(id, status);
  }
}
