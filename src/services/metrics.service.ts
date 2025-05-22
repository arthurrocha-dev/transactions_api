import { Injectable } from '@nestjs/common';
import { transactionsCreated, transactionsInMemory } from '../metrics/metrics';

@Injectable()
export class MetricsService {
  incrementTransactionsCreated() {
    transactionsCreated.inc();
  }

  setTransactionsInMemory(count: number) {
    transactionsInMemory.set(count);
  }
}
