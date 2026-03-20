import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select } from "rizzui";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link} from "react-router-dom";
import { routes } from "@/routes";
import { IndexPorposeSchema, indexPorposeSchema } from "@/schema/indexPorpose";
import RetailSpacePorpose from "./RetailSpacePorpose";
import ProjectPorpose from "./ProjectPorpose";
import LandPorpose from "./LandPorpose";
import DuplexePorpose from "./DuplexePorpose";
import PropertyPropose from "./PropertyPropose";

const Index = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setValue,
  } = useForm<IndexPorposeSchema>({
    resolver: zodResolver(indexPorposeSchema),
  });
 
  const [selectedType, setSelectedType] = useState("Terrain");

  const onSubmit = useCallback(
    (values: IndexPorposeSchema) => {
      // window.alert(JSON.stringify(values, null, 4));
      const dataWithPropertyType = { ...values, projectType: selectedType };
      window.alert(JSON.stringify(dataWithPropertyType, null, 4));
     
    },
    [selectedType]
  );
  const renderFormByType = () => {
    switch (selectedType) {
      case "Propriété":
        return <PropertyPropose />;
      case "Projet":
        return <ProjectPorpose />;
      case "Espace commercial":
        return <RetailSpacePorpose />;
      default:
        return <LandPorpose />;
    }
  };

  return (
    <>
      <div className="p-6 text-justify lg:text-base text-sm container">
        <p className="">
          Bienvenue sur notre plateforme immobilière! Chez EFFICACE, nous
          sommes là pour vous accompagner dans la réalisation de vos projets
          immobiliers.
          <span>
            {" "}
            <br /> Vous avez un bien immobilier que vous souhaitez proposer à
            l'investissement, à la vente ou à la location ? Nous sommes là pour
            vous aider à concrétiser cette opportunité. Cliquez sur le bouton
            ci-dessous pour sélectionner le type de proposition que vous
            souhaitez nous soumettre :
          </span>{" "}
          <br />
          <span>
            {" "}
            <br /> Une fois votre proposition soumise, notre équipe se chargera
            d'examiner attentivement votre offre. Nous vous reviendrons dans les
            plus brefs délais pour discuter de votre projet et explorer les
            possibilités de collaboration et des prochaines étapes à suivre. Si
            vous avez des questions supplémentaires, n'hésitez pas à nous
            contacter{" "}
            <Link className="text-Cprimary underline" to={routes.contact.path}>
              {" "}
              ici.
            </Link>
          </span>{" "}
          <br />
          Chez EFFICACE, nous valorisons chaque proposition et nous nous
          engageons à offrir une expérience transparente et efficace à nos
          utilisateurs. Rejoignez-nous dès aujourd'hui pour participer à la
          construction d'un avenir immobilier innovant et prospère.
        </p>
        
        <div className="text-primary lg:mt-8 mt-2 w-full flex justify-center ">
          <div className="lg:w-1/2 w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="projectType"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Choisir un type de projet a propose"
                    placeholder="Choisir un type de projet"
                    {...field}
                    {...register("projectType")}
                    error={errors.projectType?.message}
                    value={field.value}
                    onChange={(selectedOption: { value: string; label: string; }) => {
                      setValue("projectType", selectedOption.value);
                      setSelectedType(selectedOption.value);
                    }}
                    options={[
                      { value: "Terrain", label: "Terrains" },
                      { value: "Propriété", label: "Propriétés" },
                      { value: "Projet", label: "Projets" },
                      {
                        value: "Espace commercial",
                        label: "Spaces commerciaux",
                      },
                    ]}
                  />
                )}
              />
              {renderFormByType()}
              {/* <Button
                type="submit"
                className=" mt-2 w-full text-white font-poppins bg-Cprimary-hover animate-bounc"
              >
                {" "}
                Soumettre
              </Button> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;


