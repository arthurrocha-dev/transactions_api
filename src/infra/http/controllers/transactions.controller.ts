import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { CreateTransactionUseCase } from '../../../core/use-cases/transaction/create-transaction.usecase';
import { ApiTags } from '@nestjs/swagger';
import { DeleteAllTransactionsUseCase } from '../../../core/use-cases/transaction/delete-all-transactions.usecase';
import { GetAllTransactionsUseCase } from '../../../core/use-cases/transaction/get-all-transactions.usecase';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get()
  getAll() {
    return this.getAllTransactionsUseCase.execute();
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateTransactionDto) {
    const timestamp = new Date(body.timestamp);
    this.createTransactionUseCase.execute(body.amount, timestamp);
    return {
      message: 'Transação aceita e registrada.',
      data: {
        amount: body.amount,
        timestamp,
      },
    };
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteAll() {
    this.deleteAllTransactionsUseCase.execute();
    return {
      message: 'Todas as transações foram apagadas com sucesso.',
    };
  }
}
