import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEye, FiTrash2, FiX, FiSearch, FiFilter, FiMapPin, FiDollarSign, FiPhone, FiClock, FiHome, FiFileText } from "react-icons/fi";
import { deleteOrderCustomer, getAllOrderCustomers } from "@/services/Ordercustomerservice";

const fmt = (n: number) =>
    new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected:  "bg-red-100 text-red-700 border-red-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
};

const TYPE_OPTIONS = [
    { value: "land",     label: "Terrain" },
    { value: "building", label: "Bâtiment" },
    { value: "city",     label: "Cité" },
];

const BUILDING_TYPE_OPTIONS = [
    { value: "commercial",          label: "Commercial" },
    { value: "office",              label: "Bureau" },
    { value: "hotel",               label: "Hôtel" },
    { value: "furnished_apartment", label: "Appartement meublé" },
    { value: "apartment_rental",    label: "Location d'appartement" },
];

const FUNCTION_OPTIONS = [
    { value: "ressort",            label: "Resort" },
    { value: "social_housing",     label: "Logement social" },
    { value: "commercial_housing", label: "Logement commercial" },
    { value: "business_district",  label: "Quartier d'affaires" },
    { value: "residential_area",   label: "Zone résidentielle" },
    { value: "gate_community",     label: "Résidence sécurisée" },
];

const translateType = (v: string) => TYPE_OPTIONS.find(o => o.value === v)?.label ?? v;
const translateBuildingType = (v: string) => BUILDING_TYPE_OPTIONS.find(o => o.value === v)?.label ?? v;
const translateFunction = (v: string) => FUNCTION_OPTIONS.find(o => o.value === v)?.label ?? v;

const TYPE_BADGE_COLORS: Record<string, string> = {
    land:     "bg-green-100 text-green-700",
    building: "bg-blue-100 text-blue-700",
    city:     "bg-purple-100 text-purple-700",
};

const DetailModal = ({ order, onClose }: { order: any; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">Commande</p>
                    <h2 className="text-lg font-bold dark:text-white">#{order.id}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {order.status ?? "En attente"}
                    </span>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {order.user && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Client</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: FiFileText,   label: "Type",          value: translateType(order.type) },
                    { icon: FiMapPin,     label: "Localisation",  value: order.localization },
                    { icon: FiDollarSign, label: "Budget",        value: fmt(Number(order.budget)) },
                    { icon: FiPhone,      label: "Téléphone",     value: order.phone_number },
                    { icon: FiClock,      label: "Délai d'achat", value: order.purchase_time ?? "—" },
                    { icon: FiHome,       label: "Surface (m²)",  value: order.land_area ? `${order.land_area} m²` : "—" },
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <item.icon className="w-3.5 h-3.5 text-yellow-500" />
                            <p className="text-xs text-gray-400">{item.label}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            {order.type === "building" && (order.building_type || order.number_of_apartments) && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Bâtiment</p>
                    <div className="grid grid-cols-2 gap-3">
                        {order.building_type && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Type</p>
                                <p className="text-sm font-semibold dark:text-white">{translateBuildingType(order.building_type)}</p>
                            </div>
                        )}
                        {order.number_of_apartments && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Appartements</p>
                                <p className="text-sm font-semibold dark:text-white">{order.number_of_apartments}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {order.type === "city" && order.function && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Cité</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{translateFunction(order.function)}</p>
                </div>
            )}

            {order.description && (
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-2">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{order.description}</p>
                </div>
            )}

            <p className="text-xs text-gray-400 text-right">
                Créé le {order.created_at ? new Intl.DateTimeFormat("fr", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.created_at)) : "—"}
            </p>
        </div>
    </div>
);

const ConfirmDeleteModal = ({ onConfirm, onClose, loading }: { onConfirm: () => void; onClose: () => void; loading: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold dark:text-white mb-2">Supprimer cette commande ?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 dark:text-white transition-colors">
                    Annuler
                </button>
                <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? "Suppression..." : "Supprimer"}
                </button>
            </div>
        </div>
    </div>
);

const AdminOrderCustomers = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getAllOrderCustomers();
            const data = res.data ?? res ?? [];
            setOrders(data);
            setFiltered(data);
        } catch {
            toast.error("Impossible de charger les commandes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => {
        let result = [...orders];
        if (typeFilter !== "all") result = result.filter(o => o.type === typeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                o.localization?.toLowerCase().includes(q) ||
                o.phone_number?.toLowerCase().includes(q) ||
                o.user?.name?.toLowerCase().includes(q) ||
                o.user?.email?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, typeFilter, orders]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteOrderCustomer(deleteTarget.id);
            toast.success("Commande supprimée");
            setDeleteTarget(null);
            fetchOrders();
        } catch {
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold dark:text-white">Commandes clients</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filtered.length} commande{filtered.length > 1 ? "s" : ""} au total
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, localisation, téléphone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/30 dark:bg-neutral-800 dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 text-gray-400" />
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:bg-neutral-800 dark:text-white"
                    >
                        <option value="all">Tous les types</option>
                        {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800">
                    <FiFileText className="mx-auto w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucune commande trouvée</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-neutral-800 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <tr>
                                    {["#", "Client", "Type", "Localisation", "Budget", "Téléphone", "Délai", "Détails", "Statut", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                {filtered.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{order.id}</td>
                                        <td className="px-4 py-3">
                                            {order.user ? (
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-xs">{order.user.name}</p>
                                                    <p className="text-gray-400 text-xs">{order.user.email}</p>
                                                </div>
                                            ) : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize whitespace-nowrap ${TYPE_BADGE_COLORS[order.type] ?? "bg-gray-100 text-gray-600"}`}>
                                                {translateType(order.type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{order.localization}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{fmt(Number(order.budget))}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{order.phone_number}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{order.purchase_time ?? "—"}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {order.type === "building" && order.building_type && (
                                                <span className="block">{translateBuildingType(order.building_type)}</span>
                                            )}
                                            {order.type === "city" && order.function && (
                                                <span className="block">{translateFunction(order.function)}</span>
                                            )}
                                            {order.type === "land" && <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                                {order.status ?? "En attente"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-lg transition-colors" title="Voir les détails">
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(order)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors" title="Supprimer">
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedOrder && <DetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            {deleteTarget && <ConfirmDeleteModal onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} loading={deleting} />}
        </div>
    );
};

export default AdminOrderCustomers;