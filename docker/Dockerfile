FROM oven/bun:1.1 AS base
WORKDIR /app

# Camada apenas de dependências para cache eficiente
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Camada final da aplicação
FROM base AS app
ENV NODE_ENV=production
COPY package.json bun.lock* ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["bun", "index.ts"]
