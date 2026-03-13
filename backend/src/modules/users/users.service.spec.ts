/*
 * ===========================================================================
 * Users Service - Testes Unitários
 * ===========================================================================
 *
 * Testes do serviço de gerenciamento de usuários:
 * - Criar usuário
 * - Buscar por email
 * - Buscar por ID
 * - Listar todos os usuários
 * ===========================================================================
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockUser = {
    id: 'uuid-123',
    email: 'test@test.com',
    password: 'hashed-password',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    /*
     * Teste: Criação de usuário deve salvar no banco e retornar o objeto criado.
     */
    it('deve criar um usuário com sucesso', async () => {
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.create({
        email: 'test@test.com',
        password: 'hashed-password',
      });

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@test.com', password: 'hashed-password' },
      });
    });
  });

  describe('findByEmail', () => {
    /*
     * Teste: Busca por email deve retornar o usuário se existir.
     */
    it('deve retornar um usuário pelo email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    /*
     * Teste: Busca por email deve retornar null se não existir.
     */
    it('deve retornar null se usuário não existir', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    /*
     * Teste: Busca por ID deve retornar o usuário se existir.
     */
    it('deve retornar um usuário pelo ID', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('uuid-123');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
    });

    /*
     * Teste: Busca por ID deve retornar null se não existir.
     */
    it('deve retornar null se usuário não existir', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    /*
     * Teste: Listagem deve retornar usuários sem senhas.
     */
    it('deve listar todos os usuários sem o campo password', async () => {
      const usersWithoutPassword = [
        { id: 'uuid-123', email: 'test@test.com', createdAt: new Date() },
      ];
      mockPrisma.user.findMany.mockResolvedValue(usersWithoutPassword);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, email: true, createdAt: true },
      });
    });
  });
});
