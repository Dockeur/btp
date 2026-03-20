import { getColumns } from '@/components/admin/tables/land/columns';
import Title from '@/components/admin/ui/Title';
import AddLandModal from '@/components/admin/ui/land/AddLandModal';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { deleteLand, getLands } from '@/services/LandService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Land = () => {
    const [lands, setLands] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ open: false, id: 0, type: "create" })
    const onDeleteLand = useCallback(async (id: any) => {
        try {
            toast.promise(deleteLand(id), {
                pending: "Suppression du terrain d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Terrain supprimé avec succès"
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
        const getL = async () => {
            setLoading(true)
            try {
                const res = await getLands()
                setLands(res.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
            } catch (error) {
                console.log(error)
                toast.error("Une erreur est survenue lors du chargement des terrains")
            } finally {
                setLoading(false)
            }
        }

        getL()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des terrains" links={[{ title: 'Admin', url: '/admin' }, { title: 'Terrains' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => setModalState({ open: true, id: 0, type: "create" })} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddLandModal modalState={modalState} setModalState={setModalState} refresh={refresh} setRefresh={setRefresh} />
                </div>
                <BaseTable data={lands} options={{ delete: onDeleteLand, modalState, setModalState, setRefresh, refresh }} getColumns={getColumns} loading={loading} />
            </div>
        </div >
    )
}

export default Land