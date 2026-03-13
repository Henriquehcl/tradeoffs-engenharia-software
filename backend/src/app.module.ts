/*
 * ===========================================================================
 * App Module - Módulo Raiz da Aplicação
 * ===========================================================================
 *
 * Este é o módulo principal que compõe toda a aplicação NestJS.
 * Segue o princípio de modularização, importando cada feature module
 * separadamente para manter a organização e separação de responsabilidades.
 *
 * Módulos importados:
 * - ConfigModule: Gerenciamento de variáveis de ambiente
 * - DatabaseModule: Conexão com PostgreSQL via Prisma
 * - AuthModule: Autenticação JWT (login, registro, guards)
 * - UsersModule: Gerenciamento de usuários
 * - TradeoffsModule: CRUD da entidade principal
 * ===========================================================================
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TradeoffsModule } from './modules/tradeoffs/tradeoffs.module';
import { JokesModule } from './modules/jokes/jokes.module';

@Module({
  imports: [
    // Carrega variáveis de ambiente do arquivo .env
    // isGlobal: true torna as configs acessíveis em todos os módulos
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Módulo de banco de dados (Prisma)
    DatabaseModule,

    // Módulos de funcionalidade (feature modules)
    AuthModule,
    UsersModule,
    TradeoffsModule,
    JokesModule,
  ],
})
export class AppModule { }
