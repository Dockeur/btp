import React, { useEffect, useState, useCallback } from "react";
import {
    adminListSaleRequests,
    adminUpdateSaleRequestStatus,
    deleteSaleRequest,
    SaleRequestStatus,
    SaleRequestType,
} from "@/services/Salerequestservice";


interface ApiUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface SaleableData {
    id: number;
    area?: string | number;
    is_fragmentable?: boolean;
    relief?: string;
    description?: string;
    location_id?: number;
    certificat_of_ownership?: boolean;
    technical_doc?: boolean;
    land_title?: string;
    images?: string[];
    kml_file?: string | null;
   
    numberOfRoom?: number;
    numberOfToilet?: number;
}

interface Saleable {
    id: number;
    type: string; 
    photos: { id: number; url: string }[] | null;
    data: SaleableData;
}

export interface ApiSaleRequest {
    id: number;
    user: ApiUser;
    description: string;
    type: SaleRequestType;
    status: SaleRequestStatus;
    has_validated_contrat: boolean;
    saleable: Saleable;
    created_at: string;
}


const getImages = (r: ApiSaleRequest): string[] => {
    const fromData   = r.saleable?.data?.images ?? [];
    const fromPhotos = (r.saleable?.photos ?? []).map((p) => p.url);
    return fromData.length ? fromData : fromPhotos;
};

const getKml = (r: ApiSaleRequest): string | null =>
    r.saleable?.data?.kml_file ?? null;

const getUserName = (u: ApiUser) =>
    [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const RELIEF_FR: Record<string, string> = { flat: "Plat", slope: "En pente", hilly: "Vallonné" };


const STATUS_CFG: Record<SaleRequestStatus, { label: string; dot: string; badge: string; bar: string }> = {
    pending:   { label: "En attente", dot: "bg-amber-400",   badge: "bg-amber-50   text-amber-700   border-amber-200",   bar: "bg-amber-400"   },
    accepted:  { label: "Approuvée",  dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-400" },
    rejected:  { label: "Rejetée",    dot: "bg-red-400",     badge: "bg-red-50     text-red-700     border-red-200",     bar: "bg-red-400"     },
    cancelled: { label: "Annulée",    dot: "bg-gray-300",    badge: "bg-gray-50    text-gray-500    border-gray-200",    bar: "bg-gray-300"    },
};


const IcoCheck = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);
const IcoX = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IcoTrash = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const IcoEye = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const IcoSearch = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const IcoFilter = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
    </svg>
);
const IcoClose = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IcoWarn = () => (
    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
const IcoRefresh = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
const IcoLand = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4m6 16h4a2 2 0 002-2V6a2 2 0 00-2-2h-4m-6 16V4m6 16V4M9 4h6" />
    </svg>
);
const IcoHome = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 21V12h6v9" />
    </svg>
);
const IcoSpin = () => (
    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);
