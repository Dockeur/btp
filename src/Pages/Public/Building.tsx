import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaChartArea, FaMapMarkerAlt, FaBuilding, FaVideo } from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { BsFillBuildingFill } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import FilterComponent from "@/components/public/FilterComponent";
import Pagination from "@/components/admin/ui/table/pagination";
import Loader from "../../loader/Loader";
import { getProducts } from "@/services/ProductService";
import { useFilterFrontend } from "@/hooks/useFilterFrontend";
import { ProductType } from "@/types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr", { style: "currency", currency: "XAF" }).format(price);

const StatTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-2.5 px-1 text-center">
      {icon}
      <span className="text-xs font-bold text-gray-800">{value}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
};

const VideoTile = ({ href }: { href: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 bg-red-50 rounded-xl py-2.5 px-1 text-center">
      <FaVideo className="w-3.5 h-3.5 text-red-500" />
      {React.createElement(
        "a",
        {
          href: href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-xs font-bold text-red-500 hover:underline",
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
        },
        "Video"
      )}
      <span className="text-[10px] text-gray-400">Visite</span>
    </div>
  );
};

const ImmeubleCard = ({
  immeuble,
  onNavigate,
}: {
  immeuble: ProductType;
  onNavigate: (id: number) => void;
}) => {
  const p = immeuble.productable;

  const address =
    p.location?.address
      ? `${p.location.address.street}, ${p.location.address.city}`
      : "Localisation non renseignee";

  const statItems = [
    {
      icon: <FaBuilding className="w-3.5 h-3.5 text-blue-500" />,
      label: "Appts",
      value: String(p.number_of_appartements || 0),
    },
    {
      icon: <MdApartment className="w-3.5 h-3.5 text-indigo-500" />,
      label: "Niveaux",
      value: String(p.levels || 0),
    },
    {
      icon: <FaCar className="w-3.5 h-3.5 text-purple-500" />,
      label: "Parking",
      value: String(p.parkings || 0),
    },
    {
      icon: <FaChartArea className="w-3.5 h-3.5 text-emerald-500" />,
      label: "Terrain",
      value: `${p.field_area} m2`,
    },
    {
      icon: <BsFillBuildingFill className="w-3.5 h-3.5 text-orange-500" />,
      label: "Bati",
      value: `${p.build_area} m2`,
    },
  ];

  const handleCardClick = () => onNavigate(immeuble.id);
  const handleBtnClick = () => onNavigate(immeuble.id);

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-Cprimary/30 hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img
          src={p.images?.[0] ?? "/placeholder.jpg"}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {immeuble.for_rent || immeuble.for_sale ? (
          <span className="absolute top-3 left-3 bg-Cprimary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {immeuble.for_rent ? "A louer" : "A vendre"}
          </span>
        ) : null}
        {p.has_pool ? (
          <span className="absolute top-3 right-3 bg-white text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
            Piscine
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-Cprimary transition-colors">
            {p.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Ref. {immeuble.reference}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <FaMapMarkerAlt className="text-Cprimary shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 mb-4">
          {statItems.map((s) => (
            <StatTile key={s.label} icon={s.icon} label={s.label} value={s.value} />
          ))}
          {p.location?.coordinate_link ? (
            <VideoTile href={p.location.coordinate_link} />
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
              Cout construction
            </p>
            <p className="text-sm font-bold text-Cprimary">
              {formatPrice(immeuble.total_price)}
            </p>
          </div>
          <button
            onClick={handleBtnClick}
            className="flex items-center gap-1.5 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
          >
            Voir details
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

const Immeuble = () => {
  const navigate = useNavigate();
  const [immeubles, setImmeubles] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const countPerPage = 10;

  useEffect(() => {
    const fetchImmeubles = async () => {
      try {
        const response: any = await getProducts();
        const filtered = response.data.filter(
          (item: ProductType) =>
            (item.productable_type === "App\\Models\\Property" &&
              item.productable?.type === "Building") ||
            item.productable?.type === "Immeuble"
        );
        setImmeubles(filtered);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchImmeubles();
  }, []);

  const {
    tableData,
    handlePriceFilter,
    handleLocationFilter,
    handleStatusFilter,
    handlePaginate,
    totalItems,
    currentPage,
    status,
    location,
    minPrice,
    maxPrice,
  } = useFilterFrontend<ProductType>(immeubles, countPerPage);

  const handleNavigate = (id: number) => navigate(`/immeubles/${id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-Cprimary py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
            Catalogue
          </p>
          <h1 className="text-3xl font-black text-white">Immeubles</h1>
          <p className="text-white/50 text-sm mt-1">Decouvrez nos immeubles disponibles</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-3">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <Loader />
        ) : tableData.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Aucun immeuble trouve</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-6">
              {totalItems} immeuble{totalItems > 1 ? "s" : ""} trouve{totalItems > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tableData.map((immeuble) => (
                <ImmeubleCard
                  key={immeuble.id}
                  immeuble={immeuble}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Pagination
        current={currentPage}
        pageSize={countPerPage}
        total={totalItems}
        onChange={handlePaginate}
        className="flex justify-center pb-12"
      />
    </div>
  );
};

export default Immeuble;