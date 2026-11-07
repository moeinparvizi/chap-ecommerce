import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthCheckService) private health: HealthCheckService,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(PrismaHealthIndicator) private prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prismaHealth.pingCheck('database', this.prisma)]);
  }
}
