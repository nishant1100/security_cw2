// import React, { useState } from "react";
// import ProductCard from "../products/ProductCard";
// import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

// const categories = [
//   "Android Phones",
//   "iPhone",
//   "5G Phones",
//   "Gaming Phones",
//   "Refurbished Phones",
// ];

// const BrowsePage = () => {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("default");

//   const { data: products = [] } = useFetchAllProductsQuery();

//   const handleCategoryChange = (category) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category]
//     );
//   };

//   const clearFilters = () => {
//     setSelectedCategories([]);
//     setSearchTerm("");
//     setSortOption("default");
//   };

//   // Filter Logic
//   const categoryFiltered = selectedCategories.length
//     ? products.filter((product) =>
//         selectedCategories.includes(product.category)
//       )
//     : products;

//   const searchFiltered = categoryFiltered.filter((product) =>
//     product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.productName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedProducts = [...searchFiltered];
//   if (sortOption === "price-low-high") {
//     sortedProducts.sort(
//       (a, b) =>
//         Number(a.new_price.$numberDecimal) - Number(b.new_price.$numberDecimal)
//     );
//   } else if (sortOption === "price-high-low") {
//     sortedProducts.sort(
//       (a, b) =>
//         Number(b.new_price.$numberDecimal) - Number(a.new_price.$numberDecimal)
//     );
//   }

//   return (
//     <div className="max-w-7.1xl mx-auto px-4 py-10">
//       <h2 className="text-4xl font-bold text-center mb-10">Browse Products</h2>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filters Section (Left Side) */}
//         <aside className="w-full md:w-1/4 space-y-6">
//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search product..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//           />

//           {/* Category Checkboxes */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Categories</h3>
//             <div className="space-y-2">
//               {categories.map((category) => (
//                 <label key={category} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     value={category}
//                     checked={selectedCategories.includes(category)}
//                     onChange={() => handleCategoryChange(category)}
//                     className="accent-blue-500"
//                   />
//                   <span>{category}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Sort Option */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Sort By</h3>
//             <select
//               onChange={(e) => setSortOption(e.target.value)}
//               value={sortOption}
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
//             >
//               <option value="default">Default</option>
//               <option value="price-low-high">Price: Low to High</option>
//               <option value="price-high-low">Price: High to Low</option>
//             </select>
//           </div>

//           {/* Clear Filters */}
//           <button
//             onClick={clearFilters}
//             className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
//           >
//             Clear All Filters
//           </button>
//         </aside>

//         {/* Products Grid (Right Side) */}
//         <section className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {sortedProducts.length > 0 ? (
//           sortedProducts.map((product, index) => (
//             <ProductCard key={index} product={product} />
//           ))
//         ) : (
//           <p className="text-gray-500 col-span-full text-center">
//             No products found.
//           </p>
//         )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default BrowsePage;
import React, { useState } from "react";
import ProductCard from "../products/ProductCard";
import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

const categories = [
  "Android Phones",
  "iPhone",
  "5G Phones",
  "Gaming Phones",
  "Refurbished Phones",
];

const BrowsePage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const { data: products = [] } = useFetchAllProductsQuery();

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setSortOption("default");
  };

  // Filtering Logic
  const categoryFiltered = selectedCategories.length
    ? products.filter((product) =>
        selectedCategories.includes(product.category)
      )
    : products;

  const searchFiltered = categoryFiltered.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...searchFiltered];
  if (sortOption === "price-low-high") {
    sortedProducts.sort(
      (a, b) =>
        Number(a.new_price.$numberDecimal) - Number(b.new_price.$numberDecimal)
    );
  } else if (sortOption === "price-high-low") {
    sortedProducts.sort(
      (a, b) =>
        Number(b.new_price.$numberDecimal) - Number(a.new_price.$numberDecimal)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-9">
      <h2 className="text-4xl font-bold text-center mb-10">Browse Products</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Section */}
        <aside className="w-full md:w-1/4 space-y-6 md:sticky md:top-28 self-start">
          {/* Search */}
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />

          {/* Category Checkboxes */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="accent-blue-500"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Option */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Sort By</h3>
            <select
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Section */}
        <section className="w-full md:w-3/4 grid sm:grid-cols-2 gap-6 place-items-center">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <div key={index} className="w-full flex justify-center">
                <div className="w-full max-w-[420px]">
                  <ProductCard product={product} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No products found.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default BrowsePage;
