/*
 * ===========================================================================
 * Seed do Banco de Dados
 * ===========================================================================
 *
 * Script para popular o banco de dados com dados iniciais de desenvolvimento.
 * Cria um usuário padrão e alguns tradeoffs de exemplo para facilitar
 * o desenvolvimento e testes.
 *
 * Executar com: npx prisma db seed
 * ===========================================================================
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Cria um usuário padrão para desenvolvimento
  const hashedPassword = await bcrypt.hash('senha123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@desafio.com' },
    update: {},
    create: {
      email: 'admin@desafio.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário criado: ${user.email}`);

  // Cria tradeoffs de exemplo que ilustram diferentes cenários
  const tradeoffs = [
    {
      name: 'MVP Startup - Rápido e Barato',
      qualityScore: 30,
      lowPriceScore: 90,
      speedScore: 85,
      userId: user.id,
    },
    {
      name: 'Produto Enterprise - Qualidade Máxima',
      qualityScore: 95,
      lowPriceScore: 20,
      speedScore: 25,
      userId: user.id,
    },
    {
      name: 'Hackathon - Velocidade Extrema',
      qualityScore: 15,
      lowPriceScore: 70,
      speedScore: 99,
      userId: user.id,
    },
    {
      name: 'Projeto Equilibrado',
      qualityScore: 65,
      lowPriceScore: 60,
      speedScore: 55,
      userId: user.id,
    },
    {
      name: 'Refatoração Planejada',
      qualityScore: 90,
      lowPriceScore: 40,
      speedScore: 45,
      userId: user.id,
    },
  ];

  for (const tradeoff of tradeoffs) {
    await prisma.tradeoff.create({ data: tradeoff });
  }

  console.log(`✅ ${tradeoffs.length} tradeoffs criados`);
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
