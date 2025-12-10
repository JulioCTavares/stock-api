import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { env } from "@/config/env/env";
import { logger } from "./logger";

type JwtPayload = {
    id: string;
    role: string;
}

type SignPayload = {
    payloadData: JwtPayload;
    expiresIn: number;
    secret: string;
}

export class JWTUtils {
    static async sign(payload: SignPayload): Promise<string> {
        const { payloadData, expiresIn, secret } = payload;
        logger.info(`Signing JWT with payload`);
        const jwt = new SignJWT({
            ...payloadData,
            exp: Math.floor(Date.now() / 1000) + expiresIn,
        });
        logger.info(`JWT signed successfully`);
        return jwt.setProtectedHeader({ alg: "HS256" }).sign(new TextEncoder().encode(secret));
    }

    static async verify(token: string): Promise<boolean> {
        logger.info(`Verifying JWT`);
        const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
        if (!payload) {
            logger.error(`Invalid JWT`);
            return false;
        }
        if (payload.exp && payload.exp < Date.now() / 1000) {
            logger.error(`JWT expired`);
            return false;
        }
        logger.info(`JWT verified successfully`);
        return true;
    }

    static async decode(token: string): Promise<JwtPayload> {
        logger.info(`Decoding JWT`);
        const payload = decodeJwt(token);
        logger.info(`JWT decoded successfully`);
        return payload as JwtPayload;
    }
}