import { registerUserInputSchema, type RegisterUserInput } from "@/application/dtos/users/registerUserInput";
import type { UserService } from "@/application/services/user.service";
import type { UserEntity } from "@/domain/entities/user.entity";
import { logger, ValidationError, ConflictError } from "@/utils";
import { ZodError } from "zod";

export class RegisterUserUseCase {
    constructor(private readonly userService: UserService) {}

    async execute(input: RegisterUserInput): Promise<UserEntity> {
        logger.info("Reciving data and initialize use case")
        logger.debug({ email: input.email }, "Iniciando registro de usuário");

        let validated: RegisterUserInput;
        try {
            validated = registerUserInputSchema.parse(input);
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
                logger.warn({ input, errors }, "Validação de entrada falhou");
                throw new ValidationError(`Dados inválidos: ${errors}`, error.issues);
            }
            logger.error({ error, input }, "Erro inesperado na validação");
            throw new ValidationError("Erro ao validar dados de entrada");
        }

        const existingUser = await this.userService.findByEmail(validated.email);
        if (existingUser) {
            logger.warn({ email: validated.email }, "Tentativa de registro com email já existente");
            throw new ConflictError("Email já está em uso");
        }

        try {
            const user = await this.userService.create(validated);
            logger.info({ userId: user.id, email: user.email }, "Usuário registrado com sucesso");
            return user;
        } catch (error) {
            logger.error({ error, email: validated.email }, "Erro ao criar usuário");
            throw error instanceof Error ? error : new Error("Erro ao registrar usuário");
        }
    }
}