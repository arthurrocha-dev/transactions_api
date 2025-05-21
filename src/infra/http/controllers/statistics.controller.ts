import { Controller, Get } from '@nestjs/common';
import { GetStatisticsUseCase } from '../../../core/use-cases/statistics/get-statistics.usecase';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PinoLogger } from 'src/services/pino-logger.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly logger: PinoLogger,
  ) {}

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Get()
  @ApiOperation({ summary: 'Retorna estatísticas das últimas 60s' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        count: 0,
        sum: 0.0,
        avg: 0.0,
        min: 0.0,
        max: 0.0,
      },
    },
  })
  getStatistics() {
    this.logger.log('Requisição para obter estatísticas iniciada');

    try {
      const stats = this.getStatisticsUseCase.execute();
      this.logger.log(`Estatísticas calculadas: ${JSON.stringify(stats)}`);
      return stats;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Erro ao obter estatísticas', error.stack);
      } else {
        this.logger.error('Erro ao obter estatísticas', String(error));
      }
      throw error;
    }
  }
}
