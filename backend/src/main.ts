/*
//backend/src/main.ts
 * ===========================================================================
 * Main Entry Point - NestJS Application
 * ===========================================================================
 *
 * Arquivo principal que inicializa a aplicação NestJS.
 *
 * Responsabilidades:
 * 1. Criar a instância da aplicação NestJS
 * 2. Configurar o Swagger (documentação OpenAPI)
 * 3. Habilitar validação global de DTOs
 * 4. Configurar CORS para comunicação com o frontend
 * 5. Iniciar o servidor HTTP na porta configurada
 *
 * Fluxo de execução:
 * main() → createApp → configureSwagger → enableCors → listen
 * ===========================================================================
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  // Cria a instância da aplicação NestJS com o módulo raiz
  const app = await NestFactory.create(AppModule);

  // Define o prefixo global '/api' para todas as rotas
  // Isso significa que todos os endpoints serão acessíveis em /api/...
  app.setGlobalPrefix('api');

  // Habilita CORS para permitir requisições do frontend (localhost:3000)
  // Em produção, configure origins específicos
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Configura validação global de DTOs usando class-validator
  // whitelist: remove propriedades não declaradas no DTO
  // forbidNonWhitelisted: lança erro se propriedades extras forem enviadas
  // transform: converte automaticamente payloads em instâncias dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Registra filtro global de exceções para respostas padronizadas
  app.useGlobalFilters(new HttpExceptionFilter());

  // Registra interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),    // Log de todas as requisições
    new TransformInterceptor(),  // Padroniza formato de resposta
  );

  // =============================================
  // Configuração do Swagger (OpenAPI)
  // =============================================
  // O Swagger gera documentação interativa da API automaticamente
  // Acessível em: http://localhost:3001/api/docs
  const config = new DocumentBuilder()
    .setTitle('Desafio Técnico - API')
    .setDescription(
      'API Fullstack do Desafio Técnico. ' +
      'Gerencia tradeoffs de engenharia baseado no conceito: ' +
      '"Se uma mesa possui três pernas chamadas qualidade, preço baixo e velocidade, ela seria capenga."',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido no login',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticação (login e registro)')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Tradeoffs', 'CRUD da entidade principal de tradeoffs')
    .addTag('Jokes', 'Integração com API de piadas geek (frontend → backend → API externa)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Inicia o servidor na porta configurada (padrão: 3001)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
  console.log(`📚 Swagger disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
