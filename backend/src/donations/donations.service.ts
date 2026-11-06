import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async getCampaigns() {
    return this.prisma.donationCampaign.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCampaign(dto: CreateCampaignDto) {
    return this.prisma.donationCampaign.create({ data: dto });
  }

  async recordDonation(campaignId: string, amount: number) {
    const campaign = await this.prisma.donationCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.prisma.donationCampaign.update({
      where: { id: campaignId },
      data: { raisedAmount: { increment: amount } },
    });
  }
}
