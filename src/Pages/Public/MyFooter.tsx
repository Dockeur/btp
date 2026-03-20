import React, { useState } from "react";
import Logo from "@image/logo/logo_fb.png";
import { FaYoutube, FaTelegram } from "react-icons/fa";
import { Button, Input } from "rizzui";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NewsletterSchema, newsletterSchema } from "@/schema/newsletter";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@/routes";

const MyFooter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterSchema>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterSchema) => {
    try {
      setLoading(true);
      setErrorMessage("");
      console.log(data);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const socials = [
    {
      href: "https://www.facebook.com/profile.php?id=61553377505208&mibextid=ZbWKwL",
      label: "Facebook",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      href: "https://www.youtube.com/channel/UCPWJSt5QqDQHI2QNxoo6U_g",
      label: "YouTube",
      icon: <FaYoutube className="w-4 h-4" />,
    },
    {
      href: "https://www.linkedin.com/in/efficace-innovation-18254b2a0/",
      label: "LinkedIn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      ),
    },
    {
      href: "mailto:efficaceinnovation@gmail.com?subject=Objet",
      label: "Email",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 134 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.09091 100H30.303V48.4848L0 25.7576V90.9091C0 95.9394 4.07576 100 9.09091 100Z" fill="#4285F4"/>
          <path d="M103.03 100H124.242C129.273 100 133.333 95.9242 133.333 90.9091V25.7576L103.03 48.4848" fill="#34A853"/>
          <path d="M103.03 9.09091V48.4848L133.333 25.7576V13.6364C133.333 2.39394 120.5 -4.01515 111.515 2.72727" fill="#FBBC04"/>
          <path d="M30.303 48.4848V9.09091L66.6667 36.3636L103.03 9.09091V48.4848L66.6667 75.7576" fill="#EA4335"/>
          <path d="M0 13.6364V25.7576L30.303 48.4848V9.09091L21.8182 2.72727C12.8182 -4.01515 0 2.39394 0 13.6364" fill="#C5221F"/>
        </svg>
      ),
    },
    {
      href: "https://instagram.com/eff.icacesa",
      label: "Telegram",
      icon: <FaTelegram className="w-4 h-4" />,
    },
  ];

  const links = [
    {
      title: "À propos",
      items: [
        { label: "À propos de nous", to: routes.about.path },
        { label: "Contactez-nous", to: routes.contact.path },
      ],
    },
    {
      title: "Propriétés",
      items: [
        { label: "Immeubles", to: routes.building.path },
        { label: "Terrains", to: routes.land.path },
        { label: "Duplex", to: routes.duplex.path },
        { label: "Villas", to: routes.villa.path },
      ],
    },
    {
      title: "Actualités",
      items: [
        { label: "Dernières actualités", to: "#" },
        { label: "Architecture", to: "#" },
      ],
    },
    {
      title: "Entreprise",
      items: [
        { label: "Blog", to: "#" },
        { label: "Partenaires", to: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-blue-900 text-white">

    
      <div className="border-b border-white/10">
        <div className="container mx-auto  py-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-orange/90 uppercase tracking-widest mb-0.5">
                  Restez informé
                </p>
                <h3 className="text-base font-bold text-white">
                  Inscrivez-vous à notre newsletter
                </h3>
              </div>

              <div className="flex items-start gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:w-72">
                  <Input
                    {...register("email")}
                    error={errorMessage || errors.email?.message}
                    placeholder="Votre adresse email"
                    className="text-gray-900 bg-white rounded-lg text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-orange hover:bg-Cprimary/90 text-white font-semibold px-5 h-10 rounded-lg whitespace-nowrap text-sm transition-all duration-200 shrink-0"
                >
                  S'inscrire
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

    
      <div className="container mx-auto  py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

    
          <div className="lg:col-span-1">
            <Link to={routes.home.path} className="inline-block mb-5">
              <img src={Logo} alt="Logo" className="h-14 w-auto object-contain" />
            </Link>

            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Votre partenaire de confiance pour tous vos projets immobiliers.
            </p>

          
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  to={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-Cprimary flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {links.map((col) => (
              <div key={col.title}>
                <h5 className="text-xs font-bold uppercase tracking-widest text-orange/90 mb-4">
                  {col.title}
                </h5>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {currentYear} Efficace Innovation. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default MyFooter;