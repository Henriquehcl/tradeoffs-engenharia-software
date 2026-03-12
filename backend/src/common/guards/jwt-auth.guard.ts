/*
 * ===========================================================================
 * JWT Auth Guard - Proteção de Rotas
 * ===========================================================================
 *
 * Guard que protege rotas que requerem autenticação.
 * Herda do AuthGuard do Passport e implementa a estratégia 'jwt'.
 *
 * Fluxo de autenticação:
 * 1. Requisição chega ao guard
 * 2. Guard extrai o token JWT do header Authorization
 * 3. JwtStrategy valida e decodifica o token
 * 4. Se válido, o payload do token é injetado em request.user
 * 5. Se inválido, retorna 401 Unauthorized
 *
 * Uso nos controllers:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * getProtected() { ... }
 * ===========================================================================
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /*
   * Callback chamado após a validação do token.
   * Se houver erro ou o usuário não for encontrado, lança 401.
   *
   * @param err - Erro durante a validação (se houver)
   * @param user - Payload do token decodificado
   * @returns O objeto do usuário se autenticado com sucesso
   */
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
