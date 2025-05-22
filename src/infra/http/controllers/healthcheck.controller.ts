import { Controller, Get } from '@nestjs/common';
import { PinoLogger } from 'src/services/pino-logger.service';

@Controller('health')
export class HealthController {
  constructor(private readonly logger: PinoLogger) {}

  @Get()
  check() {
    this.logger.log(`[${new Date().toISOString()}] /health endpoint called`);
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
