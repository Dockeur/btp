import { getColumns } from '@/components/admin/tables/product/columns';
import Title from '@/components/admin/ui/Title';
import AddProductModal from '@/components/admin/ui/product/AddProductModal';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { getAccommodations } from '@/services/AccommodationService';
import { getLands } from '@/services/LandService';
import { deleteProduct, getProducts } from '@/services/ProductService';
import { getProperties } from '@/services/PropertyService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("property");
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            let responseData = null;
            switch (type) {
                case "property":
                    responseData = await getProperties()
                    break;
                case "land":
                    responseData = await getLands()
                    break;
                case "accommodation":
                    responseData = await getAccommodations()
                    break;
                default:
                    break;
            }
            responseData ? setData(responseData.data) : setData([])
        }

        getData()
    }, [type])

    const [modalState, setModalState] = useState({ open: false, id: 0, type: "create" })
    const onDeleteProduct = useCallback(async (id: any) => {
        try {
            toast.promise(deleteProduct(id), {
                pending: "Suppression du produit d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Produit supprimé avec succès"
                    }
                },
                error: {
                    render() {
                        return "Une erreur est survenue"
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, [refresh])
    useEffect(() => {
        const getP = async () => {
            setLoading(true)
            try {
                const res = await getProducts()
                setProducts(res.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
            } catch (error) {
                console.log(error)
                toast.error("Une erreur est survenue lors du chargement des terrains")
            } finally {
                setLoading(false)
            }
        }

        getP()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des produits" links={[{ title: 'Admin', url: '/admin' }, { title: 'Produits' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => {
                        setModalState({ open: true, id: 0, type: "create" })
                        setType("property")
                    }} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddProductModal data={data} type={type} setType={setType} modalState={modalState} setModalState={setModalState} refresh={refresh} setRefresh={setRefresh} />
                </div>
                <BaseTable data={products} options={{ delete: onDeleteProduct, modalState, setModalState, setRefresh, refresh, data, type, setType }} getColumns={getColumns} loading={loading} />
            </div>
        </div >
    )
}

export default Product