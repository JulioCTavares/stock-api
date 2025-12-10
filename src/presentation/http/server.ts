import fastify from "fastify";
import { userRouter } from "./routes/users/userRouter";
import cors from "@fastify/cors";
import { rateLimiterPlugin } from "./middlewares/rateLimiterPlugin";
import { authMiddleware } from "@/shared/factories/auth/authFactory";

const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname"
            }
        },
        level: "info",
    }
});

server.register(authMiddleware)

server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

server.register(rateLimiterPlugin);

server.register(userRouter, { prefix: "/api/v1" });

export default server;