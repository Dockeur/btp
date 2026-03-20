import React from 'react'
import Breadcrumb from './Breadcrumb'

const Title = ({ title, links }: { title: string, links: any[] }) => {
    return (
        <div className='flex justify-between w-full items-center flex-wrap gap-2'>
            <h1 className='text-xl font-semibold'>{title}</h1>
            <Breadcrumb links={links} />
        </div>
    )
}

export default Title