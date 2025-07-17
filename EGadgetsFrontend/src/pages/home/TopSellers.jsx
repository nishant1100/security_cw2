import React, { useEffect, useState } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../products/ProductCard";
import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';


const categories = [
  "Choose a Category",
  "Android Phones",
  "iPhone",
  "5G Phones",
  "Gaming Phones",
  "Refurbished Phones",
];
export const TopSellers = () => {

  const [selectedCategory, setSelectedCategory] = useState("Choose a Category");
  
  const {data:products = []} = useFetchAllProductsQuery();
  console.log(products)

  const filteredProducts =
    selectedCategory === "Choose a Category"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  console.log(filteredProducts);

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Recommended For You</h2>

      {/* cateogyr filter  garne */}

      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-purple-100 p-2 rounded-md rounded-md py-4 focus:outline-none"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true} 
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination,Navigation]}
        className="mySwiper"
      >
        {filteredProducts.length > 0 && filteredProducts.map((product, index) => (
          <SwiperSlide key={index}> 
            <ProductCard key={index} product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


// import React, { useState } from "react";
// import { Pagination, Navigation } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import ProductCard from "../products/ProductCard";
// import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const categories = [
//   "Choose a Category",
//   "Smartphones",
//   "Accessories",
//   "Tablets",
//   "Wearables",
//   "Gaming",
// ];

// export const TopSellers = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Choose a Category");
//   const { data: products = [] } = useFetchAllProductsQuery();

//   const filteredProducts =
//     selectedCategory === "Choose a Category"
//       ? products
//       : products.filter((product) => product.category === selectedCategory);

//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="max-w-screen-xl mx-auto px-4">
//         {/* Heading */}
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
//           🛍️ Recommended For You
//         </h2>

//         {/* Category Filter */}
//         <div className="flex justify-center mb-10">
//           <select
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             value={selectedCategory}
//             name="category"
//             id="category"
//             className="px-5 py-3 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
//           >
//             {categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Product Swiper */}
//         {filteredProducts.length > 0 ? (
//           <Swiper
//             slidesPerView={1}
//             spaceBetween={30}
//             navigation={true}
//             breakpoints={{
//               640: {
//                 slidesPerView: 1,
//                 spaceBetween: 20,
//               },
//               768: {
//                 slidesPerView: 2,
//                 spaceBetween: 30,
//               },
//               1024: {
//                 slidesPerView: 2,
//                 spaceBetween: 40,
//               },
//               1180: {
//                 slidesPerView: 3,
//                 spaceBetween: 40,
//               },
//             }}
//             modules={[Pagination, Navigation]}
//             className="mySwiper"
//           >
//             {filteredProducts.map((product, index) => (
//               <SwiperSlide key={index}>
//                 <ProductCard product={product} />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             No products available in this category.
//           </p>
//         )}
//       </div>
//     </section>
//   );
// };
