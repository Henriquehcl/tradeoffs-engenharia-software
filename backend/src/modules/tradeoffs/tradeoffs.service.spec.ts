/*
 * ===========================================================================
 * Tradeoffs Service - Testes Unitários
 * ===========================================================================
 *
 * Testes que cobrem as operações CRUD do TradeoffsService:
 * - Criação de tradeoff
 * - Listagem com paginação
 * - Busca por ID
 * - Atualização parcial
 * - Deleção
 * - Tratamento de erros (not found)
 * ===========================================================================
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TradeoffsService } from './tradeoffs.service';
import { PrismaService } from '../../database/prisma.service';

describe('TradeoffsService', () => {
  let service: TradeoffsService;

  // Mock completo do PrismaService com as operações de tradeoff
  const mockPrisma = {
    tradeoff: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const userId = 'user-uuid-123';
  const tradeoffId = 'tradeoff-uuid-456';

  // Objeto de tradeoff de exemplo para os testes
  const mockTradeoff = {
    id: tradeoffId,
    name: 'MVP Rápido',
    qualityScore: 30,
    lowPriceScore: 90,
    speedScore: 85,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeoffsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TradeoffsService>(TradeoffsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    /*
     * Teste: Criação de tradeoff deve salvar no banco e retornar o objeto criado.
     */
    it('deve criar um tradeoff com sucesso', async () => {
      const createDto = {
        name: 'MVP Rápido',
        qualityScore: 30,
        lowPriceScore: 90,
        speedScore: 85,
      };
      mockPrisma.tradeoff.create.mockResolvedValue(mockTradeoff);

      const result = await service.create(createDto, userId);

      expect(result).toEqual(mockTradeoff);
      expect(mockPrisma.tradeoff.create).toHaveBeenCalledWith({
        data: { ...createDto, userId },
      });
    });
  });

  describe('findAll', () => {
    /*
     * Teste: Listagem deve retornar itens paginados com metadados.
     */
    it('deve listar tradeoffs com paginação', async () => {
      mockPrisma.tradeoff.findMany.mockResolvedValue([mockTradeoff]);
      mockPrisma.tradeoff.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 }, userId);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    /*
     * Teste: Busca por ID deve retornar o tradeoff se existir.
     */
    it('deve retornar um tradeoff pelo ID', async () => {
      mockPrisma.tradeoff.findFirst.mockResolvedValue(mockTradeoff);

      const result = await service.findOne(tradeoffId, userId);

      expect(result).toEqual(mockTradeoff);
    });

    /*
     * Teste: Busca por ID deve lançar NotFoundException se não encontrado.
     */
    it('deve lançar NotFoundException se tradeoff não existir', async () => {
      mockPrisma.tradeoff.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    /*
     * Teste: Atualização parcial deve modificar apenas os campos enviados.
     */
    it('deve atualizar um tradeoff com sucesso', async () => {
      const updateDto = { name: 'Atualizado' };
      mockPrisma.tradeoff.findFirst.mockResolvedValue(mockTradeoff);
      mockPrisma.tradeoff.update.mockResolvedValue({ ...mockTradeoff, ...updateDto });

      const result = await service.update(tradeoffId, updateDto, userId);

      expect(result.name).toBe('Atualizado');
    });
  });

  describe('remove', () => {
    /*
     * Teste: Deleção deve remover o tradeoff do banco.
     */
    it('deve deletar um tradeoff com sucesso', async () => {
      mockPrisma.tradeoff.findFirst.mockResolvedValue(mockTradeoff);
      mockPrisma.tradeoff.delete.mockResolvedValue(mockTradeoff);

      const result = await service.remove(tradeoffId, userId);

      expect(result).toEqual(mockTradeoff);
      expect(mockPrisma.tradeoff.delete).toHaveBeenCalledWith({ where: { id: tradeoffId } });
    });
  });
});
