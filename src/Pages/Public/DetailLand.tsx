import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaWhatsapp, FaMap, FaGlobe, FaShareAlt, FaHeart,
  FaPhone, FaEnvelope, FaCertificate, FaMountain,
  FaCheck, FaTimes, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { HiOutlineDocumentText, HiLocationMarker } from "react-icons/hi";
import { MdVerified, MdLandscape } from "react-icons/md";
import { FiArrowLeft, FiMaximize2, FiX } from "react-icons/fi";
import { Maximize2 } from "lucide-react";
import Loader from "../../loader/Loader";
import { getProducts } from "@/services/ProductService";
import TourBooking from "@/components/TourBooking";

const reliefLabels: Record<string, string> = {
  plate: "Plat",
  mountainous: "Montagneux",
  hilly: "Vallonne",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0, notation: "compact" }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat("fr").format(n);


const HeroStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="bg-white rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
    <div className="text-Cprimary">{icon}</div>
    <p className="text-xl font-black text-gray-900 leading-tight">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [land, setLand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "location" | "details">("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; mapUrl: string; earthUrl: string } | null>(null);

  const parseKML = async (kmlUrl: string) => {
    try {
      const cleanUrl = kmlUrl.replace("http://192.168.100.152:8000", "");
      const res = await fetch(cleanUrl);
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const coordsText = xml.getElementsByTagName("coordinates")[0]?.textContent;
      if (!coordsText) return;
      const points = coordsText.trim().split(/\s+/);
      const lats: number[] = [], lngs: number[] = [];
      points.forEach((p) => {
        const [lng, lat] = p.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) { lats.push(lat); lngs.push(lng); }
      });
      if (!lats.length) return;
      const lat = lats.reduce((a, b) => a + b) / lats.length;
      const lng = lngs.reduce((a, b) => a + b) / lngs.length;
      setCoords({
        lat, lng,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        earthUrl: `https://earth.google.com/web/@${lat},${lng},500d`,
      });
    } catch (e) { console.error("Erreur KML:", e); }
  };

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response: any = await getProducts();
        const found = response.data.find(
          (item: any) => item.id === Number(id) && item.productable_type === "App\\Models\\Land"
        );
        setLand(found);
        const kml =
          found?.productable?.location?.media?.[0]?.original_url ||
          found?.productable?.location?.kml ||
          found?.productable?.location?.coordinate_link;
        if (kml) parseKML(kml);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchLand();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: land.productable.land_title, url: window.location.href });
    }
  };

  const images = land?.productable?.images || [];
  const nextImage = () => setSelectedImage((p) => (p + 1) % images.length);
  const prevImage = () => setSelectedImage((p) => (p - 1 + images.length) % images.length);

  if (loading) return <Loader />;

  if (!land) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdLandscape className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-4">Terrain introuvable</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-Cprimary text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  const location = land.productable.location?.address;

  const tabs = [
    { id: "description", label: "Description",   icon: HiOutlineDocumentText },
    { id: "location",    label: "Localisation",   icon: HiLocationMarker },
    { id: "details",     label: "Details",         icon: MdLandscape },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

     
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-Cprimary transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Terrains</span>
              <span>/</span>
              <span className="text-gray-700 font-medium">{land.reference}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaShareAlt className="w-4 h-4 text-gray-500" />
            </button>
            <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaHeart className={`w-4 h-4 ${isFavorite ? "text-red-500" : "text-gray-400"}`} />
            </button>
          </div>
        </div>
      </div>

     
      <div className="bg-Cprimary py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              {land.reference}
            </span>
            {land.productable.certificat_of_ownership && (
              <span className="bg-white text-orange text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <MdVerified className="w-3 h-3" />
                Titre foncier verifie
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
            {land.productable.land_title}
          </h1>

          {location && (
            <p className="flex items-center gap-2 text-sm text-white/60 mb-8">
              <HiLocationMarker className="shrink-0" />
              {location.city}, {location.country}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HeroStat icon={<Maximize2 className="w-5 h-5" />}    value={`${fmtNum(Number(land.productable.area))} m2`}                                          label="Superficie totale" />
            <HeroStat icon={<FaMountain className="w-5 h-5" />}   value={reliefLabels[land.productable.relief] ?? land.productable.relief}                       label="Type de relief" />
            <HeroStat icon={<FaCertificate className="w-5 h-5" />} value={land.productable.certificat_of_ownership ? "Disponible" : "Non disponible"}            label="Titre foncier" />
            <HeroStat icon={<MdLandscape className="w-5 h-5" />}  value={fmtCompact(Number(land.unit_price))}                                                    label="Prix au m2" />
          </div>
        </div>
      </div>

      
      <div className="container mx-auto  py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          
          <div className="lg:col-span-2 space-y-6">

            
            {images.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="relative h-80 lg:h-[420px] overflow-hidden group cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={images[selectedImage]}
                    alt={`Photo ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <FiMaximize2 className="w-4 h-4" />
                  </button>
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <FaChevronLeft className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <FaChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

           
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                      activeTab === tab.id ? "text-Cprimary" : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-Cprimary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-8">

               
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">A propos</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {land.productable.description || land.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        {
                          label: "Titre foncier",
                          value: land.productable.certificat_of_ownership ? "Disponible" : "Non disponible",
                          ok: land.productable.certificat_of_ownership,
                        },
                        {
                          label: "Relief",
                          value: reliefLabels[land.productable.relief] ?? land.productable.relief,
                          ok: true,
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.ok ? "bg-emerald-50" : "bg-red-50"}`}>
                            {item.ok
                              ? <FaCheck className="w-3.5 h-3.5 text-emerald-500" />
                              : <FaTimes className="w-3.5 h-3.5 text-red-400" />}
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-bold text-gray-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                
                {activeTab === "location" && coords && (
                  <div className="space-y-5">
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                      <iframe
                        src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&output=embed&z=17`}
                        className="w-full h-72"
                        loading="lazy"
                      />
                    </div>

                    {location && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                          <HiLocationMarker className="text-Cprimary" />
                          Adresse
                        </h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          {location.street && <p>{location.street}</p>}
                          <p className="font-semibold">{location.city}</p>
                          <p className="text-gray-500">{location.country}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3">
                      {React.createElement("a", {
                        href: coords.mapUrl, target: "_blank", rel: "noopener noreferrer",
                        className: "flex items-center justify-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold py-3 rounded-xl transition-all",
                      }, React.createElement(FaMap, { className: "w-4 h-4" }), "Google Maps")}
                      {React.createElement("a", {
                        href: coords.earthUrl, target: "_blank", rel: "noopener noreferrer",
                        className: "flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-all",
                      }, React.createElement(FaGlobe, { className: "w-4 h-4" }), "Google Earth")}
                    </div>
                  </div>
                )}

               
                {activeTab === "details" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "Superficie totale", value: `${fmtNum(Number(land.productable.area))} m2`, icon: Maximize2 },
                      { label: "Type de relief",    value: reliefLabels[land.productable.relief] ?? land.productable.relief, icon: FaMountain },
                      { label: "Titre foncier",     value: land.productable.certificat_of_ownership ? "Disponible" : "Non disponible", icon: FaCertificate },
                      { label: "Reference",         value: land.reference, icon: HiOutlineDocumentText },
                    ].map((d, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-Cprimary/10 rounded-xl flex items-center justify-center shrink-0">
                          <d.icon className="w-4 h-4 text-Cprimary" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{d.label}</p>
                          <p className="text-sm font-bold text-gray-900">{d.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

    
            {land.productable.video_lands?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Visite virtuelle</h3>
                <div className="space-y-4">
                  {land.productable.video_lands.map((video: any) => {
                    const rawId = video.videoLink.split("v=")[1] || "";
                    const cleanVideoId = rawId.includes("&") ? rawId.split("&")[0] : rawId;
                    return (
                      <div key={video.id} className="aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <iframe
                          width="100%" height="100%"
                          src={`https://www.youtube.com/embed/${cleanVideoId}`}
                          title="Visite virtuelle"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <TourBooking productId={land.id} />
          </div>

         
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

             
              <div className="bg-Csecondary1 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Prix total</p>
                <p className="text-3xl font-black text-white mb-1">{fmt(Number(land.total_price))}</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-0.5">Prix au metre carre</p>
                  <p className="text-lg font-bold text-white">{fmt(Number(land.unit_price))}/m2</p>
                </div>

                <div className="mt-5 space-y-2">
                  {React.createElement("a", {
                    href: `https://wa.me/237680312741?text=${encodeURIComponent(`Bonjour, je suis interesse par le terrain ${land.reference}`)}`,
                    target: "_blank", rel: "noopener noreferrer",
                    className: "flex items-center justify-center gap-2 w-full bg-white text-black/40  text-sm font-bold py-3 rounded-xl transition-all",
                  },
                    React.createElement(FaWhatsapp, { className: "w-4 h-4" }),
                    "Contacter sur WhatsApp"
                  )}
                 
                </div>
              </div>

            
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Besoin d'aide ?</h4>
                <div className="space-y-3">
                  {React.createElement("a", {
                    href: "tel:237680312741",
                    className: "flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors",
                  },
                    React.createElement("div", { className: "w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center" },
                      React.createElement(FaPhone, { className: "w-3 h-3 text-Cprimary" })
                    ),
                    "+237 680 312 741"
                  )}
                  {React.createElement("a", {
                    href: "mailto:contact@example.com",
                    className: "flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors",
                  },
                    React.createElement("div", { className: "w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center" },
                      React.createElement(FaEnvelope, { className: "w-3 h-3 text-Cprimary" })
                    ),
                    "contact@example.com"
                  )}
                </div>
              </div>

         
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Garanties</h4>
                <div className="space-y-3">
                  {[
                    { icon: MdVerified,    color: "text-emerald-500", bg: "bg-emerald-50", title: "Terrain verifie",  sub: "Documents authentifies" },
                    { icon: FaCertificate, color: "text-Cprimary",    bg: "bg-Cprimary/10", title: "Titre foncier",  sub: "Propriete securisee" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${badge.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <badge.icon className={`w-4 h-4 ${badge.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{badge.title}</p>
                        <p className="text-xs text-gray-400">{badge.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <img
            src={images[selectedImage]}
            alt="Plein ecran"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors">
                <FaChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full">
                {selectedImage + 1} / {images.length}
              </span>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors">
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandDetails;