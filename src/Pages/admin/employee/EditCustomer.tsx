import Loading from '@/components/admin/ui/Loading'
import Title from '@/components/admin/ui/Title'
import UpdatePassword from '@/components/admin/ui/UpdatePassword'
import UpdateCustomer from '@/components/admin/ui/customer/UpdateCustomer'
import { routes } from '@/routes'
import { getCustomer } from '@/services/CustomerService'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EditCustomer = () => {
    const [customer, setCustomer] = useState<any>(null)

    const customerId = useParams().id

    useEffect(() => {
        const getE = async () => {
            const res = await getCustomer(customerId)
            setCustomer(res.data)
        }
        getE()
    }, [])
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Modification du client" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Clients', url: routes.admin.customers.path }, { title: 'Éditer' }]} />
            {customer ? (
                <>
                    <UpdateCustomer customer={customer} />
                    <UpdatePassword data={customer} />
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default EditCustomer