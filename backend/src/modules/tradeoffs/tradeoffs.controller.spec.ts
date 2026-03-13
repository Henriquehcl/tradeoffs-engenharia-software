/*
 * ===========================================================================
 * Tradeoffs Controller - Testes Unitários
 * ===========================================================================
 *
 * Testes do controller de tradeoffs:
 * - Endpoint de criação
 * - Endpoint de listagem
 * - Endpoint de busca por ID
 * - Endpoint de atualização
 * - Endpoint de deleção
 * ===========================================================================
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TradeoffsController } from './tradeoffs.controller';
import { TradeoffsService } from './tradeoffs.service';

describe('TradeoffsController', () => {
  let controller: TradeoffsController;
  let service: TradeoffsService;

  const mockTradeoffsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const userId = 'user-uuid-123';
  const tradeoffId = 'tradeoff-uuid-456';

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

  const mockRequest = { user: { sub: userId } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeoffsController],
      providers: [{ provide: TradeoffsService, useValue: mockTradeoffsService }],
    }).compile();

    controller = module.get<TradeoffsController>(TradeoffsController);
    service = module.get<TradeoffsService>(TradeoffsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    /*
     * Teste: Endpoint POST deve criar tradeoff e retornar resultado.
     */
    it('deve chamar TradeoffsService.create com dados corretos', async () => {
      const createDto = {
        name: 'MVP Rápido',
        qualityScore: 30,
        lowPriceScore: 90,
        speedScore: 85,
      };
      mockTradeoffsService.create.mockResolvedValue(mockTradeoff);

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(createDto, userId);
      expect(result).toEqual(mockTradeoff);
    });
  });

  describe('findAll', () => {
    /*
     * Teste: Endpoint GET deve listar tradeoffs com paginação.
     */
    it('deve chamar TradeoffsService.findAll com query e userId', async () => {
      const query = { page: 1, limit: 10 };
      const paginatedResult = {
        items: [mockTradeoff],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      };
      mockTradeoffsService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(query, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(query, userId);
      expect(result.items).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    /*
     * Teste: Endpoint GET /:id deve retornar um tradeoff específico.
     */
    it('deve chamar TradeoffsService.findOne com id e userId', async () => {
      mockTradeoffsService.findOne.mockResolvedValue(mockTradeoff);

      const result = await controller.findOne(tradeoffId, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(tradeoffId, userId);
      expect(result).toEqual(mockTradeoff);
    });
  });

  describe('update', () => {
    /*
     * Teste: Endpoint PATCH /:id deve atualizar campos parcialmente.
     */
    it('deve chamar TradeoffsService.update com dados corretos', async () => {
      const updateDto = { name: 'Atualizado' };
      const updated = { ...mockTradeoff, name: 'Atualizado' };
      mockTradeoffsService.update.mockResolvedValue(updated);

      const result = await controller.update(tradeoffId, updateDto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(tradeoffId, updateDto, userId);
      expect(result.name).toBe('Atualizado');
    });
  });

  describe('remove', () => {
    /*
     * Teste: Endpoint DELETE /:id deve remover o tradeoff.
     */
    it('deve chamar TradeoffsService.remove com id e userId', async () => {
      mockTradeoffsService.remove.mockResolvedValue(mockTradeoff);

      const result = await controller.remove(tradeoffId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(tradeoffId, userId);
      expect(result).toEqual(mockTradeoff);
    });
  });
});
