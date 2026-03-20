import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { MdLandscape } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { Maximize2, TrendingUp } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import Loader from "../../loader/Loader";
import { Link } from "react-router-dom";
import FilterComponent from "@/components/public/FilterComponent";
import { useFilterFrontend } from "@/hooks/useFilterFrontend";
import { ProductType } from "@/types";
import { getProducts } from "@/services/ProductService";
import Pagination from "@/components/admin/ui/table/pagination";


const FeatureBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className="flex items-center gap-1.5">
    {ok
      ? <BiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
      : <BiXCircle className="w-4 h-4 text-gray-300 shrink-0" />}
    <span className={`text-xs font-medium ${ok ? "text-emerald-600" : "text-gray-400"}`}>
      {label}
    </span>
  </div>
);


const LandCard = ({ land }: { land: ProductType }) => {
  const address = land?.productable?.location?.address;
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat("fr").format(n);

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-Cprimary/30 hover:shadow-lg transition-all duration-300 group">

      
      <div className="relative h-48 overflow-hidden">
        <img
          src={land?.productable?.images?.[0] ?? "/placeholder-land.jpg"}
          alt={land?.productable?.title ?? "Villa"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {land.reference}
          </span>
        </div>
        {(land.for_rent || land.for_sale) && (
          <span className="absolute top-3 right-3 bg-Cprimary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {land.for_rent ? "A louer" : "A vendre"}
          </span>
        )}
      </div>

 
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 truncate mb-1 group-hover:text-Cprimary transition-colors">
          {land?.productable?.title ?? "Villa disponible"}
        </h3>

        {address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <FaMapMarkerAlt className="w-3 h-3 text-Cprimary shrink-0" />
            <span className="truncate">
              {[address.street, address.city, address.country].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

       
        <div className="grid grid-cols-2 gap-2 py-4 border-y border-gray-50 mb-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <Maximize2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">Surface</p>
              <p className="text-xs font-bold text-gray-900">
                {fmtNum(Number(land?.productable?.area ?? 0))} m2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">Prix/m2</p>
              <p className="text-xs font-bold text-gray-900">
                {fmt(Number(land.unit_price ?? 0))}
              </p>
            </div>
          </div>
        </div>

       
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Prix total</p>
          <p className="text-base font-black text-Cprimary">
            {fmt(Number(land.total_price ?? land.unit_price ?? 0))}
          </p>
        </div>

        
        <div className="flex items-center gap-4 py-3 border-t border-gray-50 mb-4">
          <FeatureBadge ok={!!land?.productable?.is_fragmentable}       label="Fragmentable" />
          <FeatureBadge ok={!!land?.productable?.certificat_of_ownership} label="Certifie" />
        </div>

       
        <div className="flex gap-2">
          <Link
            to={`/land/${land.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-Cprimary hover:bg-Csecondary1 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            Voir details
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
       
        </div>
      </div>
    </article>
  );
};


const LandListing = () => {
  const [lands, setLands] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const countPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await getProducts();
        setLands(
          response.data.filter(
            (value: ProductType) =>
              value.productable_type === "App\\Models\\Property" &&
              value.productable?.type !== "building"
          )
        );
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
  } = useFilterFrontend<ProductType>(lands, countPerPage);

  return (
    <div className="min-h-screen bg-gray-50">

     
      <div className="bg-Csecondary1 py-10 px-4">
        <div className="container mx-auto">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Catalogue</p>
          <h1 className="text-3xl font-black text-white">Nos Villas Disponibles</h1>
          <p className="text-white/50 text-sm mt-1">
            Decouvrez notre selection de villas de qualite
          </p>
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
              <MdLandscape className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Aucune villa ne correspond aux criteres selectionnes</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-6">
              {totalItems} villa{totalItems > 1 ? "s" : ""} disponible{totalItems > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tableData.map((land) => (
                <LandCard key={land.id} land={land} />
              ))}
            </div>
          </>
        )}

        <Pagination
          showLessItems
          className="flex justify-center py-12"
          current={currentPage}
          pageSize={countPerPage}
          defaultCurrent={1}
          onChange={(page) => handlePaginate(page)}
          total={totalItems}
        />
      </div>
    </div>
  );
};

export default LandListing;