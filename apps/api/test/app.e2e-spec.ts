import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { vi } from 'vitest';

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDb('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    vi.stubEnv('JWT_SECRET', 'integration-test-secret-at-least-thirty-two-characters');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app?.close();
    vi.unstubAllEnvs();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
      });
  });
});
