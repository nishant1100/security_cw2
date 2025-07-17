import React, { useState } from "react";
import ProductCard from "../products/ProductCard";
import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";

const categories = [
  "All Categories",
  "Android Phones",
  "iPhone",
  "5G Phones",
  "Gaming Phones",
  "Refurbished Phones",
];

const BrowsePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const { data: products = [] } = useFetchAllProductsQuery();

  // Filter products by category
  const filteredProducts = selectedCategory === "All Categories"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // Filter products by search term
  const searchFilteredProducts = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...searchFilteredProducts];
  if (sortOption === "price-low-high") {
    sortedProducts.sort((a, b) => Number(a.new_price.$numberDecimal) - Number(b.new_price.$numberDecimal));
  } else if (sortOption === "price-high-low") {
    sortedProducts.sort((a, b) => Number(b.new_price.$numberDecimal) - Number(a.new_price.$numberDecimal));
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSearchTerm("");
    setSortOption("default");
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Browse Products</h2>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-md w-full sm:w-72 shadow-sm"
        />
        
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-3 rounded-md w-full sm:w-60 shadow-sm"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-3 rounded-md w-full sm:w-60 shadow-sm"
        >
          <option value="default">Sort By</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>

        <button
          onClick={clearFilters}
          className="bg-red-500 text-white px-4 py-3 rounded-md shadow-md hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
