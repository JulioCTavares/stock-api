FROM oven/bun:1.1 AS base
WORKDIR /usr/src/app

# Camada apenas de dependências para cache eficiente
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Camada final da aplicação
FROM base AS app
ENV NODE_ENV=production
COPY package.json bun.lock* ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 4000
CMD ["bun", "run", "src/presentation/http/app.ts"]
