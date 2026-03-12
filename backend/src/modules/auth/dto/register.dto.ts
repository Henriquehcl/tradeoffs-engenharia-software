/*
 * ===========================================================================
 * Register DTO - Data Transfer Object para Registro
 * ===========================================================================
 *
 * Define e valida os dados necessários para criar uma nova conta.
 * Herda os mesmos campos do LoginDto (email + senha) mas pode
 * ser estendido com campos adicionais no futuro (nome, etc.).
 * ===========================================================================
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do novo usuário (deve ser único)',
    example: 'novousuario@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do novo usuário (mínimo 6 caracteres)',
    example: 'minhasenha123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
