import { z } from "zod";

export const userProfileSchema = z.object({
  last_name: z
    .string()
    .min(1, "Le nom est requis")
    .min(3, "Le nom doit avoir au moins 3 caractères"),
  first_name: z
    .string()
    .min(1, "Le prénom est requis")
    .min(3, "Le prénom doit avoir au moins 3 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email({ message: "Email non valide" }),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  country: z.string().min(1, "Le choix du pays est requis"),
  city: z
  .string()
  .min(1, "La ville est requise")
  .min(3, "Le nom de la ville doit avoir au moins 3 caractères"),

  street: z
  .string()
  .min(1, "Le quartier est requis")
  .min(3, "Le nom du quartier doit avoir au moins 3 caractères"),

  profile: z
    .any()
    .refine(
      (file) =>
        file?.length === 0
          ? true
          : ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
              file?.[0]?.type
            ),
      {
        message: "L'image doit avoir les extensions .png, .jpg, .jpeg, .gif",
      }
    )
    .refine(
      (file) => {
        return file?.length === 0 ? true : file?.[0]?.size <= 10 * 1024 * 1024;
      },
      {
        message: "L'image doit peser 10MB maximum",
      }
    ),
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
