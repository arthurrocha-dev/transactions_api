import { Controller, Get } from '@nestjs/common';
import { GetStatisticsUseCase } from 'src/core/use-cases/statistics/get-statistics.usecase';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

  @Throttle({ default: { limit: 5, ttl: 30 } })
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
    return this.getStatisticsUseCase.execute();
  }
}
