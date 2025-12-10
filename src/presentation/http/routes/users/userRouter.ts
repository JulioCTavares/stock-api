import type { FastifyInstance } from "fastify";
import { createRegisterUserController } from "@/shared/factories/users";
import { createAuthRateLimiterFactory } from "@/shared/factories/rateLimiter/createRateLimiter";

export const userRouter = (app: FastifyInstance) => {
    const registerUserController = createRegisterUserController();
    const authRateLimiter = createAuthRateLimiterFactory();

   
    app.post(
        "/sign-up",
        {
            preHandler: async (req, res) => {
                await authRateLimiter.byRoute(req, res, "register");
            }
        },
        (req, res) => registerUserController.handle(req, res)
    );
};