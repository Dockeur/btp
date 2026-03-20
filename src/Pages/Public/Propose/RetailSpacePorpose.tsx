import React from "react";
import { Button, Input, NumberInput } from "rizzui";

const RetailSpacePorpose = () => {

  return (
    <>
      <div className="p-6 text-justify lg:text-base text-sm ">
        <h2 className="text-center lg:text-2xl p-2  font-semibold text-Csecondary1 underline lg:uppercase">
          Proposez votre Espace commercial
        </h2>
        <p className="text-center">
          Pour soumettre votre Espace commercial veuillez remplir le formulaire
          suivant :
        </p>
      </div>
      <div className="w-full rounded-lg divide-y border  ">
        <form action="">
          <div className="lg:flex gap-4 w-full ">
            <div className="flex flex-col gap-4 p-4 w-full items-center ">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-3 pt-4">
                  <Input className="w-full" label="Nom" placeholder="mane" />
                  <Input className="w-full" label="Prénom" />
                </div>
                <Input type="number" label="Number" />
                <Input label="Téléphone" />
                <Input label="Mot de passe" />
                <NumberInput
                  label="Your Number"
                  formatType="numeric"
                  value="20000000"
                  displayType="input"
                  thousandSeparator=","
                  thousandsGroupStyle="none"
                  customInput={Input as React.ComponentType<unknown>}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 self-start p-4 w-full">
              <div className="flex flex-col gap-3 w-full pt-4">
                <Input label="Nom" />
                <Input label="Nom" />
                <Input label="Nom" />
                <Input type="datetime-local" label="Datetime Local" />
                <Input type="url" label="Url" placeholder="Url" />
              </div>
            </div>
          </div>
          <div className="m-3">
            <Button className="bg-Cprimary text-lg w-full">Soumettre</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RetailSpacePorpose;
