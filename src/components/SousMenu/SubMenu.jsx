import { routes } from '@/routes';
import React from 'react';
import { Link } from 'react-router-dom';


const SubMenu = () => {
    return (
        <div className="dropdown-menu md:text-left">
            <div className="divide-y divide-gray-400  text-texteCouleur font-lato">
                <Link className="block p-2 hover:text-Csecondary1 " to={routes.villa.path}>Villas</Link>
                <Link className="block p-2 hover:text-Csecondary1 " to={routes.duplex.path}>Duplex</Link>
                <Link className="block p-2 hover:text-Csecondary1" to={routes.building.path}>Immeubles</Link>
                {/* <Link className="block p-2 hover:text-Csecondary1" to="#">Espaces commerciaux</Link> */}
            </div>
        </div>
    );
};


const SubMenuInvestir =()=>{
    return (
        <div className="dropdown-menu md:text-left ">
            <div className="divide-y divide-gray-400  text-texteCouleur font-lato overflow-x-auto h-96">
                <Link className="block p-2 hover:text-Csecondary1"to="/service1">Commerces</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service2">Logements</Link>
                <Link className="block p-2 hover:text-Csecondary1 "to="/service3">Appartements meublés</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service4">Immeubles locatifs</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service5">Educations</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service6">Lotissements</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service7">Loisirs</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service8">Centres médicals</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service9">Hotels</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service9">Industriels</Link>
            </div>
        </div>
    );
}


const SubMenuAide =()=>{
    return (
        
        <div className="dropdown-menu md:text-left">
            <div className="divide-y divide-gray-400  text-texteCouleur font-lato">
                <Link className="block p-2 hover:text-Csecondary1" to="/services">Copropriétés</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service2">Crash funding</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/service3">Achats</Link>
                <Link className="block p-2 hover:text-Csecondary1" to="/pagination">Pagination</Link>
            </div>
        </div>
    );
}


export { SubMenu, SubMenuInvestir,SubMenuAide };

