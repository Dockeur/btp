import React, { useState, useEffect } from "react";

import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaCar,
  FaChartArea,
  FaWhatsapp,
} from "react-icons/fa";
import { MdPriceCheck } from "react-icons/md";
import Loader from "../../loader/Loader";
import { ActionIcon, Button, Modal } from "rizzui";
import { Link } from "react-router-dom";
import { routes } from "@/routes";
import FilterComponent from "@/components/public/FilterComponent";
import { useFilterFrontend } from "@/hooks/useFilterFrontend";
import { ProductType } from "@/types";
import { getProducts } from "@/services/ProductService";
import Pagination from "@/components/admin/ui/table/pagination";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { GiPoolDive } from "react-icons/gi";
import FinancialDetailsForm from "./FinancialDetailsForm";

const Duplex = () => {
  const [selectedDuplex, setSelectedDuplex] = useState<ProductType | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [duplex, setDuplex] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const countPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const duplex: any = await getProducts();
        setDuplex(
          duplex.data.filter(
            (value: ProductType) =>
              value.productable_type == "App\\Models\\Property" &&
              value.productable.type == "duplex"
          )
        );
      } catch (error) {
        console.error("Erreur lors de la création des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDuplexClick = (duplex: ProductType) => {
    setSelectedDuplex(duplex);
    setShowModal(true);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<any>(null);

  const openModal = (imageIndex: any) => {
    setSelectedImageIndex(imageIndex);
    setModalIsOpen(true);
  };

  const navigate = (direction: any) => {
    if (direction === "prev") {
      setSelectedImageIndex((prevIndex: any) =>
        prevIndex > 0
          ? prevIndex - 1
          : selectedDuplex?.productable.images.length - 1
      );
    } else if (direction === "next") {
      setSelectedImageIndex((prevIndex: any) =>
        prevIndex < selectedDuplex?.productable.images.length - 1
          ? prevIndex + 1
          : 0
      );
    }
  };

  const {
    tableData,
    handlePriceFilter,
    handleLocationFilter,
    handleStatusFilter,
    handlePaginate,
    totalItems,
    currentPage,
    status,
    location,
    minPrice,
    maxPrice,
  } = useFilterFrontend<ProductType>(duplex, countPerPage);

  return (
    <>
      <div className="px-4 lg:px-14 bg-neutralSilver py-4  rounded-md">
        <FilterComponent
          handlePriceFilter={handlePriceFilter}
          handleLocationFilter={handleLocationFilter}
          handleStatusFilter={handleStatusFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
          status={status}
          location={location}
        />
      </div>
      <div className="text-center py-8 ">
        <h2 className="lg:text-3xl text-xl font-bold text-Csecondary1 uppercase p-4">
          duplex
        </h2>
        <h2 className="lg:text-lg md:text-lg font-semibold p-4 text-Cprimary ">
          Nous offrons une large gamme de services innovants dans le domaine de
          l'immobilier :
        </h2>
      </div>
      <div className="px-4 ">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 self-start lg:w-[calc(100%-10rem)]">
              {tableData.length === 0 ? (
                <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 2xl:col-span-5 flex justify-center items-center h-96">
                  <p className="text-Cred-primary font-semibold text-center text-xl max-w-sm">
                    Aucun duplex ne correspond aux critères de recherche
                    sélectionnés.
                  </p>
                </div>
              ) : (
                tableData.map((duplex) => {
                  return (
                    <div
                      key={duplex.id}
                      className="bg-Csecondary bg-neutralSilver rounded-2xl shadow-2xl border border-Cprimary transition-all duration-300 w-full hover:scale-95 "
                    >
                      <div className="flex flex-col  ">
                        <div
                          className=" "
                          onClick={() => {
                            setSelectedDuplex(duplex);
                            setShowModal(true);
                            handleDuplexClick(duplex);
                          }}
                        >
                          <div className="relative">
                            <img
                              src={duplex.productable.images[0]}
                              alt="image duplex"
                              className="object-center rounded-t-2xl border border-Csecondary1 object-cover z-0 "
                            />
                          </div>
                        </div>

                        <div className="h-full p-2 flex flex-col gap-1 text-sm ">
                          <h3 className="font-semibold text-Cprimary flex justify-between items-center">
                            <div
                              onClick={() => {
                                setSelectedDuplex(duplex);
                                setShowModal(true);
                              }}
                              className="italic underline uppercase top-8"
                            >
                              {duplex.reference}
                            </div>
                            <span className="font-bold italic text-Csecondary1">
                              {duplex.for_rent
                                ? "À louer"
                                : duplex.for_sale
                                ? "À vendre"
                                : ""}
                            </span>
                          </h3>
                          <span className=" text-texteCouleur mr-2 flex ">
                            <FaMapMarkerAlt
                              className="mr-2 mt-1"
                              style={{
                                color: "blue",
                              }}
                            />
                            {duplex.productable.location.address.country},
                            {duplex.productable.location.address.city},
                            {duplex.productable.location.address.street}
                          </span>
                          <span className=" text-texteCouleur text-justify  flex ">
                            <MdPriceCheck
                              className="mr-1 h-5 w-5"
                              style={{
                                color: "blue",
                              }}
                            />
                            {new Intl.NumberFormat("fr", {
                              style: "currency",
                              currency: "XAF",
                            }).format(duplex.unit_price)}
                          </span>

                          <p className=" text-texteCouleur text-justify flex">
                            <FaChartArea
                              className="mr-2"
                              style={{
                                color: "blue",
                              }}
                            />
                            {duplex.productable.field_area}m²
                          </p>

                          <div className="featured-property-box-icons justify-between flex m-2 p-2">
                            <div className="bed-icon text-center flex">
                              <div className="bg-slate-300 p-1 rounded-md ">
                                <Link
                                  to="#"
                                  data-toggle="tooltip"
                                  title={`Chambres:${duplex.productable.field_area}`}
                                  className=""
                                >
                                  <FaBed />
                                </Link>
                              </div>
                              <p className="text-green px-2">
                                {duplex.productable.field_area}
                              </p>
                            </div>
                            <div className="bath-icon text-center flex ">
                              <div className="bg-slate-300 p-1 rounded-md ">
                                <Link
                                  to="#"
                                  data-toggle="tooltip"
                                  title={`Douches:${
                                    duplex.productable.has_garden
                                      ? "Oui"
                                      : "Non"
                                  }`}
                                >
                                  <FaBath />
                                </Link>
                              </div>
                              <p className=" px-2">
                                {duplex.productable.has_garden ? (
                                  <span className="text-green"> Oui</span>
                                ) : (
                                  <span className="text-red">Non</span>
                                )}
                              </p>
                            </div>
                            <div className="garage-icon text-center flex">
                              <div className="bg-slate-300 p-1 rounded-md  ">
                                <Link
                                  to="#"
                                  data-toggle="tooltip"
                                  title={`Parking:${duplex.productable.parkings }`}
                                  className=""
                                >
                                  <FaCar />
                                </Link>
                              </div>
                              <p className="text-green px-2">
                                {duplex.productable.parkings}
                              </p>
                            </div>

                            <div className="area-icon text-center flex ">
                              <div className="bg-slate-300 p-1 rounded-md">
                                <Link
                                  to="#"
                                  data-toggle="tooltip"
                                  title={`Piscine:${duplex.productable.has_pool? "Oui" : "Non"}`}
                                >
                                  <GiPoolDive />
                                </Link>
                              </div>
                              <p className="text-white px-2">
                                {duplex.productable.has_pool ? (
                                  <span className="text-green"> Oui</span>
                                ) : (
                                  <span className="text-red">"Non"</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
             

              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                containerClassName="lg:!max-w-7xl w-full"
              >
                {selectedDuplex && (
                  <div className="p-4 w-full">
                    <div className="flex items-end justify-end">
                      <ActionIcon
                        size="lg"
                        variant="text"
                        onClick={() => setShowModal(false)}
                      >
                        <XMarkIcon className="h-8 w-8" strokeWidth={1.8} />
                      </ActionIcon>
                    </div>

                    <div className="flex bg-white gap-1 flex-wrap">
                      <h3 className="text-sm lg:text-base font-semibold text-white bg-Cprimary rounded-lg p-2 px-1">
                        {selectedDuplex.reference}
                      </h3>
                      <span className="text-sm lg:text-base font-semibold text-white  bg-Cprimary rounded-lg  p-2">
                        A{" "}
                        {selectedDuplex.productable.for_sale
                          ? "vendre"
                          : "louer"}
                      </span>
                      <Link
                        to={`https://wa.me/237686741680?text=Bonjour%20!%20Je%20suis%20intéressé%20par%20votre%20service,${selectedDuplex.reference}`}
                        className=""
                      >
                        <span className="text-sm lg:text-base font-semibold text-white  bg-Cprimary rounded-lg p-2 flex items-center gap-2 ">
                          <FaWhatsapp />
                          <span>+237 686 741 680</span>
                        </span>
                      </Link>
                    </div>

                    <div className="my-8 mt-4">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 lg:w-1/2 ">
                          <img
                            src={selectedDuplex.productable.images[0]}
                            alt={selectedDuplex.productable.title}
                            className="object-cover lg:col-span-3 col-span-2 row-span-2 lg:row-span-3 w-full rounded-md "
                          />
                          {selectedDuplex.productable.images.map(
                            (image: string, imageIndex: number) => (
                              <div
                                key={imageIndex}
                                onClick={() => openModal(imageIndex)}
                              >
                                <img
                                  src={image}
                                  alt={`Image ${imageIndex + 1}`}
                                  className="object-cover w-full h- rounded-md cursor-pointer"
                                />
                              </div>
                            )
                          )}
                     
                        </div>

                        <div className="xl:w-1/2 ">
                          <p className="lg:px-5 mb-5 max-w text-texteCouleur lg:text-lg leading-relaxed">
                          <div className="px-8">
                              <span className="text-black  font-bold">
                                Description:{" "}
                                <span className=" italic font-normal text-slate-600">
                                  {selectedDuplex.productable.description}{" "}
                                </span>{" "}
                              </span>{" "}
                            </div>
                            <h1 className="text-2xl text-center font-poppins text-black m-5 font-semibold underline">
                              Caractéristiques Principales :
                            </h1>
                            <div className=" px-8">
                              <h2 className=" text-Csecondary1 font-semibold">
                                {selectedDuplex.productable.description}
                                <span className=" text-Cprimary italic m-2">
                                  Salon
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                {selectedDuplex.productable.description}
                                <span className=" text-Cprimary italic m-2">
                                  Salle a manger
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                {selectedDuplex.productable.description}
                                <span className=" text-Cprimary italic m-2">
                                  Chambres
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                {selectedDuplex.productable.has_parking
                                  ? "Oui"
                                  : "Non"}
                                <span className=" text-Cprimary italic m-2">
                                  Parking
                                </span>{" "}
                              </h2>

                              <h2 className=" text-Csecondary1 font-semibold ">
                                {selectedDuplex.productable.description}
                                <span className=" text-Cprimary italic m-2">
                                  Salle d'eau
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                R+1 :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.area} m²
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                Piscine :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.has_pool
                                    ? "Oui"
                                    : "Non"}
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                Superficie RDC :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.area} m²
                                </span>{" "}
                              </h2>
                              <h2 className=" text-Csecondary1 font-semibold">
                                Superficie RDJ :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.area} m²
                                </span>{" "}
                              </h2>

                              <h2 className=" text-Csecondary1 font-semibold">
                                Surface bati :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.description}
                                </span>{" "}
                              </h2>

                              <h2 className=" text-Csecondary1 font-semibold">
                                Terrain :
                                <span className=" text-Cprimary italic m-2">
                                  {selectedDuplex.productable.description}
                                </span>{" "}
                              </h2>
                            </div>
                            <div className="px-8">
                            {selectedDuplex && (
        <FinancialDetailsForm selectedImmeuble={selectedDuplex} />
      )}
                             

                            </div>
                          </p>

                          <div className="  px-14">
                            <Link to={routes.login.path}>
                              {" "}
                              <Button className="btn-primary xs:w-full w-24 py-2 bg-Cprimary text-white rounded hover:bg-Csecondary1  transition-all duration-300 hover:-translate-y-4">
                                Acheter
                              </Button>
                            </Link>
                            <Link
                              to={`https://wa.me/237686741680?text=Bienvenue chez EFFICACE S.A, votre partenaire immobilier de confiance. Nous sommes ravis de vous accompagner dans votre quête d'informations sur cette villa ${selectedDuplex.productable.title} moderne exceptionnelle,${selectedDuplex.productable.reference}. Nous vous remercions de choisir EFFICACE S.A comme votre partenaire immobilier. Notre équipe vous contactera dans les plus brefs délais pour vous fournir toutes les informations nécessaires et pour organiser une rencontre si nécessaire .`}
                            >
                              {" "}
                              <Button className="btn-primary xs:w-full w-36 py-2 hover:bg-Cprimary text-white rounded bg-Csecondary1 transition-all duration-300 hover:-translate-y-4 ml-14 xs:m-8  xs:-ml-1">
                                En savoir plus
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Modal>
            </div>
          )}
    
        </div>
      </div>

      <Pagination
        showLessItems={true}
        className="flex justify-center py-8"
        current={currentPage}
        pageSize={countPerPage}
        defaultCurrent={1}
        onChange={(page) => handlePaginate(page)}
        total={totalItems}
      />
    </>
  );
};

export default Duplex;
