/*
 * ===========================================================================
 * Logging Interceptor - Interceptor de Log de Requisições
 * ===========================================================================
 *
 * Intercepta todas as requisições HTTP para registrar:
 * - Método HTTP e URL da requisição
 * - Tempo de resposta (em milissegundos)
 * - Status da resposta
 *
 * Utiliza o padrão Observer (via RxJS tap) para observar a resposta
 * sem modificá-la, apenas adicionando logs.
 *
 * Fluxo:
 * Request → [LOG: início] → Handler → [LOG: fim + tempo] → Response
 * ===========================================================================
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  /*
   * Intercepta a requisição, registra o início e o tempo de resposta.
   *
   * @param context - Contexto de execução com informações da requisição
   * @param next - Handler que encaminha para o próximo interceptor/controller
   * @returns Observable com a resposta, após log de tempo
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    // Log do início da requisição
    this.logger.log(`→ ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        // Log do fim da requisição com tempo de resposta
        const responseTime = Date.now() - now;
        this.logger.log(`← ${method} ${url} - ${responseTime}ms`);
      }),
    );
  }
}
