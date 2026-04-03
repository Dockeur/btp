import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    Plus, Trash2, Home, DollarSign, Image as ImageIcon,
    Save, Building2, Edit, Upload, TrendingUp
} from 'lucide-react';
import { Button, Input, Select, Textarea, Checkbox, FileInput } from 'rizzui';
import {
    getProperty,
    updateProperty,
    createBuildingPart,
    updateBuildingPart,
    deleteBuildingPart,
    updateBuildingFinance,
    createBuildingInvestment,
    updateBuildingInvestment,
} from 'src/services/propertyService';

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${active
            ? 'border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
    </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", cancelText = "Annuler", loading = false }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Button type="button" onClick={onClose} variant="outline" disabled={loading}>{cancelText}</Button>
                    <Button type="button" onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white" isLoading={loading} disabled={loading}>{confirmText}</Button>
                </div>
            </div>
        </div>
    );
};

export default function EditProperty() {
    const { id: propertyId } = useParams();
    const [activeTab, setActiveTab]               = useState('general');
    const [loading, setLoading]                   = useState(false);
    const [property, setProperty]                 = useState(null);
    const [buildingParts, setBuildingParts]       = useState([]);
    const [editingPartId, setEditingPartId]       = useState(null);
    const [buildingFinances, setBuildingFinances] = useState({ high: null, medium: null, low: null });
    const [isEditingFinance, setIsEditingFinance] = useState(false);
    const [activeFinanceType, setActiveFinanceType] = useState('medium');
    const [buildingInvestment, setBuildingInvestment] = useState(null);
    const [isEditingInvestment, setIsEditingInvestment] = useState(false);
    const [confirmModal, setConfirmModal]         = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

    const { register, control, handleSubmit, watch, setValue } = useForm();
    const selectedType = watch('type');

    const types = [
        { label: "Immeuble", value: "building" },
        { label: "Duplex",   value: "duplex"   },
        { label: "Villa",    value: "villa"    },
        { label: "Maison",   value: "house"    },
        { label: "Centre commercial", value: "commercial_center" },
    ];

    const countries = [
        { value: 'Tunisie',   label: 'Tunisie'   },
        { value: 'France',    label: 'France'    },
        { value: 'Algérie',   label: 'Algérie'   },
        { value: 'Maroc',     label: 'Maroc'     },
        { value: 'Cameroun',  label: 'Cameroun'  },
    ];

    const standingTypes = [
        { value: 'high',   label: 'Haut Standing',  icon: '🏆', color: 'emerald' },
        { value: 'medium', label: 'Moyen Standing', icon: '⭐', color: 'blue'    },
        { value: 'low',    label: 'Bas Standing',   icon: '🏠', color: 'orange'  },
    ];

    const inputCls    = 'ring-0 dark:border-slate-600';
    const dropdownCls = 'dark:bg-neutral-900 dark:border-neutral-800';
    const optionCls   = 'dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const propRes = await getProperty(propertyId);
                const data = propRes.data;
                setProperty(data);

                Object.keys(data).forEach(key => setValue(key, data[key]));

                if (data.location?.coordinate_link) setValue('coordinate_link', data.location.coordinate_link);
                if (data.location?.address) {
                    if (data.location.address.country) setValue('country', data.location.address.country);
                    if (data.location.address.city)    setValue('city',    data.location.address.city);
                    if (data.location.address.street)  setValue('street',  data.location.address.street);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [propertyId, setValue]);

    useEffect(() => {
        if (!property || property.type !== 'building') return;

        if (Array.isArray(property.building_finances)) {
            const financesObj = { high: null, medium: null, low: null };
            property.building_finances.forEach(finance => {
                const st = finance.type_of_standing;
                if (['high', 'medium', 'low'].includes(st)) financesObj[st] = finance;
            });
            setBuildingFinances(financesObj);
        }

        if (property.building_investment) {
            setBuildingInvestment(property.building_investment);
        }

        if (property.part_of_buildings) {
            setBuildingParts(property.part_of_buildings.map(part => ({
                id: part.id,
                title: part.title,
                description: part.description,
                type_name: part.type_of_part_of_the_building?.name || '',
                type_of_part_of_the_building_id: part.type_of_part_of_the_building_id,
                mount_of_part: part.mount_of_part || '',
                number_of_part: part.number_of_part || '',
                existingPhotos: part.photos || [],
                newPhotos: [],
                isNew: false,
            })));
        }
    }, [property]);

    const reloadProperty = async () => {
        const propRes = await getProperty(propertyId);
        setProperty(propRes.data);
    };

    const calculateFinanceTotal = (standingType) => {
        const f = buildingFinances[standingType];
        if (!f) return 0;
        return ['project_study', 'building_permit', 'structural_work', 'finishing', 'equipments']
            .reduce((sum, key) => sum + (Number(f[key]) || 0), 0);
    };

    const updateFinanceField = (standingType, field, value) => {
        setBuildingFinances(prev => ({
            ...prev,
            [standingType]: { ...(prev[standingType] || {}), [field]: value },
        }));
    };

    const updateBuildingPartField = (id, field, value) => {
        setBuildingParts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleFinanceSubmit = async (e) => {
        e.preventDefault();
        const financesArray = standingTypes
            .filter(s => buildingFinances[s.value])
            .map(s => {
                const f = buildingFinances[s.value];
                return {
                    project_study:    f.project_study    || 0,
                    building_permit:  f.building_permit  || 0,
                    structural_work:  f.structural_work  || 0,
                    finishing:        f.finishing        || 0,
                    equipments:       f.equipments       || 0,
                    cost_of_land:     f.cost_of_land     || 0,
                    type_of_standing: s.value,
                };
            });
        try {
            setLoading(true);
            await updateBuildingFinance({ finances: financesArray }, propertyId);
            toast.success("Finances mises à jour avec succès");
            setIsEditingFinance(false);
            await reloadProperty();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement des finances");
        } finally {
            setLoading(false);
        }
    };

    const handleInvestmentSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            growth_in_market_value: Number(formData.get('growth_in_market_value')),
            annual_expense:         Number(formData.get('annual_expense')),
            mount_income:           Number(formData.get('mount_income')),
        };
        try {
            setLoading(true);
            if (buildingInvestment?.id) {
                await updateBuildingInvestment(data, propertyId);
            } else {
                await createBuildingInvestment(propertyId, data);
            }
            toast.success("Investissement mis à jour avec succès");
            setIsEditingInvestment(false);
            await reloadProperty();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement de l'investissement");
        } finally {
            setLoading(false);
        }
    };

    const addBuildingPart = () => {
        const newPart = {
            id: `new_${Date.now()}`, title: '', description: '', type_name: '',
            mount_of_part: '', number_of_part: '', existingPhotos: [], newPhotos: [],
            isNew: true, isEditing: true,
        };
        setBuildingParts(prev => [...prev, newPart]);
        setEditingPartId(newPart.id);
    };

    const removeBuildingPart = (id) => {
        if (String(id).startsWith('new_')) {
            setBuildingParts(prev => prev.filter(p => p.id !== id));
            if (editingPartId === id) setEditingPartId(null);
            return;
        }
        const part = buildingParts.find(p => p.id === id);
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer cette partie ?',
            message: `Êtes-vous sûr de vouloir supprimer "${part?.title}" ? Cette action est irréversible.`,
            onConfirm: () => handleDeletePart(id),
        });
    };

    const handleDeletePart = async (id) => {
        try {
            setLoading(true);
            await deleteBuildingPart(propertyId, id);
            toast.success("Partie supprimée avec succès");
            await reloadProperty();
            if (editingPartId === id) setEditingPartId(null);
            setConfirmModal({ isOpen: false, onConfirm: null, title: '', message: '' });
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    const saveBuildingPart = async (part) => {
        if (!part.title || !part.description) { toast.error("Veuillez remplir tous les champs obligatoires"); return; }
        try {
            setLoading(true);
            if (part.isNew) {
                const fd = new FormData();
                fd.append('parts[0][title]',       part.title);
                fd.append('parts[0][description]', part.description);
                if (part.type_name)      fd.append('parts[0][type_name]',      part.type_name);
                if (part.mount_of_part)  fd.append('parts[0][mount_of_part]',  part.mount_of_part);
                if (part.number_of_part) fd.append('parts[0][number_of_part]', part.number_of_part);
                part.newPhotos?.forEach((photo, i) => fd.append(`part_photos_0[${i}]`, photo));
                await createBuildingPart(propertyId, fd);
                toast.success("Partie ajoutée avec succès");
            } else {
                const fd = new FormData();
                fd.append('title',       part.title);
                fd.append('description', part.description);
                fd.append('_method',     'PATCH');
                if (part.type_name)      fd.append('type_name',      part.type_name);
                if (part.mount_of_part)  fd.append('mount_of_part',  part.mount_of_part);
                if (part.number_of_part) fd.append('number_of_part', part.number_of_part);
                fd.append('replace_photos', part.replace_photos ? '1' : '0');
                if (part.replace_photos) part.newPhotos?.forEach((photo, i) => fd.append(`photos[${i}]`, photo));
                await updateBuildingPart(propertyId, part.id, fd);
                toast.success("Partie mise à jour avec succès");
            }
            setEditingPartId(null);
            await reloadProperty();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images') return;
                if (value === undefined || value === null || value === '') return;
                if (key === 'has_pool' || key === 'has_garden') { formData.append(key, value ? '1' : '0'); return; }
                if (['bedrooms', 'bathrooms', 'number_of_salons', 'parkings', 'levels', 'number_of_appartements'].includes(key)) {
                    const n = parseInt(value); if (!isNaN(n)) formData.append(key, n.toString()); return;
                }
                if (['build_area', 'field_area', 'basement_area', 'ground_floor_area', 'estimated_payment'].includes(key)) {
                    const n = parseFloat(value); if (!isNaN(n)) formData.append(key, n.toString()); return;
                }
                formData.append(key, value);
            });
            if (data.images?.length > 0) {
                Array.from(data.images).forEach(file => {
                    if (file instanceof File && file.type.startsWith('image/')) formData.append('images[]', file);
                });
            }
            formData.append('_method', 'PATCH');
            await updateProperty(formData, propertyId);
            toast.success("Propriété mise à jour avec succès");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !property) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-4">
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, onConfirm: null, title: '', message: '' })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Supprimer"
                cancelText="Annuler"
                loading={loading}
            />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white mb-2">Modifier : {property?.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Admin / Propriétés / Édition</p>
                    </div>
                    <Button onClick={handleSubmit(onSubmit)} isLoading={loading} className="bg-yellow-500 hover:bg-yellow-600 gap-2 w-full sm:w-auto">
                        <Save size={18} /> Enregistrer
                    </Button>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b dark:border-neutral-800 overflow-x-auto bg-white dark:bg-neutral-900 sticky top-0 z-10">
                        <div className="flex min-w-max">
                            <TabButton active={activeTab === 'general'}    onClick={() => setActiveTab('general')}    icon={Home}       label="Général"        />
                            {selectedType === 'building' && (
                                <>
                                    <TabButton active={activeTab === 'finance'}    onClick={() => setActiveTab('finance')}    icon={DollarSign} label="Finances"       />
                                    <TabButton active={activeTab === 'parts'}      onClick={() => setActiveTab('parts')}      icon={Building2}  label="Unités"         />
                                    <TabButton active={activeTab === 'investment'} onClick={() => setActiveTab('investment')} icon={TrendingUp} label="Investissement" />
                                </>
                            )}
                            <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={ImageIcon} label="Média" />
                        </div>
                    </div>

                    <div className="p-6">

                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Input label="Titre" className="sm:col-span-2 lg:col-span-3" {...register('title')} inputClassName={inputCls} />
                                    <Controller name="type" control={control} render={({ field }) => (
                                        <Select label="Type de propriété" options={types}
                                            value={types.find(t => t.value === field.value)}
                                            onChange={option => field.onChange(option.value)}
                                            selectClassName={inputCls} dropdownClassName={dropdownCls} optionClassName={optionCls} />
                                    )} />
                                    <Input label="Nom du type"               {...register('type_name')}             inputClassName={inputCls} placeholder="Ex: Haut standing" />
                                    <Input type="number" label="Surface Construite (m²)"  {...register('build_area',         { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Surface Terrain (m²)"     {...register('field_area',         { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Surface Sous-sol (m²)"    {...register('basement_area',      { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Surface RDC (m²)"         {...register('ground_floor_area',  { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Prix Estimé (FCFA)"       {...register('estimated_payment',  { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Niveaux"                  {...register('levels',             { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Chambres"                 {...register('bedrooms',           { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Salles de bain"           {...register('bathrooms',          { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Salons"                   {...register('number_of_salons',   { valueAsNumber: true })} inputClassName={inputCls} />
                                    <Input type="number" label="Parkings"                 {...register('parkings',           { valueAsNumber: true })} inputClassName={inputCls} />
                                    {selectedType === 'building' && (
                                        <Input type="number" label="Nombre d'appartements" {...register('number_of_appartements', { valueAsNumber: true })} inputClassName={inputCls} />
                                    )}
                                    <div className="flex items-center gap-6 py-4">
                                        <Checkbox label="Piscine" {...register('has_pool')}   inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0" />
                                        <Checkbox label="Jardin"  {...register('has_garden')} inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0" />
                                    </div>
                                    <Textarea label="Description" className="sm:col-span-2 lg:col-span-3" {...register('description')} rows={4} textareaClassName={inputCls} />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t dark:border-neutral-800">
                                    <h3 className="text-lg font-semibold dark:text-white sm:col-span-2">Localisation</h3>
                                    <Controller name="country" control={control} render={({ field }) => (
                                        <Select label="Pays" options={countries}
                                            value={countries.find(c => c.value === field.value)}
                                            onChange={option => field.onChange(option.value)}
                                            selectClassName={inputCls} dropdownClassName={dropdownCls} optionClassName={optionCls} />
                                    )} />
                                    <Input label="Ville"           {...register('city')}             inputClassName={inputCls} />
                                    <Input label="Quartier / Rue"  {...register('street')}            inputClassName={inputCls} />
                                    <Input label="Lien de la vidéo" className="sm:col-span-2" {...register('coordinate_link')} inputClassName={inputCls} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'finance' && selectedType === 'building' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold dark:text-white">Détails financiers par standing (FCFA)</h3>
                                    {!isEditingFinance && (
                                        <Button type="button" onClick={() => setIsEditingFinance(true)} variant="outline" className="gap-2">
                                            <Edit size={16} /> Modifier
                                        </Button>
                                    )}
                                </div>

                                <div className="flex gap-2 border-b dark:border-neutral-700 mb-6">
                                    {standingTypes.map(s => (
                                        <button key={s.value} type="button" onClick={() => setActiveFinanceType(s.value)}
                                            className={`px-4 py-3 font-medium transition-all border-b-2 flex items-center gap-2 ${activeFinanceType === s.value
                                                ? `border-${s.color}-500 text-${s.color}-500 bg-${s.color}-50 dark:bg-${s.color}-900/20`
                                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                            <span className="text-xl">{s.icon}</span>
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {isEditingFinance ? (
                                    <form onSubmit={handleFinanceSubmit}>
                                        <div className="space-y-8">
                                            {standingTypes.map(s => {
                                                const finance = buildingFinances[s.value] || {};
                                                return (
                                                    <div key={s.value}
                                                        className={`p-6 rounded-lg border-2 ${activeFinanceType === s.value
                                                            ? `border-${s.color}-500 bg-${s.color}-50 dark:bg-${s.color}-900/10`
                                                            : 'border-gray-200 dark:border-neutral-700 opacity-50'}`}>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="text-2xl">{s.icon}</span>
                                                            <h4 className="text-lg font-semibold dark:text-white">{s.label}</h4>
                                                        </div>
                                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {[
                                                                { key: 'project_study',   label: 'Étude du projet'      },
                                                                { key: 'building_permit', label: 'Permis de construire'  },
                                                                { key: 'structural_work', label: 'Gros œuvres'           },
                                                                { key: 'finishing',       label: 'Finitions'             },
                                                                { key: 'equipments',      label: 'Équipements'           },
                                                                { key: 'cost_of_land',    label: 'Coût du terrain'       },
                                                            ].map(field => (
                                                                <Input key={field.key} type="number" label={field.label}
                                                                    value={finance[field.key] || ''}
                                                                    onChange={e => updateFinanceField(s.value, field.key, e.target.value)}
                                                                    inputClassName={inputCls} />
                                                            ))}
                                                        </div>
                                                        <div className={`mt-4 p-4 bg-${s.color}-100 dark:bg-${s.color}-900/20 rounded-lg`}>
                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total (hors terrain)</p>
                                                            <p className={`text-2xl font-bold text-${s.color}-600 dark:text-${s.color}-400`}>
                                                                {calculateFinanceTotal(s.value).toLocaleString()} FCFA
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <Button type="submit" isLoading={loading} className="bg-yellow-500 hover:bg-yellow-600">
                                                <Save size={16} className="mr-2" /> Enregistrer toutes les finances
                                            </Button>
                                            <Button type="button" onClick={() => setIsEditingFinance(false)} variant="outline">Annuler</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        {(() => {
                                            const cs = standingTypes.find(s => s.value === activeFinanceType);
                                            const finance = buildingFinances[activeFinanceType];
                                            if (!finance) return (
                                                <div className="text-center py-12 border-2 border-dashed dark:border-neutral-700 rounded-lg">
                                                    <DollarSign className="mx-auto mb-4 text-gray-400" size={48} />
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Aucune finance enregistrée pour {cs.label}</p>
                                                    <Button type="button" onClick={() => setIsEditingFinance(true)} className="bg-yellow-500 hover:bg-yellow-600">Ajouter les finances</Button>
                                                </div>
                                            );
                                            return (
                                                <>
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {[
                                                            { label: 'Étude du projet',      value: finance.project_study    },
                                                            { label: 'Permis de construire',  value: finance.building_permit  },
                                                            { label: 'Gros œuvres',          value: finance.structural_work  },
                                                            { label: 'Finitions',             value: finance.finishing        },
                                                            { label: 'Équipements',           value: finance.equipments       },
                                                            { label: 'Coût du terrain',       value: finance.cost_of_land     },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                                                                <p className="text-lg font-semibold dark:text-white">{(Number(item.value) || 0).toLocaleString()} FCFA</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className={`p-6 bg-${cs.color}-50 dark:bg-${cs.color}-900/20 rounded-lg border-2 border-${cs.color}-200 dark:border-${cs.color}-800`}>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="text-3xl">{cs.icon}</span>
                                                            <p className={`text-sm font-medium text-${cs.color}-800 dark:text-${cs.color}-200`}>{cs.label}</p>
                                                        </div>
                                                        <div className="grid sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className={`text-sm font-medium text-${cs.color}-800 dark:text-${cs.color}-200`}>Total hors terrain</p>
                                                                <p className={`text-2xl font-bold text-${cs.color}-600 dark:text-${cs.color}-400`}>
                                                                    {calculateFinanceTotal(activeFinanceType).toLocaleString()} FCFA
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-medium text-${cs.color}-800 dark:text-${cs.color}-200`}>Coût total</p>
                                                                <p className={`text-2xl font-bold text-${cs.color}-600 dark:text-${cs.color}-400`}>
                                                                    {(calculateFinanceTotal(activeFinanceType) + (Number(finance.cost_of_land) || 0)).toLocaleString()} FCFA
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'investment' && selectedType === 'building' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold dark:text-white">Détails d'investissement</h3>
                                    {buildingInvestment && !isEditingInvestment && (
                                        <Button type="button" onClick={() => setIsEditingInvestment(true)} variant="outline" className="gap-2">
                                            <Edit size={16} /> Modifier
                                        </Button>
                                    )}
                                </div>

                                {!buildingInvestment && !isEditingInvestment ? (
                                    <div className="text-center py-12 border-2 border-dashed dark:border-neutral-700 rounded-lg">
                                        <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">Aucun investissement enregistré</p>
                                        <Button type="button" onClick={() => setIsEditingInvestment(true)} className="bg-yellow-500 hover:bg-yellow-600">
                                            Ajouter l'investissement
                                        </Button>
                                    </div>
                                ) : isEditingInvestment ? (
                                    <form onSubmit={handleInvestmentSubmit}>
                                        <div className="grid sm:grid-cols-3 gap-6">
                                            <div>
                                                <Input type="number" step="0.01" name="growth_in_market_value"
                                                    label="Croissance de la valeur marchande (%)"
                                                    defaultValue={buildingInvestment?.growth_in_market_value || 0}
                                                    inputClassName={inputCls} placeholder="Ex: 50" />
                                                <div className="mt-1.5 space-y-0.5">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Taux de croissance annuel de la valeur du bien.</p>
                                                    <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                                                        <span>💡</span>
                                                        <span>Entrer <strong>50</strong> signifie <strong>50%</strong> de croissance</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <Input type="number" name="annual_expense"
                                                    label="Dépenses annuelles (FCFA)"
                                                    defaultValue={buildingInvestment?.annual_expense || 0}
                                                    inputClassName={inputCls} placeholder="Ex: 50000000" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Charges et frais d'entretien annuels estimés</p>
                                            </div>
                                            <div>
                                                <Input type="number" name="mount_income"
                                                    label="Revenus mensuels (FCFA)"
                                                    defaultValue={buildingInvestment?.mount_income || 0}
                                                    inputClassName={inputCls} placeholder="Ex: 3000000" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Revenus locatifs ou d'exploitation mensuels estimés</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <Button type="submit" isLoading={loading} className="bg-yellow-500 hover:bg-yellow-600">
                                                <Save size={16} className="mr-2" /> Enregistrer
                                            </Button>
                                            <Button type="button" onClick={() => setIsEditingInvestment(false)} variant="outline">Annuler</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-500 rounded-lg">
                                                        <TrendingUp className="text-white" size={20} />
                                                    </div>
                                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Croissance de valeur</p>
                                                </div>
                                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                    {buildingInvestment?.growth_in_market_value || 0}%
                                                </p>
                                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">par an</p>
                                            </div>
                                            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-orange-500 rounded-lg">
                                                        <DollarSign className="text-white" size={20} />
                                                    </div>
                                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Dépenses annuelles</p>
                                                </div>
                                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                    {(Number(buildingInvestment?.annual_expense) || 0).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">FCFA / an</p>
                                            </div>
                                            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-blue-500 rounded-lg">
                                                        <TrendingUp className="text-white" size={20} />
                                                    </div>
                                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Revenus mensuels</p>
                                                </div>
                                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                    {(Number(buildingInvestment?.mount_income) || 0).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">FCFA / mois</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">ℹ️ Analyse d'investissement</h4>
                                            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                                                <p>• Une croissance de {buildingInvestment?.growth_in_market_value}% signifie que la valeur du bien augmente de ce pourcentage chaque année</p>
                                                <p>• Les dépenses annuelles comprennent l'entretien, les taxes, les assurances et autres charges</p>
                                                <p>• Les revenus mensuels représentent {(Number(buildingInvestment?.mount_income) || 0).toLocaleString()} FCFA, soit {((Number(buildingInvestment?.mount_income) || 0) * 12).toLocaleString()} FCFA / an</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'parts' && selectedType === 'building' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg dark:text-white">Unités de l'immeuble ({buildingParts.length})</h3>
                                    <Button type="button" onClick={addBuildingPart} variant="outline" className="border-yellow-500 text-yellow-500 gap-2" disabled={editingPartId !== null}>
                                        <Plus size={16} /> Ajouter une unité
                                    </Button>
                                </div>

                                {buildingParts.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed dark:border-neutral-700 rounded-lg">
                                        <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">Aucune partie enregistrée</p>
                                        <Button type="button" onClick={addBuildingPart} className="bg-yellow-500 hover:bg-yellow-600">Ajouter la première unité</Button>
                                    </div>
                                ) : (
                                    buildingParts.map(part => (
                                        <div key={part.id} className="p-6 border dark:border-neutral-700 rounded-xl relative bg-gray-50/50 dark:bg-neutral-800/30 hover:shadow-md transition-shadow">
                                            <div className="absolute -top-3 -right-3 flex gap-2">
                                                <button type="button" onClick={() => saveBuildingPart(part)} disabled={loading}
                                                    title="Enregistrer cette partie"
                                                    className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Save size={16} />
                                                </button>
                                                <button type="button" onClick={() => removeBuildingPart(part.id)} disabled={loading}
                                                    title="Supprimer cette partie"
                                                    className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                                    <Input label="Nom de l'unité"    placeholder="Ex: Appt A1"       value={part.title}          onChange={e => updateBuildingPartField(part.id, 'title',          e.target.value)} inputClassName={inputCls} />
                                                    <Input label="Type"              placeholder="Ex: Haut standing" value={part.type_name}      onChange={e => updateBuildingPartField(part.id, 'type_name',      e.target.value)} inputClassName={inputCls} />
                                                    <Input label="Description"       placeholder="Ex: 3 pièces"      value={part.description}    onChange={e => updateBuildingPartField(part.id, 'description',    e.target.value)} inputClassName={inputCls} />
                                                    <Input type="number" label="Montant (FCFA)" placeholder="Ex: 25000000" value={part.mount_of_part}  onChange={e => updateBuildingPartField(part.id, 'mount_of_part',  e.target.value)} inputClassName={inputCls} />
                                                    <Input label="Numéro"            placeholder="Ex: A-101"         value={part.number_of_part} onChange={e => updateBuildingPartField(part.id, 'number_of_part', e.target.value)} inputClassName={inputCls} />
                                                </div>

                                                <div className="pt-4 border-t dark:border-neutral-700">
                                                    <label className="block text-sm font-medium mb-3 dark:text-white">📸 Photos de l'unité</label>

                                                    {part.existingPhotos?.length > 0 && (
                                                        <div className="mb-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-700">
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                                                                    {part.existingPhotos.length} photo{part.existingPhotos.length > 1 ? 's' : ''} existante{part.existingPhotos.length > 1 ? 's' : ''}
                                                                </span>
                                                            </p>
                                                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                                                {part.existingPhotos.map((url, idx) => (
                                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-500 transition-all group">
                                                                        <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <span className="text-white text-xs font-medium">#{idx + 1}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!part.isNew && part.existingPhotos?.length > 0 && (
                                                        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                                <input type="checkbox" checked={part.replace_photos || false}
                                                                    onChange={e => updateBuildingPartField(part.id, 'replace_photos', e.target.checked)}
                                                                    className="mt-1 w-5 h-5 text-yellow-500 border-gray-300 dark:border-slate-600 rounded focus:ring-yellow-500 focus:ring-2 cursor-pointer" />
                                                                <div className="flex-1">
                                                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                                                        Remplacer toutes les photos existantes
                                                                    </span>
                                                                    <p className={`text-xs mt-1.5 ${part.replace_photos ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                        {part.replace_photos
                                                                            ? `⚠️ Les ${part.existingPhotos.length} photo(s) actuelle(s) seront définitivement supprimées`
                                                                            : 'ℹ️ Les nouvelles photos seront ajoutées aux photos existantes'}
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4">
                                                        <input type="file" multiple accept="image/*"
                                                            onChange={e => { if (e.target.files) updateBuildingPartField(part.id, 'newPhotos', Array.from(e.target.files)); }}
                                                            className="flex-1 p-3 border-2 rounded-lg dark:border-slate-600 dark:bg-neutral-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 file:cursor-pointer transition-all hover:border-yellow-500" />
                                                        {part.newPhotos?.length > 0 && (
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                                                <Upload size={16} className="text-green-600 dark:text-green-400" />
                                                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                                    {part.newPhotos.length} nouvelle{part.newPhotos.length > 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {!part.isNew && (
                                                    <div className="pt-4 border-t dark:border-neutral-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">ID: #{part.id}</span>
                                                            {part.type_name && (
                                                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded">{part.type_name}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon size={14} />
                                                            <span>{part.existingPhotos?.length || 0} photo(s)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-white mb-4">Ajouter de nouvelles photos</h3>
                                    <FileInput label="Sélectionner des images" multiple accept="image/*" {...register('images')} inputClassName={inputCls} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold dark:text-white mb-4">Photos existantes ({property?.images?.length || 0})</h4>
                                    {property?.images?.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                            {property.images.map((imgUrl, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border dark:border-neutral-700 hover:border-yellow-500 transition-all">
                                                    <img src={imgUrl} alt={`property-${index}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button type="button"
                                                            className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transform hover:scale-110 transition-all"
                                                            onClick={() => { if (window.confirm('Supprimer cette image ?')) toast.success('Image supprimée'); }}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border-2 border-dashed dark:border-neutral-700 rounded-lg">
                                            <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                            <p className="text-gray-600 dark:text-gray-400">Aucune image disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t dark:border-neutral-800">
                            <Button type="button" onClick={handleSubmit(onSubmit)} isLoading={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12 text-lg font-semibold">
                                <Save size={20} className="mr-2" /> Mettre à jour la propriété
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}