import { GetStatisticsUseCase } from './get-statistics.usecase';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';
import { Transaction } from '../../entities/transaction.entity';

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let repository: jest.Mocked<TransactionsRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      deleteAll: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new GetStatisticsUseCase(repository);
  });

  it('deve retornar zeros quando não há transações', () => {
    repository.getAll.mockReturnValue([]);

    const stats = useCase.execute();

    expect(stats).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });

  it('deve calcular estatísticas corretas das últimas 60s', () => {
    const now = new Date();
    const tx1 = new Transaction(100, new Date(now.getTime() - 10_000));
    const tx2 = new Transaction(50, new Date(now.getTime() - 30_000));
    const tx3 = new Transaction(150, new Date(now.getTime() - 70_000));

    repository.getAll.mockReturnValue([tx1, tx2, tx3]);

    const stats = useCase.execute();

    expect(stats).toEqual({
      count: 2,
      sum: 150,
      avg: 75,
      min: 50,
      max: 100,
    });
  });
});
