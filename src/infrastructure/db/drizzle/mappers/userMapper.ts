import { UserEntity } from "@/domain/entities/user.entity";
import type { userTable } from "../schemas/user";




export class UserMapper {
    static toEntity(user: typeof userTable.$inferSelect): UserEntity {
        return new UserEntity({
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    
    static toDatabase(user: UserEntity): typeof userTable.$inferInsert {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
        };
    }
}