import { getColumns } from '@/components/admin/tables/order/columns';
import AddOrderModal from '@/components/admin/ui/Order/AddOrderModal';
import Title from '@/components/admin/ui/Title';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { getCustomers } from '@/services/CustomerService';
import { deleteOrder, getOrders } from '@/services/OrderService';
import { getProducts } from '@/services/ProductService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const resOrders = await getOrders()
                setOrders(resOrders.data ?? [])
                const resProducts = await getProducts()
                setProducts(resProducts.data ?? [])
                const resCustomers = await getCustomers()
                setCustomers(resCustomers.data ?? [])
            } catch (error) {
                console.log(error)
                toast.error("Une erreur est survenue lors du chargement des commandes")
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [refresh])

    const [modalState, setModalState] = useState({ open: false, id: 0, type: "create" })
    const onDeleteOrder = useCallback(async (id: any) => {
        try {
            toast.promise(deleteOrder(id), {
                pending: "Suppression de la commande d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Commande supprimée avec succès"
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
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des produits" links={[{ title: 'Admin', url: '/admin' }, { title: 'Produits' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => {
                        setModalState({ open: true, id: 0, type: "create" })
                    }} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddOrderModal products={products} customers={customers} modalState={modalState} setModalState={setModalState} refresh={refresh} setRefresh={setRefresh} />
                </div>
                <BaseTable data={orders} options={{ delete: onDeleteOrder, customers, products, modalState, setModalState, setRefresh, refresh }} getColumns={getColumns} loading={loading} />
            </div>
        </div >
    )
}

export default Order