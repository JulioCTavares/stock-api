import type { AuthService } from "@/application/services/auth.service";
import { UnauthorizedError } from "@/utils/errorHandler";
import type { FastifyReply, FastifyRequest } from "fastify";

export class AuthorizationMiddleware {
    constructor(private readonly authService: AuthService) {}

    async execute(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedError("Token não fornecido");
        }

        // Remove "Bearer " do início do token
        const token = authHeader.replace(/^Bearer\s+/i, "");
        if (!token) {
            throw new UnauthorizedError("Token inválido");
        }

        const isValid = await this.authService.verifyToken(token);
        if (!isValid) {
            throw new UnauthorizedError("Token inválido");
        }

        const decoded = await this.authService.decodeToken(token);
        if (!decoded) {
            throw new UnauthorizedError("Token inválido");
        }

        req.user = decoded;
    }
}