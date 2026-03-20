import React, { useEffect, useState } from 'react';
import { Radio, Select } from 'rizzui';

export default function FilterComponent({
    handlePriceFilter,
    handleStatusFilter,
    handleLocationFilter,
    maxPrice,
    minPrice,
    status,
    location,
}: any) {
    const locations = ["Douala", "Yaoundé", "Bafoussam", "Maroua", "Bertoua", "Ngaoundére", "Ebolowa", "Garoua", "Buea", "Foumban", "Kumbo", "Edea"];
    const defaultPrices = Array.from({ length: 50 }, (_, i) => i * 50000);
    const rentPrices = Array.from({ length: 50 }, (_, i) => i * 20000);
    const salePrices = Array.from({ length: 50 }, (_, i) => i * 50000);
    const [prices, setPrices] = useState<number[]>(defaultPrices);
    const [minPrices, setMinPrices] = useState<number[]>(prices);
    const [maxPrices, setMaxPrices] = useState<number[]>(prices);
    useEffect(() => {
        const p = status && status === "louer" ? rentPrices : salePrices
        setPrices(p);
        setMinPrices(p)
        setMaxPrices(p)
    }, [status]);

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-2  container">
                <div className="">
                    {/* <div className=" text-white grid grid-cols-2 gap-2 w-full">

                        <div className="inline-flex items-center px-4 py-2  bg-Cprimary rounded-lg ">
                            <Radio
                                label="Vendre"
                                name="status"
                                value="vendre"
                                size="sm"
                                className="w-full"
                                onChange={() => handleStatusFilter("vendre")}
                            />
                        </div>

                        <div className="inline-flex items-center px-4 py-2 bg-Cprimary rounded-lg  ">
                            <Radio
                                label="Louer"
                                name="status"
                                id="batimentRadio"
                                value="louer"
                                size="sm"
                                onChange={() => handleStatusFilter("louer")}
                            />
                        </div>
                    </div> */}
                </div>
                <div className="flex flex-col max-lg:w-full lg:flex-row items-center gap-2 ">
                    {/* <div className="relative max-lg:w-full lg:min-w-48  flex flex-col items-center rounded-md gap-1">
                        <h2 className=" font-semibold text-base text-Cprimary ">
                            Localisation
                        </h2>
                        <Select
                            placeholder="Lieu"
                            clearable
                            onClear={() => handleLocationFilter("")}
                            selectClassName="rounded-lg text-white bg-Csecondary1"
                            options={locations.map((location) => ({
                                label: location,
                                value: location,
                            }))}
                            value={location}
                            onChange={({ value }) => handleLocationFilter(value)} />
                    </div> */}
                    <div className="relative max-lg:w-full lg:min-w-48 flex flex-col items-center rounded-md gap-1">
                        <h2 className="font-semibold text-base text-Cprimary ">
                            Prix min/m²
                        </h2>
                        <Select
                            placeholder="Prix min"
                            clearable
                            onClear={() => handlePriceFilter(null, maxPrice)}
                            selectClassName="rounded-lg text-white bg-Csecondary1"
                            options={minPrices.map((value) => ({
                                label: new Intl.NumberFormat("fr", {
                                    style: "currency",
                                    currency: "XAF",
                                }).format(value),
                                value: String(value),
                            }))}
                            value={minPrice}
                            onChange={({ value }: any) => {
                                handlePriceFilter(Number(value), Number(maxPrice))
                                setMaxPrices(prices.filter((price: number) => price > value))
                            }} />
                    </div>

                    <div className="relative max-lg:w-full lg:min-w-48  flex flex-col items-center rounded-md gap-1">
                        <h2 className=" font-semibold text-base text-Cprimary">
                            Prix max/m²
                        </h2>
                        <Select
                            placeholder="Prix max"
                            clearable
                            onClear={() => handlePriceFilter(minPrice, null)}
                            selectClassName="rounded-lg text-white bg-Csecondary1"
                            options={maxPrices.map((value) => ({
                                label: new Intl.NumberFormat("fr", {
                                    style: "currency",
                                    currency: "XAF",
                                }).format(value),
                                value: String(value),
                            }))}
                            value={maxPrice}
                            onChange={({ value }: any) => {
                                handlePriceFilter(Number(minPrice), Number(value))
                                setMinPrices(prices.filter((price: number) => price < value))
                            }} />
                    </div>
                </div>
            </div>
        </>
    )
}
