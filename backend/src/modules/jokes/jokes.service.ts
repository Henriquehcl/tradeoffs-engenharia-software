/*
 * Jokes Service - Integração com a API de Piadas Geek
 *
 * Consome a API externa de piadas e retorna uma piada aleatória.
 * Possui fallback caso a API externa esteja indisponível.
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class JokesService {
  private readonly JOKE_API_URL = 'https://geek-jokes.sameerkumar.website/api?format=json';

  private readonly FALLBACK_JOKES = [
    'Why do programmers prefer dark mode? Because light attracts bugs!',
    'A SQL query walks into a bar, walks up to two tables and asks... "Can I join you?"',
    'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
    'Why do Java developers wear glasses? Because they don\'t C#.',
    '!false – It\'s funny because it\'s true.',
  ];

  async getJoke(): Promise<{ joke: string }> {
    try {
      const response = await fetch(this.JOKE_API_URL, {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }

      const data = await response.json() as { joke?: string };

      if (!data.joke) {
        throw new Error('Formato de resposta inesperado da API');
      }

      return { joke: data.joke };
    } catch (error) {
      // Retorna piada de fallback se a API estiver indisponível
      const fallback = this.FALLBACK_JOKES[Math.floor(Math.random() * this.FALLBACK_JOKES.length)];
      return { joke: fallback };
    }
  }
}
