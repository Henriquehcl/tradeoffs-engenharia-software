/*
 * ===========================================================================
 * Users Module - Módulo de Usuários
 * ===========================================================================
 *
 * Módulo responsável pelo gerenciamento de usuários.
 * Exporta o UsersService para que outros módulos (como Auth) possam
 * utilizá-lo para criar e buscar usuários.
 * ===========================================================================
 */

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporta para uso no AuthModule
})
export class UsersModule { }
