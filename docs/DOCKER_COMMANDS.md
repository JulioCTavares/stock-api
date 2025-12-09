# Comandos Docker Compose

## Subir apenas serviços de infraestrutura (sem a aplicação)

Para desenvolvimento local, onde você roda a aplicação fora do Docker mas usa os serviços de infraestrutura:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

Isso sobe apenas:
- ✅ PostgreSQL
- ✅ Redis
- ✅ RabbitMQ

**Não sobe:**
- ❌ App (aplicação)

## Subir tudo incluindo a aplicação

Para subir todos os serviços incluindo a aplicação em Docker:

```bash
docker-compose -f docker/docker-compose.yml --profile app up -d
```

## Comandos úteis

### Ver logs
```bash
# Todos os serviços
docker-compose -f docker/docker-compose.yml logs -f

# Serviço específico
docker-compose -f docker/docker-compose.yml logs -f postgres
docker-compose -f docker/docker-compose.yml logs -f redis
```

### Parar serviços
```bash
# Parar tudo
docker-compose -f docker/docker-compose.yml down

# Parar e remover volumes
docker-compose -f docker/docker-compose.yml down -v
```

### Reiniciar um serviço
```bash
docker-compose -f docker/docker-compose.yml restart postgres
```

### Ver status dos serviços
```bash
docker-compose -f docker/docker-compose.yml ps
```

## Desenvolvimento Local

### Cenário 1: Aplicação local + Infraestrutura Docker

1. Suba apenas a infraestrutura:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

2. Configure o `.env` para apontar para os serviços Docker:
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. Rode a aplicação localmente:
   ```bash
   bun run dev
   ```

### Cenário 2: Tudo no Docker

1. Suba tudo:
   ```bash
   docker-compose -f docker/docker-compose.yml --profile app up -d
   ```

2. A aplicação estará disponível em `http://localhost:4000`

## Scripts NPM/Bun (opcional)

Você pode adicionar scripts no `package.json`:

```json
{
  "scripts": {
    "docker:up": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:up:all": "docker-compose -f docker/docker-compose.yml --profile app up -d",
    "docker:down": "docker-compose -f docker/docker-compose.yml down",
    "docker:logs": "docker-compose -f docker/docker-compose.yml logs -f"
  }
}
```

