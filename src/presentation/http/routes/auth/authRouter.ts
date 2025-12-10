import type { FastifyInstance } from "fastify";



export const authRouter = (app: FastifyInstance) => {
    const authController = createAuthController();
    app.post("/sign-in", (req, res) => authController.handle(req, res));
};