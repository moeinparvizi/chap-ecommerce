import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Plaintext legacy credentials must be migrated privately before online cutover.
    if (!user || !user.password.startsWith('$2') || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.session(user);
  }

  async register(data: { email: string; name: string; password: string }) {
    try {
      const user = await this.prisma.user.create({ data: {
        email: data.email, name: data.name, password: await hash(data.password, 12), role: 'CUSTOMER',
      } });
      return this.session(user);
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Email already registered');
      throw error;
    }
  }

  private async session(user: { id: string; email: string; name: string; role: string; phone?: string | null }) {
    return { id: user.id, email: user.email, name: user.name, role: user.role.toLowerCase(), phone: user.phone,
      accessToken: await this.jwt.signAsync({ sub: user.id }),
    };
  }
}
