import { z } from "zod";

export const productSchema = z.object({
    description: z.string().min(1, "La description est requise"),
    unit_price: z.number({ invalid_type_error: "Le prix de l'unité est requis" }).positive("Le prix de l'unité doit être positif").min(1, "Le prix de l'unité est requis"),
    total_price: z.number({ invalid_type_error: "Le prix total est requis" }).positive("Le prix total doit être positif").min(1, "Le prix total est requis"),
    status: z.string({ required_error: "Le statut est requis" }).min(1, "Le statut est requis"),
    publish: z.boolean(),
    productable_id: z.string({ required_error: "La propriété est requise" }),
    type: z.string({ required_error: "Le type est requis" }).min(1, "Le type est requis"),
    for_rent: z.boolean(),
    for_sale: z.boolean(),
    published_at: z.date().nullable().optional(),
}).superRefine(({ for_sale, for_rent }, ctx) => {
    if (!for_sale && !for_rent) {
        ctx.addIssue({
            code: 'custom',
            message: 'Veuillez choisir une des options',
            path: ['for_sale']
        })
    } else if (for_sale && for_rent) {
        ctx.addIssue({
            code: 'custom',
            message: 'Veuillez choisir une seule option',
            path: ['for_sale']
        })
    }
})

export type ProductSchema = z.infer<typeof productSchema>