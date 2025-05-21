import { Transaction } from '../entities/transaction.entity';

export abstract class TransactionsRepository {
  abstract save(transaction: Transaction): void;
  abstract deleteAll(): void;
  abstract getAll(): Transaction[];
}
