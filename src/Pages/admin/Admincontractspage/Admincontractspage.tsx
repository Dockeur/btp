import {
    adminCreateContract,
    adminDeleteContract,
    Contract,
    ContractType,
    downloadContract,
    listContracts,
} from "@/services/ContractsService";
import React, { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════════ */
const IcoPlus = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const IcoTrash = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const IcoDownload = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const IcoEye = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
const IcoPdf = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v6h6" />
    </svg>
);
const IcoUploadCloud = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);
const IcoSpin = () => (
    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

/* ═══════════════════════════════════════════════════════════════════════
   TYPE CONFIG
═══════════════════════════════════════════════════════════════════════ */
const TYPE_CFG: Record<ContractType, { label: string; color: string; bg: string }> = {
    request_for_sales: { label: "Demande de vente", color: "text-Cprimary",   bg: "bg-Cprimary/10"  },
    inscription:       { label: "Inscription",      color: "text-violet-600", bg: "bg-violet-50"    },
};

/* ═══════════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════════════════════════ */
interface ConfirmProps {
    title: string; message: string; loading?: boolean;
    onConfirm: () => void; onCancel: () => void;
}
const ConfirmDialog: React.FC<ConfirmProps> = ({ title, message, loading, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onCancel : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[popIn_0.18s_ease-out]">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
                <IcoWarn />
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
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                        text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60">
                    {loading ? <IcoSpin /> : <><IcoTrash /> Supprimer</>}
                </button>
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   PDF VIEWER MODAL
═══════════════════════════════════════════════════════════════════════ */
const PdfViewerModal: React.FC<{ contract: Contract; onClose: () => void }> = ({ contract, onClose }) => (
    <>
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col animate-[slideUp_0.25s_ease-out]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="text-red-500"><IcoPdf /></div>
                        <div>
                            <p className="font-bold text-gray-700 text-sm">{contract.title}</p>
                            <p className="text-xs text-gray-400">
                                Ajouté le {new Date(contract.created_at).toLocaleDateString("fr-FR", {
                                    day: "2-digit", month: "long", year: "numeric",
                                })}
                            </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_CFG[contract.type]?.bg} ${TYPE_CFG[contract.type]?.color}`}>
                            {TYPE_CFG[contract.type]?.label ?? contract.type}
                        </span>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                        <IcoClose />
                    </button>
                </div>
                <div className="flex-1 bg-gray-100 overflow-hidden rounded-b-2xl" style={{ minHeight: "500px" }}>
                    <iframe src={contract.file_url} className="w-full h-full rounded-b-2xl"
                        style={{ minHeight: "500px" }} title={contract.title} />
                </div>
            </div>
        </div>
    </>
);

/* ═══════════════════════════════════════════════════════════════════════
   UPLOAD MODAL
═══════════════════════════════════════════════════════════════════════ */
interface UploadModalProps {
    onClose: () => void;
    onSuccess: (c: Contract) => void;
}
const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
    const [title,    setTitle]    = useState("");
    const [type,     setType]     = useState<ContractType>("request_for_sales");
    const [file,     setFile]     = useState<File | null>(null);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File | null) => {
        if (!f) return;
        if (f.type !== "application/pdf") { setError("Seuls les fichiers PDF sont acceptés."); return; }
        setFile(f);
        setError(null);
        if (!title) setTitle(f.name.replace(/\.pdf$/i, ""));
    };

    const handleSubmit = async () => {
        if (!title.trim() || !file) return;
        setLoading(true);
        setError(null);
        try {
            const res = await adminCreateContract(title.trim(), file, type);
            onSuccess(res.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Erreur lors de l'upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-[slideUp_0.25s_ease-out]">

                    {/* header */}
                    <div className="bg-Cprimary px-6 py-4 rounded-t-2xl flex items-center justify-between">
                        <div>
                            <h2 className="text-white font-bold text-base">Nouveau contrat</h2>
                            <p className="text-white/70 text-xs mt-0.5">Uploader un fichier PDF</p>
                        </div>
                        <button onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all">
                            <IcoClose />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">

                        {/* titre */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Titre du contrat <span className="text-red-400">*</span>
                            </label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex : Contrat de vente standard 2026"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                                    text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                                    focus:ring-Cprimary/30 focus:border-Cprimary transition-all" />
                        </div>

                        {/* type */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Type de contrat <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.entries(TYPE_CFG) as [ContractType, typeof TYPE_CFG[ContractType]][]).map(([val, cfg]) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setType(val)}
                                        className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border-2 text-left transition-all
                                            ${type === val
                                                ? `border-Cprimary ${cfg.bg}`
                                                : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}
                                    >
                                        <span className={`text-xs font-bold ${type === val ? cfg.color : "text-gray-600"}`}>
                                            {cfg.label}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{val}</span>
                                        {type === val && (
                                            <span className={`text-[10px] font-bold ${cfg.color}`}>✓ Sélectionné</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* fichier PDF */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Fichier PDF <span className="text-red-400">*</span>
                            </label>
                            {file ? (
                                <div className="flex items-center gap-3 px-4 py-3 bg-Cprimary/5 border border-Cprimary/30 rounded-xl">
                                    <div className="text-red-500 flex-shrink-0"><IcoPdf /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} Ko</p>
                                    </div>
                                    <button onClick={() => setFile(null)}
                                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                                        <IcoClose />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onClick={() => inputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                        ${dragging ? "border-Cprimary bg-Cprimary/5" : "border-gray-300 hover:border-Cprimary hover:bg-gray-50"}`}
                                >
                                    <div className="text-gray-300 flex justify-center mb-2"><IcoUploadCloud /></div>
                                    <p className="text-sm font-medium text-gray-500">Glissez votre PDF ici</p>
                                    <p className="text-xs text-gray-400 mt-1">ou cliquez pour sélectionner</p>
                                </div>
                            )}
                            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* footer */}
                    <div className="px-6 pb-6 pt-0 flex gap-3">
                        <button onClick={onClose} disabled={loading}
                            className="flex-1 border border-gray-200 text-gray-600 font-semibold text-sm py-2.5
                                rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Annuler
                        </button>
                        <button onClick={handleSubmit} disabled={loading || !title.trim() || !file}
                            className="flex-1 flex items-center justify-center gap-2 bg-Cprimary hover:bg-Csecondary1
                                text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? <IcoSpin /> : <><IcoUploadCloud /> Publier</>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   CONTRACT CARD
