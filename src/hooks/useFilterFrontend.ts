import { useEffect, useMemo, useState } from "react";

export const useFilterFrontend = <T>(initialData: any, countPerPage: number = 10) => {

    const [data, setData] = useState(initialData);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const paginatedData = (data: T[] = filteredData) => {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        if (data.length > start) return data.slice(start, end);
        return data;
    };

    const handlePaginate = (page: number) => {
        setCurrentPage(page);
    };

    const handlePriceFilter = (min: number | null = null, max: number | null = null) => {
        setMinPrice(min);
        setMaxPrice(max);
    };
    const handleLocationFilter = (location: string) => {
        setLocation(location);
    };
    const handleStatusFilter = (status: string) => {
        setStatus(status);
    };
    const filteredData = useMemo(() => {
        return data
            .filter((item: any) => {
                if (minPrice && maxPrice) {
                    return Number(item.unit_price) >= minPrice && Number(item.unit_price) <= maxPrice;
                } else if (minPrice && !maxPrice) {
                    return Number(item.unit_price) >= minPrice;
                } else if (!minPrice && maxPrice) {
                    return Number(item.unit_price) <= maxPrice;
                } else {
                    return true;
                }
            })
            .filter((item: any) => {
                if (location === "") return true;
                return item.productable?.location?.address?.city.toLowerCase() === location.toLowerCase()
            })
            .filter((item: any) => {
                if (status === "") return true;
                const statusValue = item.for_sale ? "vendre" : "louer";
                return statusValue === status;
            });
    }, [data, minPrice, maxPrice, location, status]);

    const totalItems = filteredData.length;

    const tableData = paginatedData();

    return {
        tableData,
        minPrice,
        maxPrice,
        location,
        status,
        filteredData,
        totalItems,
        currentPage,
        handlePriceFilter,
        handleLocationFilter,
        handleStatusFilter,
        handlePaginate,
    };
};