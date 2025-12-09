import { env } from "@/config/env/env";
import server from "./server";

const app = async () => {
    try {
        await server.listen({ port: env.PORT, host: "0.0.0.0" });
        server.log.info(`Server is running on port ${env.PORT}`);
        return server;
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}

app();