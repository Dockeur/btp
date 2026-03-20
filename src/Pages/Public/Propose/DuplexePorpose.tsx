import React from "react";
import { Button } from "rizzui";

const DuplexePorpose = () => {
  const handleSubmit = () => {};
  return (
    <>
      <div className="p-6 text-justify lg:text-base text-sm ">
        <h2 className="text-center font-semibold text-Csecondary1 underline">
          Proposez votre Duplexe
        </h2>
        <p className="text-center">
          Pour soumettre votre projet immobilier, veuillez remplir le formulaire
          suivant :
        </p>
        <div className="text-primary mt-8  w-full flex justify-center">
          <div className="lg:w-1/3 w-full">
            <form onSubmit={handleSubmit} className="">
              <Button
                type="submit"
                className=" mt-2 w-full text-white font-poppins bg-Cprimary-hover animate-bounc"
              >
                {" "}
                Soumettre
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DuplexePorpose;