const IcoFile = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);
const IcoDownload = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const IcoUser = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const IcoApproveCircle = () => (
    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IcoRejectCircle = () => (
    <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IcoClock = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface ConfirmProps {
    title: string;
    message: string;
    confirmLabel: string;
    confirmClass: string;
    icon: React.ReactElement;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
const ConfirmDialog: React.FC<ConfirmProps> = ({
    title, message, confirmLabel, confirmClass, icon, loading, onConfirm, onCancel,
}) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onCancel : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[popIn_0.18s_ease-out]">
            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mx-auto mb-4">
                {icon}
            </div>
            <h3 className="text-center text-gray-800 font-bold text-base mb-1.5">{title}</h3>
            <p className="text-center text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} disabled={loading}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold text-sm py-2.5
                        rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                    Annuler
                </button>
                <button onClick={onConfirm} disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 text-white font-semibold
                        text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60 ${confirmClass}`}>
                    {loading ? <IcoSpin /> : confirmLabel}
                </button>
            </div>
        </div>
    </div>
);


const Field = ({ label, value, full = false }: { label: string; value: React.ReactNode; full?: boolean }) => (
    <div className={`flex flex-col gap-0.5 ${full ? "col-span-2 sm:col-span-3" : ""}`}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <span className="text-sm text-gray-700 font-medium break-words">
            {value ?? <span className="text-gray-300 italic">—</span>}
        </span>
    </div>
);


const SectionTitle = ({ icon, label }: { icon: React.ReactElement; label: string }) => (
    <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
);


const BoolBadge = ({ value, trueLabel = "Oui", falseLabel = "Non" }: { value: boolean; trueLabel?: string; falseLabel?: string }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border
        ${value
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-500 border-red-200"}`}>
        {value
            ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>}
        {value ? trueLabel : falseLabel}
    </span>
);


interface DetailModalProps {
    req: ApiSaleRequest;
    onClose: () => void;
    onApprove: (r: ApiSaleRequest) => void;
    onReject: (r: ApiSaleRequest) => void;
    onDelete: (r: ApiSaleRequest) => void;
    actionLoadingId: number | null;
}

const DetailModal: React.FC<DetailModalProps> = ({
    req, onClose, onApprove, onReject, onDelete, actionLoadingId,
}) => {
    const [activeImg, setActiveImg] = useState(0);

    const images  = getImages(req);
    const kml     = getKml(req);
    const isLand  = req.type === "land";
    const cfg     = STATUS_CFG[req.status] ?? STATUS_CFG.pending;
    const busy    = actionLoadingId === req.id;
    const d       = req.saleable?.data ?? {} as SaleableData;

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-[slideUp_0.25s_ease-out]">

                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-mono">
                                #{req.id}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                            </span>
                            <span className="bg-Cprimary/10 text-Cprimary text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                {isLand ? <IcoLand /> : <IcoHome />}
                                {isLand ? "Terrain" : "Propriété"}
                            </span>
                        </div>
                        <button onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                            <IcoClose />
                        </button>
                    </div>

                  
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                       
                        {images.length > 0 ? (
                            <div>
                                <SectionTitle icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} label="Photos" />
                          
                                <div className="w-full h-60 rounded-xl overflow-hidden bg-gray-100 mb-2">
                                    <img
                                        src={images[activeImg]}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                          
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {images.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImg(i)}
                                                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                                                    ${activeImg === i
                                                        ? "border-Cprimary scale-105"
                                                        : "border-transparent opacity-60 hover:opacity-100"}`}
                                            >
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl h-32 flex flex-col items-center justify-center gap-2 text-gray-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">Aucune photo disponible</span>
                            </div>
                        )}

                       
                        <div className="bg-gray-50 rounded-xl p-4">
                            <SectionTitle
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7"/></svg>}
                                label="Description"
                            />
                            <p className="text-sm text-gray-700 leading-relaxed">{req.description}</p>
                        </div>

                     
                        <div className="bg-gray-50 rounded-xl p-4">
                            <SectionTitle
                                icon={isLand ? <IcoLand /> : <IcoHome />}
                                label="Informations du bien"
                            />
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {d.area && (
                                    <Field label="Surface" value={`${d.area} m²`} />
                                )}
                                {isLand && d.land_title && (
                                    <Field label="Titre foncier" value={d.land_title} />
                                )}
                                {isLand && d.relief && (
                                    <Field label="Relief" value={RELIEF_FR[d.relief] ?? d.relief} />
                                )}
                                {isLand && d.is_fragmentable !== undefined && (
                                    <Field label="Fragmentable"
                                        value={<BoolBadge value={d.is_fragmentable} />} />
                                )}
                                {isLand && d.certificat_of_ownership !== undefined && (
                                    <Field label="Certificat de propriété"
                                        value={<BoolBadge value={d.certificat_of_ownership} trueLabel="Disponible" falseLabel="Non disponible" />} />
                                )}
                                {isLand && d.technical_doc !== undefined && (
                                    <Field label="Document technique"
                                        value={<BoolBadge value={d.technical_doc} trueLabel="Disponible" falseLabel="Non disponible" />} />
                                )}
                                {!isLand && d.numberOfRoom && (
                                    <Field label="Pièces" value={`${d.numberOfRoom} pièces`} />
                                )}
                                {!isLand && d.numberOfToilet && (
                                    <Field label="Toilettes" value={`${d.numberOfToilet} WC`} />
                                )}
                                <Field label="Contrat validé"
                                    value={<BoolBadge value={req.has_validated_contrat} />} />
                                <Field label="Soumis le" value={formatDate(req.created_at)} />
                            </div>
                        </div>

                        
                        {kml && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <SectionTitle icon={<IcoFile />} label="Fichier de localisation (KML)" />
                                <a
                                    href={kml}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-Cprimary
                                        hover:text-Cprimary text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-xl
                                        transition-all shadow-sm"
                                >
                                    <IcoFile />
                                    Télécharger le fichier KML
                                    <IcoDownload />
                                </a>
                            </div>
                        )}

                       
                        <div className="bg-gray-50 rounded-xl p-4">
                            <SectionTitle icon={<IcoUser />} label="Propriétaire" />
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-Cprimary/10 flex items-center justify-center
                                    text-Cprimary font-bold text-sm flex-shrink-0">
                                    {req.user.firstName?.[0]}{req.user.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-700">{getUserName(req.user)}</p>
                                    <p className="text-xs text-gray-400">{req.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
                        <button onClick={() => onDelete(req)} disabled={busy}
                            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700
                                hover:bg-red-50 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                            {busy ? <IcoSpin /> : <IcoTrash />}
                            Supprimer
                        </button>
                        <div className="flex gap-2">
                            {req.status !== "rejected" && (
                                <button onClick={() => onReject(req)} disabled={busy}
                                    className="flex items-center gap-2 text-sm font-semibold border border-orange-200
                                        text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                                    {busy ? <IcoSpin /> : <IcoX />}
                                    Refuser
                                </button>
                            )}
                            {req.status !== "accepted" && (
                                <button onClick={() => onApprove(req)} disabled={busy}
                                    className="flex items-center gap-2 text-sm font-semibold bg-emerald-500
                                        hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                                    {busy ? <IcoSpin /> : <IcoCheck />}
                                    Approuver
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


interface StatCardProps { label: string; count: number; color: string; bg: string; icon: React.ReactElement }
const StatCard: React.FC<StatCardProps> = ({ label, count, color, bg, icon }) => (
    <div className={`${bg} rounded-2xl px-5 py-4 flex items-center gap-4 border border-white/60 shadow-sm`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-white/60`}>
            {icon}
        </div>
        <div>
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
        </div>
    </div>
);


interface RowProps {
    req: ApiSaleRequest;
    onView: () => void;
    onApprove: () => void;
    onReject: () => void;
    onDelete: () => void;
    busy: boolean;
}
const TableRow: React.FC<RowProps> = ({ req, onView, onApprove, onReject, onDelete, busy }) => {
    const cfg    = STATUS_CFG[req.status] ?? STATUS_CFG.pending;
    const images = getImages(req);
    const isLand = req.type === "land";
    const area   = req.saleable?.data?.area ?? null;

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group">

            <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">#{req.id}</td>

           
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {images.length > 0 ? (
                        <img src={images[0]} alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                            {isLand ? <IcoLand /> : <IcoHome />}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm text-gray-700 font-medium line-clamp-1">{req.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {getUserName(req.user)}
                        </p>
                    </div>
                </div>
            </td>

            
            <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 bg-Cprimary/10 text-Cprimary text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {isLand ? <IcoLand /> : <IcoHome />}
                    {isLand ? "Terrain" : "Propriété"}
                </span>
            </td>

           
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {area ? `${area} m²` : <span className="text-gray-300">—</span>}
            </td>

         
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                </span>
            </td>

          
            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                {formatDate(req.created_at)}
            </td>

           
            <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={onView} title="Voir les détails"
                        className="p-1.5 rounded-lg hover:bg-Cprimary/10 hover:text-Cprimary text-gray-400 transition-all">
                        <IcoEye />
                    </button>
                    {req.status !== "accepted" && (
                        <button onClick={onApprove} disabled={busy} title="Approuver"
                            className="p-1.5 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 text-gray-400 transition-all disabled:opacity-40">
                            {busy ? <IcoSpin /> : <IcoCheck />}
                        </button>
                    )}
                    {req.status !== "rejected" && (
                        <button onClick={onReject} disabled={busy} title="Refuser"
                            className="p-1.5 rounded-lg hover:bg-orange-100 hover:text-orange-600 text-gray-400 transition-all disabled:opacity-40">
                            {busy ? <IcoSpin /> : <IcoX />}
                        </button>
                    )}
                    <button onClick={onDelete} disabled={busy} title="Supprimer"
                        className="p-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 text-gray-400 transition-all disabled:opacity-40">
                        {busy ? <IcoSpin /> : <IcoTrash />}
                    </button>
                </div>
            </td>
        </tr>
    );
};


type ActionType = "approve" | "reject" | "delete";
interface PendingAction { req: ApiSaleRequest; type: ActionType }

const AdminSaleRequestsPage: React.FC = () => {
    const [requests,      setRequests]      = useState<ApiSaleRequest[]>([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState<string | null>(null);
    const [search,        setSearch]        = useState("");
    const [filterStatus,  setFilterStatus]  = useState<SaleRequestStatus | "all">("all");
    const [filterType,    setFilterType]    = useState<SaleRequestType | "all">("all");
    const [detailReq,     setDetailReq]     = useState<ApiSaleRequest | null>(null);
    const [pending,       setPending]       = useState<PendingAction | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

  
    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminListSaleRequests();
            
            const list: ApiSaleRequest[] = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : [];
            setRequests(list);
        } catch {
            setError("Impossible de charger les demandes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    
    const filtered = requests.filter((r) => {
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        const matchType   = filterType   === "all" || r.type   === filterType;
        const q           = search.toLowerCase();
        const matchSearch = !q
            || r.description.toLowerCase().includes(q)
            || String(r.id).includes(q)
            || getUserName(r.user).toLowerCase().includes(q)
            || r.user.email.toLowerCase().includes(q);
        return matchStatus && matchType && matchSearch;
    });

  
    const counts = {
        total:    requests.length,
        pending:  requests.filter((r) => r.status === "pending").length,
        accepted: requests.filter((r) => r.status === "accepted").length,
        rejected: requests.filter((r) => r.status === "rejected").length,
    };

    
    const askAction = (req: ApiSaleRequest, type: ActionType) => {
        setPending({ req, type });
        setDetailReq(null);
    };

    const executeAction = async () => {
        if (!pending) return;
        const { req, type } = pending;
        setActionLoading(req.id);
        try {
            if (type === "delete") {
                await deleteSaleRequest(req.id);
                setRequests((prev) => prev.filter((r) => r.id !== req.id));
            } else {
                const newStatus: SaleRequestStatus = type === "approve" ? "accepted" : "rejected";
                await adminUpdateSaleRequestStatus(req.id, newStatus);
                setRequests((prev) =>
                    prev.map((r) => (r.id === req.id ? { ...r, status: newStatus } : r))
                );
            }
        } catch {
            alert("Une erreur est survenue. Réessayez.");
        } finally {
            setActionLoading(null);
            setPending(null);
        }
    };

  
    const confirmCfg = pending
        ? pending.type === "approve"
            ? { title: "Approuver cette demande ?", message: "Le propriétaire sera notifié de la validation.", confirmLabel: "Approuver", confirmClass: "bg-emerald-500 hover:bg-emerald-600", icon: <IcoApproveCircle /> }
            : pending.type === "reject"
            ? { title: "Refuser cette demande ?", message: "Le propriétaire sera informé du refus de sa demande.", confirmLabel: "Refuser", confirmClass: "bg-orange-500 hover:bg-orange-600", icon: <IcoRejectCircle /> }
            : { title: "Supprimer définitivement ?", message: "Cette action est irréversible. La demande sera effacée.", confirmLabel: "Supprimer", confirmClass: "bg-red-500 hover:bg-red-600", icon: <IcoWarn /> }
        : null;

 
    return (
        <div className="min-h-screen bg-gray-50/60 p-6">

            {/* header */}
            <div className="mb-7">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Demandes de vente</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Gérez et modérez toutes les demandes soumises par les propriétaires.
                </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                <StatCard label="Total" count={counts.total} color="text-gray-600" bg="bg-white"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>} />
                <StatCard label="En attente" count={counts.pending} color="text-amber-600" bg="bg-amber-50"
                    icon={<IcoClock />} />
                <StatCard label="Approuvées" count={counts.accepted} color="text-emerald-600" bg="bg-emerald-50"
                    icon={<IcoApproveCircle />} />
                <StatCard label="Rejetées" count={counts.rejected} color="text-red-500" bg="bg-red-50"
                    icon={<IcoRejectCircle />} />
            </div>

            {/* filtres */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-52 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <IcoSearch />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par id, description, nom…"
                        className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <IcoFilter />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer">
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="accepted">Approuvées</option>
                        <option value="rejected">Rejetées</option>
                        <option value="cancelled">Annulées</option>
                    </select>
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
                    className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer">
                    <option value="all">Tous les types</option>
                    <option value="land">Terrain</option>
                    <option value="property">Propriété</option>
                </select>
                <button onClick={fetchAll} disabled={loading}
                    className="ml-auto flex items-center gap-2 text-sm font-semibold text-Cprimary
                        hover:bg-Cprimary/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                    <IcoRefresh />
                    Rafraîchir
                </button>
            </div>

            {/* table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-8 h-8 border-2 border-Cprimary/30 border-t-Cprimary rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Chargement des demandes…</p>
                    </div>
                )}
                {!loading && error && (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <p className="text-red-500 text-sm">{error}</p>
                        <button onClick={fetchAll} className="text-Cprimary text-sm underline">Réessayer</button>
                    </div>
                )}
                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                        <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500 font-semibold">Aucune demande trouvée</p>
                        <p className="text-gray-400 text-sm">Modifiez vos filtres ou attendez de nouvelles soumissions.</p>
                    </div>
                )}
                {!loading && !error && filtered.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    {["#", "Bien", "Type", "Surface", "Statut", "Date", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        req={req}
                                        busy={actionLoading === req.id}
                                        onView={()    => setDetailReq(req)}
                                        onApprove={()  => askAction(req, "approve")}
                                        onReject={()   => askAction(req, "reject")}
                                        onDelete={()   => askAction(req, "delete")}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                            {filtered.length !== requests.length && ` (sur ${requests.length})`}
                        </div>
                    </div>
                )}
            </div>

            {/* detail modal */}
            {detailReq && (
                <DetailModal
                    req={detailReq}
                    onClose={() => setDetailReq(null)}
                    onApprove={(r) => askAction(r, "approve")}
                    onReject={(r)  => askAction(r, "reject")}
                    onDelete={(r)  => askAction(r, "delete")}
                    actionLoadingId={actionLoading}
                />
            )}

            {/* confirm */}
            {pending && confirmCfg && (
                <ConfirmDialog
                    {...confirmCfg}
                    loading={actionLoading === pending.req.id}
                    onConfirm={executeAction}
                    onCancel={() => { if (!actionLoading) setPending(null); }}
                />
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AdminSaleRequestsPage;