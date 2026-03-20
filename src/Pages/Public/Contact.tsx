import Contacts from "@/data/contact";
import { ContactSchema, contactSchema } from "@/schema/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Textarea } from "rizzui";

const Contact = () => {
  const [state, setState] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { handleSubmit, formState: { errors }, register } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactSchema) => {
    try {
      setLoading(true);
      setErrorMessage("");
      console.log(data);
    } catch (error: any) {
      if (error.response.status === 422) {
        setErrorMessage(error.response.data.data.errors.email[0]);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const contactItems = Contacts();

  const renderContactCards = () => {
    return contactItems.map((item) => {
      const cardClass = "group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-Cprimary/30 hover:shadow-md transition-all duration-200";
      return (
        <a key={item.id} href={item.pageUrl} className={cardClass}>
          <div className="w-10 h-10 rounded-xl bg-Cprimary/10 flex items-center justify-center shrink-0 group-hover:bg-Cprimary/20 transition-colors duration-200">
            <img src={item.image} alt={item.title} className="w-6 h-6 object-contain rounded-full" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {item.title}
            </p>
            <p className="text-sm font-medium text-gray-700 truncate group-hover:text-Cprimary transition-colors duration-200">
              {item.description}
            </p>
          </div>
        </a>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-Csecondary1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
            Nous sommes là pour vous
          </p>
          <h1 className="text-3xl lg:text-4xl font-black text-white">
            Contactez-nous
          </h1>
          <p className="mt-2 text-white/60 text-sm max-w-md">
            Permettez-nous de vous guider vers de nouveaux sommets dans le domaine de l'immobilier.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Colonne gauche */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Nos coordonnées
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderContactCards()}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Notre localisation
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64 lg:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5919426852915!2d9.750972076416037!3d4.103125395870667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610e6e35ea0b63%3A0x5fda80bccb6d34a5!2sAngelina%20H%C3%B4tel!5e0!3m2!1sfr!2scm!4v1698831986158!5m2!1sfr!2scm"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Envoyez-nous un message
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:p-8">
              <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register("name")}
                  error={errorMessage || errors.name?.message}
                  label="Nom complet"
                  placeholder="Entrez votre nom complet"
                  className="text-gray-900"
                />
                <Input
                  {...register("email")}
                  error={errorMessage || errors.email?.message}
                  label="Adresse email"
                  placeholder="exemple@email.com"
                  className="text-gray-900"
                />
                <Textarea
                  {...register("sms")}
                  error={errorMessage || errors.sms?.message}
                  label="Message"
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="text-gray-900"
                  value={state}
                  maxLength={2000}
                  onChange={(e: any) => setState(e.target.value)}
                  renderCharacterCount={({ characterCount, maxLength }: any) => (
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {characterCount}/{maxLength}
                    </div>
                  )}
                />
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full bg-Cprimary hover:bg-Csecondary1 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md mt-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline mr-2 w-4 h-4" viewBox="0 0 512 512">
                    <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                  </svg>
                  Envoyer le message
                </Button>
              </form>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Vos données sont sécurisées et ne seront jamais partagées.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;