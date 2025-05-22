import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';
import { MetricsService } from '../../../services/metrics.service';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly repository: TransactionsRepository,
    private readonly metricsService: MetricsService,
  ) {}

  execute(amount: number, timestamp: Date): void {
    const now = new Date();
    if (timestamp.getTime() > now.getTime()) {
      throw new UnprocessableEntityException('Timestamp no futuro');
    }

    if (amount < 0) {
      throw new UnprocessableEntityException('Amount negativo');
    }

    const transaction = new Transaction(amount, timestamp);
    this.repository.save(transaction);
    this.metricsService.incrementTransactionsCreated();

    const allTransactions = this.repository.getAll();
    this.metricsService.setTransactionsInMemory(allTransactions.length);
  }
}
