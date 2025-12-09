import type { RegisterUserInput } from "@/application/dtos/users/registerUserInput";
import type { RegisterUserUseCase } from "@/application/use-cases/users/registerUserUseCase";
import type { FastifyRequest, FastifyReply } from "fastify";
import { FastifyResponseHelper } from "@/utils/response-fastify";
import { handleError } from "@/utils/errorHandler";
import { HTTP_STATUS } from "@/utils/constants";

export class RegisterUserController {
    constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

    async handle(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const { username, email, password } = req.body as RegisterUserInput;
            const user = await this.registerUserUseCase.execute({ username, email, password });
            return FastifyResponseHelper.created(res, user, "Usuário criado com sucesso");
        } catch (error) {
            const errorResponse = handleError(error);
            const errorData = await errorResponse.json();
            return res.status(errorResponse.status).send(errorData);
        }
    }
}