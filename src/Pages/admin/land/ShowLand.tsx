import Loading from "@/components/admin/ui/Loading";
import Title from "@/components/admin/ui/Title";
import { routes } from "@/routes";
import { getLand } from "@/services/LandService";
import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from "react-icons/fi";
import { MdLocationPin } from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge, cn } from "rizzui";
import { PropertyImage } from "../property/ShowProperty";


function LandDetail(props: any) {
    return (<div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
        <div className='py-4 px-4'>
            <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Détails</span>
        </div>
        <div className='p-4 grid grid-cols-2 gap-4'>
            <span><span className='dark:text-white text-black font-bold'>Titre Foncier : </span>{props.land.land_title}</span>
            <span><span className='dark:text-white text-black font-bold'>Surface : </span>{props.land.area} M²</span>
            <span><span className='dark:text-white text-black font-bold'>Relief : </span>{props.land.relief}</span>
            <span className='inline-flex gap-4 items-center'><span className='dark:text-white text-black font-bold'>Fragmentable : </span>{props.land.is_fragmentable ? <FiCheckCircle className='text-green text-xl' /> : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}</span>
            <span className='inline-flex gap-4 items-center'><span className='dark:text-white text-black font-bold'>Certificat de propriété : </span>{props.land.certificat_of_ownership ? <FiCheckCircle className='text-green text-xl' /> : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}</span>
            <span className='inline-flex gap-4 items-center'><span className='dark:text-white text-black font-bold'>Document technique : </span>{props.land.technical_doc ? <FiCheckCircle className='text-green text-xl' /> : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}</span>
            <span className='col-span-2'><span className='dark:text-white text-black font-bold'>Adresse : </span>{props.land.location.address.street}, {props.land.location.address.city}, {props.land.location.address.country}</span>
            <span className='col-span-2 max-w-96'><span className='dark:text-white text-black font-bold'>Description : </span>{props.land.description}</span>
            <span className='inline-flex gap-4'><span className='dark:text-white text-black font-bold'>Géolocalisation : </span><Link className='underline text-blue-600' to={props.land.location.coordinate_link}><MdLocationPin className="text-2xl" /></Link></span>
            <span className={cn('col-span-2 flex gap-2 items-center flex-wrap', props.land.is_fragmentable ? '' : 'hidden')}><span className='dark:text-white text-black font-bold'>Fragments : </span>{props.land.fragments.map((fragment: any) => <Badge key={fragment.id}>{fragment.area} M²</Badge>)}</span>
        </div>
    </div>);
}


const ShowLand = () => {
    const [land, setLand] = useState<any>(null)
    const landId = useParams().id

    useEffect(() => {
        const getL = async () => {
            try {
                const res = await getLand(landId)
                setLand(res.data)
            } catch (error) {
                console.log(error)
                toast.error("Une erreur est survenue lors du chargement du terrain")
            }
        }
        getL()
    }, [])
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Détail du terrain" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Terrains', url: routes.admin.lands.path }, { title: 'Détail' }]} />
            {land ? (
                <>
                    <LandDetail land={land}></LandDetail>
                    <PropertyImage length={land.images.length} images={land.images}></PropertyImage>
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default ShowLand