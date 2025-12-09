import { UserEntity } from "@/domain/entities/user.entity";

export interface IUserRepository {
    save(user: UserEntity): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findAll(params?: { limit?: number; offset?: number }): Promise<UserEntity[]>;
    update(user: UserEntity): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}