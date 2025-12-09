import { env } from "@/config/env/env";
import type { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/infrastructure/repositories/user/user.repository";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { userTable } from "../schemas/user";
import { UserMapper } from "../mappers/userMapper";
import { desc, eq, sql } from "drizzle-orm";
import { logger, now, PAGINATION } from "@/utils";

const SELECT_FIELDS = {
  id: userTable.id,
  username: userTable.username,
  email: userTable.email,
  password: userTable.password,
  role: userTable.role,
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt
} as const;

export class UserDrizzleRepository implements IUserRepository {
  constructor(private readonly db: NodePgDatabase = drizzle(env.DATABASE_URL)) {}

  async save(user: UserEntity): Promise<UserEntity> {
    logger.info(`Saving user ${user.username} to database`);
    const currentDate = now();
    const [newUser] = await this.db
      .insert(userTable)
      .values({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt ?? currentDate,
        updatedAt: user.updatedAt ?? currentDate
      })
      .returning(SELECT_FIELDS);

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return UserMapper.toEntity(newUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [user] = await this.db
      .select(SELECT_FIELDS)
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    return user ? UserMapper.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [user] = await this.db
      .select(SELECT_FIELDS)
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    return user ? UserMapper.toEntity(user) : null;
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<UserEntity[]> {
    const { limit = PAGINATION.DEFAULT_LIMIT, offset = 0 } = params ?? {};

    const query = this.db
      .select(SELECT_FIELDS)
      .from(userTable)
      .orderBy(desc(userTable.createdAt))
      .limit(limit)
      .offset(offset);

    const users = await query;

    return users.map(UserMapper.toEntity);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const [updatedUser] = await this.db
      .update(userTable)
      .set({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        updatedAt: now()
      })
      .where(eq(userTable.id, user.id))
      .returning(SELECT_FIELDS);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return UserMapper.toEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const result = await this.db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning({ count: sql<number>`count(*)` });

    const affected = result?.[0]?.count ?? 0;
    if (affected === 0) {
      throw new Error("Failed to delete user");
    }
  }
}