-- CreateMigration
-- Migração inicial: cria as tabelas users e tradeoffs

-- Tabela de usuários para autenticação JWT
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Tabela principal: tradeoffs de engenharia
-- Representa o conceito "mesa com três pernas" (qualidade, preço, velocidade)
CREATE TABLE "tradeoffs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quality_score" INTEGER NOT NULL,
    "low_price_score" INTEGER NOT NULL,
    "speed_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tradeoffs_pkey" PRIMARY KEY ("id")
);

-- Índice único no email para garantir unicidade
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Chave estrangeira: tradeoff pertence a um usuário
ALTER TABLE "tradeoffs"
    ADD CONSTRAINT "tradeoff_user_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
