import React from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ links }: { links: any[] }) => {
    return (
        <div>
            <span className='flex gap-2 text-sm items-center'>
                {links.map((link: any, index: number) => (
                    // <span key={index} className=''>
                    <Link to={link.url} key={index} className='dark:text-white flex gap-2 items-center text-black last-of-type:text-slate-500 dark:last-of-type:text-slate-400'>
                        {link.title}
                        {index < links.length - 1 && <span className='text-slate-500 dark:text-slate-400'><MdOutlineKeyboardDoubleArrowRight /></span>}
                    </Link>
                    // </span>
                ))}
            </span>
        </div>
    )
}

export default Breadcrumb