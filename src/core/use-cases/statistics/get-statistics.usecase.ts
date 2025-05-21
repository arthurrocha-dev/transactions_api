import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';

@Injectable()
export class GetStatisticsUseCase {
  constructor(private readonly repository: TransactionsRepository) {}

  execute() {
    const now = Date.now();
    const past60s = now - 60000;

    const validTransactions = this.repository
      .getAll()
      .filter((tx) => tx.timestamp.getTime() >= past60s);

    const count = validTransactions.length;

    if (count === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
    }

    const amounts = validTransactions.map((tx) => tx.amount);

    const sum = amounts.reduce((acc, val) => acc + val, 0);
    const avg = sum / count;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return {
      count,
      sum: Number(sum.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
    };
  }
}
