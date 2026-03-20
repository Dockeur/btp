import { z } from "zod";

export const addCustomerSchema = z.object({
    last_name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
    first_name: z.string().min(1, "Le prénom est requis").min(3, "Le prénom doit avoir au moins 3 caractères"),
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
    phone: z.string().min(1, "Le numéro de téléphone est requis"),
    password: z
        .string()
        .min(1, 'Le mot de passe est requis')
        .min(6, 'Le mot de passe doit avoir au moins 6 caractères'),
    profile: z.any()
        .refine((file) => file?.length === 0 ? true : ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(file?.[0]?.type), {
            message: "L'image doit avoir les extensions .png, .jpg, .jpeg, .gif",
        })
        .refine((file) => {
            return file?.length === 0 ? true : file?.[0]?.size <= 10 * 1024 * 1024
        }, {
            message: "L'image doit peser 10MB maximum",
        }),
    password_confirmation: z.string()
        .min(1, 'La confirmation de mot de passe est requise'),
    country: z.string({ required_error: "Le pays est requis" }).min(1, "Le pays est requis"),
    city: z.string().min(1, "La ville est requise"),
    street: z.string().min(1, "Le quartier est requis"),
}).superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
        ctx.addIssue({
            code: 'custom',
            message: 'Les mots de passe ne correspondent pas.',
            path: ['password_confirmation']
        })
    }
})

export type AddCustomerSchema = z.infer<typeof addCustomerSchema>