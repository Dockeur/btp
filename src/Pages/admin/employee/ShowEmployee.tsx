import Activity from '@/components/admin/ui/Activity'
import Loading from '@/components/admin/ui/Loading'
import LoginHistory from '@/components/admin/ui/LoginHistory'
import Title from '@/components/admin/ui/Title'
import { routes } from '@/routes'
import { getEmployee } from '@/services/EmployeeService'
import { formatDate } from '@/utils/format-date'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from 'rizzui'


function ProfileInfo(props: any) {
    return (<div className="flex flex-col gap-4 max-lg:w-full">
        <div className="max-lg:w-full rounded-lg bg-white self-start dark:bg-neutral-900 p-4 max-sm:flex-col lg:max-w-xl flex gap-4 items-center">
            <img src={props.employee.user.profile} alt={props.employee.user.email} className='rounded-full object-cover object-center h-64 w-64' />
            <span className="flex flex-col max-lg:w-full gap-2 font-semibold">
                <span><span className='dark:text-white text-black font-bold'>Noms : </span>{props.employee.first_name + "  " + props.employee.last_name}</span>
                <span><span className='dark:text-white text-black font-bold'>Email : </span>{props.employee.user.email}</span>
                <span><span className='dark:text-white text-black font-bold'>Fonction : </span>{props.employee.position ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Téléphone : </span>{props.employee.phone ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Crée le : </span>{formatDate(new Date(props.employee.created_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                <span><span className='dark:text-white text-black font-bold'>Modifié le : </span>{formatDate(new Date(props.employee.updated_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                <span className='flex gap-2 items-center flex-wrap'><span className='dark:text-white text-black font-bold'>Rôles : </span>{props.employee.user.roles.map((role: any) => <Badge>{role.name}</Badge>)}</span>
            </span>
        </div>
    </div>);
}


const ShowEmployee = () => {
    const [employee, setEmployee] = useState<any>(null)
    const employeeId = useParams().id

    useEffect(() => {
        const getE = async () => {
            const res = await getEmployee(employeeId)
            setEmployee(res.data)
        }
        getE()
    }, [])
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Détail de l'employé" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Employés', url: routes.admin.employees.path }, { title: 'Détail' }]} />
            {employee ? (
                <>
                    <ProfileInfo employee={employee}></ProfileInfo>
                    <LoginHistory auth={employee} />
                    <Activity auth={employee} />
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default ShowEmployee