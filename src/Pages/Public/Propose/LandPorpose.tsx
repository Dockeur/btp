import { LandPorposeSchema, landPorposeSchema } from "@/schema/landPorpose";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "rizzui";

const LandPorpose = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LandPorposeSchema>({
    resolver: zodResolver(landPorposeSchema),
  });

  const onSubmit = async (data: LandPorposeSchema) => {
    window.alert(JSON.stringify(data, null, 4));
  };

  return (
    <>
      <div className="p-6 text-justify lg:text-base text-sm ">
        <h2 className="text-center lg:text-2xl p-2 font-semibold text-Csecondary1 underline">
          Proposez votre terrain
        </h2>
        <p className="text-center">
          Pour soumettre votre terrain, veuillez remplir le formulaire
          suivant :
        </p>
      </div>
      <div className="w-full rounded-lg divide-y border ">
        <form action="">
          <div className="flex gap-2 w-full flex-col md:flex-row">
            <div className="flex flex-col gap-4 p-4 w-full items-center ">
              <div className="flex flex-col gap-3 w-full pt-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <Input className="w-full" label="Nom" />
                  <Input className="w-full" label="Prénom" />
                </div>
                <Input label="email" />
                <Input label="Téléphone" />
                <Input label="Mot de passe" />

              </div>
            </div>
            <div className="flex flex-col gap-2 self-start  p-4 w-full">
              <div className="flex flex-col gap-3 w-full pt-4">
                <Input label="Nom" />
                <Input label="Nom" />
                <Input label="Nom" />

              </div>

            </div>

          </div>
          <div className="m-3 ">
            <Button type="submit" className="bg-Cprimary text-lg w-full">Soumettre</Button>
          </div>

        </form>
      </div>
    </>

  );
};

export default LandPorpose;
