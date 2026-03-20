import { z } from "zod";

export const profileSchema = z.object({
    last_name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
    first_name: z.string().min(1, "Le prénom est requis").min(3, "Le prénom doit avoir au moins 3 caractères"),
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }),
    position: z.string().min(1, "La fonction est requis"),
    phone: z.string().min(1, "Le numéro de téléphone est requis"),
    profile: z.any()
        .refine((file) => file?.length === 0 ? true : ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(file?.[0]?.type), {
            message: "L'image doit avoir les extensions .png, .jpg, .jpeg, .gif",
        })
        .refine((file) => {
            return file?.length === 0 ? true : file?.[0]?.size <= 10 * 1024 * 1024
        }, {
            message: "L'image doit peser 10MB maximum",
        })
    ,
})

export type ProfileSchema = z.infer<typeof profileSchema>