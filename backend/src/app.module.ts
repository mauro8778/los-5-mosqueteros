import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { AiMatchModule } from './ai-match/ai-match.module';
import { StoreModule } from './store/store.module';
import { DonationsModule } from './donations/donations.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PetsModule,
    AdoptionsModule,
    AiMatchModule,
    StoreModule,
    DonationsModule,
    AppointmentsModule,
    ChatModule,
  ],
})
export class AppModule {}
