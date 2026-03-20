import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/routes";
import { UserProfileSchema, userProfileSchema } from "@/schema/userProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, FileInput, Input, Select } from "rizzui";
import { toast } from "react-toastify";
import ChangePassword from "@/components/admin/ui/ChangePassword";
import LoginHistory from "@/components/admin/ui/LoginHistory";
import { formatDate } from "@/utils/format-date";

const Profile = () => {
  const { getAuth, updateProfile, getError } = useAuth();
  const auth = getAuth();

  // Vérification si auth et auth.user existent
  if (!auth || !auth.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg">Chargement du profil...</span>
      </div>
    );
  }

  const [imageUrl, setImageUrl] = useState(auth.user?.profile || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState("Cameroun");
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      last_name: auth.last_name,
      first_name: auth.first_name,
      email: auth.user?.email,
      phone: auth?.phone,
      country: auth?.address?.country,
      city: auth?.address?.city,
      street: auth?.address?.street,
    },
  });

  const onSubmit = async (data: UserProfileSchema, e: any) => {
    console.log(data.profile[0]);

    try {
      setLoading(true);
      const formData = new FormData(e.target);
      if (data.profile[0]) {
        formData.append("profile", data.profile[0]);
      } else {
        formData.delete("profile");
      }

      toast.promise(updateProfile(formData), {
        pending: "Chargement...",
        success: {
          render() {
            setLoading(false);
            return "Profil mis à jour avec succès !";
          },
        },
        error: {
          render() {
            setLoading(false);
            return getError();
          },
        },
      });
    } catch (error) {
      toast.error("Impossible de mettre à jour le profil");
      setLoading(false);
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-[10%] max-lg:px-4 my-10 max-lg:flex-col flex gap-8 items-center justify-center ">
      <div className="flex gap-2 self-start flex-col lg:max-w-[16rem] w-full p-4 rounded-lg divide-y border">
        <Link to={routes.profile.path}>
          <span className="hover:bg-slate-200 p-2 rounded">Mon profile</span>
        </Link>
        <Link to="#">
          <span className="hover:bg-slate-200 p-2 rounded">
            Mes commandes
          </span>
        </Link>
        <span className="hover:bg-slate-200 p-2 rounded">
          Documents et contrats
        </span>
        <span className="hover:bg-slate-200 p-2 rounded">
          Portefeuille d'investissements
        </span>
        <Link to="#">
          <span className="hover:bg-slate-200 p-2 rounded">
            Mes propositions
          </span>
        </Link>
        <span className="hover:bg-slate-200 p-2 rounded">
          Historique des transactions
        </span>
      </div>

      <div className="flex lg:gap-14 gap-8 flex-col shadow-lg w-full lg:p-4 lg:border rounded-lg ">
        <div className="flex flex-wrap items-center justify-center rounded-t-lg bg-slate-300 sm:px-2 w-full">
          <div className="h-40 w-40 overflow-hidden sm:rounded-full sm:relative sm:p-0 top-10 left-5 p-3 ">
            <img
              src={imageUrl || "/default-avatar.png"}
              alt={auth.first_name}
              className="bg-Cprimary w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="lg:w-2/3 lg:text-center lg:pl-5 lg:mt-10 mt-2 flex flex-col">
            <span>
              <span className=" text-black font-bold ">
                Noms :{" "}
              </span>
              {auth.first_name + "  " + auth.last_name}
            </span>
            <span>
              <span className=" text-black font-bold">
                Email :{" "}
              </span>
              {auth.user?.email}
            </span>

            <span>
              <span className=" text-black font-bold">
                Localisation :{" "}
              </span>
              {(auth.address?.country || "Non renseigné") +
                "-" +
                (auth.address?.city || "") +
                "-" +
                (auth.address?.street || "")}
            </span>

            <span>
              <span className=" text-black font-bold">
                Téléphone :{" "}
              </span>
              {auth.phone ?? "Non renseigné"}
            </span>
            <span>
              <span className=" text-black font-bold">
                Crée le :{" "}
              </span>
              {formatDate(
                new Date(auth.created_at),
                "D MMMM YYYY, HH:mm:ss"
              )}
            </span>

            <span>
              <span className=" text-black font-bold">
                Modifié le :{" "}
              </span>
              {formatDate(
                new Date(auth.updated_at),
                "D MMMM YYYY, HH:mm:ss"
              )}
            </span>
          </div>
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <div className="flex flex-col lg:w-1/2 gap-4 w-full  ">
            <div className="rounded-lg border w-full flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
              <div className="py-4 px-4">
                <span className="text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500">
                  Informations de profil
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3 w-full p-4">
                  <div className="flex gap-3 max-lg:flex-col">
                    <Input
                      className="w-full "
                      error={errors.last_name?.message}
                      {...register("last_name")}
                      label="Nom"
                      inputClassName="ring-0 dark:border-slate-600"
                    />

                    <Input
                      className="w-full"
                      error={errors.first_name?.message}
                      {...register("first_name")}
                      label="Prénom"
                      inputClassName="ring-0 dark:border-slate-600"
                    />
                  </div>
                  <Input
                    error={errors.email?.message}
                    {...register("email")}
                    label="Email"
                    inputClassName="ring-0 dark:border-slate-600"
                  />
                  <Input
                    error={errors.phone?.message}
                    {...register("phone")}
                    label="Téléphone"
                    inputClassName="ring-0 dark:border-slate-600"
                  />
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Pays"
                        {...field}
                        {...register("country")}
                        error={errors.country?.message}
                        value={field.value}
                        onChange={(selectedOption: {
                          value: string;
                          label: string;
                        }) => {
                          setValue("country", selectedOption.value);
                          setSelectedType(selectedOption.value);
                        }}
                        options={[
                          { value: "Cameroun", label: "Cameroun" },
                          { value: "Maroc", label: "Maroc" },
                          { value: "Tunisie", label: "Tunisie" },
                          { value: "Algerie", label: "Algerie" },
                          { value: "Soudan", label: "Soudan" },
                          { value: "Afrique du Sud", label: "Afrique du Sud" },
                          { value: "Egypte", label: "Egypte" },
                          { value: "Ethiopie", label: "Ethiopie" },
                          { value: "Ouganda", label: "Ouganda" },
                          { value: "Uganda", label: "Uganda" },
                          { value: "Gabon", label: "Gabon" },
                          { value: "Congo", label: "Congo" },
                          { value: "Guineé", label: "Guineé" },
                          { value: "Suisse", label: "Suisse" },
                          { value: "Tchad", label: "Tchad" },
                          { value: "France", label: "France" },
                          { value: "Canada", label: "Canada" },
                          { value: "Espagne", label: "Espagne" },
                          { value: "Italie", label: "Italie" },
                          { value: "Allemagne", label: "Allemagne" },
                          { value: "Japon", label: "Japon" },
                          { value: "Chine", label: "Chine" },
                          { value: "Inde", label: "Inde" },
                          { value: "Russie", label: "Russie" },
                          { value: "Etats-Unis", label: "Etats-Unis" },
                          { value: "Angleterre", label: "Angleterre" },
                          { value: "Togo", label: "Togo" },
                        ]}
                      />
                    )}
                  />
                  <div className="gap-3 grid lg:grid-cols-2  ">
                    <Input
                      className=""
                      error={errors.city?.message}
                      {...register("city")}
                      label="Ville"
                      inputClassName="ring-0 dark:border-slate-600"
                    />
                    <Input
                      error={errors.street?.message}
                      {...register("street")}
                      label="Quartier"
                      inputClassName="ring-0 dark:border-slate-600"
                    />
                  </div>
                  <FileInput
                    error={errors.profile?.message as string}
                    label="Photo"
                    {...register("profile")}
                    onChange={(e) => {
                      register("profile").onChange(e);
                      handleImageChange(e);
                    }}
                    inputClassName="ring-0 dark:border-slate-600"
                  />
                  <Button
                    isLoading={loading}
                    type="submit"
                    className="bg-yellow-500  text-lg"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-3 border rounded-lg  self-start w-full">
              <ChangePassword />
            </div>
          </div>
          <div className="border rounded-lg lg:w-1/2 w-full self-start">
            <LoginHistory auth={auth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;