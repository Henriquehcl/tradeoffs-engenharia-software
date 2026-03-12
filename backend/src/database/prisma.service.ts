/*
 * ===========================================================================
 * Prisma Service - Serviço de Conexão com Banco de Dados
 * ===========================================================================
 *
 * Wrapper do Prisma Client como serviço injetável do NestJS.
 *
 * Implementa o lifecycle hook OnModuleInit para conectar automaticamente
 * ao banco quando o módulo é inicializado, e OnModuleDestroy para
 * desconectar graciosamente quando a aplicação é encerrada.
 *
 * Este serviço é injetado em todos os services que precisam
 * acessar o banco de dados.
 * ===========================================================================
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /*
   * Conecta ao banco de dados quando o módulo é inicializado.
   * Chamado automaticamente pelo NestJS durante o bootstrap.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /*
   * Desconecta do banco de dados quando o módulo é destruído.
   * Garante que conexões não fiquem abertas (graceful shutdown).
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
