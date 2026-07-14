import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    return Promise.resolve(req.ip || req.socket?.remoteAddress || 'unknown');
  }
}
