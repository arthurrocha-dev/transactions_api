import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    console.log(`[${new Date().toISOString()}] /health endpoint called`);
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
