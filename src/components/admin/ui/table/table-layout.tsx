import { useColumn } from "@/hooks/useColumn";
import { useTable } from "@/hooks/useTable";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button, Input, Popover, Select, Text, Title } from "rizzui";
import Pagination from "../../ui/table/pagination";
import Table from "../table/index";
import { ToggleColumns } from "./index";

const paginationLimitOptions = [1, 2, 5, 10, 25, 50, 100].map((v) => ({
    label: String(v),
    value: v,
}));

export default function BaseTable({ data, getColumns, options = null, loading = false }: any) {
    // New add
    const [pageSize, setPageSize] = useState(5);
    const onHeaderCellClick = (value: string) => ({
        onClick: () => {
            handleSort(value);
        },
    });

    const onDeleteItem = (id: string) => {
        handleDelete(id);
    };

    const {
        // isLoading,
        sortConfig,
        totalItems,
        tableData,
        currentPage,
        searchTerm,
        handleSort,
        handleDelete,
        handleSearch,
        handlePaginate,
        selectedRowKeys,
        setSelectedRowKeys,
        handleRowSelect,
        handleSelectAll,
    } = useTable(data, pageSize);

    const columns = React.useMemo(
        () =>
            getColumns({
                data,
                sortConfig,
                onHeaderCellClick,
                onDeleteItem,
                checkedItems: selectedRowKeys,
                onChecked: handleRowSelect,
                handleSelectAll,
                options
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            selectedRowKeys,
            onHeaderCellClick,
            sortConfig.key,
            sortConfig.direction,
            onDeleteItem,
            handleRowSelect,
            handleSelectAll,
        ]
    );
    const { visibleColumns, checkedColumns, setCheckedColumns } = useColumn(columns);

    const handleDeleteSelected = () => {
        selectedRowKeys.forEach((id) => {
            options?.delete(id);
        });
        setSelectedRowKeys([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <Input type="search" value={searchTerm} clearable={true} onClear={() => handleSearch("")} onChange={(e) => handleSearch(e.target.value)} className="w-auto" prefix={<FaSearch />} inputClassName="text-sm dark:border-slate-600 ring-0" placeholder="Rechercher à partir de ..." />
                <ToggleColumns columns={columns} checkedColumns={checkedColumns}
                    setCheckedColumns={setCheckedColumns}
                />
            </div>
            <Table data={tableData} loading={loading} columns={visibleColumns} className="text-sm" variant="modern" />
            {selectedRowKeys.length > 0 && <div className="flex justify-between items-center bg-yellow-500 text-white px-4 py-2 font-bold mt-4">
                <span>Éléments sélectionnés : {selectedRowKeys.length}</span>
                <Popover placement="left" enableOverlay arrowClassName="dark:fill-neutral-900">
                    <Popover.Trigger>
                        <Button>Supprimer</Button>
                    </Popover.Trigger>
                    <Popover.Content className="dark:bg-neutral-900 dark:border-none" >
                        {({ setOpen }) => (
                            <div className="w-64 dark:bg-neutral-900 dark:text-white">
                                <Title as="h5">Supprimer {selectedRowKeys.length} éléments</Title>
                                <Text className="w-full">Êtes-vous sûr de vouloir supprimer ces éléments ?</Text>
                                <div className="flex justify-end gap-3 mb-1">
                                    <Button className="dark:border-slate-600" size="sm" onClick={() => setOpen(false)} variant="outline">
                                        Non
                                    </Button>
                                    <Button onClick={() => { setOpen(false); handleDeleteSelected() }} size="sm">
                                        Oui
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Popover.Content>
                </Popover >
            </div>}
            <div className="flex justify-between">
                <Select value={pageSize} onChange={(e: any) => setPageSize(e.value)}
                    options={paginationLimitOptions}
                    className="w-auto [&_.rizzui-select-button]:h-8 [&_.rizzui-select-value]:pe-2 [&_.rizzui-select-button]:text-sm [&_.rizzui-select-button>span>svg]:h-3 [&_.rizzui-select-button>span>svg]:w-3"
                    selectClassName="px-2 dark:border-slate-600 ring-0 py-0"
                    dropdownClassName="shadow-lg dark:bg-neutral-900 dark:border-slate-600"
                    optionClassName="text-sm px-1 dark:hover:bg-neutral-800 dark:[&>div]:text-slate-500 group dark:bg-transparent dark:hover:[&>div]:text-white" />
                <Pagination showLessItems={true} current={currentPage} pageSize={pageSize} defaultCurrent={1} onChange={(page) => handlePaginate(page)} total={totalItems} />
            </div>
        </div >
    );
}