import { routes } from "@/routes";
import { formatDate } from "@/utils/format-date";
import React from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ActionIcon, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import HeaderCell from "../../ui/table/header-cell";
import UpdateRoleModal from "../../ui/role/UpdateRoleModal";

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
            title: <HeaderCell title="Nom" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "name"} />,
            dataIndex: "name",
            key: "name",
            onHeaderCell: () => onHeaderCellClick("name"),
            render: (name: any) => (
                <div className="whitespace-nowrap">
                    {name}
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
                <div key={row.id} className="inline-flex gap-3">
                    <ActionIcon onClick={() => options.setModalState({ open: true, id: row.id })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEdit className="h-4 w-4" />
                    </ActionIcon>
                    <UpdateRoleModal role={row} {...options} />
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
