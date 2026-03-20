
import React, { useState, useRef } from 'react';

function MyForm() {
 // Référence au formulaire
  const resetForm = () => {
    formRef.current.reset();
  };
  const formRef = useRef(null);
 
  const [searchText, setSearchText] = useState('');
  const [propertyType, setPropertyType] = useState(''); // Terrain, Batiment, Investissement
  const [searchResults, setSearchResults] = useState([]); // Noms des propriétés
  const [noResults, setNoResults] = useState(false); // État pour afficher le message "Aucun résultat"

  const terrains = [
    { id: 1, name: 'Terrain 1', country: 'Pays A', city: 'Ville X', district: 'Quartier Y' },
    { id: 2, name: 'Terrain 2', country: 'Pays A', city: 'Ville Z', district: 'Quartier X' },
    // Ajoutez d'autres terrains ici
  ];

  const batiments = [
    { id: 1, name: 'Bâtiment 1', country: 'Pays A', city: 'Ville X', district: 'Quartier Y' },
    { id: 2, name: 'Bâtiment 2', country: 'Pays B', city: 'Ville Z', district: 'Quartier X' },
    // Ajoutez d'autres bâtiments ici
  ];

  const investissements = [
    { id: 1, name: 'Investissement 1', country: 'Pays B', city: 'Ville Z', district: 'Quartier X' },
    { id: 2, name: 'Investissement 2', country: 'Pays C', city: 'Ville Y', district: 'Quartier Z' },
    // Ajoutez d'autres investissements ici
  ];

  const handleSearch = () => {
    let results = [];
    if (propertyType === 'Terrain') {
      results = terrains
        .filter((terrain) => {
          return (
            terrain.country.toLowerCase() === searchText.toLowerCase() ||
            terrain.city.toLowerCase() === searchText.toLowerCase() ||
            terrain.district.toLowerCase() === searchText.toLowerCase()
          );
        })
        .map((terrain) => terrain.name);
    } else if (propertyType === 'Batiment') {
      results = batiments
        .filter((batiment) => {
          return (
            batiment.country.toLowerCase() === searchText.toLowerCase() ||
            batiment.city.toLowerCase() === searchText.toLowerCase() ||
            batiment.district.toLowerCase() === searchText.toLowerCase()
          );
        })
        .map((batiment) => batiment.name);
    } else if (propertyType === 'Investissement') {
      results = investissements
        .filter((investissement) => {
          return (
            investissement.country.toLowerCase() === searchText.toLowerCase() ||
            investissement.city.toLowerCase() === searchText.toLowerCase() ||
            investissement.district.toLowerCase() === searchText.toLowerCase()
          );
        })
        .map((investissement) => investissement.name);
    }

    setSearchResults(results);

    // Mettre à jour l'état "noResults" si la recherche ne renvoie aucun résultat
    setNoResults(results.length === 0);
    // Réinitialiser le formulaire après la recherche
    
  };

  return (
    <div>
      <div className='text-center justify-center text-Csecondary2 font-montserrat mx-auto md:text-center lg:mb-5 mt-28'>
        <h3 className=' font-bold lg:mb-2  lg:text-4xl' >L'innovation au cœur de nos actions</h3>
        <h4 className=' font-semibold lg:mb-2 lg:text-3xl'>Votre propriété, notre priorité.</h4>
        <p className='lg:text-xl font-semibold text-sm ' >Devient investisseur a partir de 100.000f</p>

      </div>
      

      <div className="flex mb-4 justify-center items-center lg:mb-7 lg:w-80 w-60 hidden">
       
        <div className="mb-[0.125rem] lg:mr-10 lg:ml-60 ml-28  inline-flex items-center min-h-[2rem] pl-[5rem]">
          <input
            type="radio"
            name="propertyType"
            id="terrainRadio"
            value="Terrain"
            className='h-5 w-5 appearance-none  checked:bg-Cprimary rounded-full border-2 checked:border-Csecondary1'
            checked={propertyType === 'Terrain'}
            onChange={() => setPropertyType('Terrain')}
          />
          <label htmlFor="terrainRadio" className='text-Csecondary2 font-lato text-base px-1'>Terrain</label>
          
        </div>

        <div className="mb-[0.125rem] inline-flex items-center min-h-[2rem] pl-[1rem]  ">
          <input
            type="radio"
            name="propertyType"
            id="batimentRadio"
            value="Batiment"
            className='h-5 w-5 appearance-none checked:bg-Cprimary rounded-full border-2 checked:border-Csecondary1'
            checked={propertyType === 'Batiment'}
            onChange={() => setPropertyType('Batiment')}
          />
          <label htmlFor="batimentRadio" className='text-white font-lato text-base px-1 '>Bâtiment</label>
        </div>


        <div className="mb-[0.125rem] mr-36 inline-flex items-center min-h-[1.5rem] pl-[1rem]">
          <input
            type="radio"
            name="propertyType"
            id="investmentRadio"
            value="Investissement"
            className='h-5 w-5 appearance-none checked:bg-Cprimary rounded-full border-2 checked:border-Csecondary1'
            checked={propertyType === 'Investissement'}
            onChange={() => setPropertyType('Investissement')}
          />
          <label htmlFor="investmentRadio" className='text-white font-lato text-base px-1'>Investissement</label>
        </div>
      </div>

      <form ref={formRef} className="relative mx-3 sm:mx-auto -top-5 lg:bg-Csecondary1 p-0.5 hidden">
        <div className="flex items-center ">
          <input
            type="text"
            placeholder="Entrez un pays, une ville, un quartier"
            autoComplete='on'
            className="w-full  py-3 pl-4 pr-12 text-texteCouleur border rounded-md outline-none bg-gray-50 focus:bg-white"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-6 h-6 my-auto text-gray-400 right-4 cursor-pointer hover:text-Csecondary1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => {
              handleSearch();
              resetForm();
            }}
             
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

      {/* Afficher les résultats de la recherche */}
      <div className='text-whit text-center -mt-5'>
        {noResults ? (
          <p >Aucun résultat trouvé.</p>
        ) : (
          <div>
            <h3 className=' hidden'>Résultats de la recherche :</h3>
            <ul>
              {searchResults.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyForm;









// import React , { useState } from 'react';


// function MyForm() {
//   const [searchText, setSearchText] = useState('');
//   const handleSearch = () => {
//     // Mettre ici la logique de recherche que vous souhaitez
//     alert('Recherche en cours...'); // Exemple : une alerte pour démonstration
//        // Réinitialisez le formulaire en effaçant le texte de recherche
//        setSearchText('');
//   };

  
//   return (
//     <div>
//       <div className='text-center justify-center text-Csecondary2 font-montserrat  mx-auto md:text-center'>
//         <h3 className='text-3xl font-semibold mb-2 mt-7 text-Csecondary1' >Votre propriété, notre priorité</h3>
//         <p className=' text-Csecondary1 mb-3 text-xl ' >Devient investisseur a partir de 100.000f</p>

//       </div>

//       <div className="flex mb-5 justify-center items-center ">
 
//          {/* First radio */}
//          <div className="mb-[0.125rem] mr-10 inline-block min-h-[2rem] pl-[7rem]">
//           <input
//               className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none checked:bg-Cprimary rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-Csecondary1 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
//               type="radio"
//               name="inlineRadioOptions"
//               id="inlineRadio2"
//               value="option2"
//           />
//           <label
//               className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
//               htmlFor="inlineRadio2"
//           >
//               <p className='text-Csecondary2 font-lato text-base'>Terrain</p>
//           </label>
//           </div>
//           {
//           // Second radio
//           }
//           <div className="mb-[0.125rem] mr-10 inline-block min-h-[2rem] pl-[1.5rem]">
//           <input
//               className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none checked:bg-Cprimary rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-Csecondary1 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
//               type="radio"
//               name="inlineRadioOptions"
//               id="inlineRadio2"
//               value="option2"
//           />
//           <label
//               className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
//               htmlFor="inlineRadio2"
//           >
//               <p className='text-Csecondary2 font-lato text-base'>Batiment</p>
//           </label>
//           </div>
//           {
//           // Third radio 
//           }
//                    <div className="mb-[0.125rem] mr-32 inline-block min-h-[1.5rem] pl-[1.5rem]">
//           <input
//               className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none checked:bg-Cprimary rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-Csecondary1 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
//               type="radio"
//               name="inlineRadioOptions"
//               id="inlineRadio2"
//               value="option2"
//           />
//           <label
//               className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
//               htmlFor="inlineRadio2"
//           >
//               <p className='text-Csecondary2 font-lato text-base'>Ivestissement</p>
//           </label>
//           </div>
//       </div>
//       <form className="relative mx-16 sm:mx-auto mx -top-4">
//       <div className="w-full flex items-center">
//         <input
//           type="text"
//           placeholder="Entrez un pays, une ville, un quartier"
//           className="w-full py-3 pl-4 pr-12 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="absolute w-6 h-6 my-auto text-gray-400 right-4 cursor-pointer"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           onClick={handleSearch}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//           />
//         </svg>

//       </div>
//     </form>

//     </div>
    
//   );
// }

// export default MyForm;
