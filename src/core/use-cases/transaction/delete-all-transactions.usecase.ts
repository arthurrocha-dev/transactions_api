import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(private readonly repository: TransactionsRepository) {}

  execute(): void {
    this.repository.deleteAll();
  }
}