═══════════════════════════════════════════════════════════════════════ */
interface ContractCardProps {
    contract: Contract;
    onView: () => void;
    onDownload: () => void;
    onDelete: () => void;
    isDownloading: boolean;
    isDeleting: boolean;
    isLatest: boolean;
}
const ContractCard: React.FC<ContractCardProps> = ({
    contract, onView, onDownload, onDelete, isDownloading, isDeleting, isLatest,
}) => {
    const typeCfg = TYPE_CFG[contract.type] ?? { label: contract.type, color: "text-gray-500", bg: "bg-gray-100" };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-Cprimary/30 hover:shadow-md transition-all duration-200">
            <div className={`h-1 ${isLatest ? "bg-Cprimary" : "bg-gray-200"}`} />
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${isLatest ? "bg-Cprimary/10 text-Cprimary" : "bg-gray-100 text-gray-400"}`}>
                        <IcoPdf />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm font-bold text-gray-700 truncate">{contract.title}</p>
                            {isLatest && (
                                <span className="text-[10px] font-bold bg-Cprimary/10 text-Cprimary px-2 py-0.5 rounded-full">
                                    Actif
                                </span>
                            )}
                        </div>
                        {/* badge type */}
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${typeCfg.bg} ${typeCfg.color}`}>
                            {typeCfg.label}
                        </span>
                        <p className="text-xs text-gray-400">
                            Ajouté le {new Date(contract.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit", month: "long", year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                    <button onClick={onView}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600
                            hover:text-Cprimary hover:bg-Cprimary/10 px-3 py-1.5 rounded-lg transition-all">
                        <IcoEye /> Visualiser
                    </button>
                    <button onClick={onDownload} disabled={isDownloading}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600
                            hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                        {isDownloading ? <IcoSpin /> : <IcoDownload />}
                        Télécharger
                    </button>
                    <button onClick={onDelete} disabled={isDeleting}
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-400
                            hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                        {isDeleting ? <IcoSpin /> : <IcoTrash />}
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════════════════ */
const AdminContractsPage: React.FC = () => {
    const [contracts,     setContracts]     = useState<Contract[]>([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState<string | null>(null);
    const [filterType,    setFilterType]    = useState<ContractType | "all">("all");
    const [showUpload,    setShowUpload]     = useState(false);
    const [viewContract,  setViewContract]  = useState<Contract | null>(null);
    const [confirmId,     setConfirmId]     = useState<number | null>(null);
    const [deletingId,    setDeletingId]    = useState<number | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await listContracts();
            setContracts(res.data ?? []);
        } catch { setError("Impossible de charger les contrats."); }
        finally   { setLoading(false); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleDownload = async (contract: Contract) => {
        setDownloadingId(contract.id);
        try {
            const blob = await downloadContract(contract.id);
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href = url; a.download = `${contract.title}.pdf`; a.click();
            URL.revokeObjectURL(url);
        } catch { alert("Erreur lors du téléchargement."); }
        finally { setDownloadingId(null); }
    };

    const handleDelete = async () => {
        if (confirmId === null) return;
        setDeletingId(confirmId);
        try {
            await adminDeleteContract(confirmId);
            setContracts((prev) => prev.filter((c) => c.id !== confirmId));
            setConfirmId(null);
        } catch { alert("Erreur lors de la suppression."); }
        finally { setDeletingId(null); }
    };

    /* filtre + tri (les plus récents d'abord) */
    const displayed = [...contracts]
        .reverse()
        .filter((c) => filterType === "all" || c.type === filterType);

    /* contrat actif par type = le plus récent de chaque type */
    const latestByType: Record<string, number> = {};
    [...contracts].forEach((c) => { latestByType[c.type] = c.id; });

    return (
        <div className="min-h-screen bg-gray-50/60 p-6">

            {/* header */}
            <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Contrats</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Gérez les contrats PDF soumis aux utilisateurs.</p>
                </div>
                <button onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white
                        font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                    <IcoPlus /> Nouveau contrat
                </button>
            </div>

            {/* stats + filtres */}
            {!loading && !error && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
                        <span className="text-2xl font-black text-Cprimary">{contracts.length}</span>
                        <span className="text-sm font-semibold text-gray-500">
                            contrat{contracts.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* filtre type */}
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
                        className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5
                            outline-none cursor-pointer shadow-sm">
                        <option value="all">Tous les types</option>
                        <option value="request_for_sales">Demande de vente</option>
                        <option value="inscription">Inscription</option>
                    </select>

                    <button onClick={fetchAll} disabled={loading}
                        className="ml-auto flex items-center gap-2 text-sm font-semibold text-Cprimary
                            hover:bg-Cprimary/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                        <IcoRefresh /> Rafraîchir
                    </button>
                </div>
            )}

            {/* loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="w-8 h-8 border-2 border-Cprimary/30 border-t-Cprimary rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Chargement des contrats…</p>
                </div>
            )}

            {/* error */}
            {!loading && error && (
                <div className="flex flex-col items-center py-20 gap-3">
                    <p className="text-red-500 text-sm">{error}</p>
                    <button onClick={fetchAll} className="text-Cprimary text-sm underline">Réessayer</button>
                </div>
            )}

            {/* empty */}
            {!loading && !error && displayed.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                        <IcoPdf />
                    </div>
                    <p className="text-gray-500 font-semibold">Aucun contrat trouvé</p>
                    <p className="text-gray-400 text-sm">Ajoutez un contrat PDF ou modifiez le filtre.</p>
                    <button onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white
                            font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
                        <IcoPlus /> Ajouter un contrat
                    </button>
                </div>
            )}

            {/* grille */}
            {!loading && !error && displayed.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayed.map((c) => (
                        <ContractCard
                            key={c.id}
                            contract={c}
                            isLatest={latestByType[c.type] === c.id}
                            isDownloading={downloadingId === c.id}
                            isDeleting={deletingId === c.id}
                            onView={() => setViewContract(c)}
                            onDownload={() => handleDownload(c)}
                            onDelete={() => setConfirmId(c.id)}
                        />
                    ))}
                </div>
            )}

            {/* modals */}
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onSuccess={(c) => { setContracts((prev) => [...prev, c]); setShowUpload(false); }}
                />
            )}
            {viewContract && <PdfViewerModal contract={viewContract} onClose={() => setViewContract(null)} />}
            {confirmId !== null && (
                <ConfirmDialog
                    title="Supprimer ce contrat ?"
                    message="Cette action est irréversible. Les utilisateurs ne pourront plus consulter ce contrat."
                    loading={deletingId === confirmId}
                    onConfirm={handleDelete}
                    onCancel={() => { if (!deletingId) setConfirmId(null); }}
                />
            )}

            <style>{`
                @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes popIn   { from { opacity:0; transform:scale(0.9); }      to { opacity:1; transform:scale(1); }      }
            `}</style>
        </div>
    );
};

export default AdminContractsPage;