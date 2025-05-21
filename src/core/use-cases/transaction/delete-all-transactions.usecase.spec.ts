import { DeleteAllTransactionsUseCase } from './delete-all-transactions.usecase';
import { TransactionsRepository } from '../../interfaces/transactions-repository.interface';

describe('DeleteAllTransactionsUseCase', () => {
  let useCase: DeleteAllTransactionsUseCase;
  let repository: jest.Mocked<TransactionsRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      deleteAll: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new DeleteAllTransactionsUseCase(repository);
  });

  it('deve chamar o método deleteAll do repositório', () => {
    useCase.execute();
    expect(repository.deleteAll).toHaveBeenCalled();
  });
});
