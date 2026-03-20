import { z } from "zod";

export const indexPorposeSchema = z.object({
//   projectType: z.string({
//     errorMap: () => {
//       return { message: "Il faut choisir un de type de projet" };
//     },
//   }),
  projectType: z.string().min(1, "Bien vouloir choisir un type de projet").min(3, "Il faut choisir un de type de projet"),
});

export type IndexPorposeSchema = z.infer<typeof indexPorposeSchema>;
