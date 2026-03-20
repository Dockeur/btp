import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
    sms: z.string().min(1, "Le message est requis").min(25, "Le nom doit avoir au moins 25 caractères"),
    
    
})

export type ContactSchema = z.infer<typeof contactSchema>