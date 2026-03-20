import DeletePopover from '@/components/admin/ui/DeletePopover'
import Loading from '@/components/admin/ui/Loading'
import Title from '@/components/admin/ui/Title'
import AddAccommodationModal from '@/components/admin/ui/accommodation/AddAccommodationModal'
import ShowAccommodationModal from '@/components/admin/ui/accommodation/ShowAccommodationModal'
import UpdateAccommodationModal from '@/components/admin/ui/accommodation/UpdateAccommodationModal'
import { routes } from '@/routes'
import { deleteAccommodation } from '@/services/AccommodationService'
import { getProperties, getProperty } from '@/services/PropertyService'
import { PropertyType } from '@/types'
import React, { useCallback, useEffect, useState } from 'react'
import { FiCheckCircle, FiEdit, FiEye, FiPlus } from 'react-icons/fi'
import { MdLocationPin } from 'react-icons/md'
import { RiCheckboxBlankCircleLine } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ActionIcon } from 'rizzui'



function RetailSpace(props: any) {
    return (<div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
        <div className='py-4 px-4'>
            <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Espaces commerciaux</span>
        </div>
        <div className='flex flex-col gap-2 p-4 max-h-72 overflow-auto'>
            {props.length ? props.retail_spaces.map((retail_space: any) => <div key={retail_space.id} className='flex justify-between items-center'>
                <span className='dark:text-white text-black font-bold capitalize'> {retail_space.type}</span>
                {
                    /* <ShowAccommodationModal accommodation={accommodation} modalState={modalState} setModalState={setModalState} /> */
                }
                <ActionIcon onClick={() => props.setModalState({
                    id: retail_space.id,
                    open: true,
                    type: "show"
                })} variant="outline" className="cursor-pointer dark:border-slate-600">
                    <FiEye className="h-4 w-4" />
                </ActionIcon>
            </div>) : <div className='w-full text-center text-xl py-14'>Aucun espace commercial</div>}
        </div>
    </div>);
}



function PropertyDetail(props: any) {
    return (<div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
        <div className='py-4 px-4'>
            <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Détails</span>
        </div>
        <div className='p-4 grid grid-cols-2 gap-4'>
            <span><span className='dark:text-white text-black font-bold'>Titre : </span>{props.property.title}</span>
            <span><span className='dark:text-white text-black font-bold'>Terrain : </span>{props.property.field_area} M²</span>
            <span><span className='dark:text-white text-black font-bold'>Surface bâti : </span>{props.property.build_area} M²</span>
            <span><span className='dark:text-white text-black font-bold'>Rez de chaussé : </span>{props.property.basement_area} M²</span>
            <span><span className='dark:text-white text-black font-bold'>Sous sol : </span>{props.property.ground_floor_area} M²</span>
            <span><span className='dark:text-white text-black font-bold'>Niveaux : </span>{props.property.levels}</span>
            <span><span className='dark:text-white text-black font-bold'>Type : </span>{props.property.type}</span>
            <span><span className='dark:text-white text-black font-bold'>Parkings : </span>{props.property.parkings}</span>
            <span className='inline-flex gap-4 items-center'><span className='dark:text-white text-black font-bold'>Piscine : </span>{props.property.has_pool ? <FiCheckCircle className='text-green text-xl' /> : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}</span>
            <span className='inline-flex gap-4 items-center'><span className='dark:text-white text-black font-bold'>Jardin : </span>{props.property.has_garden ? <FiCheckCircle className='text-green text-xl' /> : <RiCheckboxBlankCircleLine className='text-red text-2xl' />}</span>
            <span className='col-span-2'><span className='dark:text-white text-black font-bold'>Adresse : </span>{props.property.location.address.street}, {props.property.location.address.city}, {props.property.location.address.country}</span>
            <span className='col-span-2 max-w-96'><span className='dark:text-white text-black font-bold'>Description : </span>{props.property.description}</span>
            <span className='inline-flex gap-4'><span className='dark:text-white text-black font-bold'>Géolocalisation : </span><Link className='underline text-blue-600' to={props.property.location.coordinate_link}><MdLocationPin className="text-2xl" /></Link></span>
        </div>
    </div>);
}



