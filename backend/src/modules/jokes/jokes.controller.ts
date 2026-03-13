/*
 * Jokes Controller - Endpoint de Piadas
 *
 * Endpoint protegido que retorna uma piada geek aleatória
 * consumindo a API externa via JokesService.
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JokesService } from './jokes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Jokes')
@Controller('jokes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter piada geek aleatória',
    description:
      'Retorna uma piada geek aleatória consumida da API externa. ' +
      'O frontend NÃO deve chamar a API externa diretamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Piada retornada com sucesso',
    schema: { example: { joke: 'Why do programmers prefer dark mode? Because light attracts bugs!' } },
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  getJoke() {
    return this.jokesService.getJoke();
  }
}
