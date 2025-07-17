// import React from 'react'

// import bannerImg from "../../assets/Egadget_logo.png"

// const Banner = () => {
//   return (
//     <div className='flex flex-col md:flex-row-reverse px-8 py-16 justify-between items-center gap-12 bg-purple-100'>
//          <div className='md:w-1/2 w-full flex items-center md:justify-end'>
//             <img src={bannerImg} alt="" />
//         </div>
        
//         <div className='md:w-1/2 w-full'>
//             <h1 className='md:text-5xl text-2xl font-medium mb-7'>Home Brewed in Nepal Support Local Business</h1>
//             <p className='mb-10'>SonicSummit advocates for protection, recognition and appreciation of the artist. Noodle believes in providing more agency to the artist and builds awareness around piracy, artist support and music rights in the Nepali music scene.

// </p>

//             <button className='rounded bg-gray-100 p-5'>Subscribe</button>
//         </div>

//     </div>
//   )
// }

// export default Banner

import React from 'react';
import bannerImg from "../../assets/SM cover.png"; 

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 px-6 md:px-16 py-16 rounded-xl bg-gradient-to-r from-blue-100 via-white to-red-100">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <img
          src={bannerImg}
          alt="Featured Phone"
          className="max-w-lg md:max-w-xl lg:max-w-xl rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
          Discover the Latest Smartphones in Nepal
        </h1>

        <p className="text-gray-600 mb-8 text-base md:text-lg">
          EGadget is your trusted hub for the latest and most reliable smartphones in Nepal.
          From budget picks to flagship devices, we've got it all locally curated, quality assured.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium transition duration-200">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
