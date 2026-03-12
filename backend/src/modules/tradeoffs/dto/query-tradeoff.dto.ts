/*
 * ===========================================================================
 * Query Tradeoff DTO - Parâmetros de Consulta
 * ===========================================================================
 *
 * Define e valida os parâmetros de query string para listagem de tradeoffs.
 * Inclui paginação, busca textual, filtros por range de scores e ordenação.
 * ===========================================================================
 */

import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryTradeoffDto {
  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Busca por nome (parcial, case-insensitive)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Score mínimo de qualidade' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minQuality?: number;

  @ApiPropertyOptional({ description: 'Score máximo de qualidade' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  maxQuality?: number;

  @ApiPropertyOptional({ description: 'Score mínimo de preço' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Score máximo de preço' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Score mínimo de velocidade' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minSpeed?: number;

  @ApiPropertyOptional({ description: 'Score máximo de velocidade' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  maxSpeed?: number;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    default: 'createdAt',
    enum: ['name', 'qualityScore', 'lowPriceScore', 'speedScore', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'qualityScore', 'lowPriceScore', 'speedScore', 'createdAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
