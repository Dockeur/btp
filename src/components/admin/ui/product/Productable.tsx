import { routes } from '@/routes'
import React from 'react'
import { Link } from 'react-router-dom'
import ShowAccommodationModal from '../accommodation/ShowAccommodationModal'

const Productable = ({ data, type }: any) => {
    const newType = type.split("\\")[2]
    const [modalState, setModalState] = React.useState({ open: false, id: 0, type: "create" })

    switch (newType) {
        case "Property":
            return <Link to={routes.admin.properties.show(data?.id)} className="text-blue-500 hover:underline">
                Propriété #{data?.id}
            </Link>
        case "Retail_space":
            return <div></div>
        case "Accommodation":
            return (
                <>
                    <ShowAccommodationModal accommodation={data} modalState={modalState} setModalState={setModalState} />
                    <button onClick={() => setModalState({ id: data.id, open: true, type: "show" })} className="text-blue-500 hover:underline">
                        Logement #{data.id}
                    </button>
                </>
            )
        case "Land":
            return <Link to={routes.admin.lands.show(data?.id)} className="text-blue-500 hover:underline">
                Terrain #{data?.id}
            </Link>
        default: return <div></div>
    }
}

export default Productable