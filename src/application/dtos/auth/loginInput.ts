import z from "zod";
import { VALIDATION } from "@/utils/constants";

export const loginInputSchema = z.object({
    email: z.email(),
    password: z.string().min(VALIDATION.MIN_PASSWORD_LENGTH).max(VALIDATION.MAX_PASSWORD_LENGTH)
});

export type LoginInput = z.infer<typeof loginInputSchema>;