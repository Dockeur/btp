import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input, Password, PinCode, Stepper, Text } from "rizzui";
import { useForgetPassword } from "src/hooks/useForgetPassword";
import { routes } from "src/routes";
import { sendCode } from "src/services/AuthService";
import { z } from "zod";

export default function ForgotPassword() {
  const { getCode, confirmCode, getEmail, resetAll, resetMessage, step, getError, getSuccess, resetPassword }: any = useForgetPassword();
  const [currentStep, setCurrentStep] = useState(step);

  const schema = z.object({
    email: z.string().min(1, "L'email est requis").email({ message: "Email non valide" }).optional(),
    code: z.string().min(1, "Le code est requis").min(6, "Le code doit avoir 6 caractères").optional(),
    password: z.string().min(1, "Le mot de passe est requis").min(6, "Le mot de passe doit avoir 6 caractères").optional(),
    password_confirmation: z.string().min(1, "La confirmation de mot de passe est requise").min(6, "La confirmation de mot de passe doit avoir 6 caractères").optional(),
  }).superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "les mots de passe ne correspondent pas",
        path: ["password_confirmation"],
      });
    }
  })

  const navigate = useNavigate();

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (currentStep === 1) {
      if (!watch("code")) {
        setValue("code", "");
      }
    };
  }, [currentStep]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      setMessage({} as any);
      setOpen(false);
      resetMessage();
      console.log(data)
      switch (currentStep) {
        case 0:
          await getCode(data);
          if (getSuccess()) {
            setMessage({
              type: "success",
              content: getSuccess(),
              class: "bg-green-100",
              title: "Code envoyé",
            });
            setOpen(true);
            setTimeout(() => {
              setCurrentStep(1);
            }, 3000);
          } else {
            setMessage({
              type: "danger",
              content: getError(),
              class: "bg-red-100",
              title: "Erreur",
            });
            setOpen(true);
          }
          break;
        case 1:
          await confirmCode(data);
          if (getSuccess()) {
            setMessage({
              type: "success",
              content: getSuccess(),
              class: "bg-green-100",
              title: "Code validé",
            });
            setOpen(true);
            setTimeout(() => {
              setCurrentStep(2);
            }, 3000);
          } else {
            setMessage({
              type: "danger",
              content: getError(),
              class: "bg-red-100",
              title: "Erreur",
            });
            setOpen(true);
          }
          break;
        case 2:
          await resetPassword(data);
          if (getSuccess()) {
            setMessage({
              type: "success",
              content: getSuccess(),
              class: "bg-green-100",
              title: "Mot de passe modifié",
            });
            setOpen(true);
            resetAll();
            setTimeout(() => {
              navigate(routes.login.path, { replace: true });
            }, 3000);
          } else {
            setMessage({
              type: "danger",
              content: getError(),
              class: "bg-red-100",
              title: "Erreur",
            });
            setOpen(true);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // reset();
      setLoading(false);
    }
  };
  const [open, setOpen] = useState(step === 0 ? true : false);
  const initialMessage = step === 0 ? {
    type: "info",
    content: "Renseignez votre adresse email pour recevoir un code de validation",
    class: "bg-blue-100",
    title: "Code de validation",
  } : {};
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const handleResend = async () => {
    try {
      const res = await sendCode({
        email: getEmail(),
      });
      if (res.success) {
        setMessage({
          type: "success",
          content: res.message,
          class: "bg-green-100",
          title: "Code renvoyé avec succès",
        });
        setOpen(true);
      } else {
        setMessage({
          type: "danger",
          content: res.message,
          class: "bg-red-100",
          title: "Erreur",
        });
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center h-screen bg-white p-4">
        <div className="lg:w-1/2 hidden md:flex">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full"
            alt="login image"
          />
        </div>
        <div className="bg-white max-w-lg rounded-lg w-full shadow-xl ">
          <div className="bg-Cprimary text-white font-poppins font-semibold text-xl text-center p-4 rounded-t-lg lg:text-2xl">
            Réinitialiser votre mot de passe
          </div>
          <div className="p-5 ">
            <Stepper currentIndex={currentStep}>
              <Stepper.Step title="Step 1" description="" />
              <Stepper.Step title="Step 2" description="" />
              <Stepper.Step title="Step 3" description="" />
            </Stepper>
          </div>

          <div className="">
            {open && (
              <div className="px-4">
                <Alert
                  color={message.type as any}
                  className={message.class}
                  bar={true}
                  closable
                  onClose={() => setOpen(false)}
                >
                  <Text fontWeight="bold">{message.title}</Text>
                  <Text>{message.content}</Text>
                </Alert>
              </div>
            )}
            {currentStep === 0 && (
              <div>
                <div className="p-5">
                  <div className=" flex  ">
                    {/* Right column container with form */}
                    <div className=" w-full  ">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email input */}
                        <div className="relative">
                          <Input
                            {...register("email")}
                            error={errors.email?.message}
                            // inputClassName="border-blue-500"
                            className=" text-black mt-3"
                            label="Email"
                            placeholder="Entrez votre email"
                          />
                          <Button className="py-5 w-full text-white font-poppins text-lg bg-Cprimary my-4" type="submit" isLoading={loading}>Envoyer</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-5 flex justify-center">
                  {/* Contenu de Step 2 */}
                  <PinCode
                    type="number"
                    center={false}
                    setValue={(value) => {
                      setValue("code", value as string)
                    }}
                    error={errors.code?.message}
                    length={6}
                  />
                </div>
                <div className="p-5 flex justify-between gap-4">
                  <Button className="py-5 w-full text-white font-poppins" type="button" onClick={handleResend}>Renvoyer le code</Button>
                  <Button className="py-5 w-full text-white font-poppins text-lg bg-Cprimary" type="submit" isLoading={loading}>Confirmer</Button>
                </div>
              </form>
            )}
            {currentStep === 2 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  {/* Formulaire de réinitialisation du mot de passe */}
                  <Input
                    // inputClassName="border-blue-500"
                    className=" text-black mt-3"
                    label="Email"
                    value={getEmail()}
                    disabled
                  />
                  <Password
                    {...register("password")}
                    error={errors.password?.message}
                    // inputClassName="border-blue-500 "
                    className="text-black mt-3"
                    label="Mot de passe"
                    placeholder="Nouveau mot de passe "
                  />
                  <Password
                    {...register("password_confirmation")}
                    error={errors.password_confirmation?.message}
                    // inputClassName="border-blue-500"
                    className="text-black mt-3"
                    label="Confirmation de mot de passe"
                    placeholder="Confirmez le mot de passe"
                  />
                  <Button className="py-5 w-full text-white font-poppins text-lg bg-Cprimary my-4" type="submit" isLoading={loading}>Envoyer</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
