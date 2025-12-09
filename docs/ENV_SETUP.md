# Configuração de Variáveis de Ambiente

## Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Environment Configuration
NODE_ENV=dev
PORT=4000

# PostgreSQL Configuration
# Opção 1: URL completa (prioridade)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db

# Opção 2: Variáveis individuais (usado se DATABASE_URL não fornecida)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=stock_db

# Redis Configuration
# Opção 1: URL completa (prioridade)
REDIS_URL=redis://localhost:6379

# Opção 2: Variáveis individuais (usado se REDIS_URL não fornecida)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ Configuration
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
```

## Formato das URLs

### DATABASE_URL (PostgreSQL)

**Formato completo:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Exemplos:**
```env
# Local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db

# Com SSL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db?sslmode=require

# Produção (exemplo)
DATABASE_URL=postgresql://user:password@db.example.com:5432/stock_db
```

### REDIS_URL

**Formato completo:**
```
redis://[password@][host]:[port]
```

**Exemplos:**
```env
# Local sem senha
REDIS_URL=redis://localhost:6379

# Local com senha
REDIS_URL=redis://:senha123@localhost:6379

# Produção (exemplo)
REDIS_URL=redis://:senha123@redis.example.com:6379
```

## Prioridade de Configuração

O sistema usa a seguinte prioridade:

1. **URL completa** (`DATABASE_URL` ou `REDIS_URL`) - se fornecida, será usada diretamente
2. **Variáveis individuais** - se a URL não for fornecida, constrói automaticamente a partir das variáveis individuais

## Exemplos de Uso

### Exemplo 1: Usando URLs completas
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db
REDIS_URL=redis://localhost:6379
```

### Exemplo 2: Usando variáveis individuais
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=stock_db

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Exemplo 3: Misturado (URL para DB, variáveis para Redis)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=minhasenha
```

## Docker Compose

Se estiver usando Docker Compose, as URLs são construídas automaticamente usando os nomes dos serviços:

```env
# Variáveis básicas (valores padrão serão usados se não fornecidas)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=stock_db
POSTGRES_PORT=5432

REDIS_PORT=6379
REDIS_PASSWORD=

RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# Aplicação
NODE_ENV=dev
PORT=4000
```

**Nota**: No Docker Compose, os hosts são os nomes dos serviços:
- `POSTGRES_HOST=postgres` (nome do serviço)
- `REDIS_HOST=redis` (nome do serviço)

As URLs são construídas automaticamente como:
- `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/stock_db`
- `REDIS_URL=redis://redis:6379`

## Valores Padrão

Se as variáveis não forem fornecidas, os seguintes valores padrão serão usados:

- `POSTGRES_HOST`: `localhost`
- `POSTGRES_PORT`: `5432`
- `POSTGRES_USER`: `postgres`
- `POSTGRES_PASSWORD`: `postgres`
- `POSTGRES_DB`: `stock_db`
- `REDIS_HOST`: `localhost`
- `REDIS_PORT`: `6379`

## Segurança

⚠️ **Importante**: Nunca commite o arquivo `.env` no repositório. Ele contém informações sensíveis.

O arquivo `.env` já está no `.gitignore` para proteger suas credenciais.

