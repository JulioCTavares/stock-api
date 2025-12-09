import type { IHashStrategy } from "../hashStrategy";
import argon2 from "argon2";


export class ArgonHasher implements IHashStrategy {
    async hash(data: string): Promise<string> {
        return await argon2.hash(data, {
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,
        });
    }
    async verify(data: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, data);
    }
}