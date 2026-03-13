/*
 * ===========================================================================
 * Config Module - Configurações Centralizadas
 * ===========================================================================
 *
 * Módulo de configuração centralizada da aplicação.
 * Exporta constantes e funções de configuração reutilizáveis.
 *
 * As configurações de ambiente são gerenciadas pelo ConfigModule
 * do NestJS (@nestjs/config) e acessíveis via ConfigService.
 *
 * Configurações disponíveis via .env:
 * - DATABASE_URL: URL de conexão com PostgreSQL
 * - JWT_SECRET: Chave secreta para assinar tokens JWT
 * - JWT_EXPIRATION: Tempo de expiração dos tokens (padrão: 24h)
 * - PORT: Porta do servidor HTTP (padrão: 3001)
 * ===========================================================================
 */

/**
 * Configurações padrão da aplicação.
 * Utilizadas como fallback quando variáveis de ambiente não estão definidas.
 */
export const appConfig = {
  /** Porta padrão do servidor */
  port: 3001,

  /** Expiração padrão do token JWT */
  jwtExpiration: '24h',

  /** Salt rounds para bcrypt */
  bcryptSaltRounds: 10,

  /** Limite padrão de paginação */
  defaultPageLimit: 10,

  /** Limite máximo de paginação */
  maxPageLimit: 100,
};
