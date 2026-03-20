import React from "react";
import { useState } from "react";

export const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("acheter");
  const [searchValue, setSearchValue] = useState("");
  // const [propertyType, setPropertyType] = useState("tous");
  // const [priceRange, setPriceRange] = useState("budget");

  const tabs = [
    { id: "acheter", label: "Acheter", icon: "" },
    // { id: "louer",   label: "Louer",   icon: "" },
    // { id: "vendre",  label: "Vendre",  icon: "" },
    { id: "estimer", label: "Estimer", icon: "" },
  ];

  // const propertyTypes = ["Tous types", "Maison", "Appartement", "Terrain", "Bureau"];
  // const priceRanges   = ["Tous budgets", "< 50M FCFA", "50–100M", "100–200M", "> 200M"];

  return (
    <section className="relative w-full h-[580px] lg:h-[720px] overflow-hidden">

      {/* BG placeholder (replace with your Carousel) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-gray-900">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage:"url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600')", backgroundSize:"cover", backgroundPosition:"center"}}/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"/>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
          <span className="text-white/90 text-sm font-medium">+2 500 biens disponibles</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-3xl lg:text-6xl font-semibold text-white text-center leading-tight drop-shadow-xl mb-10 ">
          Optenez <span className="text-orange-400">1</span> Maison
          <br className="hidden md:block"/> à moin de 100 000 FCFA
        </h1>

        {/* ── SEARCH CARD ── */}
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-3.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5
                    ${activeTab === tab.id ? "text-orange-600 bg-orange-50" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t-full"/>
                  )}
                </button>
              ))}
            </div>

            {/* Search Inputs */}
            <div className="p-4 flex flex-col sm:flex-row gap-3">

              {/* Location input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Ville, quartier, commune…"
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

              {/* Type select */}
              {/* <div className="relative sm:w-40">
                <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                  className="w-full appearance-none pl-4 pr-8 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all cursor-pointer">
                  {propertyTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div> */}

              {/* Budget select */}
              {/* <div className="relative sm:w-40">
                <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
                  className="w-full appearance-none pl-4 pr-8 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all cursor-pointer">
                  {priceRanges.map(p => <option key={p}>{p}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div> */}

              {/* Search button */}
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.02] whitespace-nowrap">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Rechercher
              </button>
            </div>

        
            <div className="px-4 pb-3.5 flex flex-wrap gap-2">
              {["Coup de cœur", "Nouveau", "Promotions", "Vue mer", "Piscine"].map(tag => (
                <button key={tag} className="text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-full transition-colors duration-200">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

     
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
};

