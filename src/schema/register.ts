import { z } from "zod";

export const registerSchema = z.object({
    last_name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
    first_name: z.string().min(1, "Le prénom est requis").min(3, "Le prénom doit avoir au moins 3 caractères"),
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
    password: z
        .string()
        .min(1, 'Le mot de passe est requis')
        .min(6, 'Le mot de passe doit avoir au moins 6 caractères'),
    accept: z.boolean({ invalid_type_error: 'Vous devez accepter les conditions d\'utilisation' })
        .refine((val) => val, { message: 'Vous devez accepter les conditions d\'utilisation' }),
    password_confirmation: z.string()
        .min(1, 'La confirmation de mot de passe est requise')
    // .min(6, 'La confirmation de mot de passe doit avoir au moins 6 caractères'),
}).superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
        ctx.addIssue({
            code: 'custom',
            message: 'Les mots de passe ne correspondent pas.',
            path: ['password_confirmation']
        })
    }
})

export type RegisterSchema = z.infer<typeof registerSchema>