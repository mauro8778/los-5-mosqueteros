import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    return this.prisma.vetAppointment.create({
      data: {
        userId,
        petId: dto.petId,
        petName: dto.petName,
        reason: dto.reason,
        appointmentDate: new Date(dto.appointmentDate),
        notes: dto.notes,
        status: AppointmentStatus.PENDING,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.vetAppointment.findMany({
      where: { userId },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.vetAppointment.findMany({
      include: { user: { select: { fullName: true, phone: true, email: true } } },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const app = await this.prisma.vetAppointment.findUnique({ where: { id } });
    if (!app) {
      throw new NotFoundException('Turno no encontrado');
    }

    return this.prisma.vetAppointment.update({
      where: { id },
      data: { status },
    });
  }
}
