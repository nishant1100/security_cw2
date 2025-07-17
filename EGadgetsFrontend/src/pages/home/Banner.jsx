// import React from 'react';
// import bannerImg from "../../assets/SM cover.png"; 
// import { Link, useNavigate } from "react-router-dom";

// const Banner = () => {
//   return (
//     <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 px-6 md:px-16 py-16 rounded-xl bg-gradient-to-r from-blue-100 via-white to-red-100">
//       {/* Image Section */}
//       <div className="w-full md:w-1/2 flex justify-center md:justify-end">
//         <img
//           src={bannerImg}
//           alt="Featured Phone"
//           className="max-w-lg md:max-w-xl lg:max-w-xl rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
//         />
//       </div>

//       {/* Text Section */}
//       <div className="w-full md:w-1/2 text-center md:text-left">
//         <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
//           Discover the Latest Smartphones in Nepal
//         </h1>

//         <p className="text-gray-600 mb-8 text-base md:text-lg">
//           EGadget is your trusted hub for the latest and most reliable smartphones in Nepal.
//           From budget picks to flagship devices, we've got it all locally curated, quality assured.
//         </p>
//         <Link
//                         to="/browse"
//                         className="bg-primary py-1 px-4 flex items-center rounded-md text-black font-semibold hover:scale-105 transition-all duration-300 text-sm md:text-base"
//                     >
//                         Shop Now
//                     </Link>
//       </div>
//     </div>
//   );
// };

// export default Banner;
import React from 'react';
import bannerImg from "../../assets/SM cover.png"; 
import { Link } from "react-router-dom";

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

        {/* Shop Now Button */}
        <div className="flex justify-center md:justify-start">
          <Link
            to="/browse"
            className="bg-purple-600 text-white py-3 px-6 rounded-md font-semibold shadow-md hover:bg-purple-700 transition-all duration-300 text-sm md:text-base"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
