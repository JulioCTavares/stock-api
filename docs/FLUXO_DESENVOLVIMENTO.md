# Fluxo de Desenvolvimento por Features

Este documento descreve o fluxo completo de desenvolvimento de uma feature, desde a definição do domínio até a implementação do controller.

## 📋 Visão Geral

O projeto segue **Clean Architecture** com **Design Patterns**, organizando o código em camadas bem definidas:

```
Request → Controller → Use Case → Service → Repository → Database
                ↓         ↓          ↓          ↓
              DTOs    Facade    Proxy Cache  Mapper
```

---

## 🚀 Passo a Passo: Criando uma Feature

### **PASSO 1: Domain Layer (Entidades e Value Objects)**

**Onde:** `src/domain/`

**Quando começar:** Primeiro passo - definir o modelo de domínio

**O que fazer:**

1. Criar a **Entity** em `src/domain/entities/`
   - Exemplo: `User.ts`, `Product.ts`
   - Define propriedades e regras básicas do domínio

2. Criar **Value Objects** em `src/domain/value-objects/` (se necessário)
   - Exemplo: `Email.ts`, `Password.ts`
   - Objetos imutáveis com validação

**Exemplo:**

```typescript
// src/domain/entities/user.entity.ts
export class UserEntity {
  id: string;
  username: string;
  email: string;
  // ...
}
```

---

### **PASSO 2: Infrastructure Layer - Database Schema**

**Onde:** `src/infrastructure/db/drizzle/schemas/`

**Quando começar:** Após definir a entidade de domínio

**O que fazer:**

1. Criar o **schema Drizzle** em `src/infrastructure/db/drizzle/schemas/`
   - Define a estrutura da tabela no banco
   - Exemplo: `user.ts`

2. Gerar migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

**Exemplo:**

```typescript
// src/infrastructure/db/drizzle/schemas/user.ts
export const userTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // ...
});
```

---

### **PASSO 3: Infrastructure Layer - Repository Interface**

**Onde:** `src/infrastructure/repositories/{feature}/`

**Quando começar:** Após criar o schema

**O que fazer:**

1. Criar a **interface do repositório** em `src/infrastructure/repositories/{feature}/`
   - Define os contratos de acesso aos dados
   - Exemplo: `user.repository.ts` → `IUserRepository`

**Exemplo:**

```typescript
// src/infrastructure/repositories/user/user.repository.ts
export interface IUserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  // ...
}
```

---

### **PASSO 4: Infrastructure Layer - Mapper**

**Onde:** `src/infrastructure/db/drizzle/mappers/`

**Quando começar:** Após criar a interface do repositório

**O que fazer:**

1. Criar o **Mapper** em `src/infrastructure/db/drizzle/mappers/`
   - Converte entre entidade de domínio e schema do banco
   - Exemplo: `userMapper.ts`

**Exemplo:**

```typescript
// src/infrastructure/db/drizzle/mappers/userMapper.ts
export class UserMapper {
  static toEntity(row: UserRow): UserEntity {
    return new UserEntity({
      id: row.id,
      email: row.email,
      // ...
    });
  }
}
```

---

### **PASSO 5: Infrastructure Layer - Repository Implementation**

**Onde:** `src/infrastructure/db/drizzle/repositories/`

**Quando começar:** Após criar o mapper

**O que fazer:**

1. Implementar o repositório concreto em `src/infrastructure/db/drizzle/repositories/`
   - Usa Drizzle para acessar o banco
   - Usa o Mapper para converter dados
   - Exemplo: `user-drizzle.repository.ts`

**Exemplo:**

```typescript
// src/infrastructure/db/drizzle/repositories/user-drizzle.repository.ts
export class UserDrizzleRepository implements IUserRepository {
  constructor(private readonly db: NodePostgresDatabase) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const [row] = await this.db.insert(userTable).values(UserMapper.toRow(user)).returning();
    return UserMapper.toEntity(row);
  }
}
```

---

### **PASSO 6: Infrastructure Layer - Cache Proxy (Opcional)**

**Onde:** `src/infrastructure/cache/proxys/repositories/`

**Quando começar:** Se a feature precisa de cache

**O que fazer:**

1. Criar o **Proxy de Cache** em `src/infrastructure/cache/proxys/repositories/`
   - Envolve o repositório real com cache
   - Implementa o mesmo contrato `IUserRepository`
   - Exemplo: `userRepositoryProxy.ts`

**Exemplo:**

```typescript
// src/infrastructure/cache/proxys/repositories/userRepositoryProxy.ts
export class UserRepositoryProxy implements IUserRepository {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cache: ICache,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const cached = await this.cache.get(`user:email:${email}`);
    if (cached) return JSON.parse(cached);

    const user = await this.repository.findByEmail(email);
    if (user) await this.cache.set(`user:email:${email}`, JSON.stringify(user));
    return user;
  }
}
```

