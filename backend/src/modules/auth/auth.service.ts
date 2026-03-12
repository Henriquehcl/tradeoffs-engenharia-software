/*
 * ===========================================================================
 * Auth Service - Lógica de Autenticação
 * ===========================================================================
 *
 * Serviço responsável pela lógica de negócio da autenticação.
 *
 * Responsabilidades:
 * - Registrar novos usuários (hash de senha + geração de token)
 * - Autenticar usuários existentes (validação de credenciais)
 * - Gerar tokens JWT
 *
 * Segurança:
 * - Senhas são hashadas com bcrypt (salt rounds: 10)
 * - Tokens JWT têm expiração configurável
 * - Credenciais inválidas retornam erro genérico (sem dica sobre campo incorreto)
 * ===========================================================================
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/*
 * Interface que define o payload armazenado no token JWT.
 * Contém apenas informações não-sensíveis necessárias para identificação.
 */
export interface JwtPayload {
  sub: string;   // ID do usuário (subject)
  email: string; // Email do usuário
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  /*
   * Registra um novo usuário no sistema.
   *
   * Fluxo:
   * 1. Verifica se o email já está cadastrado
   * 2. Hasheia a senha com bcrypt
   * 3. Cria o usuário no banco de dados
   * 4. Gera e retorna um token JWT
   *
   * @param registerDto - Dados de registro (email + senha)
   * @returns Token JWT de acesso
   * @throws ConflictException se o email já estiver cadastrado
   */
  async register(registerDto: RegisterDto) {
    // Verifica se já existe usuário com este email
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Hasheia a senha com bcrypt (10 salt rounds é o padrão recomendado)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Cria o usuário no banco de dados
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    // Gera o token JWT com o payload
    const token = this.generateToken(user.id, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /*
   * Autentica um usuário existente.
   *
   * Fluxo:
   * 1. Busca o usuário pelo email
   * 2. Compara a senha informada com o hash armazenado
   * 3. Se válido, gera e retorna um token JWT
   *
   * @param loginDto - Credenciais de login (email + senha)
   * @returns Token JWT de acesso
   * @throws UnauthorizedException se as credenciais forem inválidas
   */
  async login(loginDto: LoginDto) {
    // Busca o usuário pelo email
    const user = await this.usersService.findByEmail(loginDto.email);

    // Verifica se o usuário existe E se a senha confere
    // Mensagem genérica para não revelar se é o email ou a senha que está errada
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = this.generateToken(user.id, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /*
   * Gera um token JWT com o payload do usuário.
   *
   * O token contém:
   * - sub: ID do usuário (claim padrão JWT "subject")
   * - email: Email do usuário
   *
   * A expiração é configurada no JwtModule (padrão: 24h).
   *
   * @param userId - ID do usuário
   * @param email - Email do usuário
   * @returns Token JWT assinado
   */
  private generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };
    return this.jwtService.sign(payload);
  }
}
