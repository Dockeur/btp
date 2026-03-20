import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaWhatsapp, FaArrowLeft, FaBed, FaBath, FaCar,
  FaSwimmingPool, FaTree, FaBuilding, FaRulerCombined,
  FaMapPin, FaShareAlt, FaHeart, FaPhone, FaEnvelope,
  FaChevronLeft, FaChevronRight, FaDownload, FaChartArea,
} from "react-icons/fa";
import { MdHome, MdTerrain, MdLocationOn } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { HiOutlineDocumentText, HiLocationMarker } from "react-icons/hi";
import { FiArrowLeft, FiMaximize2, FiX, FiArrowRight } from "react-icons/fi";
import { Ruler, Layers, Map, Globe } from "lucide-react";
import Loader from "../../loader/Loader";
import { getProducts } from "@/services/ProductService";
import { ProductType } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("fr").format(n);

const typeLabels: Record<string, string> = {
  villa: "Villa", apartment: "Appartement", duplex: "Duplex",
  studio: "Studio", house: "Maison",
};

const reliefLabels: Record<string, string> = {
  plate: "Plat", mountainous: "Montagneux", hilly: "Vallonne",
};

// ── Hero stat ─────────────────────────────────────────────────────
const HeroStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
    <div className="text-Cprimary">{icon}</div>
    <p className="text-xl font-black text-gray-900 leading-tight">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

// ── Equipment row ─────────────────────────────────────────────────
const EquipRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: boolean | number }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <span className="flex items-center gap-2 text-sm text-gray-600">{icon} {label}</span>
    {typeof value === "boolean"
      ? value
        ? <BiCheckCircle className="text-emerald-500" size={18} />
        : <BiXCircle className="text-gray-300" size={18} />
      : <span className="text-sm font-bold text-gray-900">{value}</span>}
  </div>
);

const LandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "location" | "sites">("details");
  const [kmlCoordinates, setKmlCoordinates] = useState<Record<string, { lat: number; lng: number; mapUrl: string; earthUrl: string }>>({});

  const parseKMLCoordinates = async (kmlUrl: string, siteId: string) => {
    try {
      const cleanUrl = kmlUrl
        .replace(import.meta.env.VITE_API_URL ?? "", "")
        .replace(import.meta.env.VITE_NGROK_URL ?? "", "");
      const res = await fetch(cleanUrl, { headers: { "ngrok-skip-browser-warning": "true" } });
      if (!res.ok) return null;
      const kmlText = await res.text();
      const xml = new DOMParser().parseFromString(kmlText, "text/xml");
      let lat: number | undefined, lng: number | undefined, zoom = 500;
      const firstPoint = xml.getElementsByTagName("Point")[0];
      if (firstPoint) {
        const c = firstPoint.getElementsByTagName("coordinates")[0]?.textContent?.trim();
        if (c) { const p = c.split(","); lng = parseFloat(p[0]); lat = parseFloat(p[1]); }
      }
      if (!lat) {
        const fc = xml.getElementsByTagName("coordinates")[0];
        if (fc) {
          const pts = fc.textContent?.trim().split(/\s+/) || [];
          const lats: number[] = [], lngs: number[] = [];
          pts.forEach((p) => { const parts = p.split(","); if (parts.length >= 2) { lngs.push(parseFloat(parts[0])); lats.push(parseFloat(parts[1])); } });
          if (lats.length) {
            lat = lats.reduce((a, b) => a + b) / lats.length;
            lng = lngs.reduce((a, b) => a + b) / lngs.length;
            zoom = Math.max(300, Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs)) * 111000 * 2.5);
          }
        }
      }
      if (lat && lng) {
        const d = { lat, lng, mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, earthUrl: `https://earth.google.com/web/@${lat},${lng},0a,${zoom.toFixed(0)}d,35y,0h,0t,0r` };
        setKmlCoordinates((prev) => ({ ...prev, [siteId]: d }));
        return d;
      }
    } catch { /* silent */ }
    return null;
  };

  const getMapEmbedUrl = (siteId: string) => {
    const c = kmlCoordinates[siteId];
    return c ? `https://maps.google.com/maps?q=${c.lat},${c.lng}&output=embed&z=17&t=h` : `https://maps.google.com/maps?q=3.8480,11.5021&output=embed&z=10`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response: any = await getProducts();
        const found = response.data.find(
          (item: ProductType) => item.id === Number(id) && item.productable_type === "App\\Models\\Property"
        );
        setProperty(found);
        found?.productable?.proposed_sites?.forEach((site: any) => {
          if (site.productable?.location?.kml) parseKMLCoordinates(site.productable.location.kml, site.id.toString());
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProperty();
  }, [id]);

  const images = property?.productable?.images || [];
  const nextImage = () => setSelectedImage((p) => (p + 1) % images.length);
  const prevImage = () => setSelectedImage((p) => (p - 1 + images.length) % images.length);
  const handleShare = () => { if (navigator.share) navigator.share({ title: property?.productable?.title || "Propriete", url: window.location.href }); };

  if (loading) return <Loader />;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdHome className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-4">Propriete introuvable</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-Cprimary text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            <FiArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>
    );
  }

  const sitesCount = property?.productable?.proposed_sites?.length || 0;

  const tabs = [
    { id: "details", label: "Details", icon: HiOutlineDocumentText },
    { id: "location", label: "Localisation", icon: MdLocationOn },
    { id: "sites", label: `Sites (${sitesCount})`, icon: MdTerrain },
  ];

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-Cprimary transition-colors">
              <FiArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Proprietes</span>
              <span>/</span>
              <span className="text-gray-700 font-medium">{property.reference}</span>
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
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{property.reference}</span>
            {property?.productable?.type && (
              <span className="bg-white text-Csecondary1 text-xs font-bold px-3 py-1 rounded-full">
                {typeLabels[property.productable.type] || property.productable.type}
              </span>
            )}
            {property.for_rent && <span className="bg-Cprimary text-white text-xs font-semibold px-3 py-1 rounded-full">A louer</span>}
            {property.for_sale && <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">A vendre</span>}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
            {property?.productable?.title ?? "Propriete disponible"}
          </h1>

          {property?.productable?.location?.address && (
            <p className="flex items-center gap-2 text-sm text-white/60 mb-8">
              <HiLocationMarker className="shrink-0" />
              {[property.productable.location.address.street, property.productable.location.address.city, property.productable.location.address.country].filter(Boolean).join(", ")}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <HeroStat icon={<FaBed className="w-5 h-5" />} value={String(property?.productable?.bedrooms || 0)} label="Chambres" />
            <HeroStat icon={<FaBath className="w-5 h-5" />} value={String(property?.productable?.bathrooms || 0)} label="Salles de bain" />
            <HeroStat icon={<FaBuilding className="w-5 h-5" />} value={String(property?.productable?.number_of_salons || 0)} label="Salons" />
            <HeroStat icon={<FaCar className="w-5 h-5" />} value={String(property?.productable?.parkings || 0)} label="Parkings" />
            <HeroStat icon={<Layers className="w-5 h-5" />} value={String(property?.productable?.levels || 0)} label="Niveaux" />
          </div>
        </div>
      </div>


      <div className="container mx-auto py-10">
        <div className="grid lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 space-y-6">


            {images.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-80 lg:h-[420px] group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img src={images[selectedImage]} alt={`Photo ${selectedImage + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }} className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
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
                      <button key={i} onClick={() => setSelectedImage(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"}`}>
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
                    className={`relative flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${activeTab === tab.id ? "text-Cprimary" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-Cprimary rounded-t-full" />}
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-8">


                {activeTab === "details" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Description</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {property?.productable?.description ?? "Aucune description disponible"}
                      </p>
                    </div>

                    {(property?.productable?.build_area || property?.productable?.field_area || property?.productable?.ground_floor_area || property?.productable?.basement_area) && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Surfaces</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { label: "Surface construite", value: property?.productable?.build_area },
                            { label: "Superficie du terrain", value: property?.productable?.field_area },
                            { label: "Rez-de-chaussee", value: property?.productable?.ground_floor_area },
                            { label: "Sous-sol", value: property?.productable?.basement_area },
                          ].filter((s) => s.value).map((s) => (
                            <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                              <p className="text-xl font-black text-gray-900">{fmtNum(Number(s.value))} m2</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {activeTab === "location" && property?.productable?.location && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Localisation</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { label: "Pays", value: property.productable.location.address?.country },
                        { label: "Ville", value: property.productable.location.address?.city },
                        { label: "Quartier", value: property.productable.location.address?.street },
                      ].filter((l) => l.value).map((l) => (
                        <div key={l.label} className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-400 mb-1">{l.label}</p>
                          <p className="text-sm font-bold text-gray-900">{l.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {activeTab === "sites" && property?.productable?.proposed_sites?.length > 0 && (
                  <div className="space-y-5">
                    {property.productable.proposed_sites.map((site: any, index: number) => (
                      <div key={site.id} className="border border-gray-100 rounded-2xl overflow-hidden">

                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-Cprimary rounded-xl flex items-center justify-center shrink-0">
                              <FaMapPin className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900">{site.productable?.land_title || `Terrain ${index + 1}`}</h4>
                              {site.productable?.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{site.productable.description}</p>}
                            </div>
                          </div>

                          {(site.productable?.area || site.productable?.relief) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {site.productable?.area && (
                                <span className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                                  <FaChartArea className="w-3 h-3 text-emerald-500" />
                                  {fmtNum(Number(site.productable.area))} m2
                                </span>
                              )}
                              {site.productable?.relief && (
                                <span className="bg-white border border-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                                  {reliefLabels[site.productable.relief] || site.productable.relief}
                                </span>
                              )}
                            </div>
                          )}
                        </div>


                        {site.productable?.location?.kml && (
                          <div className="relative h-64">
                            <iframe
                              src={getMapEmbedUrl(site.id.toString())}
                              width="100%" height="100%"
                              style={{ border: 0 }} allowFullScreen loading="lazy"
                              className="w-full h-full"
                              title={`Carte ${site.productable?.land_title || "Terrain"}`}
                            />
                            {kmlCoordinates[site.id] && (
                              <div className="absolute top-3 right-3 flex gap-1.5">
                                {React.createElement("a", {
                                  href: site.productable.location.kml, download: true,
                                  className: "w-8 h-8 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 transition-colors",
                                  title: "Telecharger KML",
                                }, React.createElement(FaDownload, { className: "w-3 h-3 text-gray-600" }))}
                                {React.createElement("a", {
                                  href: kmlCoordinates[site.id].mapUrl, target: "_blank", rel: "noopener noreferrer",
                                  className: "bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors",
                                }, "Maps")}
                                {React.createElement("a", {
                                  href: kmlCoordinates[site.id].earthUrl, target: "_blank", rel: "noopener noreferrer",
                                  className: "bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors",
                                }, "Earth 3D")}
                              </div>
                            )}
                          </div>
                        )}


                        {site.productable?.location?.address && (
                          <div className="px-5 py-4 flex items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                              {[site.productable.location.address.street, site.productable.location.address.city, site.productable.location.address.country].filter(Boolean).map((v, i) => (
                                <span key={i}>{v}</span>
                              ))}
                            </div>
                            <Link
                              to={`/lands/${site.id}`}
                              className="shrink-0 flex items-center gap-1.5 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                            >
                              Detail
                              <FiArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">


              <div className="bg-Csecondary1 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Prix total</p>
                <p className="text-3xl font-black text-white mb-1">{fmt(Number(property.total_price ?? 0))}</p>
                {property?.productable?.estimated_payment && Number(property.productable.estimated_payment) > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-0.5">Mensualite estimee</p>
                    <p className="text-lg font-bold text-white">{fmt(Number(property.productable.estimated_payment))}</p>
                  </div>
                )}

                <div className="mt-5 space-y-2">
                  {React.createElement(Link, {
                    to: `https://wa.me/237686741680?text=${encodeURIComponent(`Bonjour! Je suis interesse par la propriete ${property.reference}`)}`,
                    className: "flex items-center justify-center gap-2 w-full bg-white  text-black/40 text-sm font-bold py-3 rounded-xl transition-all",
                  },
                    React.createElement(FaWhatsapp, { className: "w-4 h-4" }),
                    " Demander une visite"
                  )}
                  {/* <button className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-Csecondary1 text-sm font-bold py-3 rounded-xl transition-all">
                    <HiOutlineDocumentText className="w-4 h-4" />
                    Demander une visite
                  </button> */}
                  {/* <button className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-all border border-white/20">
                    <FaDownload className="w-3.5 h-3.5" />
                    Telecharger la fiche
                  </button> */}
                </div>
              </div>


              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Equipements</h4>
                <EquipRow icon={<FaSwimmingPool className="w-3.5 h-3.5 text-blue-400" />} label="Piscine" value={!!property?.productable?.has_pool} />
                <EquipRow icon={<FaTree className="w-3.5 h-3.5 text-emerald-500" />} label="Jardin" value={!!property?.productable?.has_garden} />
                <EquipRow icon={<FaBuilding className="w-3.5 h-3.5 text-Cprimary" />} label="Niveaux" value={property?.productable?.levels || 0} />
              </div>


              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Besoin d'aide ?</h4>
                <div className="space-y-3">
                  {React.createElement("a", {
                    href: "tel:237686741680",
                    className: "flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors",
                  },
                    React.createElement("div", { className: "w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center" },
                      React.createElement(FaPhone, { className: "w-3 h-3 text-Cprimary" })
                    ),
                    "+237 686 741 680"
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

            </div>
          </div>
        </div>
      </div>


      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
          <img src={images[selectedImage]} alt="Plein ecran" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors">
                <FaChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full">{selectedImage + 1} / {images.length}</span>
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

export default LandDetail;