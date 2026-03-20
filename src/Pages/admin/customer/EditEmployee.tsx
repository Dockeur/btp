import Loading from '@/components/admin/ui/Loading'
import Title from '@/components/admin/ui/Title'
import UpdatePassword from '@/components/admin/ui/UpdatePassword'
import UpdateEmployee from '@/components/admin/ui/employee/UpdateEmployee'
import { routes } from '@/routes'
import { getEmployee } from '@/services/EmployeeService'
import { getRoles } from '@/services/RoleService'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EditEmployee = () => {
    const [employee, setEmployee] = useState<any>(null)
    const [roles, setRoles] = useState([]);

    const employeeId = useParams().id

    useEffect(() => {
        const getE = async () => {
            const res = await getEmployee(employeeId)
            setEmployee(res.data)
        }
        const getR = async () => {
            const res = await getRoles()
            setRoles(res.data)
        }

        getR()
        getE()
    }, [])
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Modification de l'employé" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Employés', url: routes.admin.employees.path }, { title: 'Éditer' }]} />
            {employee ? (
                <>
                    <UpdateEmployee employee={employee} roles={roles} />
                    <UpdatePassword data={employee} />
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default EditEmployee