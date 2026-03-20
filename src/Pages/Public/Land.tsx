import React, { useEffect, useState } from "react";
import { MapPin, Maximize2, TrendingUp, Heart, Share2, X, Phone, User, Send, Map, Globe } from "lucide-react";
import { FaAngleLeft, FaAngleRight, FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import FilterComponent from "@/components/public/FilterComponent";
import { useFilterFrontend } from "@/hooks/useFilterFrontend";
import { routes } from "@/routes";
import { getProducts } from "@/services/ProductService";
import { ProductType } from "@/types";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { ActionIcon, Badge, Modal } from "rizzui";
import Loader from "../../loader/Loader";
import Pagination from "@/components/admin/ui/table/pagination";


const EarthChoiceModal = ({ isOpen, onClose, webUrl, mapurl }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold text-gray-900">Vue satellite</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => { window.open(mapurl, "_blank", "noopener,noreferrer"); onClose(); }}
            className="w-full flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-Cprimary/30 hover:bg-gray-50 transition-all group"
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
              <Map className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Google Maps</p>
              <p className="text-xs text-gray-400">Localisation exacte</p>
            </div>
          </button>

          {React.createElement("a", {
            href: webUrl || "https://earth.google.com/web/@3.9843,9.8261,0a,2000d,35y,0h,0t,0r",
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: onClose,
            className: "flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-Cprimary/30 hover:bg-gray-50 transition-all group",
          },
            React.createElement("div", { className: "w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0" },
              React.createElement(Globe, { className: "w-4 h-4 text-emerald-600" })
            ),
            React.createElement("div", { className: "text-left" },
              React.createElement("p", { className: "text-sm font-bold text-gray-900" }, "Google Earth Web"),
              React.createElement("p", { className: "text-xs text-gray-400" }, "Vue 3D dans le navigateur")
            )
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-4 text-center">
          Google Maps pour la localisation exacte, Google Earth pour la vue 3D
        </p>
      </div>
    </div>
  );
};


const CommandModal = ({ isOpen, onClose, terrain }: any) => {
  const [formData, setFormData] = useState({ nom: "", telephone: "" });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e: any = {};
    if (!formData.nom.trim()) e.nom = "Le nom est requis";
    if (!formData.telephone.trim()) e.telephone = "Le numero est requis";
    else if (!/^[0-9+\s()-]+$/.test(formData.telephone)) e.telephone = "Numero invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const msg = `Bonjour, je suis ${formData.nom}\n\nJe suis interesse par le terrain :\n\nRef : ${terrain.reference}\nSurface : ${terrain.productable.area} m2\nPrix : ${terrain.total_price} FCFA\nLocalisation : ${terrain.productable.location.address.street}, ${terrain.productable.location.address.city}\n\nContact : ${formData.telephone}`;
    window.open(`https://wa.me/237680312741?text=${encodeURIComponent(msg)}`, "_blank");
    setFormData({ nom: "", telephone: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-auto">
        <div className="bg-Csecondary1 p-5 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Commander</p>
          <h2 className="text-lg font-black text-white">Ce terrain vous interesse ?</h2>
          <p className="text-white/50 text-xs mt-0.5">Ref: {terrain.reference}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Details du terrain</p>
            <p className="text-sm font-bold text-gray-900">{terrain.productable.area} m2 — {terrain.total_price} FCFA</p>
            <p className="text-xs text-gray-500 mt-0.5">{terrain.productable.location.address.city}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text" name="nom" value={formData.nom} onChange={handleChange}
                placeholder="Votre nom complet"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 transition-all ${errors.nom ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Telephone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                placeholder="+237 6XX XXX XXX"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 transition-all ${errors.telephone ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            {errors.telephone && <p className="text-red-400 text-xs mt-1">{errors.telephone}</p>}
          </div>

          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <Send className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">Envoi via WhatsApp</p>
              <p className="text-xs text-emerald-600 mt-0.5">Votre demande sera envoyee directement</p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-Cprimary hover:bg-Csecondary1 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const LandCard = ({ terrain }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEarthModalOpen, setIsEarthModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const location = terrain?.productable?.location;
  const kmlOriginalUrl = location?.media?.[0]?.original_url || location?.coordinate_link || "";
  const kmlUrl = kmlOriginalUrl
    .replace("http://192.168.100.30:8000", "")
    .replace("https://690f74e23005.ngrok-free.app", "");

  useEffect(() => {
    if (!kmlUrl) {
      const def = "3.8480,11.5021";
      setFinalUrl(`https://earth.google.com/web/@${def},0a,50000d,35y,0h,0t,0r`);
      setGoogleMapsUrl(`https://www.google.com/maps/search/?api=1&query=${def}`);
      return;
    }
    const fetchKml = async () => {
      try {
        const res = await fetch(kmlUrl, { headers: { "ngrok-skip-browser-warning": "true" } });
        if (!res.ok) return;
        const kmlText = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(kmlText, "text/xml");
        let lat: number | undefined, lng: number | undefined, zoom = 500;
        const firstPoint = xml.getElementsByTagName("Point")[0];
        if (firstPoint) {
          const coordText = firstPoint.getElementsByTagName("coordinates")[0]?.textContent?.trim();
          if (coordText) {
            const parts = coordText.split(",");
            lng = parseFloat(parts[0]); lat = parseFloat(parts[1]);
          }
        }
        if (!lat) {
          const firstCoords = xml.getElementsByTagName("coordinates")[0];
          if (firstCoords) {
            const points = firstCoords.textContent?.trim().split(/\s+/) || [];
            const lats: number[] = [], lngs: number[] = [];
            points.forEach((p) => { const parts = p.split(","); if (parts.length >= 2) { lngs.push(parseFloat(parts[0])); lats.push(parseFloat(parts[1])); } });
            if (lats.length > 0) {
              lat = lats.reduce((a, b) => a + b) / lats.length;
              lng = lngs.reduce((a, b) => a + b) / lngs.length;
              const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
              zoom = Math.max(300, span * 111000 * 2.5);
            }
          }
        }
        if (lat && lng) {
          setFinalUrl(`https://earth.google.com/web/@${lat},${lng},0a,${zoom.toFixed(0)}d,35y,0h,0t,0r`);
          setGoogleMapsUrl(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
        }
      } catch {  }
    };
    fetchKml();
  }, [kmlUrl]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: terrain?.productable?.land_title || "Terrain", url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const address = terrain?.productable?.location?.address;
  const fmt = (n: number) => new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

  return (
    <>
      <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-Cprimary/30 hover:shadow-lg transition-all duration-300 group">

     
        <div className="relative h-52 overflow-hidden">
          <img
            src={terrain?.productable?.images?.[0]}
            alt={terrain?.productable?.land_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {(terrain.for_rent || terrain.for_sale) ? (
            <span className="absolute top-3 left-3 bg-Cprimary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {terrain.for_rent ? "A louer" : "A vendre"}
            </span>
          ) : null}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        
        <div className="p-5">
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-Cprimary transition-colors">
                  {terrain.productable.land_title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Ref. {terrain.reference}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
              >
                Commander
              </button>
            </div>
          </div>

        
          <div className="flex items-center justify-between mb-4">
            {address && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-Cprimary shrink-0" />
                <span className="truncate">{address.street}, {address.city}</span>
              </div>
            )}
            <button
              onClick={() => setIsEarthModalOpen(true)}
              className="shrink-0 ml-2 text-xs font-medium text-Cprimary hover:text-Csecondary1 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              Satellite
            </button>
          </div>

          
          <div className="grid grid-cols-2 gap-2 py-4 border-y border-gray-50 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <Maximize2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400">Surface</p>
                <p className="text-xs font-bold text-gray-900">{terrain.productable.area} m2</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400">Relief</p>
                <p className="text-xs font-bold text-gray-900">{terrain.productable.relief || "N/A"}</p>
              </div>
            </div>
          </div>

        
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Prix</p>
              <p className="text-sm font-bold text-Cprimary">{fmt(terrain.total_price)}</p>
              {terrain.unit_price && (
                <p className="text-xs text-gray-400">{fmt(terrain.unit_price)}/m2</p>
              )}
            </div>
            <Link
              to={`/lands/${terrain.id}`}
              className="flex items-center gap-1.5 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              Voir details
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>

      <CommandModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} terrain={terrain} />
      <EarthChoiceModal
        isOpen={isEarthModalOpen}
        onClose={() => setIsEarthModalOpen(false)}
        webUrl={finalUrl}
        mapurl={googleMapsUrl}
        kmlUrl={kmlUrl}
      />
    </>
  );
};


export const ImageModal = (props: any) => (
  <Modal isOpen={props.modalIsOpen} onClose={() => props.setModalIsOpen(false)} size="lg">
    {props.selectedImageIndex !== null && (
      <div className="relative">
        <button onClick={() => props.navigate("prev")} className="absolute rounded-full bg-Cprimary flex items-center justify-center h-10 w-10 lg:-left-5 top-1/2 z-10">
          <FaAngleLeft className="w-5 h-5 text-white" />
        </button>
        <button onClick={() => props.navigate("next")} className="absolute rounded-full bg-Cprimary flex items-center justify-center h-10 w-10 lg:-right-5 right-0 top-1/2 z-10">
          <FaAngleRight className="w-5 h-5 text-white" />
        </button>
        <img src={props.image} alt={`Image ${props.selectedImageIndex + 1}`} className="object-contain w-full h-full rounded-xl" />
      </div>
    )}
  </Modal>
);


const Terrain = () => {
  const [selectedTerrain, setSelectedTerrain] = useState<ProductType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [terrain, setTerrain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const countPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lands = await getProducts();
        setTerrain(lands.data.filter((v: any) => v.productable_type === "App\\Models\\Land"));
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const {
    tableData, handlePriceFilter, handleLocationFilter, handleStatusFilter,
    handlePaginate, totalItems, currentPage, status, location, minPrice, maxPrice,
  } = useFilterFrontend<ProductType>(terrain, countPerPage);

  const handleTerrainClick = (land: any) => {
    setSelectedTerrain(land);
    setSelectedImageIndex(0);
    setShowModal(true);
  };

  const navigateImage = (dir: "prev" | "next") => {
    if (!selectedTerrain) return;
    const total = selectedTerrain.productable.images.length;
    setSelectedImageIndex((prev) => dir === "prev" ? (prev > 0 ? prev - 1 : total - 1) : (prev < total - 1 ? prev + 1 : 0));
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50">

     
      <div className="bg-Cprimary py-10 px-4">
        <div className="container mx-auto">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Catalogue</p>
          <h1 className="text-3xl font-black text-white">Nos Terrains</h1>
          <p className="text-white/50 text-sm mt-1">Une large gamme de terrains disponibles</p>
        </div>
      </div>

 
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto  py-3">
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
      </div>

     
      <div className="container mx-auto  py-10">
        {loading ? (
          <Loader />
        ) : tableData.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Aucun terrain ne correspond aux criteres selectionnes</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              {totalItems} terrain{totalItems > 1 ? "s" : ""} disponible{totalItems > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tableData.map((t) =>
                t && t.productable ? (
                  <LandCard
                    key={t.productable.id}
                    terrain={t}
                    handleTerrainClick={handleTerrainClick}
                  />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

   
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} containerClassName="lg:!max-w-5xl w-full">
        {selectedTerrain && (
          <div className="p-6 lg:p-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="bg-Cprimary text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  {selectedTerrain.reference}
                </span>
                {React.createElement("a", {
                  href: `https://wa.me/237686741680?text=${encodeURIComponent(`Bonjour ! Je suis interesse par le terrain ${selectedTerrain.reference}`)}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors",
                },
                  React.createElement(FaWhatsapp, { className: "w-4 h-4" }),
                  "+237 686 741 680"
                )}
              </div>
              <ActionIcon size="sm" variant="text" onClick={() => setShowModal(false)}>
                <XMarkIcon className="h-6 w-6" />
              </ActionIcon>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
             
              <div className="lg:w-1/2 flex gap-3">
                <div className="hidden md:flex flex-col gap-2 w-20">
                  {selectedTerrain.productable.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden aspect-video">
                    <img
                      src={selectedTerrain.productable.images[selectedImageIndex]}
                      alt="Image principale"
                      className="w-full h-full object-cover"
                    />
                    {selectedTerrain.productable.images.length > 1 && (
                      <>
                        <button onClick={() => navigateImage("prev")} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                          <FaAngleLeft className="w-3 h-3" />
                        </button>
                        <button onClick={() => navigateImage("next")} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                          <FaAngleRight className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 md:hidden overflow-x-auto">
                    {selectedTerrain.productable.images.map((img: string, i: number) => (
                      <button key={i} onClick={() => setSelectedImageIndex(i)} className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === i ? "border-Cprimary" : "border-transparent opacity-50"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              
              <div className="lg:w-1/2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Informations</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Description",           value: selectedTerrain.productable.description, italic: true },
                      { label: "Titre foncier",         value: selectedTerrain.productable.land_title },
                      { label: "Relief",                value: selectedTerrain.productable.relief },
                      { label: "Dossier technique",     value: selectedTerrain.productable.technical_doc ? "Oui" : "Non", color: selectedTerrain.productable.technical_doc ? "text-emerald-600" : "text-red-500" },
                      { label: "Certificat propriete",  value: selectedTerrain.productable.certificat_of_ownership ? "Oui" : "Non", color: selectedTerrain.productable.certificat_of_ownership ? "text-emerald-600" : "text-red-500" },
                      { label: "Morcelable",            value: selectedTerrain.productable.is_fragmentable ? "Oui" : "Non", color: selectedTerrain.productable.is_fragmentable ? "text-emerald-600" : "text-red-500" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-semibold text-gray-400 w-36 shrink-0">{row.label}</span>
                        <span className={`text-xs text-gray-700 ${row.italic ? "italic" : ""} ${row.color || ""}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTerrain.productable.is_fragmentable && selectedTerrain.productable.fragments?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Fragments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerrain.productable.fragments.map((f: any) => (
                        <Badge key={f.id}>{f.area} m2</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTerrain.productable.video_lands?.[0]?.videoLink && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src={getEmbedUrl(selectedTerrain.productable.video_lands[0].videoLink)}
                      title="Video du terrain"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link to={routes.login.path}>
                    <button className="bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                      Acheter
                    </button>
                  </Link>
                  {React.createElement("a", {
                    href: "src/assets/documents/Offre de services_a partager.pdf",
                    target: "_blank",
                    className: "bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all",
                  }, "Fiche cliente")}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

     
      <Pagination
        showLessItems
        className="flex justify-center pb-12"
        current={currentPage}
        pageSize={countPerPage}
        defaultCurrent={1}
        onChange={(page) => handlePaginate(page)}
        total={totalItems}
      />
    </div>
  );
};

export default Terrain;