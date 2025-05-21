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
import { CreateTransactionUseCase } from 'src/core/use-cases/transaction/create-transaction.usecase';
import { ApiTags } from '@nestjs/swagger';
import { DeleteAllTransactionsUseCase } from 'src/core/use-cases/transaction/delete-all-transactions.usecase';
import { GetAllTransactionsUseCase } from 'src/core/use-cases/transaction/get-all-transactions.usecase';
import { GetStatisticsUseCase } from 'src/core/use-cases/statistics/get-statistics.usecase';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Get()
  @Throttle({ default: { limit: 1, ttl: 30 } })
  getAll() {
    return this.getAllTransactionsUseCase.execute();
  }

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

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteAll() {
    this.deleteAllTransactionsUseCase.execute();
    return {
      message: 'Todas as transações foram apagadas com sucesso.',
    };
  }
}
