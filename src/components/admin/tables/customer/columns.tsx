import { routes } from "@/routes";
import { formatDate } from "@/utils/format-date";
import React from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ActionIcon, Avatar, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import HeaderCell from "../../ui/table/header-cell";

type Columns = {
    data: any[];
    sortConfig?: any;
    handleSelectAll: any;
    checkedItems: string[];
    onDeleteItem: (id: string) => void;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    options: any
};

export const getColumns = ({
    data,
    sortConfig,
    checkedItems,
    onDeleteItem,
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
            title: <HeaderCell title="Utilisateur"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "user"} />,
            dataIndex: "user",
            key: "user",
            onHeaderCell: () => onHeaderCellClick("user"),
            render: (user: any, row: any) => (
                <div className="flex items-center whitespace-nowrap w-48">
                    <Avatar src={user?.profile} name={row.first_name + " " + row.last_name} />
                    <div className="ml-3 rtl:ml-0 rtl:mr-3">
                        <Text as="span" className="mb-0.5 !text-sm font-medium">
                            {row.first_name + " " + row.last_name}
                        </Text>
                        <Text as="p" className="text-xs text-gray-600 dark:text-slate-500">
                            {user?.email}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: <HeaderCell title="Téléphone" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "phone"} />,
            dataIndex: "phone",
            key: "phone",
            onHeaderCell: () => onHeaderCellClick("phone"),
            render: (phone: any) => (
                <div className="whitespace-nowrap">
                    {phone}
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
                        {formatDate(created_at, "DD MMM YYYY, HH:mm:ss")}
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
                        {formatDate(updated_at, "DD MMM YYYY, HH:mm:ss")}
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
                    <Link to={routes.admin.customers.show(row.id)}>
                        <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                            <FiEye className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    <Link to={routes.admin.customers.edit(row.id)}>
                        <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                            <FiEdit className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
