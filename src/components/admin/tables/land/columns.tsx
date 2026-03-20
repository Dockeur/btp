import { routes } from "@/routes";
import { formatDate } from "@/utils/format-date";
import React from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ActionIcon, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import HeaderCell from "../../ui/table/header-cell";
import UpdateLandModal from "../../ui/land/UpdateLandModal";

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
            title: <HeaderCell title="Titre Foncier" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "land_title"} />,
            dataIndex: "land_title",
            key: "land_title",
            onHeaderCell: () => onHeaderCellClick("land_title"),
            render: (land_title: any) => (
                <div className="flex items-center whitespace-nowrap">
                    {land_title ? land_title : '--'}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Surface" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "area"} />,
            dataIndex: "area",
            key: "area",
            onHeaderCell: () => onHeaderCellClick("area"),
            render: (area: any) => (
                <div className="whitespace-nowrap">
                    {area} M²
                </div>
            ),
        },
        {
            title: <HeaderCell title="Relief" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "relief"} />,
            dataIndex: "relief",
            key: "relief",
            onHeaderCell: () => onHeaderCellClick("relief"),
            render: (relief: any) => (
                <div className="whitespace-nowrap">
                    {relief}
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
                    <Link to={routes.admin.lands.show(row.id)}>
                        <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                            <FiEye className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    <ActionIcon onClick={() => options.setModalState({ open: true, id: row.id, type: "edit" })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEdit className="h-4 w-4" />
                    </ActionIcon>
                    <UpdateLandModal land={row} {...options} />
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
