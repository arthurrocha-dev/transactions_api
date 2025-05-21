import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from 'src/core/interfaces/transactions-repository.interface';
import { Transaction } from 'src/core/entities/transaction.entity';

@Injectable()
export class InMemoryTransactionsRepository implements TransactionsRepository {
  private transactions: Transaction[] = [];

  save(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  deleteAll(): void {
    this.transactions = [];
  }

  getAll(): Transaction[] {
    return this.transactions;
  }
}
