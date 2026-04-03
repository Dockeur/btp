import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaWhatsapp, FaBed, FaBath, FaCar,
  FaSwimmingPool, FaTree, FaBuilding, FaChartArea,
  FaShareAlt, FaHeart, FaPhone, FaEnvelope,
  FaChevronLeft, FaChevronRight, FaDownload, FaMapPin,
} from "react-icons/fa";
import { MdHome, MdTerrain } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { FiArrowLeft, FiMaximize2, FiX, FiArrowRight, FiLoader } from "react-icons/fi";
import { Layers, DollarSign, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import Loader from "../../loader/Loader";
import { getProducts } from "@/services/ProductService";
import { ProductType } from "@/types";
import axios from "src/auth/axios";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);
const fmtCompact = (n: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0, notation: "compact" }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("fr").format(n);

const typeLabels: Record<string, string> = {
  villa: "Villa", apartment: "Appartement", duplex: "Duplex", studio: "Studio", house: "Maison",
};
const reliefLabels: Record<string, string> = {
  plate: "Plat", mountainous: "Montagneux", hilly: "Vallonné",
};
const standingLabels: Record<string, string> = {
  low: "Faible", medium: "Moyen", high: "Élevé",
};

const STANDING_OPTIONS = [
  { value: "low",    label: "Faible", dot: "bg-gray-400"  },
  { value: "medium", label: "Moyen",  dot: "bg-blue-500"  },
  { value: "high",   label: "Élevé",  dot: "bg-amber-500" },
];

const FINANCE_ROWS: { key: string; label: string }[] = [
  { key: "project_study",          label: "Étude de projet"      },
  { key: "building_permit",        label: "Permis de construire"  },
  { key: "structural_work",        label: "Gros œuvre"           },
  { key: "finishing",              label: "Finitions"             },
  { key: "equipments",             label: "Équipements"           },
  { key: "cost_of_land",           label: "Coût du terrain"       },
  { key: "total_building_finance", label: "Total"                 },
];

interface PaymentPlan {
  total_cost: number;
  duration_months: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  semester: number;
  annual: number;
}

interface Paymentinvest {
  investment_cost: number;
  growth_in_market_value: number;
  total_income: {
    mount_income: number;
    percent: number;
  };
  annual_expense: number;
  annual_net_operating_margin: {
    mount_margin: number;
    percent_margin: number;
  };
  annual_investment_growth: number;
  return_on_investment_period: number | null;
}

const HeroStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
    <div className="text-Cprimary">{icon}</div>
    <p className="text-xl font-black text-gray-900 leading-tight">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const EquipRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: boolean | number }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <span className="flex items-center gap-2 text-sm text-gray-600">{icon} {label}</span>
    {typeof value === "boolean"
      ? value ? <BiCheckCircle className="text-emerald-500" size={18} /> : <BiXCircle className="text-gray-300" size={18} />
      : <span className="text-sm font-bold text-gray-900">{value}</span>}
  </div>
);

