import { getColumns } from '@/components/admin/tables/role/column';
import Title from '@/components/admin/ui/Title';
import AddRoleModal from '@/components/admin/ui/role/AddRoleModal';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { deleteRole, getPermissions, getRoles } from '@/services/RoleService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Role = () => {
    const [loading, setLoading] = useState(true)
    const [modalState, setModalState] = useState({ open: false, id: 0 });
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const onDeleteRole = useCallback(async (id: any) => {
        try {
            toast.promise(deleteRole(id), {
                pending: "Suppression du role d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Role supprimé avec succès"
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
        const getR = async () => {
            const res = await getRoles()
            setRoles(res.data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
            setLoading(false)
        }

        const getP = async () => {
            const res = await getPermissions()
            setPermissions(res.data)
        }

        getP()
        getR()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des roles" links={[{ title: 'Admin', url: '/admin' }, { title: 'Roles' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => setModalState({ open: true, id: 0 })} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddRoleModal refresh={refresh} setRefresh={setRefresh} permissions={permissions} modalState={modalState} setModalState={setModalState} />
                </div>
                <BaseTable data={roles} options={{ delete: onDeleteRole, permissions, modalState, setModalState, setRefresh, refresh }} getColumns={getColumns} loading={loading} />
            </div>
        </div>
    )
}

export default Role