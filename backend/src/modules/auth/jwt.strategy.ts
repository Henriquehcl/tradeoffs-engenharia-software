/*
 * ===========================================================================
 * JWT Strategy - Estratégia de Validação de Token
 * ===========================================================================
 *
 * Implementa a estratégia Passport para validação de tokens JWT.
 *
 * Fluxo de validação (executado automaticamente pelo JwtAuthGuard):
 * 1. Requisição chega com header "Authorization: Bearer <token>"
 * 2. Passport extrai o token do header (jwtFromRequest)
 * 3. Token é verificado com a chave secreta (secretOrKey)
 * 4. Se válido, o payload é passado para o método validate()
 * 5. O retorno de validate() é injetado em request.user
 *
 * Segurança:
 * - Tokens expirados são rejeitados automaticamente (ignoreExpiration: false)
 * - A chave secreta vem das variáveis de ambiente
 * ===========================================================================
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extrai o token do header Authorization (Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Não ignora tokens expirados — retorna 401
      ignoreExpiration: false,

      // Segredo para verificar a assinatura do token
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret'),
    });
  }

  /*
   * Valida o payload do token JWT decodificado.
   *
   * Este método é chamado automaticamente pelo Passport após
   * a verificação criptográfica do token. Aqui podemos fazer
   * validações adicionais, como verificar se o usuário ainda existe.
   *
   * @param payload - Payload decodificado do token JWT
   * @returns Objeto do usuário que será injetado em request.user
   * @throws UnauthorizedException se o usuário não existir mais
   */
  async validate(payload: JwtPayload) {
    // Verifica se o usuário do token ainda existe no banco
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Retorna apenas dados não-sensíveis para request.user
    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
