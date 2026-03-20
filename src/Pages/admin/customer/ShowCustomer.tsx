import Activity from '@/components/admin/ui/Activity'
import Loading from '@/components/admin/ui/Loading'
import LoginHistory from '@/components/admin/ui/LoginHistory'
import Title from '@/components/admin/ui/Title'
import { routes } from '@/routes'
import { getCustomer } from '@/services/CustomerService'
import { formatDate } from '@/utils/format-date'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


function ProfileInfo(props: any) {
    console.log('props ==>', props)
    return (<div className="flex flex-col gap-4 max-lg:w-full">
        <div className="max-lg:w-full rounded-lg bg-white self-start dark:bg-neutral-900 p-4 max-sm:flex-col lg:max-w-xl flex gap-4 items-center">
            {/* <img src={props.customer.user.profile} alt={props.customer.user.email} className='rounded-full object-cover object-center h-64 w-64' /> */}
            <span className="flex flex-col max-lg:w-full gap-2 font-semibold">
                <span><span className='dark:text-white text-black font-bold'>Noms : </span>{props.customer.first_name + "  " + props.customer.last_name}</span>
                {/* <span><span className='dark:text-white text-black font-bold'>Email : </span>{props.customer.user.email}</span> */}
                <span><span className='dark:text-white text-black font-bold'>Téléphone : </span>{props.customer.phone ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Pays : </span>{props.customer?.address?.country ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Ville : </span>{props.customer?.address?.city ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Quartier : </span>{props.customer?.address?.street ?? "Non renseigné"}</span>
                <span><span className='dark:text-white text-black font-bold'>Crée le : </span>{formatDate(new Date(props.customer.created_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                <span><span className='dark:text-white text-black font-bold'>Modifié le : </span>{formatDate(new Date(props.customer.updated_at), 'D MMMM YYYY, HH:mm:ss')}</span>
            </span>
        </div>
    </div>);
}


const ShowCustomer = () => {
    const [customer, setCustomer] = useState<any>(null)
    const customerId = useParams().id

    useEffect(() => {
        const getE = async () => {
            const res = await getCustomer(customerId)
            setCustomer(res.data)
        }
        getE()
    }, [])
    console.log(customer)
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Détail du client" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Clients', url: routes.admin.customers.path }, { title: 'Détail' }]} />
            {customer ? (
                <>
                    <ProfileInfo customer={customer}></ProfileInfo>
                    <LoginHistory auth={customer} />
                    <Activity auth={customer} />
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default ShowCustomer