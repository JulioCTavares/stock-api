# Requisições Postman - Stock API

## Configuração Base

- **Base URL**: `http://localhost:4000` (ou a URL do seu servidor)
- **Content-Type**: `application/json`

---

## 1. Registrar Usuário

### Endpoint
```
POST /api/v1/users
```

### Headers
```
Content-Type: application/json
```

### Body (raw JSON)

#### ✅ Exemplo Válido
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "senhaSegura123"
}
```

#### ✅ Exemplo com Username em Maiúsculas (será convertido para lowercase)
```json
{
  "username": "JOHN_DOE",
  "email": "john.doe@example.com",
  "password": "senhaSegura123"
}
```

#### ✅ Exemplo Mínimo Válido
```json
{
  "username": "abc",
  "email": "user@test.com",
  "password": "12345678"
}
```

### Resposta de Sucesso (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-usuario",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "hash-da-senha",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Usuário criado com sucesso"
}
```

### Respostas de Erro

#### ❌ Email já em uso (409 Conflict)
```json
{
  "success": false,
  "error": "Email já está em uso"
}
```

#### ❌ Dados inválidos (400 Bad Request)
```json
{
  "success": false,
  "error": "Dados inválidos: email: Invalid email, password: String must contain at least 8 character(s)"
}
```

#### ❌ Rate Limit Excedido (403 Forbidden)
```json
{
  "success": false,
  "error": "Muitas requisições para esta rota. Tente novamente mais tarde.",
  "retryAfter": 60
}
```

---

## Exemplos de Validação

### ❌ Username muito curto (< 3 caracteres)
```json
{
  "username": "ab",
  "email": "user@test.com",
  "password": "12345678"
}
```

### ❌ Email inválido
```json
{
  "username": "johndoe",
  "email": "email-invalido",
  "password": "12345678"
}
```

### ❌ Senha muito curta (< 8 caracteres)
```json
{
  "username": "johndoe",
  "email": "user@test.com",
  "password": "1234567"
}
```

### ❌ Campo faltando
```json
{
  "username": "johndoe",
  "email": "user@test.com"
}
```

---

## Coleção Postman

### Importar no Postman

1. Abra o Postman
2. Clique em **Import**
3. Cole o JSON abaixo:

```json
{
  "info": {
    "name": "Stock API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"johndoe\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"senhaSegura123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "users"]
        }
      },
      "response": []
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000"
    }
  ]
}
```

---

## Variáveis de Ambiente Postman

Crie uma variável de ambiente no Postman:

- **Variable**: `baseUrl`
- **Initial Value**: `http://localhost:4000`
- **Current Value**: `http://localhost:4000`

---

## Testes Rápidos

### Teste 1: Criar usuário válido
```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "senhaSegura123"
  }'
```

### Teste 2: Tentar criar usuário com email duplicado
```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe2",
    "email": "john.doe@example.com",
    "password": "senhaSegura123"
  }'
```

### Teste 3: Testar validação (senha curta)
```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "123"
  }'
```

---

## Notas Importantes

1. **Rate Limiting**: 
   - Global: 100 requisições/minuto por IP
   - Registro: 5 requisições/minuto por IP

2. **Validações**:
   - `username`: mínimo 3, máximo 255 caracteres (convertido para lowercase)
   - `email`: formato de email válido
   - `password`: mínimo 8, máximo 255 caracteres

3. **Headers**:
   - `Content-Type: application/json` é obrigatório

4. **CORS**: 
   - Configurado para aceitar requisições de qualquer origem

