import React from "react";
import AboutImage from "@image/about/equipeEfficace.jpeg";
import Partenaire from "@image/exploration/bureau.jpg";
import values from "src/data/values";
import team from "src/data/team";
import service from "src/data/services";
import { Link } from "react-router-dom";
import { routes } from "@/routes";
import { 
  FiCheckCircle, 
  FiUsers, 
  FiAward, 
  FiTarget,
  FiArrowRight,
  FiStar
} from "react-icons/fi";

const About = () => {
  const valeur = values();
  const NotreEquipe = team();
  const Services = service();

  return (
    <div className="min-h-screen bg-gray-50">
     
      <section className="relative h-[600px] overflow-hidden">
        
        <div className="absolute inset-0">
          <img
            src={AboutImage}
            alt="About EFFICACE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90  to-transparent"></div>
        </div>

     
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Qui sommes-nous ?
            </h1>
            <div className="h-1 w-24 bg-yellow-400 mb-6"></div>
            <p className="text-lg md:text-xl leading-relaxed mb-8">
              <span className="font-semibold text-yellow-400">EFFICACE</span> est une
              entreprise de création, de transformation, de construction, de financement
              et de gestion immobilière dont le siège est à Kotto, Douala.
            </p>
            <p className="text-base md:text-lg leading-relaxed opacity-90">
              Créée en 2023 et dirigée par une équipe jeune et dynamique aux compétences
              diverses, nous sommes unis par la mission de loger les personnes physiques
              et morales en Afrique. Avec pour slogan{" "}
              <span className="font-semibold text-yellow-400">
                « l'innovation cœur de nos actions »
              </span>
              , nous apportons des solutions efficaces et innovantes dans l'immobilier.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <p className="text-sm">
                  Investissement à partir de{" "}
                  <span className="font-bold text-yellow-400">100.000 FCFA</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, value: "50+", label: "Clients satisfaits" },
              { icon: FiAward, value: "2023", label: "Année de création" },
              { icon: FiTarget, value: "100%", label: "Engagement" },
              { icon: FiStar, value: "5/5", label: "Satisfaction" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
         
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Les valeurs d'EFFICACE
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Nos valeurs fondamentales qui guident chacune de nos actions
            </p>
          </div>

          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeur.map((value) => (
              <div
                key={value.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/60 to-transparent"></div>
                </div>

              
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 uppercase">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    {value.descriptin}
                  </p>
                </div>

                
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {value.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
        
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos domaines d'activités
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Une large gamme de services innovants dans le domaine de l'immobilier
            </p>
          </div>

          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                 
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {service.service}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.descriptin}
                  </p>

                  
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span className="mr-2">En savoir plus</span>
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>

                
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>

        
          <div className="text-center">
            <Link
              to="src/assets/documents/Offre de services_à partager.pdf"
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Télécharger notre brochure complète</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notre équipe
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          </div>

          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
             
              <div className="relative h-96 md:h-auto">
                <img
                  src={AboutImage}
                  alt="Notre équipe"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
              </div>

              {/* Texte */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Une équipe pluridisciplinaire
                </h3>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Notre équipe pluridisciplinaire est composée de professionnels
                  jeunes et dynamiques, passionnés qui connaissent le marché local
                  comme leur poche. Chacun de nos agents est dévoué à vous aider à
                  atteindre vos objectifs immobiliers.
                </p>

                <div className="space-y-4">
                  {[
                    "Expertise locale approfondie",
                    "Accompagnement personnalisé",
                    "Solutions sur mesure",
                    "Disponibilité et réactivité",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos partenaires
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          </div>

         
          <div className="bg-white to-indigo-50 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              
              <div className="relative h-96 md:h-auto">
                <img
                  src={Partenaire}
                  alt="Nos partenaires"
                  className="w-full h-full object-cover"
                />
              </div>

           
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Ils nous ont fait confiance
                </h3>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Faites confiance à EFFICACE pour réaliser vos aspirations
                  immobilières. Rejoignez nos partenaires satisfaits.
                </p>

             
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <img
                      src="src/assets/company/company1.jpg"
                      alt="Partenaire 1"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <img
                      src="src/assets/company/company2.jpg"
                      alt="Partenaire 2"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-100 border-l-4 border-blue-600 rounded">
                  <p className="text-blue-900 font-semibold">
                    Plus de 50 partenaires nous font confiance pour leurs projets immobiliers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;