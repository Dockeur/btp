import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Checkbox, Input, Password, Text } from "rizzui";
import { routes } from "src/routes";
import { RegisterSchema, registerSchema } from "src/schema/register";
import { register as registerUser } from '../../../services/AuthService';
const Register = () => {

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const { handleSubmit, formState: { errors }, register } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await registerUser(data);

      if (res.success) {
        setSuccessMessage("Votre compte a été crée avec succès, vous allez être redirigé vers la page de connexion dans quelques secondes.");
        setTimeout(() => {
          navigate(routes.login.path, { replace: true });
        }, 3000);
      } else {
        setErrorMessage(res.message);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 422) {
        setErrorMessage(error.response.data.data.errors.email[0]);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-white p-4">
      {/* <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('../../../../src/assets/img2.jpg')" }}>
      </div> */}
      <div className="lg:w-1/2 hidden md:flex">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
          className="w-full"
          alt="login image"
        />
      </div>
      <section className=" bg-white max-w-lg rounded-lg w-full shadow-xl ">
        <div className="bg-Cprimary text-white font-poppins font-semibold text-2xl text-center p-4 rounded-t-lg lg:text-4xl">
          {" "}
          Inscrivez-vous
        </div>
        {successMessage &&
          (
            <div className="p-4">
              <Alert color="success" className="bg-green-100" bar={true}>
                <Text fontWeight="bold">Compte crée avec succès</Text>
                <Text>{successMessage}</Text>
              </Alert>
            </div>
          )}
        {errorMessage &&
          (
            <div className="p-4">
              <Alert color="danger" className="bg-red-100" bar={true}>
                <Text fontWeight="bold">Erreur de validation</Text>
                <Text>{errorMessage}</Text>
              </Alert>
            </div>
          )}
        <div className="p-6">
          <div className=" flex  ">
            {/* Right column container with form */}
            <div className=" w-full  ">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email input */}
                <div className="relative mb-6">
                  <Input
                    {...register("last_name")}
                    error={errors.last_name?.message}
                    className="text-black "
                    type="text"
                    label="Nom(s)"
                    placeholder="Nom"
                  />
                  <Input
                    {...register("first_name")}
                    error={errors.first_name?.message}
                    className=" text-black mt-3 "
                    type="text"
                    label="Prénom"
                    placeholder="Prénom"
                  />
                  <Input
                    {...register("email")}
                    error={errors.email?.message}
                    className=" text-black mt-3"
                    type="email"
                    label="Email"
                    placeholder="Email"
                  />
                  <Password
                    {...register("password")}
                    error={errors.password?.message}
                    className="text-black mt-3"
                    label="Password"
                    placeholder="Mot de passe"
                  />
                  <Password
                    {...register("password_confirmation")}
                    error={errors.password_confirmation?.message}
                    className="text-black mt-3"
                    label="Password"
                    placeholder="Confirmez le mot de passe"
                  />
                  <Checkbox
                    {...register("accept")}
                    error={errors.accept?.message}
                    className="mt-3"
                    size="sm"
                    label={
                      <p className="">
                        J'accepte les
                        <Link to="" className="text-Cprimary">
                          {" "}
                          termes et conditions d'utilisations{" "}
                        </Link>{" "}
                      </p>
                    }
                    labelClassName="text-md"
                  />
                  <Checkbox
                    className="mt-3 "
                    size="sm"
                    label="S'abonner à la newsletter"
                    labelClassName="text-md"
                  />
                </div>

                {/* Submit button */}
                <Button
                  isLoading={loading}
                  type="submit"
                  className="py-5 w-full text-white font-poppins text-lg bg-Cprimary uppercase"
                >
                  S'inscrire
                </Button>
                <p className="pt-4">
                  Vous avez déjà un compte ?{" "}
                  <Link to={routes.login.path} className="text-Cprimary underline ml-2">
                    Se connecter
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
