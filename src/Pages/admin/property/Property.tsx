import { getColumns } from '@/components/admin/tables/property/columns';
import Title from '@/components/admin/ui/Title';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { routes } from '@/routes';
import { deleteProperty, getProperties } from '@/services/PropertyService';
import { PropertyType } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Property = () => {
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ open: false, id: 0, type: "create" })
    const onDeleteProperty = useCallback(async (id: any) => {
        try {
            toast.promise(deleteProperty(id), {
                pending: "Suppression de la propriété d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Propriété supprimé avec succès"
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
    console.log(properties)
    useEffect(() => {
        const getP = async () => {
            setLoading(true)
            try {
                const res = await getProperties()
                setProperties(res.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getP()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des propriétés" links={[{ title: 'Admin', url: '/admin' }, { title: 'Propriétés' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <Link to={routes.admin.properties.create} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </Link>
                </div>
                <BaseTable data={properties} options={{ delete: onDeleteProperty, modalState, setModalState, setRefresh, refresh }} getColumns={getColumns} loading={loading} />
            </div>
        </div >
    )
}

export default Property