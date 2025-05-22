import { Counter, Gauge } from 'prom-client';

export const transactionsCreated = new Counter({
  name: 'transactions_created_total',
  help: 'Total number of transactions created',
});

export const transactionsInMemory = new Gauge({
  name: 'transactions_in_memory',
  help: 'Number of transactions currently in memory',
});
