import z from "zod";

export const registerUserInputSchema = z.object({
    username: z.string().min(3).max(255).trim().toLowerCase(),
    email: z.email(),
    password: z.string().min(8).max(255).trim(),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;