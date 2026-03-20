import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/ProductService";
import { FiArrowLeft } from "react-icons/fi";
import React from "react";
import BuildingDetail from "./BuildingDetail";

const BuildingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [immeuble, setImmeuble] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImmeuble = async () => {
      try {
        const response: any = await getProducts();
        const found = response.data.find(
          (item: any) =>
            item.id === Number(id) &&
            item.productable_type === "App\\Models\\Property" &&
            (item.productable?.type === "Building" ||
              item.productable?.type === "Immeuble")
        );
        setImmeuble(found);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    fetchImmeuble();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-Cprimary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!immeuble) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiArrowLeft className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm mb-4">Immeuble introuvable</p>
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

  return <BuildingDetail immeuble={immeuble} />;
};

export default BuildingDetailsPage;