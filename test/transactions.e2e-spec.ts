import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) - deve criar uma transação válida e refletir nas estatísticas', async () => {
    const amount = 100.5;

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount,
        timestamp: new Date().toISOString(),
      });

    expect(response.status).toBe(201);

    const statsResponse = await request(app.getHttpServer()).get('/statistics');

    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body).toEqual({
      count: 1,
      sum: amount,
      avg: amount,
      min: amount,
      max: amount,
    });
  });

  it('/transactions (POST) - deve retornar 422 se a transação estiver no futuro', async () => {
    const futureDate = new Date(Date.now() + 60000).toISOString(); // 1 minuto no futuro
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 50,
        timestamp: futureDate,
      });

    expect(response.status).toBe(422);
  });

  it('/transactions (POST) - deve retornar 400 se JSON for inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 'invalid_value',
      });

    expect(response.status).toBe(400);
  });

  it('/transactions (DELETE) - deve apagar todas as transações', async () => {
    await request(app.getHttpServer()).post('/transactions').send({
      amount: 50.0,
      timestamp: new Date().toISOString(),
    });

    const deleteResponse = await request(app.getHttpServer()).delete(
      '/transactions',
    );

    expect(deleteResponse.status).toBe(200);

    const statsResponse = await request(app.getHttpServer()).get('/statistics');

    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });
});
