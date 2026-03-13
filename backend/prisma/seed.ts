/*
 * Seed do Banco de Dados
 * Cria o usuário inicial do sistema conforme requisito do teste técnico.
 * Usa upsert para ser idempotente (seguro de executar várias vezes).
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const email = 'cliente@incuca.com.br';
  const password = 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário inicial criado/verificado: ${user.email}`);
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
