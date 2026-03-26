import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCar, FaSwimmingPool, FaTree,
  FaBuilding, FaChevronLeft, FaChevronRight,
  FaShareAlt, FaHeart, FaPhone, FaEnvelope,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { HiOutlineDocumentText, HiLocationMarker } from "react-icons/hi";
import { Building2, Layers, Ruler, DollarSign, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { FiArrowLeft, FiMaximize2, FiX } from "react-icons/fi";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { ProductType } from "@/types";

interface Props {
  immeuble: ProductType;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0, notation: "compact" }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat("fr").format(n);


const HeroStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="bg-white rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
    <div className="text-Cprimary">{icon}</div>
    <p className="text-2xl font-black text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);


const EquipRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: boolean | string | number }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <span className="flex items-center gap-2 text-sm text-gray-600">
      {icon} {label}
    </span>
    {typeof value === "boolean" ? (
      value
        ? <BiCheckCircle className="text-emerald-500" size={20} />
        : <BiXCircle className="text-gray-300" size={20} />
    ) : (
      <span className="text-sm font-bold text-gray-900">{value}</span>
    )}
  </div>
);


const FinanceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);

/* ── Carte métrique investissement ── */
const InvestCard = ({
  label,
  value,
  badge,
  color = "gray",
  icon,
}: {
  label: string;
  value: string;
  badge?: string;
  color?: "gray" | "emerald" | "red" | "blue" | "primary";
  icon?: React.ReactNode;
}) => {
  const bg: Record<string, string> = {
    gray: "bg-gray-50 border-gray-100",
    emerald: "bg-emerald-50 border-emerald-100",
    red: "bg-red-50 border-red-100",
    blue: "bg-blue-50 border-blue-100",
    primary: "bg-Cprimary/5 border-Cprimary/20",
  };
  const badgeColor: Record<string, string> = {
    gray: "text-gray-500",
    emerald: "text-emerald-600",
    red: "text-red-500",
    blue: "text-blue-600",
    primary: "text-Cprimary",
  };
  return (
    <div className={`${bg[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400">{label}</p>
        {icon && <span className="text-gray-300">{icon}</span>}
      </div>
      <p className="text-lg font-black text-gray-900">{value}</p>
      {badge && (
        <p className={`text-xs font-semibold mt-1 ${badgeColor[color]}`}>{badge}</p>
      )}
    </div>
  );
};


const BuildingDetail: React.FC<Props> = ({ immeuble }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "parts" | "finances">("details");
  const [kmlCoordinates, setKmlCoordinates] = useState<Record<string, { lat: number; lng: number; mapUrl: string; earthUrl: string }>>({});

  const property = immeuble;
  const productable = property?.productable;
  const buildingParts = productable?.part_of_buildings || [];
  const images = productable?.images || [];

  const parseKMLCoordinates = async (kmlUrl: string, siteId: string) => {
    try {
      const cleanUrl = kmlUrl
        .replace(import.meta.env.VITE_API_URL ?? "", "")
        .replace(import.meta.env.VITE_NGROK_URL ?? "", "");
      const response = await fetch(cleanUrl, { headers: { "ngrok-skip-browser-warning": "true" } });
      if (!response.ok) return null;
      const kmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlText, "text/xml");
      let lat: number | undefined, lng: number | undefined, zoom = 500;
      const firstPoint = xmlDoc.getElementsByTagName("Point")[0];
      if (firstPoint) {
        const coordText = firstPoint.getElementsByTagName("coordinates")[0]?.textContent?.trim();
        if (coordText) {
          const parts = coordText.split(",");
          lng = parseFloat(parts[0]);
          lat = parseFloat(parts[1]);
        }
      }
      if (!lat) {
        const firstCoords = xmlDoc.getElementsByTagName("coordinates")[0];
        if (firstCoords) {
          const points = firstCoords.textContent?.trim().split(/\s+/) || [];
          const lats: number[] = [], lngs: number[] = [];
          points.forEach((p) => {
            const parts = p.split(",");
            if (parts.length >= 2) { lngs.push(parseFloat(parts[0])); lats.push(parseFloat(parts[1])); }
          });
          if (lats.length > 0) {
            lat = lats.reduce((a, b) => a + b) / lats.length;
            lng = lngs.reduce((a, b) => a + b) / lngs.length;
            const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
            zoom = Math.max(300, span * 111000 * 2.5);
          }
        }
      }
      if (lat && lng) {
        const data = {
          lat, lng,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          earthUrl: `https://earth.google.com/web/@${lat},${lng},0a,${zoom.toFixed(0)}d,35y,0h,0t,0r`,
        };
        setKmlCoordinates((prev) => ({ ...prev, [siteId]: data }));
        return data;
      }
    } catch { /* silent */ }
    return null;
  };

  useEffect(() => {
    if (!property?.proposed_products) return;
    property.proposed_products.forEach((item: any) => {
      const kml = item.productable?.location?.kml;
      if (kml && !kmlCoordinates[item.id]) parseKMLCoordinates(kml, item.id.toString());
    });
  }, [property]);

  const getMapEmbed = (siteId: string) => {
    const c = kmlCoordinates[siteId];
    return c
      ? `https://maps.google.com/maps?q=${c.lat},${c.lng}&output=embed&z=17&t=h`
      : `https://maps.google.com/maps?q=3.8480,11.5021&output=embed&z=10`;
  };

  const nextImg = () => setSelectedImage((p) => (p + 1) % images.length);
  const prevImg = () => setSelectedImage((p) => (p - 1 + images.length) % images.length);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: productable?.title || "Immeuble", url: window.location.href });
    }
  };

  const tabs = [
    { id: "details", label: "Details", icon: HiOutlineDocumentText },
    { id: "parts", label: `Parties (${buildingParts.length})`, icon: Building2 },
    { id: "finances", label: "Couts", icon: DollarSign },
  ];

  const standingLabels: Record<string, string> = {
    low: "Standing Faible", medium: "Standing Moyen", high: "Standing Eleve",
  };

  /* helpers investissement */
  const inv = productable?.investment;
  const hasInvestment = !!inv;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
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
              <span>Immeubles</span>
              <span>/</span>
              <span className="text-gray-700 font-medium">{property?.reference}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaShareAlt className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHeart className={`w-4 h-4 ${isFavorite ? "text-red-500" : "text-gray-400"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="bg-Cprimary py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              {property?.reference}
            </span>
            {(property?.for_rent || property?.for_sale) && (
              <span className="bg-Cprimary text-white text-xs font-semibold px-3 py-1 rounded-full">
                {property.for_rent ? "A louer" : "A vendre"}
              </span>
            )}
            {buildingParts.length > 0 && (
              <span className="bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {buildingParts.length} partie{buildingParts.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
            {productable?.title ?? "Immeuble"}
          </h1>

          {productable?.location?.address && (
            <p className="flex items-center gap-2 text-sm text-white/60 mb-8">
              <HiLocationMarker className="shrink-0" />
              {productable.location.address.street && `${productable.location.address.street}, `}
              {productable.location.address.city}
              {productable.location.address.country && `, ${productable.location.address.country}`}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HeroStat icon={<Ruler className="w-5 h-5" />} value={productable?.field_area ? `${fmtNum(Number(productable.field_area))} m2` : "N/A"} label="Surface totale" />
            <HeroStat icon={<Layers className="w-5 h-5" />} value={String(productable?.levels || 0)} label="Niveaux" />
            <HeroStat icon={<FaCar className="w-5 h-5" />} value={String(productable?.parkings || 0)} label="Parkings" />
            <HeroStat icon={<MdApartment className="w-5 h-5" />} value={String(productable?.number_of_appartements || 0)} label="Appartements" />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Colonne principale ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Galerie */}
            {images.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-80 lg:h-[420px] overflow-hidden group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img src={images[selectedImage]} alt="Photo principale" className="w-full h-full object-cover" />
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
                      <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <FaChevronLeft className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
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
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglets */}
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
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-Cprimary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-8">

                {/* ── Tab Détails ── */}
                {activeTab === "details" && (
                  <div className="space-y-8">

                    {/* Description */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Presentation</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {productable?.description || property?.description || "Aucune description disponible"}
                      </p>
                    </div>

                    {/* Surfaces */}
                    {(productable?.build_area || productable?.field_area || productable?.ground_floor_area) && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Surfaces</h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {productable?.build_area && Number(productable.build_area) > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-xs text-gray-400 mb-1">Surface construite</p>
                              <p className="text-xl font-black text-gray-900">{fmtNum(Number(productable.build_area))} m2</p>
                            </div>
                          )}
                          {productable?.field_area && Number(productable.field_area) > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-xs text-gray-400 mb-1">Terrain</p>
                              <p className="text-xl font-black text-gray-900">{fmtNum(Number(productable.field_area))} m2</p>
                            </div>
                          )}
                          {productable?.ground_floor_area && Number(productable.ground_floor_area) > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-xs text-gray-400 mb-1">Emprise au sol</p>
                              <p className="text-xl font-black text-gray-900">{fmtNum(Number(productable.ground_floor_area))} m2</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Programme global */}
                    {productable?.overall_program?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Programme global</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {productable.overall_program.map((item: any, i: number) => (
                            <div key={i} className="bg-Cprimary/5 border border-Cprimary/10 rounded-xl p-4">
                              <p className="text-xs text-gray-500 mb-1">{item.type_name}</p>
                              <p className="text-2xl font-black text-gray-900">{item.count}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ══════════════════════════════════════════
                        SECTION INVESTISSEMENT — COMPLÈTE
                    ══════════════════════════════════════════ */}
                    {hasInvestment && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                          Investissement
                        </h3>

                        {/* Coût principal */}
                        <div className="bg-Cprimary/5 border border-Cprimary/20 rounded-2xl p-5 mb-5 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Coût d'investissement total</p>
                            <p className="text-2xl font-black text-Cprimary">
                              {fmt(inv.investment_cost || 0)}
                            </p>
                          </div>
                          <DollarSign className="w-9 h-9 text-Cprimary/25" />
                        </div>

                        {/* Revenus */}
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Revenus
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <InvestCard
                            color="emerald"
                            label="Revenus annuels"
                            value={inv.total_income?.mount_income > 0 ? fmt(inv.total_income.mount_income) : "—"}
                            badge={inv.total_income?.percent > 0 ? `${inv.total_income.percent}% du capital` : undefined}
                            icon={<TrendingUp className="w-4 h-4" />}
                          />
                          <InvestCard
                            color="emerald"
                            label="Croissance valeur marché"
                            value={inv.growth_in_market_value > 0 ? fmt(inv.growth_in_market_value) : "—"}
                            icon={<TrendingUp className="w-4 h-4" />}
                          />
                        </div>

                        {/* Charges & Marges */}
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Charges & Marges
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <InvestCard
                            color="red"
                            label="Charges annuelles"
                            value={inv.annual_expense > 0 ? fmt(inv.annual_expense) : "—"}
                            icon={<TrendingDown className="w-4 h-4" />}
                          />
                          <InvestCard
                            color="blue"
                            label="Marge nette d'exploitation"
                            value={
                              inv.annual_net_operating_margin?.mount_margin > 0
                                ? fmt(inv.annual_net_operating_margin.mount_margin)
                                : "—"
                            }
                            badge={
                              inv.annual_net_operating_margin?.percent_margin > 0
                                ? `${inv.annual_net_operating_margin.percent_margin}% de marge`
                                : undefined
                            }
                            icon={<BarChart2 className="w-4 h-4" />}
                          />
                        </div>

                        {/* Performance */}
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Performance
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <InvestCard
                            color="gray"
                            label="Croissance annuelle"
                            value={
                              inv.annual_investment_growth > 0
                                ? `${inv.annual_investment_growth}%`
                                : "—"
                            }
                          />
                          <InvestCard
                            color="gray"
                            label="Période de retour"
                            value={inv.return_on_investment_period || "—"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab Parties ── */}
                {activeTab === "parts" && buildingParts.length > 0 && (
                  <div className="space-y-5">
                    {buildingParts.map((part: any, i: number) => (
                      <div key={part.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
                          <div className="w-8 h-8 bg-Cprimary rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{part.title || `Partie ${i + 1}`}</h4>
                            {part.description && <p className="text-xs text-gray-400 mt-0.5">{part.description}</p>}
                          </div>
                        </div>
                        {part.photos && part.photos.length > 0 && (
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {part.photos.map((photo: string, pi: number) => (
                              <div
                                key={pi}
                                className="aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                                onClick={() => window.open(photo, "_blank")}
                              >
                                <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab Finances (coûts construction) ── */}
                {activeTab === "finances" && productable?.building_finances?.length > 0 && (
                  <div className="space-y-5">
                    {productable.building_finances
                      .sort((a: any, b: any) => ({ low: 1, medium: 2, high: 3 }[a.type_of_standing as string] - { low: 1, medium: 2, high: 3 }[b.type_of_standing as string]))
                      .map((finance: any) => (
                        <div key={finance.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900">{standingLabels[finance.type_of_standing] || finance.type_of_standing}</h4>
                          </div>
                          <div className="px-5 py-2">
                            {finance.project_study && <FinanceRow label="Etude de projet" value={fmtCompact(Number(finance.project_study))} />}
                            {finance.building_permit && <FinanceRow label="Permis de construire" value={fmtCompact(Number(finance.building_permit))} />}
                            {finance.structural_work && <FinanceRow label="Gros oeuvre" value={fmtCompact(Number(finance.structural_work))} />}
                            {finance.finishing && <FinanceRow label="Finitions" value={fmtCompact(Number(finance.finishing))} />}
                            {finance.total_building_finance && (
                              <div className="flex items-center justify-between py-4 mt-2 border-t border-gray-100">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-lg font-black text-Cprimary">{fmtCompact(Number(finance.total_building_finance))}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cartes map */}
            {Array.isArray(property?.proposed_products) && property.proposed_products.map((item: any) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-72">
                  <iframe
                    src={getMapEmbed(item.id.toString())}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`Carte ${item.productable?.land_title || "Terrain"}`}
                    className="w-full h-full"
                  />
                  {kmlCoordinates[item.id] && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      {React.createElement("a", {
                        href: kmlCoordinates[item.id].mapUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors",
                      }, "Google Maps")}
                      {React.createElement("a", {
                        href: kmlCoordinates[item.id].earthUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors",
                      }, "Earth 3D")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

              {/* Prix */}
              <div className="bg-Csecondary1 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
                  {property?.for_rent ? "Prix de location" : "Prix total"}
                </p>
                <p className="text-3xl font-black text-white mb-1">
                  {fmt(Number(property?.total_price ?? 0))}
                </p>
                {productable?.estimated_payment && Number(productable.estimated_payment) > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-0.5">Mensualite estimee</p>
                    <p className="text-lg font-bold text-white">{fmt(Number(productable.estimated_payment))}</p>
                  </div>
                )}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => {
                      const msg = `Bonjour! Je souhaite commander l'immeuble ${property?.reference} - ${productable?.title}`;
                      window.open(`https://wa.me/237686741680?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-Csecondary1 text-sm font-bold py-3 rounded-xl transition-all border border-white/20"
                  >
                    <HiOutlineDocumentText className="w-4 h-4" />
                    Commander
                  </button>
                </div>
              </div>

              {/* Équipements */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Equipements</h4>
                <EquipRow icon={<FaSwimmingPool className="w-3.5 h-3.5 text-blue-400" />} label="Piscine" value={!!productable?.has_pool} />
                <EquipRow icon={<FaTree className="w-3.5 h-3.5 text-emerald-500" />} label="Jardin" value={!!productable?.has_garden} />
                <EquipRow icon={<FaBuilding className="w-3.5 h-3.5 text-Cprimary" />} label="Niveaux" value={productable?.levels || 0} />
              </div>

              {/* Contact */}
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

      {/* ── Lightbox ── */}
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
              <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors">
                <FaChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full">
                {selectedImage + 1} / {images.length}
              </span>
              <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors">
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildingDetail;