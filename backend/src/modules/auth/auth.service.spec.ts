/*
 * ===========================================================================
 * Auth Service - Testes Unitários
 * ===========================================================================
 *
 * Testes que cobrem a lógica de autenticação:
 * - Registro de novo usuário
 * - Prevenção de registro com email duplicado
 * - Login com credenciais válidas
 * - Rejeição de login com credenciais inválidas
 * - Geração correta de tokens JWT
 * ===========================================================================
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

// Mock do bcrypt para controlar o comportamento nos testes
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Mock do UsersService para isolar a lógica do AuthService
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  // Mock do JwtService para verificar a geração de tokens
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  // Configuração do módulo de teste antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Limpa os mocks entre testes para evitar interferência
    jest.clearAllMocks();
  });

  describe('register', () => {
    /*
     * Teste: Registro de novo usuário deve funcionar corretamente.
     * Verifica que:
     * 1. A senha é hashada com bcrypt
     * 2. O usuário é criado no banco
     * 3. Um token JWT é retornado
     */
    it('deve registrar um novo usuário e retornar token', async () => {
      const registerDto = { email: 'test@test.com', password: 'senha123' };
      const hashedPassword = 'hashed-password';
      const createdUser = { id: 'uuid-123', email: 'test@test.com', password: hashedPassword };

      // Configura os mocks
      mockUsersService.findByEmail.mockResolvedValue(null); // Email não existe
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      // Verifica o resultado
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: hashedPassword,
      });
    });

    /*
     * Teste: Registro com email já cadastrado deve lançar ConflictException.
     */
    it('deve lançar ConflictException se email já estiver cadastrado', async () => {
      const registerDto = { email: 'existing@test.com', password: 'senha123' };
      mockUsersService.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(authService.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    /*
     * Teste: Login com credenciais válidas deve retornar token.
     */
    it('deve autenticar usuário e retornar token', async () => {
      const loginDto = { email: 'test@test.com', password: 'senha123' };
      const user = { id: 'uuid-123', email: 'test@test.com', password: 'hashed' };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@test.com');
    });

    /*
     * Teste: Login com email inexistente deve lançar UnauthorizedException.
     */
    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'wrong@test.com', password: 'senha123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    /*
     * Teste: Login com senha incorreta deve lançar UnauthorizedException.
     */
    it('deve lançar UnauthorizedException se senha estiver incorreta', async () => {
      const user = { id: 'uuid-123', email: 'test@test.com', password: 'hashed' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
