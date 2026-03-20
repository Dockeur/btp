import React from 'react'
import { Loader } from 'rizzui'

const Loading = () => {
    return (
        <div className="w-full h-96 gap-5 flex items-center justify-center">
            <span className="text-xl">Chargement</span>
            <Loader size="xl" variant="threeDot" />
        </div>
    )
}

export default Loading