/*
 * ===========================================================================
 * Transform Interceptor - Padronização de Respostas
 * ===========================================================================
 *
 * Intercepta todas as respostas da API e as encapsula em um formato
 * padronizado, facilitando o consumo pelo frontend.
 *
 * Formato da resposta:
 * {
 *   data: { ... },       // Dados retornados pelo controller
 *   statusCode: 200,     // Código HTTP
 *   timestamp: "..."     // Momento da resposta
 * }
 *
 * Benefícios:
 * - Respostas consistentes em toda a API
 * - Frontend pode confiar no formato da resposta
 * - Facilita tratamento de erros no cliente
 * ===========================================================================
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
 * Interface que define o formato padrão de resposta da API.
 */
export interface ResponseFormat<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  /*
   * Intercepta a resposta e a envolve no formato padronizado.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
