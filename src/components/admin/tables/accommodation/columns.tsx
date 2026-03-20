import { formatDate } from "@/utils/format-date";
import React from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { ActionIcon, Checkbox, Text } from "rizzui";
import DeletePopover from "../../ui/DeletePopover";
import ShowAccommodationModal from '../../ui/accommodation/ShowAccommodationModal';
import UpdateAccommodationModal from "../../ui/accommodation/UpdateAccommodationModal";
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
            title: <HeaderCell title="Reference" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "reference"} />,
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
            title: <HeaderCell title="Salle à manger" className="whitespace-nowrap" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "dining_room"} />,
            dataIndex: "dining_room",
            key: "dining_room",
            onHeaderCell: () => onHeaderCellClick("dining_room"),
            render: (dining_room: any) => (
                <div className="whitespace-nowrap">
                    {dining_room}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Séjour" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "living_room"} />,
            dataIndex: "living_room",
            key: "living_room",
            onHeaderCell: () => onHeaderCellClick("living_room"),
            render: (living_room: any) => (
                <div className="whitespace-nowrap">
                    {living_room}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Chambre" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "bedroom"} />,
            dataIndex: "bedroom",
            key: "bedroom",
            onHeaderCell: () => onHeaderCellClick("bedroom"),
            render: (bedroom: any) => (
                <div className="whitespace-nowrap">
                    {bedroom}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Cuisine" sortable
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "kitchen"} />,
            dataIndex: "kitchen",
            key: "kitchen",
            onHeaderCell: () => onHeaderCellClick("kitchen"),
            render: (kitchen: any) => (
                <div className="whitespace-nowrap">
                    {kitchen}
                </div>
            ),
        },
        {
            title: <HeaderCell title="Salle de bain" sortable className="whitespace-nowrap"
                ascending={sortConfig?.direction === "asc" && sortConfig?.key === "bath_room"} />,
            dataIndex: "bath_room",
            key: "bath_room",
            onHeaderCell: () => onHeaderCellClick("bath_room"),
            render: (bath_room: any) => (
                <div className="whitespace-nowrap">
                    {bath_room}
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
                    <ShowAccommodationModal accommodation={row} modalState={options.modalState} setModalState={options.setModalState} />
                    <ActionIcon onClick={() => options.setModalState({ id: row.id, open: true, type: "show" })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEye className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon onClick={() => options.setModalState({ id: row.id, open: true, type: "edit" })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEdit className="h-4 w-4" />
                    </ActionIcon>
                    <UpdateAccommodationModal accommodation={row} {...options} />
                    <DeletePopover onDelete={() => options.delete(row.id)} />
                </div>
            ),
        }
    ];
