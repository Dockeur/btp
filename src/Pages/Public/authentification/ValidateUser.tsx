import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Alert, Button, PinCode, Text } from "rizzui";
import { useAuth } from "src/hooks/useAuth";
import { sendCode, validateUser } from "src/services/AuthService";
import { z } from "zod";

const ValidateUser = () => {
  const { auth, freshAuth } = useAuth();
  const schema = z.object({
    code: z
      .string({ required_error: "Le code est requis" })
      .min(6, "Le code doit avoir 6 caractères"),
  });
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState({
    type: "info",
    content: "Un code de validation a été envoyé à votre adresse email",
    class: "bg-blue-100",
    title: "Validation de compte",
  });
  const [loading, setLoading] = useState(false);


const handleResend = async () => {
  // Vérification de sécurité pour éviter le crash
  if (!auth?.email) {
    setMessage({
      type: "danger",
      content: "Session expirée ou utilisateur introuvable. Veuillez vous reconnecter.",
      class: "bg-red-100",
      title: "Erreur",
    });
    setOpen(true);
    return;
  }

  try {
    const res = await sendCode({
      email: auth.email, // Plus besoin de auth.user.email car tu stockes directement l'utilisateur dans 'auth'
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
      // ... reste de ta logique d'erreur
    }
  } catch (error) {
    console.log(error);
  }
};

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  console.log('from ==> ', from)
  const {
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data);
    try {
      setLoading(true);
      const res = await validateUser(data);
      if (res.success) {
        setMessage({
          type: "success",
          content: res.message,
          class: "bg-green-100",
          title: "Validation avec succès",
        });
        setOpen(true);
        await freshAuth();
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 3000);
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
      setMessage({
        type: "danger",
        content: "Une erreur est survenue, veuillez réessayer",
        class: "bg-red-100",
        title: "Erreur",
      });
      setOpen(true);
    } finally {
      reset();
      setLoading(false);
    }
  };

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
        <section className="border bg-white max-w-lg rounded-lg w-full shadow-xl shadow-orange-100  ">
          <div className="bg-Cprimary text-white font-poppins font-semibold text-xl text-center p-4 rounded-t-lg lg:text-2xl">
            {" "}
            Validez votre compte
          </div>
          {open && (
            <div className="p-4">
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
          <div className="p-6">
            <div className=" flex  ">
              {/* Right column container with form */}
              <div className=" w-full  ">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email input */}
                  <div className="relative mb-6">
                    <div className="p-5 w-full flex justify-center">
                      <PinCode
                        type="number"

                        center={false}
                        setValue={(value) => setValue("code", value as string)}
                        error={errors.code?.message}
                        length={6}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      type="button"
                      onClick={handleResend}
                      className="py-5 text-white font-poppins uppercase"
                    >
                      Renvoyer le code
                    </Button>
                    <Button
                      isLoading={loading}
                      type="submit"
                      className="py-5 text-white font-poppins bg-Cprimary uppercase"
                    >
                      Valider
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ValidateUser;
