import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { CreateTransactionUseCase } from '../../../core/use-cases/transaction/create-transaction.usecase';
import { ApiTags } from '@nestjs/swagger';
import { DeleteAllTransactionsUseCase } from '../../../core/use-cases/transaction/delete-all-transactions.usecase';
import { GetAllTransactionsUseCase } from '../../../core/use-cases/transaction/get-all-transactions.usecase';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PinoLogger } from 'src/services/pino-logger.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly logger: PinoLogger,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get()
  getAll() {
    this.logger.log('Buscando todas as transações');

    return this.getAllTransactionsUseCase.execute();
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateTransactionDto) {
    this.logger.log(
      `Criando transação: amount=${body.amount}, timestamp=${body.timestamp}`,
    );

    const timestamp = new Date(body.timestamp);
    this.createTransactionUseCase.execute(body.amount, timestamp);

    this.logger.log('Transação criada com sucesso.');

    return {
      message: 'Transação aceita e registrada.',
      data: {
        amount: body.amount,
        timestamp,
      },
    };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteAll() {
    this.logger.warn('Deletando todas as transações');

    this.deleteAllTransactionsUseCase.execute();

    this.logger.log('Todas as transações foram apagadas.');

    return {
      message: 'Todas as transações foram apagadas com sucesso.',
    };
  }
}
