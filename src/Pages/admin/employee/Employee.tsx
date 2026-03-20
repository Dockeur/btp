import { getColumns } from '@/components/admin/tables/employee/columns';
import AddEmployeeModal from '@/components/admin/ui/employee/AddEmployeeModal';
import Title from '@/components/admin/ui/Title';
import BaseTable from '@/components/admin/ui/table/table-layout';
import { deleteEmployee, getEmployees } from '@/services/EmployeeService';
import { getRoles } from '@/services/RoleService';
import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Employee = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalState, setModalState] = useState(false);
    const [roles, setRoles] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const onDeleteEmployee = useCallback(async (id: any) => {
        try {
            toast.promise(deleteEmployee(id), {
                pending: "Suppression de l'employé d'id : " + id + " ...",
                success: {
                    render() {
                        setRefresh(!refresh)
                        return "Employé supprimé avec succès"
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
        const getE = async () => {
            const res = await getEmployees()
            setEmployees(res.data)
            setLoading(false)
        }
        const getR = async () => {
            const res = await getRoles()
            setRoles(res.data)
        }

        getR()
        getE()
    }, [refresh])
    return (
        <div className="flex flex-wrap gap-8 p-4">
            <Title title="Gestion des employées" links={[{ title: 'Admin', url: '/admin' }, { title: 'Employés' }]} />
            <div className="p-4 rounded-lg bg-white space-y-5 w-full dark:bg-neutral-900">
                <div className="flex justify-end gap-4 font-bold">
                    <button onClick={() => setModalState(true)} className='bg-yellow-500 font-semibold p-2 rounded text-white flex gap-2 items-center'>
                        <FiPlus />
                        <span>
                            Ajouter
                        </span>
                    </button>
                    <AddEmployeeModal refresh={refresh} setRefresh={setRefresh} roles={roles} modalState={modalState} setModalState={setModalState} />
                </div>
                <BaseTable data={employees} options={{ delete: onDeleteEmployee }} getColumns={getColumns} loading={loading} />
            </div>
        </div>
    )
}

export default Employee