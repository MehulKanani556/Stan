import React from 'react'
import shadow from '../images/shadow.jpg'
import hd from '../images/hd.png'
import tap from '../images/tap.jpg'


const MultiHome = () => {
  return (
    <div className='bg-black md:pt-[50px] pt-[70px]'>
        <div className="container">
            <div className="flex lg:flex-nowrap flex-wrap gap-x-6 sm:px-0 px-1">
                <div className="lg:w-2/5 w-full">
                    <div className='relative ms:rounded-[35px] rounded-[10px] overflow-hidden'>
                       <img src={shadow} alt="" className='xl:h-[825px] lg:h-[700px] md:h-[600px] ms:h-[500px] h-[400px] object-cover w-full' />
                        <div className='absolute top-0 text-white ms:p-11 p-5'>
                           <h2 className='lg:text-[38px] md:text-[34px] ms:text-[30px] text-[26px] font-[700]'>Seamless Device Access</h2>
                           <h4 className='lg:text-[22px] ms:text-[19px] text-[16px] mt-3 ms:leading-[29px] leading-[24px]'>Enjoy gaming across smartphones, desktops, and set-top boxes with uninterrupted single sign-on access.</h4>
                        </div>
                    </div>
                </div>
                <div className="lg:w-3/5 w-full lg:mt-0 mt-6">
                   <div className='relative ms:rounded-[35px] rounded-[10px] overflow-hidden'>
                       <img src={hd} alt="" className='xl:h-[400px] ms:h-[338px] h-[300px] object-cover w-full' />
                       <div className='absolute top-0 text-white ms:p-11 p-5'>
                           <h2 className='lg:text-[38px] md:text-[34px] ms:text-[30px] text-[26px] font-[700]'>Crystal Clear Gaming</h2>
                           <h4 className='lg:text-[22px] ms:text-[19px] text-[16px] mt-3 lms:eading-[29px] leading-[24px]'>High-quality cloud gaming, 1080p resolution, zero hidden fees.</h4>
                        </div>
                   </div>

                   <div className='relative ms:rounded-[35px] rounded-[10px] overflow-hidden mt-6'>
                       <img src={tap} alt="" className='xl:h-[400px] h-[338px] object-cover w-full' />
                       <div className='absolute bottom-0 text-white ms:p-11 p-5'>
                           <h2 className='lg:text-[38px] md:text-[34px] ms:text-[30px] text-[26px] font-[700]'>One-Tap Gaming</h2>
                           <h4 className='lg:text-[22px] ms:text-[19px] text-[16px] mt-3 ms:leading-[29px] leading-[24px]'>Stream games directly from the cloud and start playing in seconds</h4>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MultiHome
