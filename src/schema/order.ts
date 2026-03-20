import { z } from "zod";

export const orderSchema = z.object({
    unit_price: z.number({ invalid_type_error: "Le prix de l'unité est requis" }).positive("Le prix de l'unité doit être positif").min(1, "Le prix de l'unité est requis"),
    total_price: z.number({ invalid_type_error: "Le prix total est requis" }).positive("Le prix total doit être positif").min(1, "Le prix total est requis"),
    status: z.string({ required_error: "Le statut est requis" }).min(1, "Le statut est requis"),
    product_id: z.string({ required_error: "Le produit est requise" }),
    customer_id: z.string({ required_error: "Le client est requise" }),
})
export type OrderSchema = z.infer<typeof orderSchema>