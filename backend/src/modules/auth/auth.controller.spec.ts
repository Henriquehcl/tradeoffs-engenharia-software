/*
 * ===========================================================================
 * Auth Controller - Testes Unitários
 * ===========================================================================
 *
 * Testes do controller de autenticação:
 * - Endpoint de registro
 * - Endpoint de login
 * - Endpoint de perfil (protegido)
 * ===========================================================================
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    /*
     * Teste: Endpoint POST /auth/register deve chamar o AuthService
     * e retornar o token gerado.
     */
    it('deve chamar AuthService.register e retornar resultado', async () => {
      const dto = { email: 'test@test.com', password: 'senha123' };
      const expected = { access_token: 'token', user: { id: '1', email: 'test@test.com' } };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('login', () => {
    /*
     * Teste: Endpoint POST /auth/login deve validar credenciais
     * e retornar token.
     */
    it('deve chamar AuthService.login e retornar resultado', async () => {
      const dto = { email: 'test@test.com', password: 'senha123' };
      const expected = { access_token: 'token', user: { id: '1', email: 'test@test.com' } };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('getProfile', () => {
    /*
     * Teste: Endpoint GET /auth/profile deve retornar dados do usuário
     * do token JWT (injetado pelo guard).
     */
    it('deve retornar dados do usuário autenticado', () => {
      const req = { user: { sub: 'uuid-123', email: 'test@test.com' } };
      const result = controller.getProfile(req);

      expect(result).toEqual({ id: 'uuid-123', email: 'test@test.com' });
    });
  });
});