---

### **PASSO 7: Application Layer - Service**

**Onde:** `src/application/services/`

**Quando começar:** Após ter o repositório (com ou sem proxy)

**O que fazer:**

1. Criar o **Service** em `src/application/services/`
   - Contém lógica de negócio
   - Usa repositório e outras estratégias (hash, etc.)
   - Exemplo: `user.service.ts`

**Exemplo:**

```typescript
// src/application/services/user.service.ts
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashStrategy: IHashStrategy,
  ) {}

  async create(input: CreateUserInput): Promise<UserEntity> {
    const hashed = await this.hashStrategy.hash(input.password);
    const user = new UserEntity({ ...input, password: hashed });
    return this.userRepository.save(user);
  }
}
```

---

### **PASSO 8: Application Layer - DTOs**

**Onde:** `src/application/dtos/{feature}/`

**Quando começar:** Antes ou junto com o Use Case

**O que fazer:**

1. Criar **DTOs** com validação Zod em `src/application/dtos/{feature}/`
   - Define estrutura e validação dos dados de entrada
   - Exemplo: `registerUserInput.ts`

**Exemplo:**

```typescript
// src/application/dtos/users/registerUserInput.ts
export const registerUserInputSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;
```

---

### **PASSO 9: Application Layer - Use Case**

**Onde:** `src/application/use-cases/{feature}/`

**Quando começar:** Após criar o Service e DTOs

**O que fazer:**

1. Criar o **Use Case** em `src/application/use-cases/{feature}/`
   - Orquestra a lógica de uma ação específica
   - Valida entrada com DTO
   - Chama o Service
   - Exemplo: `registerUserUseCase.ts`

**Exemplo:**

```typescript
// src/application/use-cases/users/registerUserUseCase.ts
export class RegisterUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(input: RegisterUserInput): Promise<UserEntity> {
    const validated = registerUserInputSchema.parse(input);
    return this.userService.create(validated);
  }
}
```

---

### **PASSO 10: Shared Layer - Factory**

**Onde:** `src/shared/factories/{feature}/`

**Quando começar:** Após ter todas as dependências (Service, Repository, Cache, etc.)

**O que fazer:**

1. Criar a **Factory** em `src/shared/factories/{feature}/`
   - Instancia e conecta todas as dependências
   - Retorna o Service ou Use Case configurado
   - Exemplo: `createUserService.ts`

**Exemplo:**

```typescript
// src/shared/factories/users/createUserService.ts
export const createUserService = () => {
  const redis = new RedisClient(env.REDIS_URL);
  const db = drizzle(env.DATABASE_URL);
  const userRepository = new UserDrizzleRepository(db);
  const userRepositoryProxy = new UserRepositoryProxy(userRepository, new RedisCache(redis));
  const hashStrategy = new ArgonHasher();

  return new UserService(userRepositoryProxy, hashStrategy);
};
```

---

### **PASSO 11: Shared Layer - Facade (Opcional, para Auth)**

**Onde:** `src/shared/facades/`

**Quando começar:** Se a feature precisa orquestrar múltiplos Use Cases

**O que fazer:**

1. Criar a **Facade** em `src/shared/facades/`
   - Simplifica a interface para operações complexas
   - Orquestra múltiplos Use Cases
   - Exemplo: `AuthFacade.ts` (register + login + refresh)

**Exemplo:**

```typescript
// src/shared/facades/AuthFacade.ts
export class AuthFacade {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
  ) {}

  async register(input: RegisterUserInput) {
    return this.registerUser.execute(input);
  }

  async login(input: LoginUserInput) {
    return this.loginUser.execute(input);
  }
}
```

---

### **PASSO 12: Presentation Layer - Controller**

**Onde:** `src/presentation/http/controllers/`

**Quando começar:** Último passo - após ter Use Cases/Facade e Factory

**O que fazer:**

1. Criar o **Controller** em `src/presentation/http/controllers/`
   - Recebe requisições HTTP
   - Valida entrada (pode usar DTOs)
   - Chama Use Case ou Facade
   - Retorna resposta HTTP
   - Exemplo: `AuthController.ts`

**Exemplo:**

```typescript
// src/presentation/http/controllers/AuthController.ts
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  async register(req: Request) {
    try {
      const user = await this.authFacade.register(req.body);
      return Response.json({ user }, { status: 201 });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  }
}
```

---

### **PASSO 13: Presentation Layer - Routes**

**Onde:** `src/presentation/http/routes.ts`

**Quando começar:** Após criar o Controller

**O que fazer:**

1. Registrar as rotas em `src/presentation/http/routes.ts`
   - Conecta endpoints HTTP aos controllers
   - Aplica middlewares (auth, rate limit, etc.)

