import React from "react";
import Table from "rc-table";
import { ActionIcon, Checkbox, CheckboxGroup, Empty, Loader, Popover, Title, cn } from "rizzui";
import { addSpacesToCamelCase } from "@/utils/add-spaces-to-camel-case";
import { PiTextColumns } from "react-icons/pi";

export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : T;

const tableStyles = {
    table:
        '[&_.rc-table-content]:overflow-x-auto [&_table]:borde dark:[&_table]:border-slate-600 [&_table]:w-full dark:[&_.rc-table-row:hover]:bg-neutral-800/40 dark:[&_.rc-table-row:hover]:text-white [&_.rc-table-row:hover]:bg-gray-50 [&_.rc-table-row-expand-icon-cell]:w-14',
    thead:
        '[&_thead]:text-left [&_thead]:rtl:text-right [&_th.rc-table-cell]:uppercase [&_th.rc-table-cell]:text-xs [&_th.rc-table-cell]:font-semibold [&_th.rc-table-cell]:tracking-wider [&_th.rc-table-cell]:text-gray-500',
    tCell:
        '[&_.rc-table-cell]:px-3 [&_th.rc-table-cell]:py-3 [&_td.rc-table-cell]:py-4',
    variants: {
        classic:
            '[&_thead]:bg-gray-100 [&_.rc-table-container]:border-x [&_.rc-table-container]:border-gray-200/70 [&_td.rc-table-cell]:border-b [&_td.rc-table-cell]:border-gray-200/70 [&_thead]:border-y [&_thead]:border-gray-200/70',
        modern:
            '[&_thead_th]:bg-gray-100 dark:[&_thead_th]:bg-neutral-800 dark:[&_th.rc-table-cell]:text-white [&_td.rc-table-cell]:border-b [&_td.rc-table-cell]:border-gray-200/70 dark:[&_td.rc-table-cell]:border-slate-700 [&_thead_.rc-table-row-expand-icon-cell]:bg-gray-100',
        minimal:
            '[&_thead_th]:bg-gray-100 [&_thead_th:first-child]:rounded-ss-lg [&_thead_th:first-child]:rounded-es-lg [&_thead_th:last-child]:rounded-se-lg [&_thead_th:last-child]:rounded-ee-lg [&_thead_.rc-table-row-expand-icon-cell]:bg-gray-100',
        elegant:
            '[&_thead]:border-y [&_thead]:border-gray-200/70 [&_td.rc-table-cell]:border-b [&_td.rc-table-cell]:border-gray-200/70',
        retro:
            '[&_thead]:border-y [&_thead]:border-gray-200/70 [&_tbody_tr:last-child_td.rc-table-cell]:border-b [&_tbody_tr:last-child_td.rc-table-cell]:border-gray-200/70',
    },
    striped:
        '[&_.rc-table-row:nth-child(2n)_.rc-table-cell]:bg-gray-100/50 [&_.rc-table-row:hover]:bg-transparent',
};

type RCTableProps = ExtractProps<typeof Table>;

export interface TableProps
    extends Omit<RCTableProps, "className" | "emptyText"> {
    emptyText?: React.ReactElement;
    variant?: keyof typeof tableStyles.variants;
    striped?: boolean;
    className?: string;
    loading?: boolean;
}

export default function RcTable({
    striped,
    variant = "modern",
    emptyText,
    className,
    loading,
    ...props
}: TableProps) {
    return (
        <Table
            className={cn(
                tableStyles.table,
                tableStyles.thead,
                tableStyles.tCell,
                tableStyles.variants[variant],
                striped && tableStyles.striped,
                className
            )}
            emptyText={loading ? (
                <div className="w-full h-48 gap-5 flex items-center justify-center">
                    <span className="text-xl">Chargement</span>
                    <Loader size="xl" variant="threeDot" />
                </div>
            ) : <Empty text="Aucune donnée" textClassName="text-lg mt-5" imageClassName="" />}
            {...props}
        />
    );
}

RcTable.displayName = "Table";

type ToggleColumnsTypes<T> = {
    columns: T[];
    checkedColumns: string[];
    setCheckedColumns: React.Dispatch<React.SetStateAction<string[]>>;
    hideIndex?: number;
};

export function ToggleColumns<T>({
    columns,
    checkedColumns,
    setCheckedColumns,
    hideIndex,
}: ToggleColumnsTypes<T>) {
    return (
        <div className="">
            <Popover
                shadow="sm"
                placement="bottom-end"
                arrowClassName="dark:fill-neutral-900 dark:stroke-slate-600"
            >
                <Popover.Trigger>
                    <ActionIcon variant="outline" className="dark:border-slate-600" title={'Toggle Columns'}>
                        <PiTextColumns strokeWidth={3} className="h-6 w-6" />
                    </ActionIcon>
                </Popover.Trigger>
                <Popover.Content className="dark:bg-neutral-900 dark:border-slate-600">
                    <div className="dark:bg-neutral-900 dark:text-white px-0.5 pt-2 text-left rtl:text-right">
                        <Title as="h6" className="mb-1 px-0.5 text-sm font-semibold">
                            Masquer/Afficher les colonnes
                        </Title>
                        <CheckboxGroup
                            values={checkedColumns}
                            setValues={setCheckedColumns}
                            className="grid grid-cols-2 gap-x-6 gap-y-5 px-1.5 pb-3.5 pt-4"
                        >
                            {columns.map((column: any, index) => (
                                <Checkbox
                                    size="sm"
                                    key={column.dataIndex}
                                    value={column.dataIndex}
                                    label={addSpacesToCamelCase(column.dataIndex)}
                                    labelClassName="ml-2 rtl:mr-2 text-[13px] font-medium"
                                    helperClassName="cursor-pointer capitalize"
                                    // iconClassName="text-white stroke-2"
                                    inputClassName="checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white"
                                    className={cn(
                                        hideIndex && index === hideIndex ? 'hidden' : ''
                                    )}
                                />
                            ))}
                        </CheckboxGroup>
                    </div>
                </Popover.Content>
            </Popover>
        </div>
    );
}
