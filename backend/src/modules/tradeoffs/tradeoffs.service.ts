/*
 * ===========================================================================
 * Tradeoffs Service - Serviço da Entidade Principal
 * ===========================================================================
 *
 * Implementa a lógica de negócio para gerenciamento de tradeoffs.
 *
 * Funcionalidades:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Paginação com metadados (total, páginas, etc.)
 * - Busca por nome (filtro parcial, case-insensitive)
 * - Filtros por faixa de scores
 * - Associação com o usuário autenticado (multi-tenant)
 *
 * Regra de negócio:
 * Cada tradeoff pertence a um usuário. Um usuário só pode ver,
 * editar e deletar seus próprios tradeoffs.
 * ===========================================================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTradeoffDto } from './dto/create-tradeoff.dto';
import { UpdateTradeoffDto } from './dto/update-tradeoff.dto';
import { QueryTradeoffDto } from './dto/query-tradeoff.dto';

@Injectable()
export class TradeoffsService {
  constructor(private readonly prisma: PrismaService) { }

  /*
   * Cria um novo tradeoff associado ao usuário autenticado.
   *
   * @param createDto - Dados do tradeoff (nome + scores)
   * @param userId - ID do usuário autenticado (do token JWT)
   * @returns O tradeoff criado
   */
  async create(createDto: CreateTradeoffDto, userId: string) {
    return this.prisma.tradeoff.create({
      data: {
        name: createDto.name,
        qualityScore: createDto.qualityScore,
        lowPriceScore: createDto.lowPriceScore,
        speedScore: createDto.speedScore,
        userId: userId,
      },
    });
  }

  /*
   * Lista tradeoffs do usuário com paginação, busca e filtros.
   *
   * Parâmetros de query:
   * - page: Página atual (padrão: 1)
   * - limit: Itens por página (padrão: 10, máx: 100)
   * - search: Busca parcial por nome
   * - minQuality/maxQuality: Filtro por range de qualidade
   * - minPrice/maxPrice: Filtro por range de preço
   * - minSpeed/maxSpeed: Filtro por range de velocidade
   * - sortBy: Campo para ordenação
   * - sortOrder: Direção (asc/desc)
   *
   * @param query - Parâmetros de consulta
   * @param userId - ID do usuário autenticado
   * @returns Objeto com dados paginados + metadados
   */
  async findAll(query: QueryTradeoffDto, userId: string) {
    const {
      page = 1,
      limit = 10,
      search,
      minQuality,
      maxQuality,
      minPrice,
      maxPrice,
      minSpeed,
      maxSpeed,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Monta o filtro WHERE dinamicamente baseado nos parâmetros
    const where: Record<string, unknown> = {
      userId, // Filtra apenas tradeoffs do usuário logado
    };

    // Busca parcial por nome (case-insensitive)
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filtros por range de scores
    if (minQuality !== undefined || maxQuality !== undefined) {
      where.qualityScore = {
        ...(minQuality !== undefined && { gte: minQuality }),
        ...(maxQuality !== undefined && { lte: maxQuality }),
      };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.lowPriceScore = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }
    if (minSpeed !== undefined || maxSpeed !== undefined) {
      where.speedScore = {
        ...(minSpeed !== undefined && { gte: minSpeed }),
        ...(maxSpeed !== undefined && { lte: maxSpeed }),
      };
    }

    // Calcula o offset para paginação
    const skip = (page - 1) * limit;

    // Executa consulta e contagem em paralelo para performance
    const [items, total] = await Promise.all([
      this.prisma.tradeoff.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.tradeoff.count({ where }),
    ]);

    // Calcula metadados de paginação
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /*
   * Busca um tradeoff específico pelo ID.
   * Verifica se pertence ao usuário autenticado.
   *
   * @param id - UUID do tradeoff
   * @param userId - ID do usuário autenticado
   * @returns O tradeoff encontrado
   * @throws NotFoundException se não encontrado ou não pertencer ao usuário
   */
  async findOne(id: string, userId: string) {
    const tradeoff = await this.prisma.tradeoff.findFirst({
      where: { id, userId },
    });

    if (!tradeoff) {
      throw new NotFoundException(`Tradeoff com ID "${id}" não encontrado`);
    }

    return tradeoff;
  }

  /*
   * Atualiza um tradeoff existente.
   * Apenas o proprietário pode atualizar.
   *
   * @param id - UUID do tradeoff
   * @param updateDto - Campos a atualizar (parcial)
   * @param userId - ID do usuário autenticado
   * @returns O tradeoff atualizado
   * @throws NotFoundException se não encontrado
   */
  async update(id: string, updateDto: UpdateTradeoffDto, userId: string) {
    // Verifica se o tradeoff existe e pertence ao usuário
    await this.findOne(id, userId);

    return this.prisma.tradeoff.update({
      where: { id },
      data: updateDto,
    });
  }

  /*
   * Remove um tradeoff do banco de dados.
   * Apenas o proprietário pode deletar.
   *
   * @param id - UUID do tradeoff
   * @param userId - ID do usuário autenticado
   * @returns O tradeoff removido
   * @throws NotFoundException se não encontrado
   */
  async remove(id: string, userId: string) {
    // Verifica se o tradeoff existe e pertence ao usuário
    await this.findOne(id, userId);

    return this.prisma.tradeoff.delete({
      where: { id },
    });
  }
}
