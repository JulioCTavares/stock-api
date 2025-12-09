export class UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt ?? new Date();
        this.updatedAt = user.updatedAt ?? new Date();
    }
}