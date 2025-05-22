// src/common/interceptors/prometheus.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter } from 'prom-client';
import type { Request, Response } from 'express';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  private httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const route = (req.route as { path?: string } | undefined)?.path || req.url;

    return next.handle().pipe(
      tap(() => {
        const res: Response = context.switchToHttp().getResponse<Response>();
        const statusCode = res.statusCode;
        this.httpRequestCounter
          .labels(method, route, statusCode.toString())
          .inc();
      }),
    );
  }
}
