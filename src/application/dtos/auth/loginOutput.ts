import z from "zod";


export const loginOutputSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export type LoginOutput = z.infer<typeof loginOutputSchema>;