import React from 'react';

const Services = () => {
    const services = [
        {id:1,title:"Un terrain", description : "Nos equipes puridiciplinaire, a la pointe de la technologie innovante proposent des solution complete pour tout vos probleme de immobilers", image:"src/assets/icons/membre.png"},
        {id:2,title:"Un immeuble", description : "Nos equipes puridiciplinaire, a la pointe de la technologie innovante proposent des solution complete pour tout vos probleme de immobilers", image:"src/assets/icons/club.png"},
        {id:3,title:"Un appartement", description : "Nos equipes puridiciplinaire, a la pointe de la technologie innovante proposent des solution complete pour tout vos probleme de immobilers", image:"src/assets/icons/national.png"},
        {id:4,title:"Un studio", description : "Nos equipes puridiciplinaire, a la pointe de la technologie innovante proposent des solution complete pour tout vos probleme de immobilers", image:"src/assets/icons/national.png"},
        {id:4,title:"Une chambre", description : "Nos equipes puridiciplinaire, a la pointe de la technologie innovante proposent des solution complete pour tout vos probleme de immobilers", image:"src/assets/icons/national.png"},

    ]
    return (
        <div className='md:px-14 px-4 py-16 max-w-screen-2x1 mx-auto mt-16'>
            <div className='text-center my-8'>
                <h2 className='text-4x1 text-neutralDGrey font-semibold mb-2'> Nos clients</h2>
                <p className='text-neutralDGrey'>Nous avons travaillé avec plusieurs clients qui nous ont entierement confiance</p>
                {/* logo partenaire */}
                <div className='my-12 flex flex-wrap justify-between items-center gap-8'>
                    <img src="src/assets/company/company1.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company2.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company3.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company2.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company3.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company1.jpg" alt="" className="w-24 h-24" />
                    <img src="src/assets/company/company2.jpg" alt="" className="w-24 h-24" />
                </div>
            </div>
            {/* les cartes de services */}
            <div className='mt-20 md:w-1/2 mx-auto text-center'>
                <h2 className='text-4x1 text-neutralDGrey font-semibold mb-3'> Resolvez tout vos problemes d'immobilier en un seul clic</h2>
                <p className='text-neutralDGrey'>Soyez la prohaine personnes a vouloir?</p>
            </div>
            {/* les cartes */}
            <div className='mt-14 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 md:w-11/12 mx-auto gap-12'>
                {
                    
                    services.map(services => ( <div key={services.id} className='px-4 py-8 text-center md:w-[300px] mx-auto md:h-80 rounded-md shadow cursor-pointer hover:-translate-y-5 hover:border-b-4 hover:border-indigo-700 transition-all duration-300 flex items-center justify-center h-full'>
                          <div>
                           <div className='bg-[#E8F5E9] mb-4 h-14 w-14 mx-auto rounded-tl-3xl rounded-br-3x1'><img src={services.image} alt="" className="-ml-5"/></div> 
                           <h4 className='text-2x1 font-bold text-neutralDGrey mb-2 px-2'>{services.title}</h4>
                           <p className='text-sm text-neutralDGrey'>{services.description}</p>
                          </div>
                         
                        </div>
                      ))
                }
            </div>
        </div>
    );
};

export default Services;