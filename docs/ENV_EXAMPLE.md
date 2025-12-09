# Arquivo .env.example

Copie este conteúdo para criar seu arquivo `.env` na raiz do projeto:

```env
# ============================================
# Environment Configuration
# ============================================
NODE_ENV=dev
PORT=4000

# ============================================
# PostgreSQL Configuration
# ============================================
# Opção 1: URL completa (prioridade - será usada se fornecida)
# Para Docker: use 'postgres' como host
# Para local: use 'localhost' como host
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db

# Opção 2: Variáveis individuais (usado se DATABASE_URL não fornecida)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=stock_db

# ============================================
# Redis Configuration
# ============================================
# Opção 1: URL completa (prioridade - será usada se fornecida)
# Para Docker: use 'redis' como host
# Para local: use 'localhost' como host
REDIS_URL=redis://localhost:6379

# Opção 2: Variáveis individuais (usado se REDIS_URL não fornecida)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# RabbitMQ Configuration
# ============================================
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# ============================================
# Docker Compose - URLs para uso dentro do Docker
# ============================================
# Descomente estas linhas se estiver rodando a aplicação DENTRO do Docker
# DATABASE_URL=postgresql://postgres:postgres@postgres:5432/stock_db
# REDIS_URL=redis://redis:6379
# POSTGRES_HOST=postgres
# REDIS_HOST=redis
```

## Como usar

1. Copie o arquivo `env.example` para `.env`:
   ```bash
   cp env.example .env
   ```

2. Ou crie manualmente o arquivo `.env` na raiz do projeto com o conteúdo acima

3. Ajuste os valores conforme necessário:
   - **Desenvolvimento local**: use `localhost` como host
   - **Docker Compose**: use os nomes dos serviços (`postgres`, `redis`) como host

## Valores padrão do Docker Compose

Os valores padrão no docker-compose.yml são:
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgres`
- `POSTGRES_DB=stock_db`
- `POSTGRES_PORT=5432`
- `REDIS_PORT=6379`
- `RABBITMQ_PORT=5672`
- `RABBITMQ_MANAGEMENT_PORT=15672`
- `RABBITMQ_USER=guest`
- `RABBITMQ_PASSWORD=guest`

