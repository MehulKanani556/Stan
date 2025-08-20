import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoLocation, IoClose, IoTrash, IoPencil } from "react-icons/io5";
import manageAddress from "../images/manage_addres-1.png"

export default function ManageAddress() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Vaibhav Gohil',
            mobile: '+917567058384',
            addressLine1: 'Hirabag, Surat',
            addressLine2: 'Surat, 395006',
            landmark: '',
            pincode: '395006',
            isDefault: true
        }
    ])
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: '',
        isDefault: false
    })

    const handleBack = () => {
        navigate(-1) // Go back to previous page
    }

    const openModal = () => {
        setIsModalOpen(true)
        setEditingAddress(null)
        // Reset form data when opening
        setFormData({
            name: '',
            mobile: '',
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            pincode: '',
            isDefault: false
        })
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsEditModalOpen(false)
        setEditingAddress(null)
    }

    const openEditModal = (address) => {
        setEditingAddress(address)
        setFormData({
            name: address.name,
            mobile: address.mobile.replace('+91', ''),
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            landmark: address.landmark,
            pincode: address.pincode,
            isDefault: address.isDefault
        })
        setIsEditModalOpen(true)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingAddress) {
            // Update existing address
            const updatedAddresses = addresses.map(addr =>
                addr.id === editingAddress.id
                    ? { ...formData, id: addr.id, mobile: `+91${formData.mobile}` }
                    : addr
            )
            setAddresses(updatedAddresses)
        } else {
            // Add new address
            const newAddress = {
                ...formData,
                id: Date.now(),
                mobile: `+91${formData.mobile}`,
                isDefault: formData.isDefault || addresses.length === 0
            }

            // If this is set as default, remove default from others
            let updatedAddresses = [...addresses]
            if (newAddress.isDefault) {
                updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }))
            }

            setAddresses([...updatedAddresses, newAddress])
        }

        closeModal()
    }

    const deleteAddress = (addressId) => {
        const addressToDelete = addresses.find(addr => addr.id === addressId)
        if (addressToDelete.isDefault && addresses.length > 1) {
            // If deleting default address and there are others, make first one default
            const updatedAddresses = addresses
                .filter(addr => addr.id !== addressId)
                .map((addr, index) => ({ ...addr, isDefault: index === 0 }))
            setAddresses(updatedAddresses)
        } else {
            setAddresses(addresses.filter(addr => addr.id !== addressId))
        }
    }

    const setDefaultAddress = (addressId) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        })))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-2 sm:px-4 py-4 bg-black/30 backdrop-blur-xl sticky top-0 z-20 shadow-lg ">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        className="text-white rounded-full hover:bg-white/10 transition-colors touch-manipulation"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide">Manage Addresses</h1>
                </div>
                {/* Add Address Button */}
                <button
                    className="bg-gradient-to-r from-[#621df2] to-[#b191ff] 
             hover:from-[#8354f8] hover:to-[#9f78ff] 
             text-white px-4 sm:px-5 py-2.5 rounded-xl 
             flex items-center gap-2 text-sm font-medium 
             transition-all duration-200 shadow-md hover:shadow-xl"
                    onClick={openModal}
                >
                    <IoLocation className="w-4 h-4" />
                    <span>Add Address</span>
                </button>
            </div>

            {/* Main Content - Address Cards */}
            <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
                {addresses.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                        <div className='w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden mb-3 sm:mb-4 md:mb-6 '>
                            <img src={manageAddress} className='w-full h-full object-cover' alt="Manage Address" />
                        </div>
                        <div className="text-center px-2 max-w-xs sm:max-w-sm">
                            <h2 className="text-white text-sm xs:text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2">No addresses added!</h2>
                            <p className="text-gray-400 text-xs xs:text-sm sm:text-base leading-relaxed">Add your first address to get started</p>
                        </div>
                    </div>
                ) : (
                    // Address cards
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {addresses.map((address) => (
                            <div key={address.id} className="relative group rounded-3xl overflow-hidden">
                                <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 blur-[2px]" />
                                <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl">
                                    {/* Default Ribbon */}
                                    {address.isDefault && (
                                        <div className="pointer-events-none absolute top-0 right-0 w-32 h-24 overflow-hidden">
                                            <div className="absolute right-[-19px] top-[7px]  rotate-45">
                                                <span className="bg-[#621df2] text-white text-[10px] font-semibold tracking-wide px-6 py-1 shadow-lg">Default</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address Content */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="text-[#cfab9d] font-medium text-sm sm:text-base">{address.name}</h3>
                                        <p className="text-white text-sm">{address.addressLine1}</p>
                                        <p className="text-[#7b7b7b] text-sm">{address.addressLine2}</p>
                                        <div className='flex items-center gap-2 justify-between'>
                                            <p className="text-gray-300 text-sm">{address.mobile}</p>
                                            {/* Action Buttons */}
                                            <div className="flex items-center  gap-2 sm:gap-3 ">
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => deleteAddress(address.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-1 sm:p-2.5 rounded transition-colors duration-200"
                                                    aria-label="Delete address"
                                                >
                                                    <IoTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => openEditModal(address)}
                                                    className="bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-1 transition-all duration-200"
                                                >
                                                    <IoPencil className="w-4 h-4" />
                                                    <span className="text-sm">Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Add/Edit Modal */}
            {(isModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                                {editingAddress ? 'Edit Address' : 'Add Address'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Mobile Field */}
                            <div>
                                <label htmlFor="mobile" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Mobile No.
                                </label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange} 
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter mobile number"
                                />
                            </div>

                            {/* Address Line 1 Field */}
                            <div>
                                <label htmlFor="addressLine1" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Address Line 1
                                </label>
                                <input
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter address line 1"
                                />
                            </div>

                            {/* Address Line 2 Field */}
                            <div>
                                <label htmlFor="addressLine2" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    id="addressLine2"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter address line 2 (optional)"
                                />
                            </div>

                            {/* Landmark Field */}
                            <div>
                                <label htmlFor="landmark" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Landmark
                                </label>
                                <input
                                    type="text"
                                    id="landmark"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter landmark (optional)"
                                />
                            </div>

                            {/* Pincode Field */}
                            <div>
                                <label htmlFor="pincode" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter pincode"
                                />
                            </div>

                            {/* Default Address Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 bg-white/5 border-white/10 rounded focus:ring-pink-500 focus:ring-2"
                                />
                                <label htmlFor="isDefault" className="text-sm sm:text-base text-gray-300 cursor-pointer">
                                    Set as default address
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff]             hover:from-[#8354f8] hover:to-[#9f78ff] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation shadow-lg mt-4 sm:mt-6"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
