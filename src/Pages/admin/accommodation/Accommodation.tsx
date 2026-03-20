import { getColumns } from '@/components/admin/tables/accommodation/columns';
import Title from '@/components/admin/ui/Title';
import AddAccommodationModal from '@/components/admin/ui/accommodation/AddAccommodationModal';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { deleteAccommodation, getAccommodations } from '@/services/AccommodationService';
import { getProperties } from '@/services/PropertyService';
import React, { useCallback, useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Accommodation = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [properties, setProperties] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ open: false, id: 0, type: "create" })
    const onDeleteAccommodation = useCallback(async (id: any) => {
        try {
            toast.promise(deleteAccommodation(id), {
                pending: "Suppression du logement d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Logement supprimé avec succès"
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
        const getA = async () => {
            setLoading(true)
            const res = await getAccommodations()
            setAccommodations(res.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
            setLoading(false)
        }

        const getP = async () => {
            const res = await getProperties()
            setProperties(res.data)
        }

        getA()
        getP()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des logements" links={[{ title: 'Admin', url: '/admin' }, { title: 'Logements' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => setModalState({ open: true, id: 0, type: "create" })} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddAccommodationModal refresh={refresh} setRefresh={setRefresh} properties={properties} modalState={modalState} setModalState={setModalState} />
                </div>
                <BaseTable data={accommodations} options={{ delete: onDeleteAccommodation, accommodations, properties, modalState, setModalState, setRefresh, refresh }} getColumns={getColumns} loading={loading} />
            </div>
        </div>
    )
}

export default Accommodation