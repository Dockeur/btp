import { formatDate } from "@/utils/format-date";
import React, { useState } from "react";
import { FiCheckCircle, FiEdit } from "react-icons/fi";
import { RiCheckboxBlankCircleLine, RiLink } from "react-icons/ri";
import { ActionIcon, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import Productable from "../../ui/product/Productable";
import UpdateProductModal from "../../ui/product/UpdateProductModal";
import ProposeProductModal from "../../ui/product/ProposeProductModal";
import HeaderCell from "../../ui/table/header-cell";

type Columns = {
    data: any[];
    sortConfig?: any;
    handleSelectAll: any;
    checkedItems: string[];
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    options: any;
};


const ProposeCell = ({ row }: { row: any }) => {
    const [open, setOpen] = useState(false);

    const productType = row.productable_type?.split('\\').pop()?.toLowerCase();
    if (productType !== 'land' && productType !== 'property') return null;

    return (
        <>
            <ActionIcon
                onClick={() => setOpen(true)}
                variant="outline"
                title={productType === 'land' ? 'Proposer des propriétés' : 'Proposer des terrains'}
                className="cursor-pointer dark:border-slate-600 text-yellow-500 border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            >
                <RiLink className="h-4 w-4" />
            </ActionIcon>

            <ProposeProductModal
                product={row}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export const getColumns = ({
    data,
    sortConfig,
    checkedItems,
    onHeaderCellClick,
    handleSelectAll,
    onChecked,
    options,
}: Columns) => [
    {
        title: (
            <div className="ps-2">
                <Checkbox
                    size="sm"
                    inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
                    title={'Select All'}
                    onChange={handleSelectAll}
                    checked={checkedItems.length === data.length}
                    className="cursor-pointer"
                />
            </div>
        ),
        dataIndex: 'checked',
        key: 'checked',
        render: (_: any, row: any) => (
            <div className="inline-flex ps-2">
                <Checkbox
                    size="sm"
                    className="cursor-pointer"
                    inputClassName="checked:!bg-yellow-500 checked:!border-none dark:border-slate-600 ring-0 focus:ring-0 text-white"
                    checked={checkedItems.includes(row.id)}
                    {...(onChecked && { onChange: () => onChecked(row.id) })}
                />
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="ID"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "id"}
            />
        ),
        onHeaderCell: () => onHeaderCellClick("id"),
        dataIndex: "id",
        key: "id",
        render: (id: any) => (
            <Text className="!text-sm font-medium">{id}</Text>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Bien"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "productable"}
            />
        ),
        dataIndex: "productable",
        key: "productable",
        onHeaderCell: () => onHeaderCellClick("productable"),
        render: (productable: any, row: any) => (
            <div className="flex items-center whitespace-nowrap">
                <Productable data={productable} type={row.productable_type} />
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Référence"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "reference"}
            />
        ),
        dataIndex: "reference",
        key: "reference",
        onHeaderCell: () => onHeaderCellClick("reference"),
        render: (reference: any) => (
            <div className="flex items-center whitespace-nowrap">
                {reference ? reference : '--'}
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Prix de l'unité"
                className="whitespace-nowrap"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "unit_price"}
            />
        ),
        dataIndex: "unit_price",
        key: "unit_price",
        onHeaderCell: () => onHeaderCellClick("unit_price"),
        render: (unit_price: any) => (
            <div className="whitespace-nowrap">
                {new Intl.NumberFormat('fr', { style: 'currency', currency: 'XAF' }).format(unit_price)}
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Prix total"
                sortable
                className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "total_price"}
            />
        ),
        dataIndex: "total_price",
        key: "total_price",
        onHeaderCell: () => onHeaderCellClick("total_price"),
        render: (total_price: any) => (
            <div className="whitespace-nowrap">
                {new Intl.NumberFormat('fr', { style: 'currency', currency: 'XAF' }).format(total_price)}
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Status"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "status"}
            />
        ),
        dataIndex: "status",
        key: "status",
        onHeaderCell: () => onHeaderCellClick("status"),
        render: (status: any) => (
            <div className="whitespace-nowrap">{status}</div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="À vendre"
                sortable
                className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "for_sale"}
            />
        ),
        dataIndex: "for_sale",
        key: "for_sale",
        onHeaderCell: () => onHeaderCellClick("for_sale"),
        render: (for_sale: any) => (
            <div className="whitespace-nowrap">
                {for_sale
                    ? <FiCheckCircle className='text-green text-xl' />
                    : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="À louer"
                sortable
                className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "for_rent"}
            />
        ),
        dataIndex: "for_rent",
        key: "for_rent",
        onHeaderCell: () => onHeaderCellClick("for_rent"),
        render: (for_rent: any) => (
            <div className="whitespace-nowrap">
                {for_rent
                    ? <FiCheckCircle className='text-green text-xl' />
                    : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Publié le"
                sortable
                className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "published_at"}
            />
        ),
        dataIndex: "published_at",
        key: "published_at",
        onHeaderCell: () => onHeaderCellClick("published_at"),
        render: (published_at: Date) => (
            <div>
                <Text className="!text-sm font-medium whitespace-nowrap">
                    {published_at ? formatDate(published_at, "DD MMM YYYY, HH:mm:ss") : '--'}
                </Text>
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Créé le"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "created_at"}
            />
        ),
        dataIndex: "created_at",
        key: "created_at",
        onHeaderCell: () => onHeaderCellClick("created_at"),
        render: (created_at: Date) => (
            <div>
                <Text className="!text-sm font-medium whitespace-nowrap">
                    {new Intl.DateTimeFormat('fr', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(created_at))}
                </Text>
            </div>
        ),
    },
    {
        title: (
            <HeaderCell
                title="Modifié le"
                sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "updated_at"}
            />
        ),
        dataIndex: "updated_at",
        key: "updated_at",
        onHeaderCell: () => onHeaderCellClick("updated_at"),
        render: (updated_at: Date) => (
            <div>
                <Text className="!text-sm font-medium whitespace-nowrap">
                    {new Intl.DateTimeFormat('fr', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(updated_at))}
                </Text>
            </div>
        ),
    },
    {
        dataIndex: "action",
        key: "action",
        render: (_: any, row: any) => (
            <div className="inline-flex gap-3 items-center">
                {/* Bouton Modifier */}
                <ActionIcon
                    onClick={() => {
                        options.setType(row.productable_type.split("\\")[2].toLowerCase());
                        options.setModalState({ open: true, id: row.id, type: "edit" });
                    }}
                    variant="outline"
                    className="cursor-pointer dark:border-slate-600"
                >
                    <FiEdit className="h-4 w-4" />
                </ActionIcon>

                <UpdateProductModal product={row} {...options} />

             
                <ProposeCell row={row} />

                <DeletePopover onDelete={() => options.delete(row.id)} />
            </div>
        ),
    },
];