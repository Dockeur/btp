import React, { Fragment, useState } from "react";
import aboutImage from "@image/banner3.jpg";
import bannerImage from "@image/banner4.jpg";
import ModalTerrain from "./modals/ModalTerrain";
const TerrainDetail = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Fragment>
      <div>
        <div className="px-4 lg:px-14 max-w-screen-2x1 mx-auto bg-neutralSilver lg:w-full w-3 py-16 mt-20 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="md:w-1/3">
              <img
                src={bannerImage}
                alt=""
                className="float-left ml-20"
                onClick={() => setShowModal(true)}
              />
            </div>
            {/* stats */}
            <div className="md:w-2/3 mx-auto">
              <div>
                <p className="md:w-4/5 text-sm text-neutralGrey mb-8 leading-7 text-justify">
                  {" "}
                  Notre équipe d'experts en immobilier est composée de
                  professionnels passionnés qui connaissent le marché local
                  comme leur poche. Chacun de nos agents est dévoué à vous aider
                  à atteindre vos objectifs immobiliers, que vous cherchiez à
                  acheter votre première maison, à vendre votre propriété
                  existante, ou à investir dans des opportunités immobilières.{" "}
                </p>
                <h5 className="text-brandPrimary text-xl font-semibold mb-2">
                  By EFFICACE
                </h5>
                <p className="text-base text-neutralGrey mb-8">
                  Une association des ingénieurs et architectes{" "}
                </p>
                <div>
                  {/* classer les logo horizontalement */}
                  <div className="flex items-center gap-8 flex-wrap">
                    <img
                      src="src/assets/company/company1.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <img
                      src="src/assets/company/company3.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <img
                      src="src/assets/company/company2.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <img
                      src="src/assets/company/company3.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <img
                      src="src/assets/company/company1.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <img
                      src="src/assets/company/company2.jpg"
                      alt=""
                      className="cursor-pointer w-24 h-24"
                    />
                    <div className="flex items-center gap-8">
                      <a
                        href="/"
                        className="font-bold text-brandPrimary hover:text-neutral-700 flex items-center"
                      >
                        Rencontrer tout les clients{" "}
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
              </div>
            </div>
          </div>
          {/* modal */}
          <div className="p-10 text-center">
            <h1 className="3xl">exemple de modal</h1>
            <button
              className="text-white bg-Cprimary  hover:bg-Csecondary1 focus:outline-none font-medium text-lg rounded-lg px-5 py-1 text-center mr-5"
              onClick={() => setShowModal(true)}
            >
              Modal
            </button>
          </div>
          <ModalTerrain
            isVisible={showModal}
            onClose={() => setShowModal(false)}
          >
            <div className="p-4 ">
              <h3 className="text-xl font-semibold text-texteCouleur mb-5">
                Titre du modal
              </h3>
              <p className="mb-5 font-normal text-texteCouleur text-lg text-justify ">
                Notre équipe d'experts en immobilier est composée de
                professionnels passionnés qui connaissent le marché local comme
                leur poche. Chacun de nos agents est dévoué à vous aider à
                atteindre vos objectifs immobiliers, que vous cherchiez à
                acheter votre première maison, à vendre votre propriété
                existante, ou à investir dans des opportunités immobilières.
              </p>
              <div className="px-4 lg:px-20 max-w-screen-2x1 mx-auto my-8 mt-4">
                <div className="md:w-11/12 mx-auto flex flex-col md:flex-row  gap-2">
                  <div className="">
                    <img
                      src={aboutImage}
                      alt=""
                      className="w-full h-52 lg:-ml-28"
                    />
                  </div>
                  <div className="md:w-2/3 mx-auto text-center md:text-left lg:-ml-20">
                    <h2 className="text-4xl font-semibold mb-4 text-neutralDGrey  md:w-4/5 ">
                      À Propos d'EFFICACE
                    </h2>
                    <p className="md:w-[600px] mb-5 font-normal text-texteCouleur text-lg text-justify">
                      Bienvenue chez EFFICACE, votre partenaire de confiance
                      dans le domaine de l'immobilier depuis 2023. Nous sommes
                      fiers de mettre à votre disposition notre expertise et
                      notre passion pour l'immobilier, afin de vous accompagner
                      dans toutes vos transactions immobilières.
                      <h3 className="text-3xl font-semibold mb-4 text-neutralDGrey md:w-4/5">
                        Notre Mission
                      </h3>
                      Chez EFFICACE, notre mission est de vous offrir un service
                      immobilier de premier ordre, basé sur l'intégrité, la
                      transparence et le professionnalisme. Nous comprenons que
                      l'achat, la vente ou la location d'une propriété est l'une
                      des décisions les plus importantes de votre vie, c'est
                      pourquoi nous nous engageons à vous fournir un
                      accompagnement personnalisé et des solutions sur mesure.
                    </p>
                    <button className="btn-primary px-4 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey transition-all duration-300 hover:-translate-y-4">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalTerrain>
        </div>
      </div>
    </Fragment>
  );
};

export default TerrainDetail;
