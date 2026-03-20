import { z } from "zod";

export const landPorposeSchema = z.object({
    name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
   
    
    
})

export type LandPorposeSchema = z.infer<typeof landPorposeSchema>