**Exemplo:**

```typescript
// src/presentation/http/routes.ts
import { AuthController } from "./controllers/AuthController";
import { createAuthFacade } from "@/shared/factories/auth/createAuthFacade";

const authFacade = createAuthFacade();
const authController = new AuthController(authFacade);

app.post("/auth/register", (req) => authController.register(req));
app.post("/auth/login", (req) => authController.login(req));
```

---

## 📊 Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DOMAIN                                                   │
│    src/domain/entities/user.entity.ts                       │
│    src/domain/value-objects/Email.ts                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. INFRASTRUCTURE - Schema                                  │
│    src/infrastructure/db/drizzle/schemas/user.ts            │
│    → bun run db:generate                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. INFRASTRUCTURE - Repository Interface                    │
│    src/infrastructure/repositories/user/user.repository.ts   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. INFRASTRUCTURE - Mapper                                  │
│    src/infrastructure/db/drizzle/mappers/userMapper.ts       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. INFRASTRUCTURE - Repository Implementation               │
│    src/infrastructure/db/drizzle/repositories/               │
│    user-drizzle.repository.ts                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. INFRASTRUCTURE - Cache Proxy (Opcional)                   │
│    src/infrastructure/cache/proxys/repositories/             │
│    userRepositoryProxy.ts                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. APPLICATION - Service                                    │
│    src/application/services/user.service.ts                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. APPLICATION - DTOs                                       │
│    src/application/dtos/users/registerUserInput.ts           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. APPLICATION - Use Case                                    │
│    src/application/use-cases/users/registerUserUseCase.ts   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. SHARED - Factory                                        │
│     src/shared/factories/users/createUserService.ts          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. SHARED - Facade (Opcional, para Auth)                   │
│     src/shared/facades/AuthFacade.ts                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 12. PRESENTATION - Controller                               │
│     src/presentation/http/controllers/AuthController.ts       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 13. PRESENTATION - Routes                                   │
│     src/presentation/http/routes.ts                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist de Desenvolvimento

Ao criar uma nova feature, siga esta ordem:

- [ ] **1.** Criar Entity em `src/domain/entities/`
- [ ] **2.** Criar Value Objects (se necessário) em `src/domain/value-objects/`
- [ ] **3.** Criar Schema Drizzle em `src/infrastructure/db/drizzle/schemas/`
- [ ] **4.** Gerar e rodar migrations (`bun run db:generate && bun run db:migrate`)
- [ ] **5.** Criar Interface do Repository em `src/infrastructure/repositories/{feature}/`
- [ ] **6.** Criar Mapper em `src/infrastructure/db/drizzle/mappers/`
- [ ] **7.** Implementar Repository em `src/infrastructure/db/drizzle/repositories/`
- [ ] **8.** Criar Proxy de Cache (se necessário) em `src/infrastructure/cache/proxys/repositories/`
- [ ] **9.** Criar Service em `src/application/services/`
- [ ] **10.** Criar DTOs em `src/application/dtos/{feature}/`
- [ ] **11.** Criar Use Case em `src/application/use-cases/{feature}/`
- [ ] **12.** Criar Factory em `src/shared/factories/{feature}/`
- [ ] **13.** Criar Facade (se necessário) em `src/shared/facades/`
- [ ] **14.** Criar Controller em `src/presentation/http/controllers/`
- [ ] **15.** Registrar rotas em `src/presentation/http/routes.ts`

---

## 💡 Dicas

1. **Sempre comece pelo domínio** - entidades e value objects definem o modelo de negócio
2. **Use o Factory para instanciar** - evita acoplamento e facilita testes
3. **DTOs validam entrada** - use Zod para validação robusta
4. **Proxy de Cache é opcional** - só adicione se realmente precisar de cache
5. **Facade para operações complexas** - use quando precisar orquestrar múltiplos Use Cases
6. **Controllers devem ser finos** - apenas recebem request e chamam Use Case/Facade

---

## 📝 Exemplo Completo: Feature "Register User"

Veja o exemplo completo já implementado no projeto:

- Entity: `src/domain/entities/user.entity.ts`
- Schema: `src/infrastructure/db/drizzle/schemas/user.ts`
- Repository Interface: `src/infrastructure/repositories/user/user.repository.ts`
- Repository Implementation: `src/infrastructure/db/drizzle/repositories/user-drizzle.repository.ts`
- Proxy: `src/infrastructure/cache/proxys/repositories/userRespositoryProxy.ts`
- Service: `src/application/services/user.service.ts`
- DTO: `src/application/dtos/users/registerUserInput.ts`
- Use Case: `src/application/use-cases/users/registerUserUseCase.ts`
- Factory: `src/shared/factories/users/createUserService.ts`
