/*
 * ===========================================================================
 * Auth Module - Módulo de Autenticação
 * ===========================================================================
 *
 * Módulo responsável por toda a autenticação do sistema.
 *
 * Componentes:
 * - AuthController: Endpoints de login e registro
 * - AuthService: Lógica de autenticação (validação, geração de token)
 * - JwtStrategy: Estratégia Passport para validação de tokens JWT
 *
 * Dependências:
 * - UsersModule: Para criar e buscar usuários
 * - JwtModule: Para gerar e verificar tokens JWT
 * - PassportModule: Framework de autenticação
 *
 * Fluxo de autenticação:
 * 1. POST /api/auth/register → Cria usuário + retorna token
 * 2. POST /api/auth/login → Valida credenciais + retorna token
 * 3. Rotas protegidas → JwtAuthGuard verifica token
 * ===========================================================================
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Importa o módulo de usuários para acessar UsersService
    UsersModule,

    // Configura o Passport com estratégia JWT como padrão
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configura o módulo JWT com segredo e expiração do .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '24h'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
