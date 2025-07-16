import React from 'react'

import bannerImg from "../../assets/logo_without_background.png"

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse px-8 py-16 justify-between items-center gap-12 bg-purple-100'>
         <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="" />
        </div>
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-2xl font-medium mb-7'>Home Brewed in Nepal Support Local Business</h1>
            <p className='mb-10'>SonicSummit advocates for protection, recognition and appreciation of the artist. Noodle believes in providing more agency to the artist and builds awareness around piracy, artist support and music rights in the Nepali music scene.

</p>

            <button className='rounded bg-gray-100 p-5'>Subscribe</button>
        </div>

    </div>
  )
}

export default Banner