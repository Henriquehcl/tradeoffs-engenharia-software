/*
 * ===========================================================================
 * Create Tradeoff DTO - Dados para Criação
 * ===========================================================================
 *
 * Valida os dados necessários para criar um novo tradeoff.
 * Cada score deve estar entre 0 e 100.
 * ===========================================================================
 */

import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeoffDto {
  @ApiProperty({
    description: 'Nome descritivo do cenário de tradeoff',
    example: 'MVP Startup - Rápido e Barato',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Score de qualidade (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: 'Score de qualidade deve ser um número inteiro' })
  @Min(0, { message: 'Score de qualidade deve ser no mínimo 0' })
  @Max(100, { message: 'Score de qualidade deve ser no máximo 100' })
  qualityScore: number;

  @ApiProperty({
    description: 'Score de preço baixo (0-100)',
    example: 60,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: 'Score de preço deve ser um número inteiro' })
  @Min(0, { message: 'Score de preço deve ser no mínimo 0' })
  @Max(100, { message: 'Score de preço deve ser no máximo 100' })
  lowPriceScore: number;

  @ApiProperty({
    description: 'Score de velocidade (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: 'Score de velocidade deve ser um número inteiro' })
  @Min(0, { message: 'Score de velocidade deve ser no mínimo 0' })
  @Max(100, { message: 'Score de velocidade deve ser no máximo 100' })
  speedScore: number;
}
