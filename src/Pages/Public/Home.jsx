"use client";

import React, { useState } from "react";
import Carousel1 from "@image/acceuil/imgCarousel1.jpg";
import Carousel2 from "@image/acceuil/imgCarousel2.png";
import Carousel3 from "@image/acceuil/imgCarousel3.png";
import Carousel4 from "@image/acceuil/imgCarousel4.png";
import Accampagnement from "@image/accompagnement/accompagnement2.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SearchForm from "../../components/SousMenu/SearchForm";
import PublicProjectsList from "./PublicProjectsList";
import blogs from "src/data/blog";
import products from "src/data/pruduct";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "src/routes";
import { HeroSection } from "@/components/public/HeroSection";

import { useAuth } from "src/hooks/useAuth";
import SaleRequestModal from "@/components/Salerequestmodal";
import MySaleRequestsModal from "@/components/Mysalerequestsmodal";

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate()
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const blog = blogs();
  const explorez = products();
  const [showChatbot, setShowChatbot] = useState(false);
  const [email, setEmail] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const slides = [
    { imgSrc: Carousel1, label: "Slide 1" },
    { imgSrc: Carousel2, label: "Slide 2" },
    { imgSrc: Carousel3, label: "Slide 3" },
    { imgSrc: Carousel4, label: "Slide 4" },
  ];

  const stats = [
    { number: "2500+", label: "Biens disponibles" },
    { number: "1200+", label: "Clients satisfaits" },
    { number: "15+", label: "Années d'expérience" },
    { number: "98%", label: "Taux de satisfaction" },
  ];


  const testimonials = [
    {
      id: 1,
      name: "Marie Dupont",
      role: "Propriétaire",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "Service exceptionnel ! J'ai trouvé ma maison de rêve en moins d'un mois. L'équipe est très professionnelle et à l'écoute.",
    },
    {
      id: 2,
      name: "Jean Martin",
      role: "Investisseur",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Excellente plateforme pour investir dans l'immobilier. Les conseils sont précieux et le processus est très simple.",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "Locataire",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
      text: "Interface intuitive et réponses rapides. J'ai trouvé l'appartement parfait pour ma famille. Je recommande vivement !",
    },
  ];


  const steps = [
    {
      number: "01",
      title: "Recherchez",
      description: "Explorez notre catalogue de biens immobiliers avec des filtres avancés",
    },
    {
      number: "02",
      title: "Comparez",
      description: "Comparez les propriétés, les prix et les emplacements en un clic",
    },
    {
      number: "03",
      title: "Visitez",
      description: "Planifiez des visites virtuelles ou physiques avec nos agents",
    },
    {
      number: "04",
      title: "Achetez",
      description: "Finalisez votre achat en toute sécurité avec notre accompagnement",
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Comment puis-je acheter un bien immobilier ?",
      answer: "Commencez par parcourir notre catalogue, sélectionnez le bien qui vous intéresse, contactez notre équipe pour une visite, puis nous vous accompagnons dans toutes les démarches administratives jusqu'à la signature.",
    },
    {
      question: "Quels sont les frais associés ?",
      answer: "Les frais incluent les frais de notaire (environ 7-8% du prix), les frais d'agence (inclus dans le prix affiché), et éventuellement les frais de dossier bancaire pour votre prêt.",
    },
    {
      question: "Puis-je obtenir un financement ?",
      answer: "Oui, nous travaillons avec plusieurs partenaires bancaires pour vous aider à obtenir les meilleures conditions de financement. Notre équipe peut vous mettre en relation avec des courtiers.",
    },
    {
      question: "Combien de temps prend le processus d'achat ?",
      answer: "En moyenne, le processus complet prend entre 2 et 3 mois, du compromis de vente à la signature définitive chez le notaire.",
    },
    {
      question: "Proposez-vous des visites virtuelles ?",
      answer: "Oui, la plupart de nos biens disposent de visites virtuelles 360° et de vidéos. Vous pouvez également planifier des visites en personne avec nos agents.",
    },
  ];

  // Partenaires
  const partners = [
    { name: "Banque Nationale" },
    { name: "Assurance Vie" },
    { name: "Cabinet Notarial" },
    { name: "Constructeur Pro" },
    { name: "Courtier Expert" },
    { name: "Expert Immobilier" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Merci ! Vous êtes inscrit avec l'email : ${email}`);
    setEmail("");
  };



  return (
    <div className="overflow-x-hidden">
      <section className="relative w-full h-[560px] lg:h-[720px] overflow-hidden">
        <HeroSection />
      </section>


      <section className="py-14 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">



          <div className="mb-10">
            <p className="text-sm font-semibold text-Cprimary uppercase tracking-widest mb-1">
              Découvrez
            </p>
            <h2 className="text-2xl lg:text-3xl font-black text-Csecondary1">
              Explorez le monde immobilier
            </h2>
          </div>



          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {explorez.map((item, index) => (
              <Link
                to={item.pageUrl}
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 ${index === 0 ? "col-span-2 lg:col-span-2 h-56 lg:h-72" : "col-span-1 h-44 lg:h-56"
                  }`}
              >


                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />



                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />



                {item.count && (
                  <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {item.count}
                  </div>
                )}



                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="text-white font-bold text-sm lg:text-base leading-tight drop-shadow-sm">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/75 text-xs mt-0.5 line-clamp-1 hidden lg:block">
                      {item.description}
                    </p>
                  )}
                </div>


                <div className="absolute inset-0 bg-Cprimary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>




        </div>
      </section>



      <PublicProjectsList />


      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16 mx-auto">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-Csecondary1 mb-6 uppercase font-poppins">
                Obtenez des conseils personnalisés
              </h2>
              <p className="text-lg lg:text-xl text-texteCouleur mb-8 font-serif leading-relaxed">
                Connectez-vous pour accéder à des recommandations sur mesure, gérer vos favoris et bénéficier d'un accompagnement dédié
              </p>
              <Link to={routes.login.path}>
                <button className="bg-Csecondary1 hover:bg-Cprimary text-white font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-poppins">
                  Se connecter maintenant
                </button>
              </Link>
            </div>

            <div className="md:w-1/2">
              <div className="relative group">
                <img
                  src={Accampagnement}
                  alt="Accompagnement immobilier"
                  className="rounded-2xl shadow-2xl w-full transform transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 lg:py-24 bg-neutralSilver">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-Csecondary1 uppercase mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-texteCouleur max-w-2xl mx-auto">
              Des milliers de clients satisfaits nous font confiance
            </p>
            <div className="w-24 h-1 bg-Cprimary mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-Cprimary/20"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-Csecondary1 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-texteCouleur text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-texteCouleur italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-16 lg:py-24 bg-neutralSilver">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-Csecondary1 uppercase mb-4 font-poppins">
              Actualités immobilières
            </h2>
            <p className="text-lg text-texteCouleur max-w-2xl mx-auto">
              Restez informé des dernières tendances du marché
            </p>
            <div className="w-24 h-1 bg-Cprimary mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {blog.slice(0, 3).map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                <div className="relative overflow-hidden rounded-xl shadow-lg mb-16">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-Csecondary1/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="absolute left-4 right-4 -bottom-12 bg-white px-6 py-6 rounded-xl shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <h3 className="text-lg font-bold text-Cprimary mb-4 line-clamp-2 min-h-[3.5rem]">
                    {item.title}
                  </h3>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-Cprimary hover:text-Csecondary1 font-bold transition-colors duration-300 group/link"
                  >
                    <span>En savoir plus</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 25 11"
                      fill="none"
                      className="transition-transform duration-300 group-hover/link:translate-x-2"
                    >
                      <path
                        d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.08246 15.2929 4.69194L12 1.39905M15 5.39905ML1 5.39905"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <Link to="/blog">
              <button className="bg-white border-2 border-Cprimary text-Cprimary hover:bg-Cprimary hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                Voir toutes les actualités
              </button>
            </Link>
          </div>
        </div>
      </section>


      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-Csecondary1 uppercase mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-lg text-texteCouleur max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions
            </p>
            <div className="w-24 h-1 bg-Cprimary mx-auto mt-6"></div>
          </div>

          <div className=" mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl hover:border-Cprimary transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-neutralSilver transition-colors duration-300"
                >
                  <span className="font-semibold text-blue-800 text-lg pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-Cprimary transform transition-transform duration-300 flex-shrink-0 ${activeAccordion === index ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="px-6 pb-5 text-texteCouleur leading-relaxed bg-neutralSilver">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>







      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {auth && (
          <button
            onClick={() => setShowMyRequests(true)}
            className="bg-white border border-gray-200 text-gray-600 shadow-lg hover:shadow-xl
              text-xs font-medium px-3 py-2 rounded-full transition-all duration-300
              hover:scale-105 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
            Mes demandes
          </button>
        )}

        <button
          onClick={() => auth ? setShowSaleModal(true) : navigate(routes.login.path)}
          className="bg-Cprimary text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl
            transition-all duration-300 flex items-center justify-center transform hover:scale-110 gap-2"
        >
          <span className="text-sm font-medium">Demande de vente</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {showSaleModal && (
        <SaleRequestModal onClose={() => setShowSaleModal(false)} />
      )}

      {showMyRequests && (
        <MySaleRequestsModal
          onClose={() => setShowMyRequests(false)}
          onNewRequest={() => { setShowMyRequests(false); setShowSaleModal(true); }}
        />
      )}


    </div>
  );
};

export default Home;