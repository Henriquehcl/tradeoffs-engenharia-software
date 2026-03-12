/*
 * ===========================================================================
 * Database Module - Módulo de Banco de Dados
 * ===========================================================================
 *
 * Encapsula o Prisma Client como um módulo NestJS reutilizável.
 * O PrismaService é exportado globalmente para que todos os módulos
 * possam injetar a conexão com o banco de dados.
 *
 * Padrão utilizado: Singleton
 * O Prisma Client mantém um pool de conexões que é reutilizado
 * em toda a aplicação, evitando overhead de reconexão.
 * ===========================================================================
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna o módulo disponível globalmente sem precisar importar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule { }
