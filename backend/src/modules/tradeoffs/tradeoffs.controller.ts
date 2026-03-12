/*
 * ===========================================================================
 * Tradeoffs Controller - Endpoints da Entidade Principal
 * ===========================================================================
 *
 * Controller que expõe os endpoints CRUD para a entidade Tradeoff.
 * Todas as rotas são protegidas pelo JwtAuthGuard.
 *
 * O nome da rota segue o nome completo da entidade solicitada:
 * /api/seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga
 *
 * Endpoints:
 * - POST   / → Criar tradeoff
 * - GET    / → Listar tradeoffs (com paginação, busca e filtros)
 * - GET    /:id → Obter tradeoff específico
 * - PATCH  /:id → Atualizar tradeoff
 * - DELETE /:id → Remover tradeoff
 * ===========================================================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TradeoffsService } from './tradeoffs.service';
import { CreateTradeoffDto } from './dto/create-tradeoff.dto';
import { UpdateTradeoffDto } from './dto/update-tradeoff.dto';
import { QueryTradeoffDto } from './dto/query-tradeoff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Tradeoffs')
@Controller('seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TradeoffsController {
  constructor(private readonly tradeoffsService: TradeoffsService) { }

  /*
   * Cria um novo tradeoff.
   * O tradeoff é associado automaticamente ao usuário autenticado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo tradeoff',
    description:
      'Cria um registro de tradeoff com nome e scores de qualidade, preço e velocidade. ' +
      'O registro é automaticamente associado ao usuário autenticado.',
  })
  @ApiResponse({ status: 201, description: 'Tradeoff criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(
    @Body() createDto: CreateTradeoffDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.tradeoffsService.create(createDto, req.user.sub);
  }

  /*
   * Lista tradeoffs do usuário autenticado.
   * Suporta paginação, busca por nome e filtros por scores.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar tradeoffs',
    description:
      'Lista os tradeoffs do usuário com suporte a paginação, busca e filtros por scores.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Busca por nome' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo para ordenação' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'asc ou desc' })
  @ApiResponse({ status: 200, description: 'Lista de tradeoffs retornada com sucesso' })
  findAll(
    @Query() query: QueryTradeoffDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.tradeoffsService.findAll(query, req.user.sub);
  }

  /*
   * Busca um tradeoff específico pelo ID.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obter tradeoff por ID',
    description: 'Retorna um tradeoff específico do usuário autenticado.',
  })
  @ApiParam({ name: 'id', description: 'UUID do tradeoff' })
  @ApiResponse({ status: 200, description: 'Tradeoff encontrado' })
  @ApiResponse({ status: 404, description: 'Tradeoff não encontrado' })
  findOne(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.tradeoffsService.findOne(id, req.user.sub);
  }

  /*
   * Atualiza um tradeoff existente.
   * Permite atualização parcial (apenas campos enviados são modificados).
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar tradeoff',
    description: 'Atualiza parcialmente um tradeoff do usuário autenticado.',
  })
  @ApiParam({ name: 'id', description: 'UUID do tradeoff' })
  @ApiResponse({ status: 200, description: 'Tradeoff atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tradeoff não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTradeoffDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.tradeoffsService.update(id, updateDto, req.user.sub);
  }

  /*
   * Remove um tradeoff do sistema.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletar tradeoff',
    description: 'Remove permanentemente um tradeoff do usuário autenticado.',
  })
  @ApiParam({ name: 'id', description: 'UUID do tradeoff' })
  @ApiResponse({ status: 200, description: 'Tradeoff removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Tradeoff não encontrado' })
  remove(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.tradeoffsService.remove(id, req.user.sub);
  }
}
