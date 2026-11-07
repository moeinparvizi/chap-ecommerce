import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomPrintController } from './custom-print.controller';
import { CustomPrintService } from './custom-print.service';
import { UploadsService } from './uploads.service';
@Module({
  imports: [PrismaModule],
  controllers: [CustomPrintController],
  providers: [CustomPrintService, UploadsService],
})
export class CustomPrintModule {}
