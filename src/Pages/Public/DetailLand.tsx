import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaWhatsapp, FaMap, FaGlobe, FaShareAlt, FaHeart,
    FaPhone, FaEnvelope, FaCertificate, FaMountain,
    FaCheck, FaTimes, FaChevronLeft, FaChevronRight,
    FaBuilding,
} from "react-icons/fa";
import { HiOutlineDocumentText, HiLocationMarker } from "react-icons/hi";
import { MdVerified, MdLandscape } from "react-icons/md";
import { FiArrowLeft, FiMaximize2, FiX, FiTrendingUp, FiCalendar, FiDollarSign } from "react-icons/fi";
import { Maximize2 } from "lucide-react";
import Loader from "../../loader/Loader";
import { getProducts } from "@/services/ProductService";
import { landInvestmentAnalysis, getPaymentPlan } from "@/services/LandService";
import TourBooking from "@/components/TourBooking";

const reliefLabels: Record<string, string> = {
    plate: "Plat",
    mountainous: "Montagneux",
    hilly: "Vallonné",
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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{children}</h3>
);

const getProductPath = (product: any): string => {
    const type = product?.productable?.type ?? "";
    if (type === "Immeuble") return `/immeubles/${product.id}`;
    return `/lands/${product.id}`;
};

const ProposedProductCard = ({ product }: { product: any }) => {
    const navigate = useNavigate();
    const isProperty = product.productable_type === "App\\Models\\Property";
    const title = isProperty ? product.productable?.title : product.productable?.land_title;
    const images = product.productable?.images || [];
    const location = product.productable?.location?.address;
    const path = getProductPath(product);

    return (
        <div
            onClick={() => navigate(path)}
            className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
            <div className="relative h-44 overflow-hidden bg-gray-100">
                {images.length > 0 ? (
                    <img
                        src={images[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FaBuilding className="w-10 h-10 text-gray-300" />
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className="bg-Cprimary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {isProperty ? (product.productable?.type ?? "Propriété") : "Terrain"}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.for_sale ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}>
                        {product.for_sale ? "À vendre" : "À louer"}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <p className="text-sm font-bold text-gray-900 mb-1 truncate">{title}</p>
                {location && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <HiLocationMarker className="shrink-0" />
                        {location.city}, {location.country}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Prix total</p>
                        <p className="text-sm font-black text-Cprimary">{fmtCompact(Number(product.total_price))}</p>
                    </div>
                    <span className="text-xs text-Cprimary font-semibold group-hover:underline">Voir détails →</span>
                </div>
            </div>
        </div>
    );
};

const LandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [land, setLand] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number; mapUrl: string; earthUrl: string } | null>(null);
    const [areas, setAreas] = useState<number>();
  
    const [investmentResult, setInvestmentResult] = useState<any>(null);
    const [investmentLoading, setInvestmentLoading] = useState(false);

    const [paymentForm, setPaymentForm] = useState({
        purchase_duration: 24,
        standing: "medium" as "high" | "medium" | "low",
    });
    const [paymentResult, setPaymentResult] = useState<any>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

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
                setAreas( Number(found?.productable?.area));
                console.log("surface", Number(found?.productable?.area));
                
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

  const [investmentForm, setInvestmentForm] = useState({
        growth_in_market_value: 5,
        number_conservation_years: 10,
    });
    const handleInvestmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        setInvestmentLoading(true);
        try {
            const res = await landInvestmentAnalysis(land.id, {
                area: Number(investmentForm.area)?  Number(investmentForm.area): Number(land?.productable?.area),
                growth_in_market_value: investmentForm.growth_in_market_value,
                number_conservation_years: investmentForm.number_conservation_years,
            });
            setInvestmentResult(res.data);
        } catch (err) { console.error(err); }
        finally { setInvestmentLoading(false); }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentLoading(true);
        try {
            const res = await getPaymentPlan({
                product_id: land.id,
                purchase_duration: paymentForm.purchase_duration,
                standing: paymentForm.standing,
            });
            setPaymentResult(res);
        } catch (err) { console.error(err); }
        finally { setPaymentLoading(false); }
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
    const proposedProducts: any[] = land.proposed_products || [];

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

            {/* ─── 1. CARACTÉRISTIQUES ─── */}
            <div className="bg-Cprimary py-10 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                            {land.reference}
                        </span>
                        {land.productable.certificat_of_ownership && (
                            <span className="bg-white text-orange text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <MdVerified className="w-3 h-3" />
                                Titre foncier vérifié
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
                        <HeroStat icon={<Maximize2 className="w-5 h-5" />}     value={`${fmtNum(Number(land.productable.area))} m²`}                                      label="Superficie totale" />
                        <HeroStat icon={<FaMountain className="w-5 h-5" />}    value={reliefLabels[land.productable.relief] ?? land.productable.relief}                    label="Type de relief" />
                        <HeroStat icon={<FaCertificate className="w-5 h-5" />} value={land.productable.certificat_of_ownership ? "Disponible" : "Non disponible"}         label="Titre foncier" />
                        <HeroStat icon={<MdLandscape className="w-5 h-5" />}   value={fmtCompact(Number(land.unit_price))}                                                 label="Prix au m²" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10 px-4">
                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">

                        {/* ─── 2. IMAGES ─── */}
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
                                                className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-Cprimary" : "border-transparent opacity-50 hover:opacity-100"}`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── 3. LOCALISATION ─── */}
                        {coords && (
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-6">
                                <SectionTitle>Localisation</SectionTitle>
                                <div className="space-y-4">
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
                                        <a
                                            href={coords.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                                        >
                                            <FaMap className="w-4 h-4" />
                                            Google Maps
                                        </a>
                                        <a
                                            href={coords.earthUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                                        >
                                            <FaGlobe className="w-4 h-4" />
                                            Google Earth
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                     
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <SectionTitle>À propos</SectionTitle>
                            <p className="text-sm text-gray-700 leading-relaxed mb-5">
                                {land.productable.description || land.description}
                            </p>
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
                                    {
                                        label: "Document technique",
                                        value: land.productable.technical_doc ? "Disponible" : "Non disponible",
                                        ok: land.productable.technical_doc,
                                    },
                                    {
                                        label: "Fragmentable",
                                        value: land.productable.is_fragmentable ? "Oui" : "Non",
                                        ok: land.productable.is_fragmentable,
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

                            {land.productable.video_lands?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <SectionTitle>Visite virtuelle</SectionTitle>
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
                        </div>

                        {/* ─── 5. PROPOSITIONS DE BÂTIMENTS ─── */}
                        {proposedProducts.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <SectionTitle>Constructions proposées sur ce terrain</SectionTitle>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {proposedProducts.map((product: any) => (
                                        <ProposedProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ─── 6. ANALYSE DE L'INVESTISSEMENT ─── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
                            <SectionTitle>Analyse de l'investissement</SectionTitle>

                            <form onSubmit={handleInvestmentSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                                           Surface
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={investmentForm.area}
                                            defaultValue={Number(land?.productable?.area)}
                                            onChange={e => setInvestmentForm(f => ({ ...f, area: Number(e.target.value) }))}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 dark:bg-neutral-800 dark:border-slate-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                                            Croissance annuelle estimée (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={investmentForm.growth_in_market_value}
                                            onChange={e => setInvestmentForm(f => ({ ...f, growth_in_market_value: Number(e.target.value) }))}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 dark:bg-neutral-800 dark:border-slate-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                                            Durée de conservation (années)
                                        </label>
                                        <input
                                            type="number"
                                            value={investmentForm.number_conservation_years}
                                            onChange={e => setInvestmentForm(f => ({ ...f, number_conservation_years: Number(e.target.value) }))}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 dark:bg-neutral-800 dark:border-slate-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={investmentLoading}
                                    className="flex items-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <FiTrendingUp className="w-4 h-4" />
                                    {investmentLoading ? "Calcul en cours..." : "Analyser l'investissement"}
                                </button>
                            </form>

                            {investmentResult && (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                    {[
                                        { label: "Prix d'achat", value: fmt(investmentResult.purchase_price), color: "blue" },
                                        { label: "Valeur vénale", value: `${investmentResult.growth_in_market_value}%`, color: "emerald" },
                                        { label: "Durée de conservation", value: `${investmentResult.number_conservation_years} ans`, color: "orange" },
                                        { label: "Plus-value par an", value: fmt(investmentResult.price_based_number_of_years), color: "purple" },
                                        { label: "Valeur à maturité", value: fmt(investmentResult.maturity_amount), color: "yellow" },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-xl border border-${item.color}-100 dark:border-${item.color}-800`}>
                                            <p className={`text-xs font-medium text-${item.color}-700 dark:text-${item.color}-300 mb-1`}>{item.label}</p>
                                            <p className={`text-lg font-black text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                          
                        </div>

                        {/* ─── 7. PLANIFICATION DES VISITES ─── */}
                        <TourBooking productId={land.id} />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-4">
                            <div className="bg-Csecondary1 rounded-2xl p-6 shadow-sm">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Prix total</p>
                                <p className="text-3xl font-black text-white mb-1">{fmt(Number(land.total_price))}</p>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <p className="text-xs text-white/40 mb-0.5">Prix au mètre carré</p>
                                    <p className="text-lg font-bold text-white">{fmt(Number(land.unit_price))}/m²</p>
                                </div>
                                <div className="mt-5 space-y-2">
                                    <a
                                        href={`https://wa.me/237680312741?text=${encodeURIComponent(`Bonjour, je suis intéressé par le terrain ${land.reference}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-white text-black/40 text-sm font-bold py-3 rounded-xl transition-all"
                                    >
                                        <FaWhatsapp className="w-4 h-4" />
                                        Contacter sur WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Besoin d'aide ?</h4>
                                <div className="space-y-3">
                                    <a href="tel:237680312741" className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors">
                                        <div className="w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center">
                                            <FaPhone className="w-3 h-3 text-Cprimary" />
                                        </div>
                                        +237 680 312 741
                                    </a>
                                    <a href="mailto:contact@example.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors">
                                        <div className="w-7 h-7 bg-Cprimary/10 rounded-lg flex items-center justify-center">
                                            <FaEnvelope className="w-3 h-3 text-Cprimary" />
                                        </div>
                                        contact@example.com
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Garanties</h4>
                                <div className="space-y-3">
                                    {[
                                        { icon: MdVerified,    color: "text-emerald-500", bg: "bg-emerald-50",   title: "Terrain vérifié",  sub: "Documents authentifiés" },
                                        { icon: FaCertificate, color: "text-Cprimary",    bg: "bg-Cprimary/10", title: "Titre foncier",    sub: "Propriété sécurisée" },
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

                            {proposedProducts.length > 0 && (
                                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                        Constructions ({proposedProducts.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {proposedProducts.map((product: any) => {
                                            const isProperty = product.productable_type === "App\\Models\\Property";
                                            const title = isProperty ? product.productable?.title : product.productable?.land_title;
                                            const img = product.productable?.images?.[0];
                                            return (
                                                <button
                                                    key={product.id}
                                                    onClick={() => navigate(getProductPath(product))}
                                                    className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors text-left"
                                                >
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                        {img
                                                            ? <img src={img} alt={title} className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full flex items-center justify-center"><FaBuilding className="w-5 h-5 text-gray-300" /></div>
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
                                                        <p className="text-xs text-Cprimary font-medium">{fmtCompact(Number(product.total_price))}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
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
                        alt="Plein écran"
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