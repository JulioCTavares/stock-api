import { z } from "zod";

export const userOutputSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type UserOutput = z.infer<typeof userOutputSchema>;