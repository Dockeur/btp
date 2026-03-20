import { useState, useEffect, useMemo } from 'react';
// import isString from 'lodash/isString';

interface AnyObject {
    [key: string]: any;
}

export function useTable<T extends AnyObject>(
    initialData: T[],
    countPerPage: number = 10,
) {
    const [data, setData] = useState(initialData);
    /*
     * Dummy loading state.
     */
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
        setData(initialData);
    }, [initialData]);
    /*
     * Handle row selection
     */
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const handleRowSelect = (recordKey: string) => {
        const selectedKeys = [...selectedRowKeys];
        if (selectedKeys.includes(recordKey)) {
            setSelectedRowKeys(selectedKeys.filter((key) => key !== recordKey));
        } else {
            setSelectedRowKeys([...selectedKeys, recordKey]);
        }
    };
    const handleSelectAll = () => {
        if (selectedRowKeys.length === data.length) {
            setSelectedRowKeys([]);
        } else {
            setSelectedRowKeys(data.map((record) => record.id));
        }
    };

    /*
     * Handle sorting
     */
    const [sortConfig, setSortConfig] = useState<AnyObject>({
        key: null,
        direction: null,
    });

    function sortData(data: T[], sortKey: string, sortDirection: string) {
        return [...data].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            } else if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const sortedData = useMemo(() => {
        let newData = data;
        if (!sortConfig.key) {
            return newData;
        }
        return sortData(newData, sortConfig.key, sortConfig.direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortConfig, data]);

    function handleSort(key: string) {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }

    /*
     * Handle pagination
     */
    const [currentPage, setCurrentPage] = useState(1);
    function paginatedData(data: T[] = sortedData) {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;

        if (data.length > start) return data.slice(start, end);
        return data;
    }



    function handlePaginate(pageNumber: number) {
        setCurrentPage(pageNumber);
    }

    /*
     * Handle delete
     */
    function handleDelete(id: string | string[]) {
        const updatedData = Array.isArray(id)
            ? data.filter((item) => !id.includes(item.id))
            : data.filter((item) => item.id !== id);

        setData(updatedData);
    }



    /*
     * Handle Filters and searching
     */
    const [searchTerm, setSearchTerm] = useState('');

    /*
     * Handle searching
     */
    function handleSearch(searchValue: string) {
        setSearchTerm(searchValue);
    }

    function searchedData() {
        if (!searchTerm) return sortedData;

        const searchTermLower = searchTerm.toLowerCase();

        return sortedData.filter((item) =>
            Object.values(item).some((value) =>
                typeof value === 'object'
                    ? value &&
                    Object.values(value).some(
                        (nestedItem) =>
                            nestedItem &&
                            String(nestedItem).toLowerCase().includes(searchTermLower)
                    )
                    : value && String(value).toLowerCase().includes(searchTermLower)
            )
        );
    }

    /*
     * Reset search and filters
     */
    function handleReset() {
        setData(() => initialData);
        handleSearch('');
    }

    /*
     * Set isFiltered and final filtered data
     */
    function calculateTotalItems() {
        if (searchTerm) {
            return searchedData().length;
        }
        return sortedData.length;
    }
    const tableData = paginatedData(searchedData());

    /*
     * Go to first page when data is filtered and searched
     */
    useEffect(() => {
        handlePaginate(1);
    }, [searchTerm]);

    // useTable returns
    return {
        isLoading,
        tableData,
        // pagination
        currentPage,
        handlePaginate,
        totalItems: calculateTotalItems(),
        // sorting
        sortConfig,
        handleSort,
        // row selection
        selectedRowKeys,
        setSelectedRowKeys,
        handleRowSelect,
        handleSelectAll,
        // searching
        searchTerm,
        handleSearch,

        handleDelete,
        handleReset,
    };
}
