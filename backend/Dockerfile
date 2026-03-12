# ===========================================================================
# Backend - NestJS + Prisma
# ===========================================================================

FROM node:20-alpine

WORKDIR /app

# Prisma precisa de openssl no alpine
RUN apk add --no-cache openssl

# Copia arquivos de dependência primeiro (melhor cache)
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia schema do prisma
COPY prisma ./prisma

# Gera Prisma Client
RUN npx prisma generate

# Copia restante do projeto
COPY . .

# Compila NestJS
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]