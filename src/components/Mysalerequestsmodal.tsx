import {
    deleteSaleRequest,
    getMySaleRequests,
    SaleRequest,
    SaleRequestStatus,
} from "@/services/Salerequestservice";
import React, { useEffect, useState } from "react";



const statusConfig: Record<SaleRequestStatus, { label: string; classes: string }> = {
    pending:   { label: "En attente",  classes: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    approved:  { label: "Approuvée",   classes: "bg-green-100  text-green-700  border-green-200"  },
    rejected:  { label: "Rejetée",     classes: "bg-red-100    text-red-700    border-red-200"    },
    cancelled: { label: "Annulée",     classes: "bg-gray-100   text-gray-500   border-gray-200"   },
};


const getImages = (req: SaleRequest): string[] => {
   
    if (Array.isArray((req as any).images)) return (req as any).images as string[];

    if (Array.isArray((req as any).photos))
        return ((req as any).photos as { url: string }[]).map((p) => p.url);
    return [];
};


const getAddress = (req: SaleRequest): string | null => {
    const addr = (req as any).location?.address;
    if (!addr) return null;
    return [addr.street, addr.city, addr.country].filter(Boolean).join(", ");
};


const getArea = (req: SaleRequest): string | number | null =>
    (req as any).area ??
    (req as any).land_data?.area ??
    (req as any).property_data?.area ??
    null;



const StatusBadge = ({ status }: { status: SaleRequestStatus }) => {
    const cfg = statusConfig[status] ?? statusConfig.pending;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            {cfg.label}
        </span>
    );
};

const IconClose = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconTrash = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const IconEmpty = () => (
    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);



interface RequestCardProps {
    req: SaleRequest;
    onDelete: (id: number) => void;
    deletingId: number | null;
}

const RequestCard: React.FC<RequestCardProps> = ({ req, onDelete, deletingId }) => {
    const images  = getImages(req);
    const address = getAddress(req);
    const area    = getArea(req);

    const isLand     = req.type === "land";
    const landTitle  = (req as any).land_title  ?? (req as any).land_data?.land_title  ?? null;
    const relief     = (req as any).relief      ?? (req as any).land_data?.relief      ?? null;
    const rooms      = (req as any).property_data?.numberOfRoom   ?? null;
    const toilets    = (req as any).property_data?.numberOfToilet ?? null;

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

    const reliefLabel: Record<string, string> = {
        flat: "Plat", slope: "En pente", hilly: "Vallonné",
    };

    return (
        <div className="border border-gray-200 rounded-xl p-4 hover:border-Cprimary/40 hover:shadow-sm transition-all duration-200 bg-white">

       
            <div className="flex items-start gap-3">

              
                <div className="flex-1 min-w-0">

                 
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-Cprimary/10 text-Cprimary text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                            {isLand ? "Terrain" : "Propriété"}
                        </span>
                        <StatusBadge status={req.status} />
                        {req.has_validated_contrat && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                                Contrat validé
                            </span>
                        )}
                    </div>

                
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">{req.description}</p>

                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                        {area && (
                            <span className="flex items-center gap-1">
                                📐 <span className="text-gray-600 font-medium">{area} m²</span>
                            </span>
                        )}
                        {isLand && landTitle && (
                            <span className="flex items-center gap-1">
                                📄 <span className="text-gray-600 font-medium">{landTitle}</span>
                            </span>
                        )}
                        {isLand && relief && (
                            <span className="flex items-center gap-1">
                                🏔 <span className="text-gray-600 font-medium">{reliefLabel[relief] ?? relief}</span>
                            </span>
                        )}
                        {!isLand && rooms && (
                            <span className="flex items-center gap-1">
                                🛏 <span className="text-gray-600 font-medium">{rooms} pièces</span>
                            </span>
                        )}
                        {!isLand && toilets && (
                            <span className="flex items-center gap-1">
                                🚿 <span className="text-gray-600 font-medium">{toilets} WC</span>
                            </span>
                        )}
                        {address && (
                            <span className="flex items-center gap-1 min-w-0">
                                📍 <span className="text-gray-600 font-medium truncate">{address}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            📅 <span>{formatDate(req.created_at)}</span>
                        </span>
                    </div>
                </div>

               
                {images.length > 0 && (
                    <div className="flex-shrink-0">
                        <div className="relative w-16 h-16">
                            <img
                                src={images[0]}
                                alt=""
                                className="w-full h-full object-cover rounded-lg border border-gray-100"
                            />
                            {images.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                                    +{images.length - 1}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

          
            {images.length > 1 && (
                <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
                    {images.slice(1).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt=""
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-gray-100"
                        />
                    ))}
                </div>
            )}

          
            {req.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => onDelete(req.id)}
                        disabled={deletingId === req.id}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700
                            font-medium transition-colors disabled:opacity-50"
                    >
                        {deletingId === req.id ? (
                            <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <IconTrash />
                        )}
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    );
};



interface MySaleRequestsModalProps {
    onClose: () => void;
    onNewRequest: () => void;
}

const MySaleRequestsModal: React.FC<MySaleRequestsModalProps> = ({ onClose, onNewRequest }) => {
    const [requests, setRequests]   = useState<SaleRequest[]>([]);
    const [loading, setLoading]     = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMySaleRequests();
            setRequests(res.data ?? []);
        } catch {
            setError("Impossible de charger vos demandes.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer cette demande ?")) return;
        setDeletingId(id);
        try {
            await deleteSaleRequest(id);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert("Erreur lors de la suppression. Réessayez.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.3s_ease-out]">

               
                    <div className="bg-Cprimary px-6 py-5 flex items-center justify-between rounded-t-2xl">
                        <div>
                            <h2 className="text-white font-bold text-lg font-poppins">
                                Mes demandes de vente
                            </h2>
                            <p className="text-white/70 text-xs mt-0.5">
                                {!loading && `${requests.length} demande${requests.length !== 1 ? "s" : ""}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onNewRequest}
                                className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                                + Nouvelle
                            </button>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
                            >
                                <IconClose />
                            </button>
                        </div>
                    </div>

             
                    <div className="flex-1 overflow-y-auto p-6">

                  
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-8 h-8 border-2 border-Cprimary/30 border-t-Cprimary rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Chargement…</p>
                            </div>
                        )}

                       
                        {!loading && error && (
                            <div className="flex flex-col items-center py-12 gap-3">
                                <p className="text-red-500 text-sm">{error}</p>
                                <button onClick={fetchRequests} className="text-Cprimary text-sm underline">
                                    Réessayer
                                </button>
                            </div>
                        )}

                      
                        {!loading && !error && requests.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                <IconEmpty />
                                <p className="text-gray-500 font-medium">Aucune demande pour le moment</p>
                                <p className="text-gray-400 text-sm">Soumettez votre premier bien à la vente</p>
                                <button
                                    onClick={onNewRequest}
                                    className="mt-2 bg-Cprimary text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-Csecondary1 transition-colors"
                                >
                                    Créer une demande
                                </button>
                            </div>
                        )}

                     
                        {!loading && !error && requests.length > 0 && (
                            <div className="space-y-3">
                                {requests.map((req) => (
                                    <RequestCard
                                        key={req.id}
                                        req={req}
                                        onDelete={handleDelete}
                                        deletingId={deletingId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default MySaleRequestsModal;