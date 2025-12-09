import { RegisterUserController } from "@/presentation/http/controllers/users/registerUserController";
import { createRegisterUserUseCase } from "./createRegisterUserUseCase";

/**
 * Factory para criar instância do RegisterUserController
 * Injeta todas as dependências necessárias (Use Case -> Service -> Repository)
 */
export const createRegisterUserController = (): RegisterUserController => {
    const registerUserUseCase = createRegisterUserUseCase();
    return new RegisterUserController(registerUserUseCase);
};

