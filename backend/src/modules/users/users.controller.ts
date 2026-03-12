/*
 * ===========================================================================
 * Users Controller - Endpoints de Usuários
 * ===========================================================================
 *
 * Endpoints protegidos para gerenciamento de usuários.
 * Todas as rotas requerem autenticação via JWT.
 * ===========================================================================
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard) // Todas as rotas deste controller requerem autenticação
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /*
   * Lista todos os usuários do sistema.
   * Retorna apenas dados não-sensíveis (sem senha).
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna a lista de todos os usuários cadastrados (sem senhas).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async findAll() {
    return this.usersService.findAll();
  }
}
