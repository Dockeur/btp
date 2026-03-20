import { z } from "zod";

export const landSchema = z.object({
    land_title: z.string().min(1, "Le titre foncier est requis").min(3, "Le titre foncier doit avoir au moins 3 caractères"),
    relief: z.string().min(1, "Le relief est requis"),
    description: z.string({ invalid_type_error: "La description est requise." }).min(1, "La description est requise").min(10, "La description doit avoir au moins 10 caractères"),
    country: z.string({ invalid_type_error: "Le pays est requis" }).min(1, "Le pays est requis"),
    city: z.string().min(1, "La ville est requise"),
    street: z.string().min(1, "Le quartier est requis"),
    area: z.number({ invalid_type_error: "L'espace est requis." }).positive("L'espace est requis."),
    certificat_of_ownership: z.boolean(),
    technical_doc: z.boolean(),
  coordinate_link: z.any() 
        .refine((files) => files?.length === 1, "Un fichier de coordonnées est requis.")
        .refine((files) => files?.[0] instanceof File, "Le format doit être un fichier."),
    videoLink: z.string().url('Le lien de la video doit être une adresse web valide').min(1, "Le lien de la video est requis"),
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
            message: "Les images doivent peser 10MB maximum",
        }).optional(),
    is_fragmentable: z.boolean(),
    fragments: z.string().optional()
}).superRefine(({ is_fragmentable, fragments, area }, ctx) => {
    if (is_fragmentable && !fragments) {
        ctx.addIssue({
            code: 'custom',
            message: 'Les fragments sont requis',
            path: ['fragments']
        })
    }
    if (fragments) {
        const values = fragments?.split(';').map((fragment) => Number(fragment.trim()))
        if (values.reduce((a, b) => a + b, 0) !== area) {
            ctx.addIssue({
                code: 'custom',
                message: 'La somme des valeurs des fragments doit correspondre à la surface',
                path: ['fragments']
            })
        }
    }
})

export type LandSchema = z.infer<typeof landSchema>