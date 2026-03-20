import { z } from "zod";

export const addAccommodationSchema = z.object({
    reference: z.string().min(1, "La reference est requise").min(3, "La reference doit avoir au moins 3 caractères"),
    description: z.string().min(1, "La description est requise").min(10, "La description doit avoir au moins 10 caractères"),
    dining_room: z.number({ invalid_type_error: "Le nombre salle à manger est requis" }).int("Le nombre salle à manger doit un nombre entier").nonnegative("Le nombre salle à manger doit un nombre positif"),
    living_room: z.number({ invalid_type_error: "Le nombre séjours est requis" }).int("Le nombre séjours doit un nombre entier").nonnegative("Le nombre séjours doit un nombre positif"),
    bedroom: z.number({ invalid_type_error: "Le nombre de chambres est requis" }).int("Le nombre de chambres doit un nombre entier").nonnegative("Le nombre de chambres doit un nombre positif"),
    bath_room: z.number({ invalid_type_error: "Le nombre de salle de bain est requis" }).int("Le nombre de salle de bain doit un nombre entier").nonnegative("Le nombre de salle de bain doit un nombre positif"),
    kitchen: z.number({ invalid_type_error: "Le nombre de cuisine est requis" }).int("Le nombre de cuisine doit un nombre entier").nonnegative("Le nombre de cuisine doit un nombre positif"),
    type: z.string({ invalid_type_error: "Le type est requis", required_error: "Le type est requis" }),
    property_id: z.string({ required_error: "La propriété est requise" }),
    images: z.instanceof(FileList).refine((fileList) => {
        let res: boolean[] = []
        Array.from(fileList).forEach((file) => {
            if (!["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(file.type)) {
                res.push(false)
            }
        })

        return !res.includes(false)
    }, {
        message: "Les images doivent avoir les extensions .png, .jpg, .jpeg, .gif"
    })
        .refine((fileList) => {
            let res: boolean[] = []
            Array.from(fileList).forEach((file) => {
                if (file.size >= 10 * 1024 * 1024) {
                    res.push(false)
                }
            })

            return !res.includes(false)
        }, {
            message: "Les images doivent peser 10MB maximum chacune",
        }).optional()
})

export type AddAccommodationSchema = z.infer<typeof addAccommodationSchema>;