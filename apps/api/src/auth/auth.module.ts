import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './access.guard';

@Module({
  imports: [PrismaModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const secret = config.get<string>('JWT_SECRET');
      if (!secret || secret.length < 32 || secret.includes('change-in-production')) {
        throw new Error('JWT_SECRET must be a unique random secret of at least 32 characters');
      }
      return { secret, signOptions: { expiresIn: '8h', algorithm: 'HS256' }, verifyOptions: { algorithms: ['HS256'] } };
    },
  })],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AccessGuard }],
})
export class AuthModule {}
