import { routes } from '@/routes';
import React from 'react';
import { Link } from 'react-router-dom';


const SidebarProperty = () => {
  return (
    <>
      <div className="sticky top-[calc(4rem)] self-start text-center md:text-left divide- divide-x-2 divide-gray-400 w-[14rem] max-lg:hidden">
        <h2 className="text-2xl flex font-semibold  text-Cprimary  uppercase ">
          Autres biens
        </h2>
        <div className="w-full text-lg text-justify  divide-gray-400  text-texteCouleur ">
          <h2 className="pl-2 text-xl font-semibold  text-Cprimary ">
            Commerciaux
          </h2>
          <div className="pl-3 divide-gray-400  text-base  ">
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Bureaux
            </Link>
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Boutiques
            </Link>
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Magasins
            </Link>
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Fond de commerce
            </Link>
          </div>
          <h2 className="pl-2 text-xl font-semibold  text-Cprimary  md:w-4/5 mt-3">
            Résidentiels
          </h2>
          <div className="pl-3  divide- devide- divide-gray-400  text-base  ">
            <Link className="block p-1 hover:text-Csecondary1" to={routes.villa.path}>
              Villa
            </Link>
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Appartement
            </Link>
            <Link
              className="block p-1 hover:text-Csecondary1"
              to={routes.building.path}
            >
              Immeuble
            </Link>
            <Link
              className="block p-1 hover:text-Csecondary1"
              to={routes.duplex.path}
            >
              Duplex
            </Link>
            <Link className="block p-1 hover:text-Csecondary1" to="#">
              Studio
            </Link>
          </div>
          <Link to={routes.land.path}>
            <h2 className="pl-2 text-xl font-semibold  text-Cprimary  md:w-4/5 mt-3">
              Terrains
            </h2>
          </Link>
        </div>

        
      </div>
    </>
  );
};

export default SidebarProperty;