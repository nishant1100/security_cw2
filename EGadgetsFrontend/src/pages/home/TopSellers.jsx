import React, { useState } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../products/ProductCard";
import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Smartphone-related categories
const categories = [
  "All Categories",
  "Android Phones",
  "iPhone",
  "5G Phones",
  "Gaming Phones",
  "Refurbished Phones",
];

export const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const { data: products = [] } = useFetchAllProductsQuery();

  const filteredProducts =
    selectedCategory === "All Categories"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="py-12 pl-6 pr-2 sm:pl-10 sm:pr-4 lg:pl-16 lg:pr-8 bg-white">
      <div className="max-w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Recommended For You
        </h2>

        {/* Dropdown filter */}
        <div className="mb-8">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Product Swiper */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))
          ) : (
            <p className="text-gray-500 p-4">No products found in this category.</p>
          )}
        </Swiper>
      </div>
    </div>
  );
};
