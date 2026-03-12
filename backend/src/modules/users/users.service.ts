/*
 * ===========================================================================
 * Users Service - Serviço de Gerenciamento de Usuários
 * ===========================================================================
 *
 * Responsável pelo acesso à camada de dados de usuários.
 * Encapsula as operações do Prisma Client para a entidade User.
 *
 * Métodos:
 * - create: Cria um novo usuário
 * - findByEmail: Busca usuário por email (login)
 * - findById: Busca usuário por ID (validação de token)
 * - findAll: Lista todos os usuários (admin)
 * ===========================================================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  /*
   * Cria um novo usuário no banco de dados.
   * A senha já deve vir hashada com bcrypt do AuthService.
   *
   * @param data - Email e senha hashada
   * @returns Usuário criado (sem senha no retorno)
   */
  async create(data: { email: string; password: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  /*
   * Busca um usuário pelo email.
   * Utilizado no processo de login para verificar credenciais.
   *
   * @param email - Email do usuário
   * @returns Usuário encontrado ou null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /*
   * Busca um usuário pelo ID (UUID).
   * Utilizado pela JwtStrategy para validar se o usuário do token ainda existe.
   *
   * @param id - UUID do usuário
   * @returns Usuário encontrado ou null
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /*
   * Lista todos os usuários do sistema.
   * Exclui o campo password do retorno por segurança.
   *
   * @returns Lista de usuários (sem senhas)
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
