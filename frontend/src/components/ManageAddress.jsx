import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoLocation } from "react-icons/io5";
import manageAddress from "../images/manage-addres.png"

export default function ManageAddress() {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1) // Go back to previous page
    }

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#141416]">
                <div className="flex items-center gap-3">
                    <button className="text-white" onClick={handleBack}>
                        <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-semibold">Manage Addresses</h1>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <IoLocation className="w-4 h-4" />
                    <span>Add Address</span>
                </button>
            </div>

            {/* Main Content - Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

                <div className='w-36 h-36 rounded-full overflow-hidden'>
                    <img src={manageAddress} className=' w-full h-full object-cover' />
                </div>

                {/* Empty state text */}
                <div className="text-center">
                    <h2 className="text-white text-lg sm:text-xl font-medium">No addresses added!</h2>
                </div>
            </div>
        </div>
    )
}
