import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX, FiEye, FiClock, FiMapPin, FiDollarSign, FiPhone, FiFileText, FiHome } from "react-icons/fi";
import { createOrderCustomer, getMyOrders } from "@/services/Ordercustomerservice";

const fmt = (n: number) =>
    new Intl.NumberFormat("fr", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-700",
    approved:  "bg-emerald-100 text-emerald-700",
    rejected:  "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
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

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-Cprimary/30 bg-white";
const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

const SelectField = ({ label, name, value,texts, onChange, options, required = false }: {
    label: string; name: string; value: string; texts:string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
}) => (
    <div>
        <label className={labelCls}>{label}{required && " *"}</label>
        <select name={name} value={value} onChange={onChange} required={required} className={inputCls}>
            <option value="">{texts}</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

const OrderCard = ({ order, onClick }: { order: any; onClick: () => void }) => (
    <div
        onClick={onClick}
        className="group cursor-pointer bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
        <div className="flex items-start justify-between mb-3">
            <div>
                <p className="text-xs text-gray-400 mb-1">#{order.id}</p>
                <p className="text-sm font-bold text-gray-900">{translateType(order.type)}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status ?? "En attente"}
            </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <FiMapPin className="shrink-0 text-Cprimary w-3.5 h-3.5" />
                <span className="truncate">{order.localization}</span>
            </div>
            <div className="flex items-center gap-2">
                <FiDollarSign className="shrink-0 text-Cprimary w-3.5 h-3.5" />
                <span>{fmt(Number(order.budget))}</span>
            </div>
            {order.purchase_time && (
                <div className="flex items-center gap-2">
                    <FiClock className="shrink-0 text-Cprimary w-3.5 h-3.5" />
                    <span>{order.purchase_time}</span>
                </div>
            )}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
                {order.created_at ? new Intl.DateTimeFormat("fr", { dateStyle: "medium" }).format(new Date(order.created_at)) : "—"}
            </p>
            <span className="text-xs text-Cprimary font-semibold group-hover:underline flex items-center gap-1">
                <FiEye className="w-3.5 h-3.5" /> Détails
            </span>
        </div>
    </div>
);

const DetailModal = ({ order, onClose }: { order: any; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Commande #{order.id}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <FiX className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: FiFileText,   label: "Type",          value: translateType(order.type) },
                    { icon: FiMapPin,     label: "Localisation",  value: order.localization },
                    { icon: FiDollarSign, label: "Budget",        value: fmt(Number(order.budget)) },
                    { icon: FiPhone,      label: "Téléphone",     value: order.phone_number },
                    { icon: FiClock,      label: "Délai d'achat", value: order.purchase_time ?? "—" },
                    { icon: FiHome,       label: "Surface (m²)",  value: order.land_area ? `${order.land_area} m²` : "—" },
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <item.icon className="w-3.5 h-3.5 text-Cprimary" />
                            <p className="text-xs text-gray-400">{item.label}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>

            {order.type === "building" && (order.building_type || order.number_of_apartments) && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Bâtiment</p>
                    <div className="grid grid-cols-2 gap-3">
                        {order.building_type && (
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Type</p>
                                <p className="text-sm font-semibold text-gray-900">{translateBuildingType(order.building_type)}</p>
                            </div>
                        )}
                        {order.number_of_apartments && (
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Appartements</p>
                                <p className="text-sm font-semibold text-gray-900">{order.number_of_apartments}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {order.type === "city" && order.function && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Cité</p>
                    <p className="text-sm font-semibold text-gray-900">{translateFunction(order.function)}</p>
                </div>
            )}

            {order.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-2">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{order.description}</p>
                </div>
            )}
        </div>
    </div>
);

const Commande = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const [form, setForm] = useState({
        phone_number: "", budget: "", localization: "", land_area: "",
        description: "", type: "", purchase_time: "",
        building_type: "", number_of_apartments: "", function: "",
    });

    const fetchOrders = async () => {
        try {
            const res = await getMyOrders();
            setOrders(res.data ?? res ?? []);
        } catch {
            toast.error("Impossible de charger vos commandes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(f => {
            const next = { ...f, [name]: value };
            if (name === "type") {
                next.building_type = "";
                next.number_of_apartments = "";
                next.function = "";
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createOrderCustomer({
                phone_number: form.phone_number,
                budget: Number(form.budget),
                localization: form.localization,
                description: form.description,
                type: form.type,
                ...(form.land_area && { land_area: Number(form.land_area) }),
                ...(form.purchase_time && { purchase_time: form.purchase_time }),
                ...(form.type === "building" && form.building_type && { building_type: form.building_type }),
                ...(form.type === "building" && form.number_of_apartments && { number_of_apartments: Number(form.number_of_apartments) }),
                ...(form.type === "city" && form.function && { function: form.function }),
            });
            toast.success("Commande créée avec succès !");
            setShowForm(false);
            setForm({ phone_number: "", budget: "", localization: "", land_area: "", description: "", type: "", purchase_time: "", building_type: "", number_of_apartments: "", function: "" });
            fetchOrders();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Erreur lors de la création");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Mes commandes</h1>
                        <p className="text-sm text-gray-500 mt-1">Gérez vos demandes de terrain ou de bâtiment</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-Cprimary hover:bg-Csecondary1 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        <FiPlus className="w-4 h-4" />
                        Nouvelle commande
                    </button>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-Cprimary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiFileText className="w-7 h-7 text-Cprimary" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Vous n'avez pas encore de commande</p>
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-Cprimary text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                            <FiPlus className="w-4 h-4" /> Créer une commande
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map((order: any) => (
                            <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                        ))}
                    </div>
                )}
            </div>

            {selectedOrder && <DetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h2 className="text-lg font-bold text-gray-900">Nouvelle commande</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                             <SelectField
                                    label="Type de bien"
                                    texts="Batiment, cité, terrain"
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    options={TYPE_OPTIONS}
                                    required
                                />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Téléphone *</label>
                                    <input name="phone_number" value={form.phone_number} onChange={handleChange} required placeholder="+237670000000" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Budget (FCFA) *</label>
                                    <input type="number" name="budget" value={form.budget} onChange={handleChange} required placeholder="50000000" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Localisation *</label>
                                    <input name="localization" value={form.localization} onChange={handleChange} required placeholder="Douala, Akwa" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Surface (m²)</label>
                                    <input type="number" name="land_area" value={form.land_area} onChange={handleChange} placeholder="5000" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Délai d'achat</label>
                                    <input name="purchase_time" value={form.purchase_time} onChange={handleChange} placeholder="6 mois" className={inputCls} />
                                </div>
                               
                            </div>

                            {form.type === "building" && (
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-4 transition-all">
                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Détails du bâtiment</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <SelectField
                                            label="Type de bâtiment"
                                            name="building_type"
                                            value={form.building_type}
                                            onChange={handleChange}
                                            options={BUILDING_TYPE_OPTIONS}
                                        />
                                        <div>
                                            <label className={labelCls}>Nombre d'appartements</label>
                                            <input type="number" name="number_of_apartments" value={form.number_of_apartments} onChange={handleChange} placeholder="20" className={inputCls} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {form.type === "city" && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 transition-all">
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Détails de la cité</p>
                                    <SelectField
                                        label="Fonction"
                                        name="function"
                                        value={form.function}
                                        onChange={handleChange}
                                        options={FUNCTION_OPTIONS}
                                    />
                                </div>
                            )}

                            <div>
                                <label className={labelCls}>Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder={`Je recherche  ${form.type === "land"?"un terrain":form.type === "building"?"un batiment":"une cité"}`} className={inputCls} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={submitting || !form.type} className="flex-1 py-3 text-sm font-semibold text-white bg-Cprimary hover:bg-Csecondary1 rounded-xl transition-all disabled:opacity-50">
                                    {submitting ? "Envoi..." : "Envoyer la commande"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Commande;