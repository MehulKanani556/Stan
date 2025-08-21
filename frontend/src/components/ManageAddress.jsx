import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoLocation, IoClose, IoTrash, IoPencil } from "react-icons/io5";
import manageAddress from "../images/manage_addres-1.png"
import StylishDiv from './StylishDiv';

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
        navigate(-1) 
    }

    const openModal = () => {
        setIsModalOpen(true)
        setEditingAddress(null)
        
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
            
            const updatedAddresses = addresses.map(addr =>
                addr.id === editingAddress.id
                    ? { ...formData, id: addr.id, mobile: `+91${formData.mobile}` }
                    : addr
            )
            setAddresses(updatedAddresses)
        } else {
            
            const newAddress = {
                ...formData,
                id: Date.now(),
                mobile: `+91${formData.mobile}`,
                isDefault: formData.isDefault || addresses.length === 0
            }

            
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
        <section className='bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]'>
            <div className="min-h-screen max-w-[1480px] m-auto w-full  text-white flex flex-col">
                
                <div className="flex items-center justify-between px-2 sm:px-4 py-4 bg-black/30 backdrop-blur-xl sticky top-0 z-20 shadow-lg ">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            className="text-white rounded-full hover:bg-white/10 transition-colors touch-manipulation"
                            onClick={handleBack}
                            aria-label="Go back"
                        >
                            <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Manage Addresses
                        </h1>
                    </div>
                    
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

                
                <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
                    {addresses.length === 0 ? (
                        
                        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative">
                            
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
                                    from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
                                    animate-pulse"></div>
                            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
                                    from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
                                    animate-pulse"></div>

                            
                            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
                                    relative overflow-hidden shadow-lg shadow-purple-500/30">
                                <img
                                    src={manageAddress}
                                    alt="Lazy Cat"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            
                            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                                No addresses added!
                            </h2>
                            <p className="text-gray-400 text-sm text-center mt-2">
                                Add your first address to get started
                            </p>
                        </div>
                    ) : (
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                            {addresses.map((address) => (
                             <StylishDiv key={address.id}>

                                    
                                    {address.isDefault && (
                                        <div className="absolute top-0 right-0 w-32 h-24 overflow-hidden pointer-events-none">
                                            <div className="absolute right-[-19px] top-[7px] rotate-45">
                                                <span className="bg-[#621df2] text-white text-[10px] font-semibold tracking-wide px-6 py-1 shadow-lg">
                                                    Default
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    
                                    <div className="relative z-10 flex flex-col">
                                        
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <h3 className="text-white font-bold text-lg tracking-wide">{address.name}</h3>
                                                <p className="text-gray-400 text-sm">{address.mobile}</p>
                                            </div>
                                        </div>

                                        
                                        <div className="mb-6">
                                            <p className="text-gray-300 text-sm leading-relaxed">{address.addressLine1}</p>
                                            <p className="text-gray-500 text-sm leading-relaxed">{address.addressLine2}</p>
                                        </div>

                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <button
                                                onClick={() => deleteAddress(address.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={() => openEditModal(address)}
                                                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-2 rounded-xl font-medium shadow-md shadow-purple-600/40 hover:from-purple-700 hover:to-purple-900 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <IoPencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                    </StylishDiv>
                            ))}
                        </div>

                    )}
                </div>

                
                {(isModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-gradient-to-br from-[#1a1a1d]/80 to-[#2c2c34]/80 
                    backdrop-blur-2xl border border-white/10 rounded-2xl 
                    shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">

                            
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
                                    {editingAddress ? '✏️ Edit Address' : '➕ Add Address'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Close modal"
                                >
                                    <IoClose className="w-6 h-6" />
                                </button>
                            </div>

                            
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-5"
                            >
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Mobile No.
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter mobile number"
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter address line 1"
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter address line 2 (optional)"
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter landmark (optional)"
                                    />
                                </div>

                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 
                       rounded-xl text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                                        placeholder="Enter pincode"
                                    />
                                </div>

                                
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-violet-500 bg-white/10 border-white/20 rounded focus:ring-violet-500"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-gray-300 cursor-pointer">
                                        Set as default address
                                    </label>
                                </div>

                                
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#6d28d9] to-[#a78bfa] 
                     hover:from-[#7c3aed] hover:to-[#c084fc] 
                     text-white px-6 py-3 rounded-xl text-base font-medium 
                     transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                                >
                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}
