import React from "react";

const Aide = () => {
  const blog = [
    {
      id: 1,
      title: "Créer des processus de sauvegarde rationalisés",
      image: "/src/assets/image18.png",
    },
    {
      id: 2,
      title:
        "Quelles sont vos responsabilités en matière d'immobilier et comment pouvez-vous les gérer ?",
      image: "/src/assets/image19.png",
    },
    {
      id: 3,
      title: "Réorganiser le modèle de vos proprietes avec nos notre equipe",
      image: "/src/assets/image20.png",
    },
  ];

  return (
    <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-12 mt-40">
      <div className="text-center md:-end-1/2 mx-auto">
        <h2 className="text-4xl font-semibold mb-4 text-neutralDGrey">
          De l'efficassité dans l'immobiler
        </h2>
        <p className="text-base font-montserrat text-justify text-neutralDGrey mb-8 md:w-3/4 mx-auto">
          {/* ... Votre texte ... */}
          Bienvenue chez EFFICACE, votre partenaire de confiance dans le domaine
          de l'immobilier depuis 2023. Nous sommes fiers de mettre à votre
          disposition notre expertise et notre passion pour l'immobilier, afin
          de vous accompagner dans toutes vos transactions immobilières. Chez
          EFFICACE, notre mission est de vous offrir un service immobilier de
          premier ordre, basé sur l'intégrité, la transparence et le
          professionnalisme. Nous comprenons que l'achat, la vente ou la
          location d'une propriété est l'une des décisions les plus importantes
          de votre vie, c'est pourquoi nous nous engageons à vous fournir un
          accompagnement personnalisé et des solutions sur mesure.
        </p>
      </div>
      {/* notre blog */}
      <div className="grid lg:grid-cols-3 sm:grid-cols- grid-cols-1 gap-8 items-center justify-between">
        {blog.map((blog) => (
          <div key={blog.id} className="mx-auto relative mb-12 cursor-pointer ">
            <img
              src={blog.image}
              alt=""
              className="hover:scale-95 transition-all duration-300"
            />
            {/* eleent de survol sur les images */}
            <div className="text-center px-4 py-8 bg-white shadow-lgrounded-md md:w-3/4 mx-auto absolute left-0 right-0 -bottom-12 rounded-md">
              <h3 className="mb-3 text-neutralGrey font-semibold">
                {blog.title}
              </h3>
              <div className="flex items-center justify-center gap-8">
                <a
                  href="/"
                  className="font-bold text-brandPrimary hover:text-neutral-700 flex items-center"
                >
                  En savoir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="20"
                    viewBox="0 0 25 11"
                    fill="none"
                    className="ml-0"
                  >
                    <path
                      d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.08246 15.2929 4.69194L12 1.39905M15 5.39905ML1 5.39905"
                      stroke="#4CAF4F"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aide;
