/*
 * ===========================================================================
 * Auth Controller - Endpoints de Autenticação
 * ===========================================================================
 *
 * Controller responsável pelos endpoints públicos de autenticação.
 *
 * Endpoints:
 * - POST /api/auth/register → Registro de novo usuário
 * - POST /api/auth/login → Login de usuário existente
 * - GET /api/auth/profile → Retorna dados do usuário autenticado
 *
 * Swagger:
 * Todos os endpoints são documentados com decorators do @nestjs/swagger
 * para geração automática da documentação OpenAPI.
 * ===========================================================================
 */

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth') // Agrupa endpoints no Swagger sob a tag "Auth"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /*
   * Registra um novo usuário no sistema.
   *
   * Recebe email e senha, cria o usuário com senha hashada
   * e retorna um token JWT para acesso imediato.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário e retorna um token JWT de acesso.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso. Retorna token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: { id: 'uuid', email: 'usuario@email.com' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /*
   * Autentica um usuário existente.
   *
   * Valida email e senha, e retorna um token JWT se as credenciais
   * estiverem corretas.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Autentica o usuário com email e senha, retorna token JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: { id: 'uuid', email: 'usuario@email.com' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /*
   * Retorna os dados do usuário autenticado.
   *
   * Rota protegida pelo JwtAuthGuard — requer token válido
   * no header Authorization: Bearer <token>.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description: 'Retorna os dados do usuário com base no token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário autenticado',
    schema: {
      example: { id: 'uuid', email: 'usuario@email.com' },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  getProfile(@Request() req: { user: { sub: string; email: string } }) {
    return {
      id: req.user.sub,
      email: req.user.email,
    };
  }
}
