import { registerUserInputSchema, type RegisterUserInput } from "@/application/dtos/users/registerUserInput";
import type { UserService } from "@/application/services/user.service";
import type { UserEntity } from "@/domain/entities/user.entity";


export class RegisterUserUseCase {
    constructor(private readonly userService: UserService) {}

    async execute(input: RegisterUserInput): Promise<UserEntity> {

        try {
            const validated = registerUserInputSchema.parse(input);
            return this.userService.create(validated);
        } catch (error) {
            throw new Error("Invalid input");
        }
    }
}