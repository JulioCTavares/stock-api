import { RegisterUserUseCase } from "@/application/use-cases/users/registerUserUseCase";
import { createUserService } from "./createUserService";

/**
 * Factory para criar instância do RegisterUserUseCase
 * Injeta todas as dependências necessárias
 */
export const createRegisterUserUseCase = (): RegisterUserUseCase => {
    const userService = createUserService();
    return new RegisterUserUseCase(userService);
};

