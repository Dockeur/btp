import React, { useState, Fragment } from "react";
// import aboutImage from "@image/banner3.jpg";
import bannerImage from "@image/banner4.jpg";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

const Proposer = () => {
  const [isOpenTypeBien, setIsOpenTypeBien] = useState(false);
  const [selectedTypeBien, setSelectedTypeBien] = useState(null);
  const TypeBien = ["Immeubles", "Duplex", "Villa", "Studio", "Appartement"];
  const TypeProjet = ["Bureaux", "Centres commerciaux", "Hotel"];

  const [isOpenTypeProjet, setIsOpenTypeProjet] = useState(false);
  const [selectedTypeProjet, setSelectedTypeProjet] = useState(null);

  const handleTypeBienSelection = (bien) => {
    setSelectedTypeBien(bien);
    setIsOpenTypeBien(false);
  };

  const handleTypeProjetSelection = (projet) => {
    setSelectedTypeProjet(projet);
    setIsOpenTypeProjet(false);
  };

  return (
    <Fragment>
      <div>
        <div className="px-4 lg:px-14 max-w-screen-2x1 mx-auto my-8 mt-20 bg-neutralSilver">
          <h1 className="text-xl font-bold  text-Cprimary ">
            {" "}
            Proposer nous un bien Immobilier ou un Projet immobilier
          </h1>

          <div className="md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-Cprimary -mt-20">
            <h2 className="text-lg font-medium -ml-20 xs:ml-0 xs:mt-24">
              Bien vouloir choisir le type du bien ou de projet que vous
              souhitez proposer:
            </h2>
            <div className="relative flex flex-col items-center h-10 lg:w-[200px] rounded-md ml-0 lg:mr-10 mr-2 right-3 ">
              <h2 className="lg:mr-5 mr-28 -mt-6 font-semibold text-base text-Cprimary">
                Type de bien
              </h2>
              <button
                onClick={() => setIsOpenTypeBien((prev) => !prev)}
                className="bg-Csecondary1 flex w-full items-center justify-between font-semibold text-base rounded-lg tracking-wider border-4 border-transparent active:border-Cprimary duration-300 active:text-Cprimary text-white"
              >
                {selectedTypeBien ? selectedTypeBien : "Type de bien"}
                {!isOpenTypeBien ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </button>
              {isOpenTypeBien && (
                <div className="bg-white absolute top-10 flex-col items-start rounded-lg p-2 w-full overflow-y-auto max-h-52 border-2 z-10">
                  {TypeBien.map((typeBien, i) => (
                    <div
                      className="flex flex-col w-full p-1 "
                      key={i}
                      onClick={() => handleTypeBienSelection(typeBien)}
                    >
                      <h3 className="font-semibold text-sm text-Cprimary hover:bg-Csecondary1 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-Cprimary border-l-4">
                        {typeBien}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex flex-col items-center h-10 lg:w-[200px] rounded-md ml-0 lg:mr-10 mr-2 right-3 ">
              <h2 className="lg:mr-1 mr-28 -mt-6 font-semibold text-base text-Cprimary">
                Type de projet
              </h2>
              <button
                onClick={() => setIsOpenTypeProjet((prev) => !prev)}
                className="bg-Csecondary1 flex w-full items-center justify-between font-semibold text-base rounded-lg tracking-wider border-4 border-transparent active:border-Cprimary duration-300 active:text-Cprimary text-white"
              >
                {selectedTypeProjet ? selectedTypeProjet : "Type de projet"}
                {!isOpenTypeProjet ? (
                  <AiOutlineCaretDown className="h-8" />
                ) : (
                  <AiOutlineCaretUp className="h-8" />
                )}
              </button>
              {isOpenTypeProjet && (
                <div className="bg-white absolute top-10 flex-col items-start rounded-lg p-2 w-full overflow-y-auto max-h-52 border-2 z-10">
                  {TypeProjet.map((typeProjet, i) => (
                    <div
                      className="flex flex-col w-full p-1 "
                      key={i}
                      onClick={() => handleTypeProjetSelection(typeProjet)}
                    >
                      <h3 className="font-semibold text-sm text-Cprimary hover:bg-Csecondary1 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-Cprimary border-l-4">
                        {typeProjet}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:w-1/2 ">
              <div className="flex mb-1 justify-center lg:items-center lg:mb-2 mt-5 mr-14 gap-5 ">
                {/* Options de radio pour choisir le type de propriété */}
                <div className="mb-[0.125rem] lg:mr-10 ml-6 inline-flex items-center h-[40px] w-[100px]  bg-Cprimary rounded-lg ">
                  <input
                    type="radio"
                    name="etatSelectionne"
                    value="vendre"
                    //onChange={() => handlePropertyTypeChange("vendre")}
                    className="h-5 w-5 appearance-none checked:bg-Csecondary1 rounded-full border-2 checked:border-white m-1"
                  />
                  <label
                    htmlFor="terrainRadio"
                    className="text-white font-semibold text-base mt-0.5"
                  >
                    Acheter
                  </label>
                </div>

                <div className="mb-[0.125rem] inline-flex items-center h-[40px] w-[100px]  bg-Cprimary rounded-lg  ">
                  <input
                    type="radio"
                    name="etatSelectionne"
                    id="batimentRadio"
                    value="louer"
                    //onChange={() => handlePropertyTypeChange("louer")}
                    className="h-5 w-5 appearance-none checked:bg-Csecondary1 rounded-full border-2 checked:border-whiter m-1"
                  />
                  <label
                    htmlFor="batimentRadio"
                    className="text-white font-semibold text-base mt-0.5"
                  >
                    Louer
                  </label>
                </div>

                <div className="mb-[0.125rem] inline-flex items-center h-[40px] w-[100px]  bg-Cprimary rounded-lg  ">
                  <input
                    type="radio"
                    name="etatSelectionne"
                    id="batimentRadio"
                    value="louer"
                    //onChange={() => handlePropertyTypeChange("louer")}
                    className="h-5 w-5 appearance-none checked:bg-Csecondary1 rounded-full border-2 checked:border-whiter m-1"
                  />
                  <label
                    htmlFor="batimentRadio"
                    className="text-white font-semibold text-base mt-0.5"
                  >
                    Investir
                  </label>
                </div>
              </div>
            </div>
            {/* <div>
              <img src={aboutImage} alt="" />
            </div> */}
            <div className="md:w-3/5 mx-auto text-center md:text-left mt-20 ">
              <h2 className="text-2xl font-semibold mb-2 text-neutralDGrey  md:w-4/5">
                À Propos d'EFFICACE
              </h2>
              <p className="md:w-4/4 text-base text-neutralDGrey mb-8 text-justify">
                Bienvenue chez EFFICACE, votre partenaire de confiance dans le
                domaine de l'immobilier depuis 2023. Nous sommes fiers de mettre
                à votre disposition notre expertise et notre passion pour
                l'immobilier, afin de vous accompagner dans toutes vos
                transactions immobilières.
                <h3 className="text-3xl font-semibold mb-2 text-neutralDGrey md:w-4/5 mt-3">
                  Notre Mission
                </h3>
                Chez EFFICACE, notre mission est de vous offrir un service
                immobilier de premier ordre, basé sur l'intégrité, la
                transparence et le professionnalisme. Nous comprenons que
                l'achat, la vente ou la location d'une propriété est l'une des
                décisions les plus importantes de votre vie, c'est pourquoi nous
                nous engageons à vous fournir un accompagnement personnalisé et
                des solutions sur mesure.
              </p>
              <button className="btn-primary px-4 py-2 bg-Cprimary text-white rounded hover:bg-Csecondary1 transition-all duration-300 hover:-translate-y-4">
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-14 max-w-screen-2x1 mx-auto bg-neutralSilver w-screen py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="md:w-1/3">
              <img src={bannerImage} alt="" className="float-left ml-20" />
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
        </div>
      </div>
    </Fragment>
  );
};

export default Proposer;
