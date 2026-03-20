import { routes } from "@/routes";
import { formatDate } from "@/utils/format-date";
import React from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ActionIcon, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
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
            title: <HeaderCell title="Titre" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "title"} />,
            dataIndex: "title",
            key: "title",
            onHeaderCell: () => onHeaderCellClick("title"),
            render: (title: any) => (
                <div className="flex items-center whitespace-nowrap">
                    {title ? title : '--'}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Surface bâti" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "build_area"} />,
            dataIndex: "build_area",
            key: "build_area",
            onHeaderCell: () => onHeaderCellClick("build_area"),
            render: (build_area: any) => (
                <div className="whitespace-nowrap">
                    {build_area} M²
                </div>
            ),
        },
        {
            title: <HeaderCell title="Terrain" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "field_area"} />,
            dataIndex: "field_area",
            key: "field_area",
            onHeaderCell: () => onHeaderCellClick("field_area"),
            render: (field_area: any) => (
                <div className="whitespace-nowrap">
                    {field_area} M²
                </div>
            ),
        },
        {
            title: <HeaderCell title="Rez de chaussé" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "basement_area"} />,
            dataIndex: "basement_area",
            key: "basement_area",
            onHeaderCell: () => onHeaderCellClick("basement_area"),
            render: (basement_area: any) => (
                <div className="whitespace-nowrap">
                    {basement_area} M²
                </div>
            ),
        },
        {
            title: <HeaderCell title="Sous sol" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "ground_floor_area"} />,
            dataIndex: "ground_floor_area",
            key: "ground_floor_area",
            onHeaderCell: () => onHeaderCellClick("ground_floor_area"),
            render: (ground_floor_area: any) => (
                <div className="whitespace-nowrap">
                    {ground_floor_area} M²
                </div>
            ),
        },
        {
            title: <HeaderCell title="Niveaux" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "levels"} />,
            dataIndex: "levels",
            key: "levels",
            onHeaderCell: () => onHeaderCellClick("levels"),
            render: (levels: any) => (
                <div className="whitespace-nowrap">
                    {levels}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Type" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "type"} />,
            dataIndex: "type",
            key: "type",
            onHeaderCell: () => onHeaderCellClick("type"),
            render: (type: any) => (
                <div className="whitespace-nowrap">
                    {type}
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
                    <Link to={routes.admin.properties.show(row.id)}>
                        <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                            <FiEye className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    <Link to={routes.admin.properties.edit(row.id)}>
                        <ActionIcon variant="outline" className="cursor-pointer dark:border-slate-600">
                            <FiEdit className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    {/* <UpdateAccommodationModal accommodation={row} {...options} /> */}
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
