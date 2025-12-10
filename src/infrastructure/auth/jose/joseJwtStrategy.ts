import type { IJWTStrategy } from "../jwtStrategy";
import { JWTUtils } from "@/utils/jwt";
import { env } from "@/config/env/env";



export class JoseJwtStrategy implements IJWTStrategy {
    async sign(payload: any): Promise<string> {
        return await JWTUtils.sign({
            payloadData: payload,
            expiresIn: env.JWT_EXPIRES_IN,
            secret: env.JWT_SECRET
        });
    }
    async verify(token: string): Promise<any> {
        return await JWTUtils.verify(token);
    }
    async decode(token: string): Promise<any> {
        return await JWTUtils.decode(token);
    }
}