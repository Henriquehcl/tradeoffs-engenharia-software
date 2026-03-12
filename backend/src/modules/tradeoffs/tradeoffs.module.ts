/*
 * ===========================================================================
 * Tradeoffs Module - Módulo da Entidade Principal
 * ===========================================================================
 *
 * Módulo que gerencia a entidade "Tradeoff", representando o conceito:
 * "Se uma mesa possui três pernas chamadas qualidade, preço baixo e
 *  velocidade, ela seria capenga."
 *
 * Este módulo implementa o CRUD completo com:
 * - Paginação
 * - Busca por nome
 * - Filtros por scores
 * - Proteção via JWT
 * - Documentação Swagger
 *
 * A tabela no banco é mapeada como:
 * seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga
 * ===========================================================================
 */

import { Module } from '@nestjs/common';
import { TradeoffsService } from './tradeoffs.service';
import { TradeoffsController } from './tradeoffs.controller';

@Module({
  controllers: [TradeoffsController],
  providers: [TradeoffsService],
  exports: [TradeoffsService],
})
export class TradeoffsModule { }
