/*
 * ===========================================================================
 * Update Tradeoff DTO - Dados para Atualização
 * ===========================================================================
 *
 * Permite atualização parcial de um tradeoff.
 * Todos os campos são opcionais (partial update).
 * ===========================================================================
 */

import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTradeoffDto {
  @ApiPropertyOptional({
    description: 'Nome descritivo do cenário de tradeoff',
    example: 'Projeto Atualizado',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Score de qualidade (0-100)',
    example: 80,
  })
  @IsOptional()
  @IsInt({ message: 'Score de qualidade deve ser um número inteiro' })
  @Min(0, { message: 'Score de qualidade deve ser no mínimo 0' })
  @Max(100, { message: 'Score de qualidade deve ser no máximo 100' })
  qualityScore?: number;

  @ApiPropertyOptional({
    description: 'Score de preço baixo (0-100)',
    example: 50,
  })
  @IsOptional()
  @IsInt({ message: 'Score de preço deve ser um número inteiro' })
  @Min(0, { message: 'Score de preço deve ser no mínimo 0' })
  @Max(100, { message: 'Score de preço deve ser no máximo 100' })
  lowPriceScore?: number;

  @ApiPropertyOptional({
    description: 'Score de velocidade (0-100)',
    example: 70,
  })
  @IsOptional()
  @IsInt({ message: 'Score de velocidade deve ser um número inteiro' })
  @Min(0, { message: 'Score de velocidade deve ser no mínimo 0' })
  @Max(100, { message: 'Score de velocidade deve ser no máximo 100' })
  speedScore?: number;
}
