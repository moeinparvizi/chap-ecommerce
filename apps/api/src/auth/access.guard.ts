import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwt: JwtService, @Inject(PrismaService) private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const parts = req.path.replace(/^\/api\/?/, '').split('/').filter(Boolean);
    const [resource, id, action] = parts;
    if (req.method === 'GET' && resource === 'custom-print' && parts.length === 2 && ['settings', 'products'].includes(id)) return true;
    const method = req.method;
    if (method === 'POST' && resource === 'auth' && ['login', 'register'].includes(id) && parts.length === 2) return true;
    if (method === 'GET' && ['health', 'products', 'categories'].includes(resource)) return true;
    if (method === 'GET' && ['comments', 'reviews'].includes(resource) && !id && req.query.productId && !req.query.userId) return true;

    const token = /^Bearer (\S+)$/.exec(req.headers.authorization || '')?.[1];
    if (!token) throw new UnauthorizedException();
    let subject: string;
    try {
      const payload = await this.jwt.verifyAsync(token, { algorithms: ['HS256'] });
      if (typeof payload.sub !== 'string') throw new Error('Missing subject');
      subject = payload.sub;
    } catch { throw new UnauthorizedException(); }
    const user = await this.prisma.user.findUnique({ where: { id: subject }, select: { id: true, role: true, name: true } });
    if (!user) throw new UnauthorizedException();
    req.user = user;
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) return true;

    if (resource === 'custom-print') {
      if (id === 'uploads' || (id === 'requests' && !parts.includes('review'))) return true;
      throw new ForbiddenException();
    }

    if (req.body?.userId && req.body.userId !== user.id) throw new ForbiddenException();
    if (resource === 'profile' && id === user.id && ['GET', 'PUT'].includes(method)) return true;
    const ownedResources = ['orders', 'comments', 'reviews', 'locations', 'wishlist', 'notifications'];
    if (ownedResources.includes(resource) && method === 'GET' && !id && req.query.userId === user.id) return true;
    if (ownedResources.includes(resource) && method === 'POST' && req.body.userId === user.id) {
      if (resource === 'orders' && !id) return true;
      if (['comments', 'reviews', 'locations'].includes(resource) && !id) {
        if (['comments', 'reviews'].includes(resource)) req.body.author = user.name;
        return true;
      }
      if (resource === 'wishlist' && id === 'toggle') return true;
    }
    if (resource === 'notifications' && id === 'read-all' && method === 'PUT' && req.query.userId === user.id) return true;

    // Resolve ownership from the database, never from a client-provided userId.
    const models = { comments: this.prisma.comment, reviews: this.prisma.review, locations: this.prisma.location,
      wishlist: this.prisma.wishlist, notifications: this.prisma.notification };
    const model = models[resource as keyof typeof models];
    const allowed = method === 'DELETE' || (method === 'PUT' && (
      (resource === 'locations' && (!action || action === 'default')) || (resource === 'notifications' && action === 'read')
    ));
    if (model && id && allowed) {
      const record = await (model.findUnique as Function).call(model, { where: { id }, select: { userId: true } });
      if (record?.userId === user.id) return true;
    }
    throw new ForbiddenException();
  }
}
