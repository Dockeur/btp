import { getProducts, proposeLand, proposeProperty } from '@/services/ProductService';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { RiCloseFill, RiLink } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, Modal, Select, Text } from 'rizzui';

interface ProposeProductModalProps {
    product: any; // le produit courant (row)
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Détermine le type simplifié depuis productable_type
 * ex: "App\\Models\\Land" → "land"
 *     "App\\Models\\Property" → "property"
 */
const getSimpleType = (productable_type: string): 'land' | 'property' | null => {
    if (!productable_type) return null;
    const parts = productable_type.split('\\');
    const name = parts[parts.length - 1]?.toLowerCase();
    if (name === 'land') return 'land';
    if (name === 'property') return 'property';
    return null;
};

const ProposeProductModal = ({ product, isOpen, onClose }: ProposeProductModalProps) => {
    const productType = getSimpleType(product?.productable_type);

    // Si le produit courant est un Land → on propose des Properties
    // Si le produit courant est une Property → on propose des Lands
    const targetType = productType === 'land' ? 'property' : 'land';

    const [availableOptions, setAvailableOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    // Liste des produits déjà proposés (pour affichage local dans la session)
    const [proposedList, setProposedList] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchOptions = async () => {
            setLoadingOptions(true);
            try {
                const response = await getProducts();
                const all: any[] = response.data || response || [];

                const filtered = all.filter((p: any) => {
                    const t = getSimpleType(p.productable_type);
                    return t === targetType;
                });

                const options = filtered.map((p: any) => ({
                    value: String(p.id),
                    label: `#${p.id} — ${p.productable?.land_title ?? p.productable?.title ?? 'Sans titre'} (${new Intl.NumberFormat('fr', { style: 'currency', currency: 'XAF' }).format(p.unit_price)})`,
                }));

                setAvailableOptions(options);
            } catch (error) {
                console.error('Erreur chargement options:', error);
                toast.error('Impossible de charger les produits');
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchOptions();
        setProposedList([]);
        setSelectedId(null);
    }, [isOpen, product?.id]);

    const handleAdd = async () => {
        if (!selectedId) {
            toast.warning('Veuillez sélectionner un produit à proposer');
            return;
        }

        if (proposedList.find((p) => p.id === selectedId)) {
            toast.warning('Ce produit a déjà été proposé dans cette session');
            return;
        }

        setAdding(true);
        try {
            if (productType === 'land') {
                // Land → on propose une Property
                await proposeProperty(product.id, selectedId);
            } else {
                // Property → on propose un Land
                await proposeLand(product.id, selectedId);
            }

            const selectedOption = availableOptions.find((o) => o.value === selectedId);
            if (selectedOption) {
                setProposedList((prev) => [...prev, { id: selectedId, label: selectedOption.label }]);
            }

            toast.success(productType === 'land' ? 'Propriété proposée avec succès' : 'Terrain proposé avec succès');
            setSelectedId(null);
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Erreur lors de la proposition';
            toast.error(msg);
        } finally {
            setAdding(false);
        }
    };

    const typeLabel = targetType === 'land' ? 'un terrain' : 'une propriété';
    const sectionTitle = productType === 'land'
        ? 'Proposer des propriétés sur ce terrain'
        : 'Proposer des terrains pour cette propriété';

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-5 p-5 rounded-lg bg-white dark:bg-neutral-900 dark:text-white min-w-[420px] max-w-lg">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <RiLink className="text-yellow-500 text-xl" />
                        <Text className="text-xl font-semibold">{sectionTitle}</Text>
                    </div>
                    <ActionIcon size="sm" variant="text" onClick={onClose}>
                        <RiCloseFill className="text-2xl" />
                    </ActionIcon>
                </div>

                {/* Info produit courant */}
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <span className="font-semibold">Produit #{product?.id}</span>
                        {' — '}
                        {product?.productable?.land_title ?? product?.productable?.title ?? 'Sans titre'}
                        <span className="ml-2 capitalize text-xs bg-yellow-200 dark:bg-yellow-700 px-2 py-0.5 rounded-full">
                            {productType}
                        </span>
                    </p>
                </div>

                {/* Sélecteur + bouton ajouter */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold dark:text-white">
                        Sélectionner {typeLabel} à proposer
                    </label>

                    {loadingOptions ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400 p-3 border rounded-lg dark:border-slate-600">
                            Chargement des produits disponibles...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Select
                                    label=""
                                    placeholder={`Choisir ${typeLabel}...`}
                                    options={availableOptions}
                                    value={availableOptions.find((o) => o.value === selectedId) ?? null}
                                    onChange={(opt: any) => setSelectedId(opt?.value ?? null)}
                                    clearable={!!selectedId}
                                    onClear={() => setSelectedId(null)}
                                    dropdownClassName="dark:bg-neutral-900 dark:border-neutral-800"
                                    optionClassName="dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800"
                                    selectClassName="ring-0 dark:border-slate-600"
                                />
                            </div>

                            <Button
                                onClick={handleAdd}
                                isLoading={adding}
                                disabled={!selectedId || adding}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
                            >
                                <FiPlus className="text-lg" />
                            </Button>
                        </div>
                    )}

                    {availableOptions.length === 0 && !loadingOptions && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Aucun produit de type «&nbsp;{targetType}&nbsp;» disponible.
                        </p>
                    )}
                </div>

                {/* Liste des propositions ajoutées dans cette session */}
                {proposedList.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold dark:text-white">
                            Propositions ajoutées cette session
                        </label>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {proposedList.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2"
                                >
                                    <span className="text-sm text-green-800 dark:text-green-200 truncate flex-1">
                                        ✓ {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end pt-2 border-t dark:border-neutral-700">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="dark:border-slate-600 dark:text-white"
                    >
                        Fermer
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProposeProductModal;