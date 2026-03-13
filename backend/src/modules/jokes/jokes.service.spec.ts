/*
 * Jokes Service - Testes Unitários
 *
 * Testa a integração com a API externa de piadas:
 * - Retorno bem-sucedido
 * - Fallback quando a API está indisponível
 * - Fallback quando a resposta não contém o campo "joke"
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JokesService } from './jokes.service';

const mockJoke = 'Why do programmers prefer dark mode? Because light attracts bugs!';

describe('JokesService', () => {
  let service: JokesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JokesService],
    }).compile();

    service = module.get<JokesService>(JokesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getJoke', () => {
    it('deve retornar piada da API externa quando disponível', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ joke: mockJoke }),
      } as Response);

      const result = await service.getJoke();

      expect(result.joke).toBe(mockJoke);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('deve retornar piada de fallback quando a API retorna status de erro', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({}),
      } as Response);

      const result = await service.getJoke();

      expect(result.joke).toBeTruthy();
      expect(typeof result.joke).toBe('string');
    });

    it('deve retornar piada de fallback quando a API lança exceção (rede indisponível)', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getJoke();

      expect(result.joke).toBeTruthy();
      expect(typeof result.joke).toBe('string');
    });

    it('deve retornar piada de fallback quando a resposta não tem campo "joke"', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ unexpected: 'format' }),
      } as Response);

      const result = await service.getJoke();

      expect(result.joke).toBeTruthy();
    });
  });
});
