import fastify from "fastify";
import { userRouter } from "./routes/users/userRouter";
import cors from "@fastify/cors";
import { rateLimiterPlugin } from "./middlewares/rateLimiterPlugin";

const server = fastify({
    logger: true
});

server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

server.register(rateLimiterPlugin);

server.register(userRouter, { prefix: "/api/v1" });

export default server;