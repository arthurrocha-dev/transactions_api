import { CreateTransactionUseCase } from './create-transaction.usecase';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';
import { UnprocessableEntityException } from '@nestjs/common';
import { Transaction } from '../../entities/transaction.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: jest.Mocked<TransactionsRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      deleteAll: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new CreateTransactionUseCase(repository);
  });

  it('deve criar uma transação válida', () => {
    const now = new Date();

    useCase.execute(100, now);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        timestamp: now,
      } as Transaction),
    );
  });

  it('deve lançar erro se o amount for negativo', () => {
    const now = new Date();

    expect(() => {
      useCase.execute(-50, now);
    }).toThrow(UnprocessableEntityException);
  });

  it('deve lançar erro se a data estiver no futuro', () => {
    const future = new Date(Date.now() + 60_000);

    expect(() => {
      useCase.execute(100, future);
    }).toThrow(UnprocessableEntityException);
  });
});
