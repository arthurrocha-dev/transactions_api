import { Module } from '@nestjs/common';
import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { CreateTransactionUseCase } from './core/use-cases/transaction/create-transaction.usecase';
import { TransactionsRepository } from './core/interfaces/transactions-repository.interface';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory-transactions.repository';
import { DeleteAllTransactionsUseCase } from './core/use-cases/transaction/delete-all-transactions.usecase';
import { GetAllTransactionsUseCase } from './core/use-cases/transaction/get-all-transactions.usecase';
import { GetStatisticsUseCase } from './core/use-cases/statistics/get-statistics.usecase';
import { StatisticsController } from './infra/http/controllers/statistics.controller';
import { ThrottlerModule } from '@nestjs/throttler';

import { HealthController } from './infra/http/controllers/healthcheck.controller';
import { PinoLogger } from './services/pino-logger.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './services/metrics.service';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
        blockDuration: 60000,
      },
    ]),
    PrometheusModule.register(),
  ],
  controllers: [HealthController, TransactionsController, StatisticsController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetAllTransactionsUseCase,
    GetStatisticsUseCase,
    PinoLogger,
    MetricsService,
    {
      provide: TransactionsRepository,
      useClass: InMemoryTransactionsRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export class AppModule {}
