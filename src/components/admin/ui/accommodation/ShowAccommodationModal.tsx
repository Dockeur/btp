import React from 'react';
import { MdLiving, MdRoom } from 'react-icons/md';
import { RiCloseFill } from 'react-icons/ri';
import { ActionIcon, Modal, Text } from 'rizzui';

const ShowAccommodationModal = ({ accommodation, modalState, setModalState }: any) => {

    return (
        <>
            <Modal isOpen={modalState.open && modalState.id === accommodation.id && modalState.type === "show"} onClose={() => setModalState({ id: accommodation.id, open: false, type: "show" })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Voir un logement</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: accommodation.id, open: false, type: "show" })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>
                    <div className="flex flex-col gap-8">
                        <span className='flex justify-between w-full'>
                            <span><span className='font-semibold'>Reference : </span>{accommodation.reference ?? "Non renseigné"}</span>
                            <span><span className='font-semibold'>Type : </span>{accommodation.type ?? "Non renseigné"}</span>
                        </span>
                        <span>
                            {accommodation.description ?? "Non renseigné"}
                        </span>
                        <ul className="grid grid-cols-2 gap-2 list-inside list-disc font-semibold">
                            <li>({accommodation.living_room}) Séjour(s)</li>
                            <li>({accommodation.dining_room}) Salle(s) à manger</li>
                            <li>({accommodation.kitchen}) Cuisine(s)</li>
                            <li>({accommodation.bedroom}) Chambre(s)</li>
                            <li>({accommodation.bath_room}) Salle(s) de bain</li>
                        </ul>
                        <div className="flex gap-4 flex-wrap">
                            {accommodation.images.map((image: any, index: number) => <img key={index} src={image} className="w-36 h-36 rounded-lg" />)}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ShowAccommodationModal