import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
    password: z
        .string()
        .min(1, 'Le mot de passe est requis')
        .min(6, 'Le mot de passe doit avoir au moins 6 caractères'),
})

export type LoginSchema = z.infer<typeof loginSchema>