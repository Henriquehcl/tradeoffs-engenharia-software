/*
 * ===========================================================================
 * API Service - Cliente HTTP (Axios)
 * ===========================================================================
 *
 * Configura uma instância do Axios com:
 * - Base URL do backend
 * - Headers padrão (Content-Type: application/json)
 * - Timeout de 10 segundos
 *
 * Nota: O header Authorization é configurado dinamicamente
 * pelo AuthContext após o login.
 * ===========================================================================
 */

import axios from 'axios';

/*
 * Instância configurada do Axios para comunicação com o backend.
 *
 * Em desenvolvimento (Vite):
 * - O proxy no vite.config.ts redireciona /api para localhost:3001
 * - Não precisa de baseURL absoluta
 *
 * Em produção (Docker/nginx):
 * - O nginx no frontend faz proxy de /api para o container backend
 * - Requisições vão para a mesma origem (sem CORS)
 */
export const api = axios.create({
  baseURL: '', // Usa proxy do Vite (dev) ou nginx (prod)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Interface da resposta paginada do backend.
 * Utilizada para tipar as respostas de listagem.
 */
export interface PaginatedResponse<T> {
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  statusCode: number;
  timestamp: string;
}

/*
 * Interface da entidade Tradeoff retornada pela API.
 */
export interface Tradeoff {
  id: string;
  name: string;
  qualityScore: number;
  lowPriceScore: number;
  speedScore: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/*
 * Interface para criação/atualização de tradeoff.
 */
export interface TradeoffFormData {
  name: string;
  qualityScore: number;
  lowPriceScore: number;
  speedScore: number;
}
