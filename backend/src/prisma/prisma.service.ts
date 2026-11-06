import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('📦 Conectado exitosamente a PostgreSQL mediante Prisma');
    } catch (err: any) {
      this.logger.warn(`Nota: Conexión diferida a PostgreSQL (${err.message}). La API responderá según la disponibilidad de la base de datos.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Desconectado de PostgreSQL');
  }
}
