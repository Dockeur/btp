import { routes } from "@/routes";
import React from "react";
import { Link } from "react-router-dom";

import { Button, PinCode } from "rizzui";
const handleRegistration = async (e: any) => {
  e.preventDefault();
  // Vérifier si tous les champs sont remplis
};

const UserValided = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-white p-4">
        <div className="lg:w-1/2 hidden md:flex">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full"
            alt="login image"
          />
        </div>
        <section className=" bg-white max-w-lg rounded-lg w-full shadow-xl shadow-orange-100  ">
          <div className="bg-Cprimary text-white font-poppins font-semibold text-xl text-center p-4 rounded-t-lg lg:text-2xl">
            {" "}
            Validez votre mot de passe
          </div>
          <div className="p-6">
            <div className=" flex  ">
              {/* Right column container with form */}
              <div className=" w-full  ">
                <form onSubmit={handleRegistration}>
                  {/* Email input */}
                  <div className="relative mb-6">
                    <div className="p-5 ">
                      {/* Contenu de Step 2 */}
                      <PinCode length={6} />
                    </div>
                  </div>
                  <Link to={routes.login.path}>
                    <Button
                      type="submit"
                      className="py-5 w-full text-white font-poppins text-lg bg-Cprimary uppercase"
                    >
                      Valider
                    </Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UserValided;