const InvestCard = ({
  label, value, badge, color = "gray", icon,
}: {
  label: string; value: string; badge?: string;
  color?: "gray" | "emerald" | "red" | "blue";
  icon?: React.ReactNode;
}) => {
  const bg: Record<string, string> = {
    gray: "bg-gray-50 border-gray-100", emerald: "bg-emerald-50 border-emerald-100",
    red: "bg-red-50 border-red-100", blue: "bg-blue-50 border-blue-100",
  };
  const badgeColor: Record<string, string> = {
    gray: "text-gray-500", emerald: "text-emerald-600", red: "text-red-500", blue: "text-blue-600",
  };
  return (
    <div className={`${bg[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400">{label}</p>
        {icon && <span className="text-gray-300">{icon}</span>}
      </div>
      <p className="text-lg font-black text-gray-900">{value}</p>
      {badge && <p className={`text-xs font-semibold mt-1 ${badgeColor[color]}`}>{badge}</p>}
    </div>
  );
};

const LandDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [property, setProperty]             = useState<ProductType | null>(null);
  const [loading, setLoading]               = useState(true);
  const [selectedImage, setSelectedImage]   = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite]         = useState(false);
  const [kmlCoordinates, setKmlCoordinates] = useState<Record<string, { lat: number; lng: number; mapUrl: string; earthUrl: string }>>({});

  const [selectedStanding, setSelectedStanding] = useState<string>("medium");
  const [durationInput, setDurationInput]       = useState<string>("24");
  const [paymentPlan, setPaymentPlan]           = useState<PaymentPlan | null>(null);
  const [paymentinvest, setPaymentinvest]           = useState<Paymentinvest | null>(null);
  const [loadingPlan, setLoadingPlan]           = useState(false);
  const [planError, setPlanError]               = useState<string | null>(null);

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
          pts.forEach((p) => {
            const parts = p.split(",");
            if (parts.length >= 2) { lngs.push(parseFloat(parts[0])); lats.push(parseFloat(parts[1])); }
          });
          if (lats.length) {
            lat = lats.reduce((a, b) => a + b) / lats.length;
            lng = lngs.reduce((a, b) => a + b) / lngs.length;
            zoom = Math.max(300, Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs)) * 111000 * 2.5);
          }
        }
      }
      if (lat && lng) {
        const d = {
          lat, lng,
          mapUrl:   `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          earthUrl: `https://earth.google.com/web/@${lat},${lng},0a,${zoom.toFixed(0)}d,35y,0h,0t,0r`,
        };
        setKmlCoordinates((prev) => ({ ...prev, [siteId]: d }));
        return d;
      }
    } catch {}
    return null;
  };

  const getMapEmbedUrl = (siteId: string) => {
    const c = kmlCoordinates[siteId];
    return c
      ? `https://maps.google.com/maps?q=${c.lat},${c.lng}&output=embed&z=17&t=h`
      : `https://maps.google.com/maps?q=3.8480,11.5021&output=embed&z=10`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response: any = await getProducts();
        const found = response.data.find(
          (item: ProductType) => item.id === Number(id) && item.productable_type === "App\\Models\\Property"
        );
        setProperty(found ?? null);
        found?.proposed_products?.forEach((item: any) => {
          const kml = item.productable?.location?.kml ?? item.productable?.kml_file?.url;
          if (kml) parseKMLCoordinates(kml, item.id.toString());
        });
        found?.productable?.proposed_sites?.forEach((site: any) => {
          const kml = site.productable?.location?.kml;
          if (kml) parseKMLCoordinates(kml, site.id.toString());
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProperty();
  }, [id]);

  const fetchPaymentPlan = async () => {
    const duration = parseInt(durationInput);
    if (!property?.id || isNaN(duration) || duration < 1) return;
    setLoadingPlan(true);
    setPlanError(null);
    setPaymentPlan(null);
    setPaymentinvest(null);
    try {
      const { data } = await axios.post(
        "/products/payment-plan",
        { product_id: property.id, purchase_duration: duration, standing: selectedStanding },
        { headers: { requiresAuth: true } }
      );
      setPaymentPlan(data.payment_plan ?? null);
      setPaymentinvest(data.investment ?? null);
    } catch (err: any) {
      setPlanError(err?.response?.data?.message || "Impossible de calculer le plan de paiement.");
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchPaymentPlan, 500);
    return () => clearTimeout(t);
  }, [selectedStanding, durationInput, property?.id]);

  if (loading) return <Loader />;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdHome className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-4">Propriété introuvable</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-Cprimary text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            <FiArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>
    );
  }

  const productable      = property?.productable;
  const images           = productable?.images || [];
  const inv              = productable?.investment;
  const hasInvestment    = !!inv;
  const buildingFinances: any[] = productable?.building_finances || [];
  const buildingParts: any[]   = productable?.part_of_buildings  || [];
  const proposedProducts: any[] = property?.proposed_products   || [];
  const proposedSites: any[]   = productable?.proposed_sites    || [];
  const allSites               = [...proposedProducts, ...proposedSites];

  const financeByStanding: Record<string, any> = {};
  buildingFinances.forEach((f: any) => { financeByStanding[f.type_of_standing] = f; });

  const nextImage = () => setSelectedImage((p) => (p + 1) % images.length);
  const prevImage = () => setSelectedImage((p) => (p - 1 + images.length) % images.length);
  const handleShare = () => { if (navigator.share) navigator.share({ title: productable?.title || "Propriété", url: window.location.href }); };

  const paymentRows = paymentPlan
    ? [
        { label: "Hebdomadaire", value: paymentPlan.weekly    },
        { label: "Mensuel",      value: paymentPlan.monthly   },
        { label: "Trimestriel",  value: paymentPlan.quarterly },
        { label: "Semestriel",   value: paymentPlan.semester  },
        { label: "Annuel",       value: paymentPlan.annual    },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-Cprimary transition-colors">
              <FiArrowLeft className="w-4 h-4" />Retour
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Propriétés</span><span>/</span>
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

      {/* 1. CARACTERISTIQUES GLOBALES */}
      <div className="bg-Cprimary py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{property.reference}</span>
            {productable?.type && (
              <span className="bg-white text-Csecondary1 text-xs font-bold px-3 py-1 rounded-full">
                {typeLabels[productable.type] || productable.type}
              </span>
            )}
            {property.for_rent && <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">À louer</span>}
            {property.for_sale && <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">À vendre</span>}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
            {productable?.title ?? "Propriété disponible"}
          </h1>

          {productable?.location?.address && (
            <p className="flex items-center gap-2 text-sm text-white/60 mb-8">
              <HiLocationMarker className="shrink-0" />
              {[productable.location.address.street, productable.location.address.city, productable.location.address.country].filter(Boolean).join(", ")}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <HeroStat icon={<FaBed className="w-5 h-5" />}      value={String(productable?.bedrooms || 0)}         label="Chambres"       />
            <HeroStat icon={<FaBath className="w-5 h-5" />}     value={String(productable?.bathrooms || 0)}        label="Salles de bain" />
            <HeroStat icon={<FaBuilding className="w-5 h-5" />} value={String(productable?.number_of_salons || 0)} label="Salons"         />
            <HeroStat icon={<FaCar className="w-5 h-5" />}      value={String(productable?.parkings || 0)}         label="Parkings"       />
            <HeroStat icon={<Layers className="w-5 h-5" />}     value={String(productable?.levels || 0)}           label="Niveaux"        />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* 2. IMAGES */}
            {images.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-80 lg:h-[420px] group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img src={images[selectedImage]} alt={`Photo ${selectedImage + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                    <FiMaximize2 className="w-4 h-4" />
                  </button>
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <FaChevronLeft className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <FaChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <button key={i} onClick={() => setSelectedImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SITES PROPOSES — proposed_products (Land) + proposed_sites */}
            {allSites.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Sites proposés</h2>
                {allSites.map((site: any, index: number) => {
                  const sp      = site.productable;
                  const kmlUrl  = sp?.location?.kml ?? sp?.kml_file?.url;
                  const coords  = kmlCoordinates[site.id];
                  return (
                    <div key={site.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-Cprimary rounded-xl flex items-center justify-center shrink-0">
                            <FaMapPin className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900">{sp?.land_title || `Site ${index + 1}`}</h4>
                            {sp?.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{sp.description}</p>}
                          </div>
                        </div>
                        {(sp?.area || sp?.relief) && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {sp?.area && (
                              <span className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                                <FaChartArea className="w-3 h-3 text-emerald-500" />
                                {fmtNum(Number(sp.area))} m²
                              </span>
                            )}
                            {sp?.relief && (
                              <span className="bg-white border border-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                                {reliefLabels[sp.relief] || sp.relief}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {kmlUrl && (
                        <div className="relative h-64">
                          <iframe
                            src={getMapEmbedUrl(site.id.toString())}
                            width="100%" height="100%"
                            style={{ border: 0 }} allowFullScreen loading="lazy"
                            className="w-full h-full"
                            title={`Carte ${sp?.land_title || "Site"}`}
                          />
                          {coords && (
                            <div className="absolute top-3 right-3 flex gap-1.5">
                              <a href={kmlUrl} download
                                className="w-8 h-8 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 transition-colors"
                                title="Télécharger KML">
                                <FaDownload className="w-3 h-3 text-gray-600" />
                              </a>
                              <a href={coords.mapUrl} target="_blank" rel="noopener noreferrer"
                                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors">
                                Maps
                              </a>
                              <a href={coords.earthUrl} target="_blank" rel="noopener noreferrer"
                                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-colors">
                                Earth 3D
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {sp?.location?.address && (
                        <div className="px-5 py-4 flex items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            {[sp.location.address.street, sp.location.address.city, sp.location.address.country].filter(Boolean).map((v: string, i: number) => (
                              <span key={i}>{v}</span>
                            ))}
                          </div>
                          {site.productable_type === "App\\Models\\Land" && (
                            <Link to={`/lands/${site.id}`}
                              className="shrink-0 flex items-center gap-1.5 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                              Détail <FiArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. DESCRIPTION / PRESENTATION */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {productable?.description ?? "Aucune description disponible"}
                </p>
              </div>

              {(productable?.build_area || productable?.field_area || productable?.ground_floor_area || productable?.basement_area) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Surfaces</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "Surface construite",    value: productable?.build_area          },
                      { label: "Superficie du terrain", value: productable?.field_area           },
                      { label: "Rez-de-chaussée",       value: productable?.ground_floor_area    },
                      { label: "Sous-sol",              value: productable?.basement_area        },
                    ].filter((s) => s.value).map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                        <p className="text-xl font-black text-gray-900">{fmtNum(Number(s.value))} m²</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {buildingParts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Parties du bâtiment ({buildingParts.length})
                  </h3>
                  <div className="space-y-4">
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
                        {part.photos?.length > 0 && (
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {part.photos.map((photo: string, pi: number) => (
                              <div key={pi} className="aspect-video rounded-xl overflow-hidden border border-gray-100 cursor-pointer group" onClick={() => window.open(photo, "_blank")}>
                                <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {productable?.location?.address && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Localisation</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: "Pays",     value: productable.location.address?.country },
                      { label: "Ville",    value: productable.location.address?.city    },
                      { label: "Quartier", value: productable.location.address?.street  },
                    ].filter((l) => l.value).map((l) => (
                      <div key={l.label} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">{l.label}</p>
                        <p className="text-sm font-bold text-gray-900">{l.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. INVESTISSEMENT — tableau coûts de construction par standing */}
            {buildingFinances.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Investissement</h3>
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 w-48">Poste</th>
                        {STANDING_OPTIONS.map((s) =>
                          financeByStanding[s.value] ? (
                            <th key={s.value} className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label} standing
                              </div>
                            </th>
                          ) : null
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {FINANCE_ROWS.map((row, i) => {
                        const isTotal = row.key === "total_building_finance";
                        const hasAny  = STANDING_OPTIONS.some((s) => financeByStanding[s.value] && Number(financeByStanding[s.value][row.key]) > 0);
                        if (!hasAny) return null;
                        return (
                          <tr key={row.key} className={`border-b border-gray-50 last:border-0 ${isTotal ? "bg-Cprimary/5" : i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                            <td className={`px-5 py-3.5 text-sm ${isTotal ? "font-bold text-gray-900" : "text-gray-600"}`}>{row.label}</td>
                            {STANDING_OPTIONS.map((s) => {
                              const finance = financeByStanding[s.value];
                              if (!finance) return null;
                              const val = Number(finance[row.key]);
                              return (
                                <td key={s.value} className={`px-5 py-3.5 text-center text-sm ${isTotal ? "font-black text-Cprimary text-base" : "font-semibold text-gray-800"}`}>
                                  {val > 0 ? fmtCompact(val) : "—"}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. CHOIX DU STANDING */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Choix du standing</h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {STANDING_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setSelectedStanding(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center
                      ${selectedStanding === opt.value ? "border-Cprimary bg-Cprimary/5 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <span className={`w-3 h-3 rounded-full ${opt.dot}`} />
                    <p className={`text-xs font-bold ${selectedStanding === opt.value ? "text-Cprimary" : "text-gray-600"}`}>{opt.label}</p>
                    {selectedStanding === opt.value && <span className="text-[10px] font-bold text-Cprimary">✓ Sélectionné</span>}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Durée d'acquisition (mois)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number" min={1} value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    placeholder="Ex : 24"
                    className="w-36 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-Cprimary transition-colors"
                  />
                  <span className="text-sm text-gray-400">mois</span>
                  {durationInput && Number(durationInput) > 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                      ≈ {(Number(durationInput) / 12).toFixed(1)} ans
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Entrez n'importe quelle durée</p>
              </div>
            </div>

            {/* 7. TABLEAU DU RYTHME DE PAIEMENT */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Plan de paiement</h3>
                {loadingPlan && <FiLoader className="animate-spin text-Cprimary w-4 h-4" />}
              </div>

              {planError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{planError}</div>
              )}

              {paymentPlan && !loadingPlan && (
                <>
                  <div className="bg-Cprimary/5 border border-Cprimary/20 rounded-2xl p-4 mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Coût total — {paymentPlan.duration_months} mois · Standing {standingLabels[selectedStanding]}
                      </p>
                      <p className="text-2xl font-black text-Cprimary">{fmt(paymentPlan.total_cost)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-Cprimary/25" />
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Fréquence</th>
                          <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentRows.map((row, i) => (
                          <tr key={row.label} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                            <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.label}</td>
                            <td className="px-5 py-3.5 text-sm font-black text-gray-900 text-right">{fmt(row.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {!paymentPlan && !loadingPlan && !planError && (
                <div className="flex flex-col items-center py-10 gap-2 text-center">
                  <DollarSign className="w-10 h-10 text-gray-200" />
                  <p className="text-sm text-gray-400">Sélectionnez un standing et une durée pour voir le plan de paiement</p>
                </div>
              )}

              {loadingPlan && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-Cprimary/20 border-t-Cprimary rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Calcul en cours…</p>
                </div>
              )}
            </div>

            {/* 8. PLAN DE FINANCE (investment) */}
            {hasInvestment && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Analyse finanaciere</h3>

                <div className="bg-Cprimary/5 border border-Cprimary/20 rounded-2xl p-5 mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Coût d'investissement total</p>
                    <p className="text-2xl font-black text-Cprimary">{fmt(paymentinvest?.investment_cost || 0)}</p>
                  </div>
                  <DollarSign className="w-9 h-9 text-Cprimary/25" />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Revenus</p>
                <div className="grid grid-cols-2 gap-3 mb-5">

                    <InvestCard color="emerald" label="Taux de croissance de la valeur vénale"
                    value={paymentinvest?.growth_in_market_value > 0 ? `${paymentinvest?.growth_in_market_value}%` : "—"}
                    icon={<TrendingUp className="w-4 h-4" />}
                  />
                  <InvestCard color="emerald" label="Revenus annuels"
                    value={paymentinvest?.total_income?.mount_income > 0 ? fmt(paymentinvest?.total_income.mount_income) : "—"}
                    badge={paymentinvest?.total_income?.percent > 0 ? `${paymentinvest?.total_income.percent}% du capital` : undefined}
                    icon={<TrendingUp className="w-4 h-4" />}
                  />
                 
                
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Charges & Marges</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <InvestCard color="red" label="Charges annuelles"
                    value={paymentinvest?.annual_expense > 0 ? fmt(paymentinvest?.annual_expense) : "—"}
                    icon={<TrendingDown className="w-4 h-4" />}
                  />
                  <InvestCard color="blue" label="Marge nette d'exploitation"
                    value={paymentinvest?.annual_net_operating_margin?.mount_margin > 0 ? fmt(paymentinvest?.annual_net_operating_margin.mount_margin) : "—"}
                    badge={paymentinvest?.annual_net_operating_margin?.percent_margin > 0 ? `${paymentinvest?.annual_net_operating_margin.percent_margin}% de marge` : undefined}
                    icon={<BarChart2 className="w-4 h-4" />}
                  />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Performance</p>
                <div className="grid grid-cols-2 gap-3">
                  <InvestCard color="gray" label="Croissance annuelle"
                    value={paymentinvest?.annual_investment_growth > 0 ? `${paymentinvest?.annual_investment_growth}%` : "—"}
                  />
                  <InvestCard color="gray" label="Période de retour" value={paymentinvest?.return_on_investment_period || "—"} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

              <div className="bg-Csecondary1 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Prix total</p>
                <p className="text-3xl font-black text-white mb-1">{fmt(Number(property.total_price ?? 0))}</p>
                {productable?.estimated_payment && Number(productable.estimated_payment) > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-0.5">Mensualité estimée</p>
                    <p className="text-lg font-bold text-white">{fmt(Number(productable.estimated_payment))}</p>
                  </div>
                )}
                <div className="mt-5">
                  <a
                    href={`https://wa.me/237686741680?text=${encodeURIComponent(`Bonjour! Je suis intéressé par la propriété ${property.reference}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white text-Csecondary1 text-sm font-bold py-3 rounded-xl transition-all hover:bg-gray-50"
                  >
                    <FaWhatsapp className="w-4 h-4" /> Demander une visite
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Équipements</h4>
                <EquipRow icon={<FaSwimmingPool className="w-3.5 h-3.5 text-blue-400" />}  label="Piscine"  value={!!productable?.has_pool}   />
                <EquipRow icon={<FaTree className="w-3.5 h-3.5 text-emerald-500" />}        label="Jardin"   value={!!productable?.has_garden} />
                <EquipRow icon={<FaBuilding className="w-3.5 h-3.5 text-Cprimary" />}       label="Niveaux"  value={productable?.levels || 0}  />
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Besoin d'aide ?</h4>
                <div className="space-y-3">
                  <a href="tel:237686741680" className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors">
                    <div className="w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center">
                      <FaPhone className="w-3 h-3 text-Cprimary" />
                    </div>
                    +237 686 741 680
                  </a>
                  <a href="mailto:contact@example.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors">
                    <div className="w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="w-3 h-3 text-Cprimary" />
                    </div>
                    contact@example.com
                  </a>
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
          <img src={images[selectedImage]} alt="Plein écran" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
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