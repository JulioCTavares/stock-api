import z from "zod";
import { VALIDATION } from "@/utils";

export const registerUserInputSchema = z.object({
    username: z
        .string()
        .min(VALIDATION.MIN_USERNAME_LENGTH)
        .max(VALIDATION.MAX_USERNAME_LENGTH)
        .trim()
        .toLowerCase(),
    email: z.email(),
    password: z
        .string()
        .min(VALIDATION.MIN_PASSWORD_LENGTH)
        .max(VALIDATION.MAX_PASSWORD_LENGTH)
        .trim()
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;