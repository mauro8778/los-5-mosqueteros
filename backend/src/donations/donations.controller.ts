import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Donaciones & Rescates')
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'Listar campañas de donación activas' })
  async getCampaigns() {
    return this.donationsService.getCampaigns();
  }

  @Post('campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SHELTER_VOLUNTEER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva campaña solidaria' })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.donationsService.createCampaign(dto);
  }

  @Post('campaigns/:id/contribute')
  @ApiOperation({ summary: 'Registrar una contribución económica a una campaña' })
  async contribute(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.donationsService.recordDonation(id, amount);
  }
}
