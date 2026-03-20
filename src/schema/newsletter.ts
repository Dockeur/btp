import { z } from "zod";

export const newsletterSchema = z.object({
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),    
})

export type NewsletterSchema = z.infer<typeof newsletterSchema>