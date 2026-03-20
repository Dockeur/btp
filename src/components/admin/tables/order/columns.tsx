import React from "react";
import { FiEdit } from "react-icons/fi";
import { ActionIcon, Avatar, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import UpdateOrderModal from "../../ui/Order/UpdateOrderModal";
import Productable from "../../ui/product/Productable";
import HeaderCell from "../../ui/table/header-cell";

type Columns = {
    data: any[];
    sortConfig?: any;
    handleSelectAll: any;
    checkedItems: string[];
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    options: any
};
export const getColumns = ({
    data,
    sortConfig,
    checkedItems,
    onHeaderCellClick,
    handleSelectAll,
    onChecked,
    options
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
                <Text className="!text-sm font-medium">
                    {id}
                </Text>
            )
        },
        {
            title: <HeaderCell title="Client"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "customer"} />,
            dataIndex: "customer",
            key: "customer",
            onHeaderCell: () => onHeaderCellClick("customer"),
            render: (customer: any) => (
                <div className="flex items-center w-48 whitespace-nowrap">
                    <Avatar src={customer?.user?.profile} name={customer.first_name + " " + customer.last_name} />
                    <div className="ml-3 rtl:ml-0 rtl:mr-3">
                        <Text as="span" className="mb-0.5 !text-sm font-medium">
                            {customer.first_name + " " + customer.last_name}
                        </Text>
                        <Text as="p" className="text-xs text-gray-600 dark:text-slate-500">
                            {customer.user?.email}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: <HeaderCell title="Produit"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "product"} />,
            dataIndex: "product",
            key: "product",
            onHeaderCell: () => onHeaderCellClick("product"),
            render: (product: any) => (
                <div className="flex items-center whitespace-nowrap">
                    <Productable data={product.productable} type={product.productable_type} />
                </div>
            ),
        },
        {
            title: <HeaderCell title="Référence" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "product"} />,
            dataIndex: "product",
            key: "product",
            onHeaderCell: () => onHeaderCellClick("product"),
            render: (product: any) => (
                <div className="flex items-center whitespace-nowrap">
                    {product ? product.reference : '--'}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Prix de l'unité" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "unit_price"} />,
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
            title: <HeaderCell title="Prix total" sortable className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "total_price"} />,
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
            title: <HeaderCell title="Status" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "status"} />,
            dataIndex: "status",
            key: "status",
            onHeaderCell: () => onHeaderCellClick("status"),
            render: (status: any) => (
                <div className="whitespace-nowrap">
                    {status}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Créé le" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "created_at"} />,
            dataIndex: "created_at",
            key: "created_at",
            onHeaderCell: () => onHeaderCellClick("created_at"),
            render: (created_at: Date) => (
                <div>
                    <Text className="!text-sm font-medium whitespace-nowrap">
                        {new Intl.DateTimeFormat('fr', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(created_at))}
                    </Text>
                </div>
            )
        },
        {
            title: <HeaderCell title="Modifié le" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "updated_at"} />,
            dataIndex: "updated_at",
            key: "updated_at",
            onHeaderCell: () => onHeaderCellClick("updated_at"),
            render: (updated_at: Date) => (
                <div>
                    <Text className="!text-sm font-medium whitespace-nowrap">
                        {new Intl.DateTimeFormat('fr', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(updated_at))}
                    </Text>
                </div>
            )
        },
        {
            // title: <HeaderCell title="Action" />,
            dataIndex: "action",
            key: "action",
            render: (_: any, row: any) => (
                <div className="inline-flex gap-3">
                    <ActionIcon onClick={() => {
                        // options.setType(row.productable_type.split("\\")[2].toLowerCase())
                        options.setModalState({ open: true, id: row.id, type: "edit" })
                    }} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEdit className="h-4 w-4" />
                    </ActionIcon>
                    <UpdateOrderModal order={row} {...options} />
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
