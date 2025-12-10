import type { LoginInput } from "@/application/dtos/auth/loginInput";
import type { AuthService } from "@/application/services/auth.service";
import type { LoginOutput } from "@/application/dtos/auth/loginOutput";
import { UnauthorizedError } from "@/utils";



export class LoginUseCase {
    constructor(private readonly authService: AuthService) {}

    async execute(input: LoginInput): Promise<LoginOutput> {
        const isValid = await this.authService.valideteCredentials(input);
        if (!isValid) {
            throw new UnauthorizedError("Invalid credentials");
        }
        const {accessToken, refreshToken} = await this.authService.generateTokens(input.email);
        return {
            accessToken,
            refreshToken
        };
    }
}