import { Module } from '@nestjs/common';
import { MarkupsController } from './markups.controller';
import { MarkupsService } from './markups.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [MarkupsController], providers: [MarkupsService], exports: [MarkupsService] })
export class MarkupsModule {}
