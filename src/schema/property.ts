import { z } from "zod";

export const propertySchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis." }).min(3, { message: "Le titre doit avoir au moins 3 caractères." }),
    type_name: z.string().min(1, { message: "Le type est requis." }).min(3, { message: "Le titre doit avoir au moins 3 caractères." }),
    build_area: z.number({ invalid_type_error: "La surface de construction est requise." }).positive("La surface de construction est requise."),
    field_area: z.number({ invalid_type_error: "La surface de terrain est requise." }).positive("La surface de terrain est requise."),
    levels: z.number().int("Le nombre de niveaux doit un nombre entier").positive("Le nombre de niveaux est requis."),
    has_garden: z.boolean(),
    parkings: z.number({ invalid_type_error: "Le nombre de parkings est requis." }).int('Le nombre de parkings doit être un nombre entier').positive("Le nombre de parkings est requis."),
    has_pool: z.boolean(),
    basement_area: z.number({ invalid_type_error: "La surface du sous-sol est requise." }).nonnegative("La surface du sous-sol est requise."),
    ground_floor_area: z.number({ invalid_type_error: "La surface du rez-de-chaussée est requise." }).positive("La surface du rez-de-chaussée est requise."),
    type: z.string({ required_error: "Le type est requis." }).min(1, { message: "Le type est requis." }),
    description: z.string().min(1, { message: "La description est requise." }).min(10, { message: "La description doit avoir au moins 10 caractères." }),
    country: z.string({ required_error: "Le pays est requis." }).min(1, { message: "Le pays est requis." }),
    city: z.string().min(1, { message: "La ville est requise." }),
    street: z.string().min(1, { message: "Le quartier est requise." }),
    coordinate_link: z.string().url('Le lien de coordonnées doit être une adresse web valide').min(1, { message: "Le lien de coordonnées est requis." }),
    bedrooms: z.number({ invalid_type_error: "Le nombre de chambres est requis." }).int('Le nombre de chambres doit être un nombre entier').positive("Le nombre de chambres est requis."),
    number_of_salons: z.number({ invalid_type_error: "Le nombre de salons est requis." }).int('Le nombre de salons doit être un nombre entier').positive("Le nombre de salons est requis."),
    bathrooms: z.number({ invalid_type_error: "Le nombre de salles de bain est requis." }).int('Le nombre de salles de bain doit être un nombre entier').positive("Le nombre de salles de bain est requis."),
    estimated_payment: z.number({ invalid_type_error: "Le paiement estimé est requis." }).positive("Le paiement estimé est requis."),
    proposed_product_ids: z.array(z.string()).min(1, { message: "Au moins un terrain doit être sélectionné." }),
      number_of_appartements: z.number({ 
        invalid_type_error: "Le nombre d'appartements est requis." 
    })
    .int('Le nombre d\'appartements doit être un nombre entier')
    .positive("Le nombre d'appartements est requis.")
    .optional(),
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
        }).optional(),
    parts_of_building: z.array(z.object({
        title: z.string().min(1, { message: "Le titre de la partie est requis." }),
        description: z.string().min(1, { message: "La description de la partie est requise." }),
        photos: z.array(z.instanceof(File)).optional()
    })).optional(),
    building_finance: z.object({
        project_study: z.number({ invalid_type_error: "L'étude du projet est requise." }).nonnegative("L'étude du projet doit être un nombre positif."),
        building_permit: z.number({ invalid_type_error: "Le permis de construire est requis." }).nonnegative("Le permis de construire doit être un nombre positif."),
        structural_work: z.number({ invalid_type_error: "Les travaux de structure sont requis." }).nonnegative("Les travaux de structure doivent être un nombre positif."),
        finishing: z.number({ invalid_type_error: "Les finitions sont requises." }).nonnegative("Les finitions doivent être un nombre positif."),
        equipments: z.number({ invalid_type_error: "Les équipements sont requis." }).nonnegative("Les équipements doivent être un nombre positif."),
        cost_of_land: z.number({ invalid_type_error: "Le coût du terrain est requis." }).nonnegative("Le coût du terrain doit être un nombre positif.")
    }).optional()
});

export type PropertySchema = z.infer<typeof propertySchema>;