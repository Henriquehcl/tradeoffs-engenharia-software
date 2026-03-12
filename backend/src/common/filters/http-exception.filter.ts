/*
 * ===========================================================================
 * HTTP Exception Filter - Filtro Global de Exceções
 * ===========================================================================
 *
 * Captura todas as exceções HTTP lançadas pela aplicação e retorna
 * uma resposta padronizada em formato JSON.
 *
 * Benefícios:
 * - Respostas de erro consistentes em toda a API
 * - Logging centralizado de erros
 * - Stack traces não são expostos ao cliente em produção
 *
 * Formato da resposta de erro:
 * {
 *   statusCode: 400,
 *   message: "Mensagem de erro",
 *   error: "Bad Request",
 *   timestamp: "2024-01-01T00:00:00.000Z",
 *   path: "/api/tradeoffs"
 * }
 * ===========================================================================
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Captura TODAS as exceções (não apenas HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /*
   * Método principal que processa a exceção capturada.
   *
   * @param exception - A exceção lançada
   * @param host - Contexto da requisição (HTTP, WebSocket, etc.)
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determina o status code baseado no tipo da exceção
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extrai a mensagem de erro
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno do servidor';

    // Log do erro para debugging (apenas no servidor, não exposto ao cliente)
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    // Monta a resposta padronizada de erro
    const errorResponse = {
      statusCode: status,
      message: typeof message === 'string' ? message : (message as Record<string, unknown>).message || message,
      error: typeof message === 'string' ? message : (message as Record<string, unknown>).error || 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
