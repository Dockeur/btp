import { routes } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, Password } from "rizzui";
import { useAuth } from "src/hooks/useAuth";
import { LoginSchema, loginSchema } from "src/schema/login";
import { redirectToGoogleAuth, verifyGoogleCredential } from "src/services/AuthService";
import GoogleOneTap from "./Googleonetap";


function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [oneTapVisible, setOneTapVisible] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || routes.home.path;
  const { login, getError, loginWithToken }: any = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleCredential = async (credential: string) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await verifyGoogleCredential(credential);
      if (res.success && res.user) {
        await loginWithToken(credential, res.user);
        navigate(from, { replace: true });
      } else {
        setErrorMessage("Authentification Google échouée. Veuillez réessayer.");
      }
    } catch (err: any) {
      setErrorMessage("Erreur lors de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const success = await login(data);
      if (success) {
        setTimeout(() => navigate(from, { replace: true }), 100);
      } else {
        setErrorMessage(getError() || "Identifiants incorrects");
      }
    } catch {
      setErrorMessage("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white p-4">
      {oneTapVisible && (
        <GoogleOneTap
          onCredential={handleGoogleCredential}
          onSkip={() => setOneTapVisible(false)}
        />
      )}

      <div className="lg:w-1/2 hidden md:flex">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
          className="w-full"
          alt="login image"
        />
      </div>

      <section className="border bg-white max-w-lg rounded-lg w-full shadow-xl">
        <div className="bg-Cprimary text-white font-poppins font-semibold text-2xl text-center p-4 rounded-t-lg lg:text-4xl">
          Se connecter
        </div>
        <div className="p-6">
          <div className="flex">
            <div className="w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}
                <div className="relative mb-6">
                  <Input
                    {...register("email")}
                    error={errors.email?.message}
                    className="text-black mt-3"
                    label="Email"
                    autoComplete="off"
                    placeholder="Entrez votre email"
                  />
                  <Password
                    {...register("password")}
                    error={errors.password?.message}
                    className="text-black mt-3"
                    label="Mot de passe"
                    placeholder="Entrez votre mot de passe"
                  />
                  <div className="mt-3 flex items-center justify-between mx-auto">
                    <Checkbox className="mt-3" size="sm" label="Se souvenir de moi" labelClassName="text-md" />
                    <p className="mt-3">
                      <Link to={routes.forgotPassword.path} className="text-Cprimary">
                        Mot de passe oublié ?
                      </Link>
                    </p>
                  </div>
                </div>

                <Button isLoading={loading} type="submit" className="py-5 w-full text-white font-poppins text-lg bg-Cprimary">
                  Se connecter
                </Button>

                <p className="pt-4">
                  Vous n'avez pas de compte?
                  <Link to={routes.register.path} className="text-Cprimary underline ml-2">Créer un compte</Link>
                </p>

                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                  <p className="mx-4 mb-0 text-center font-semibold text-sm text-gray-500">Ou connectez-vous avec</p>
                </div>

                <button
                  type="button"
                  onClick={redirectToGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium text-sm transition-colors shadow-sm mb-3"
                >
                  <FcGoogle className="text-xl flex-shrink-0" />
                  Continuer avec Google
                </button>

                <div className="w-full flex items-center justify-center gap-4">
                  <Link to=""><FaFacebook className="text-xl text-blue-600" /></Link>
                  <Link to=""><FaLinkedin className="text-xl text-blue-700" /></Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;