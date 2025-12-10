import { AuthorizationMiddleware } from "@/presentation/http/middlewares/authorization";    
import { AuthService } from "@/application/services/auth.service";
import { createUserService } from "../users/createUserService";
import { JoseJwtStrategy } from "@/infrastructure/auth/jose/joseJwtStrategy";
import { ArgonHasher } from "@/infrastructure/hash/argon/argonHasher";
    


export const createAuthService = () => {
    const userService = createUserService();
    return new AuthService(userService, new JoseJwtStrategy(), new ArgonHasher());
}

export const authMiddleware = () => {
    const authService = createAuthService();
    return new AuthorizationMiddleware(authService);
}