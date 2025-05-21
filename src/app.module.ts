import { Module } from '@nestjs/common';
import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { CreateTransactionUseCase } from './core/use-cases/transaction/create-transaction.usecase';
import { TransactionsRepository } from './core/interfaces/transactions-repository.interface';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory-transactions.repository';
import { DeleteAllTransactionsUseCase } from './core/use-cases/transaction/delete-all-transactions.usecase';
import { GetAllTransactionsUseCase } from './core/use-cases/transaction/get-all-transactions.usecase';
import { GetStatisticsUseCase } from './core/use-cases/statistics/get-statistics.usecase';
import { StatisticsController } from './infra/http/controllers/statistics.controller';

@Module({
  imports: [],
  controllers: [TransactionsController, StatisticsController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetAllTransactionsUseCase,
    GetStatisticsUseCase,
    {
      provide: TransactionsRepository,
      useClass: InMemoryTransactionsRepository,
    },
  ],
})
export class AppModule {}
