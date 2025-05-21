import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';
import { Transaction } from '../../entities/transaction.entity';

@Injectable()
export class GetAllTransactionsUseCase {
  constructor(private readonly repository: TransactionsRepository) {}

  execute(): Transaction[] {
    return this.repository.getAll();
  }
}