export function PropertyImage(props: any) {
    return (<div className="rounded-lg max-lg:w-full lg:min-w-96 lg:max-w-xl self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
        <div className='py-4 px-4'>
            <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Images</span>
        </div>
        <div className='p-4 flex flex-wrap gap-2'>
            {props.length ? props.images.map((image: any, index: number) => <img key={index} src={image} alt="Image" className='w-32 h-32 object-cover rounded-lg' />) : <div className='w-full text-center text-xl py-14'>Aucune image</div>}
        </div>
    </div>);
}



function PropertyAccommodation(props: any) {
    const onDeleteAccommodation = useCallback(async (id: any) => {
        try {
            toast.promise(deleteAccommodation(id), {
                pending: "Suppression du logement d'id : " + id + " ...",
                success: {
                    render() {
                        props.setRefresh(!props.refresh)
                        return "Logement supprimé avec succès"
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
    }, [props.refresh])
    return (<div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
        <div className='py-3 px-4 items-center flex justify-between'>
            <span className='text-lg self-center px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Logements</span>
            <ActionIcon onClick={() => props.setModalState({ open: true, id: 0, type: "create" })} variant='outline' className='dark:text-white dark:border-slate-600'><FiPlus /></ActionIcon>
            <AddAccommodationModal refresh={props.refresh} property_id={String(props.property.id)} setRefresh={props.setRefresh} properties={props.properties} modalState={props.modalState} setModalState={props.setModalState} />
        </div>
        <div className='flex flex-col gap-2 p-4 max-h-72 overflow-auto'>
            {props.length ? props.accommodations.map((accommodation: any) => <div key={accommodation.id} className='flex justify-between items-center'>
                <span className='dark:text-white text-black font-bold capitalize'> {accommodation.type} - {accommodation.reference}</span>
                <span className='flex gap-2'>
                    <ShowAccommodationModal accommodation={accommodation} modalState={props.modalState} setModalState={props.setModalState} />
                    <ActionIcon onClick={() => props.setModalState({
                        id: accommodation.id,
                        open: true,
                        type: "show"
                    })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEye className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon onClick={() => props.setModalState({ id: accommodation.id, open: true, type: "edit" })} variant="outline" className="cursor-pointer dark:border-slate-600">
                        <FiEdit className="h-4 w-4" />
                    </ActionIcon>
                    <UpdateAccommodationModal accommodation={accommodation} refresh={props.refresh} setRefresh={props.setRefresh} properties={props.properties} modalState={props.modalState} setModalState={props.setModalState} />
                    <DeletePopover onDelete={() => onDeleteAccommodation(accommodation.id)} />
                </span>
            </div>) : <div className='w-full text-center text-xl py-14'>Aucun logement</div>}
        </div>
    </div>);
}


const ShowProperty = () => {
    const [property, setProperty] = useState<PropertyType | null>(null)
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false)
    const propertyId = useParams().id
    const [modalState, setModalState] = useState({ id: 0, open: false, type: "show" })

    useEffect(() => {
        const getP = async () => {
            try {
                const res = await getProperty(propertyId)
                setProperty(res.data)
            } catch (error) {
                console.log(error)
                toast.error("Une erreur est survenue lors du chargement de la propriété")
            }
        }
        const getPs = async () => {
            const res = await getProperties()
            setProperties(res.data)
        }
        getP()
        getPs()
    }, [refresh])
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Détail de la propriété" links={[{ title: 'Admin', url: routes.admin.path }, { title: 'Propriétés', url: routes.admin.properties.path }, { title: 'Détail' }]} />
            {property ? (
                <>
                    <PropertyDetail property={property}></PropertyDetail>
                    <PropertyImage length={property.images.length} images={property.images}></PropertyImage>
                    <PropertyAccommodation properties={properties} refresh={refresh} setRefresh={setRefresh} property={property} length={property.accommodations.length} accommodations={property.accommodations} modalState={modalState} setModalState={setModalState}></PropertyAccommodation>
                    <RetailSpace length={property.retail_spaces.length} retail_spaces={property.retail_spaces} setModalState={setModalState}></RetailSpace>
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}

export default ShowProperty