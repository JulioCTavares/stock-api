import type { IJWTStrategy } from "@/infrastructure/auth/jwtStrategy";
import type { UserService } from "./user.service";
import type { LoginInput } from "../dtos/auth/loginInput";
import { UnauthorizedError, USER_ROLES } from "@/utils";
import type { IHashStrategy } from "@/infrastructure/hash/hashStrategy";



export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtStrategy: IJWTStrategy,
        private readonly hashStrategy: IHashStrategy,
    ) {}

    async valideteCredentials(input: LoginInput): Promise<boolean> {
        const user = await this.userService.findByEmail(input.email);
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }
        const isPasswordValid = await this.hashStrategy.verify(input.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }
        return true;
    }

    async verifyToken(token: string): Promise<boolean> {
        return await this.jwtStrategy.verify(token);
    }

    async decodeToken(token: string): Promise<any> {
        return await this.jwtStrategy.decode(token);
    }

    private async generateAccessToken(userId: string): Promise<string> {
        return await this.jwtStrategy.sign({
            id: userId,
            role: USER_ROLES.USER
        });
    }

    private async generateRefreshToken(userId: string): Promise<string> {
        return await this.jwtStrategy.sign({
            id: userId,
            role: USER_ROLES.USER
        });
    }

    async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = await this.generateAccessToken(userId);
        const refreshToken = await this.generateRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    // TODO: Implement refresh token logic and blacklist logic
}