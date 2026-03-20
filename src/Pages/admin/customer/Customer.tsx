import { getColumns } from '@/components/admin/tables/customer/columns';
import Title from '@/components/admin/ui/Title';
import AddCustomerModal from '@/components/admin/ui/customer/AddCustomerModal';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { deleteCustomer, getCustomers } from '@/services/CustomerService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Customer = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalState, setModalState] = useState(false);
    const [refresh, setRefresh] = useState(false)

    const onDeleteCustomer = useCallback(async (id: any) => {
        try {
            toast.promise(deleteCustomer(id), {
                pending: "Suppression du client d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Client supprimé avec succès"
                    }
                },
                error: {
                    render(error: any) {
                        return "Une erreur est survenue"
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, [refresh])

    useEffect(() => {
        const getC = async () => {
            const res = await getCustomers()
            setCustomers(res.data)
            setLoading(false)
        }
        getC()
    }, [refresh])
    
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des clients" links={[{ title: 'Admin', url: '/admin' }, { title: 'Clients' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => setModalState(true)} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddCustomerModal refresh={refresh} setRefresh={setRefresh} modalState={modalState} setModalState={setModalState} />
                </div>
                <BaseTable data={customers} options={{ delete: onDeleteCustomer }} getColumns={getColumns} loading={loading} />
            </div>
        </div>
    )
}

export default Customer