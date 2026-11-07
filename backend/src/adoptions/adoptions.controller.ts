import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdoptionsService } from './adoptions.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApplicationStatus, Role } from '@prisma/client';

@ApiTags('Adopciones & Evaluación IA')
@Controller('adoptions')
export class AdoptionsController {
  constructor(private adoptionsService: AdoptionsService) {}

  @Post(':petId/evaluate')
  @ApiOperation({ summary: 'Evaluar compatibilidad de adopción con IA sin requerir sesión obligatoria' })
  async evaluate(
    @Param('petId') petId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.adoptionsService.evaluateCompatibilityOnly(petId, dto);
  }

  @Post(':petId/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Postularse a la adopción de una mascota con evaluación automática de IA' })
  async apply(
    @Param('petId') petId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.adoptionsService.submitApplication(petId, userId, dto);
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver mis postulaciones de adopción como adoptante' })
  async getMyApplications(@CurrentUser('id') userId: string) {
    return this.adoptionsService.findByUserId(userId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SHELTER_VOLUNTEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver todas las solicitudes de adopción con scoring IA (Admin/Voluntarios)' })
  async getAll() {
    return this.adoptionsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SHELTER_VOLUNTEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar o rechazar solicitud de adopción' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.adoptionsService.updateStatus(id, status);
  }
}
