import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import InputField from '../addProduct/InputField'; // Assuming your InputField component
import SelectField from '../addProduct/SelectField'; // Assuming your SelectField component

const AddProduct = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [productImage, setProductImage] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // State to store success message
  const [errorMessage, setErrorMessage] = useState('');  // State to store error message

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('productName', data.productName);
    formData.append('description', data.description);
    formData.append('old_price', data.oldPrice);
    formData.append('new_price', data.newPrice);
    formData.append('category', data.category);
    formData.append('trending', data.trending);
    if (productImage) formData.append('productImage', productImage);
    if (productFile) formData.append('productFile', productFile);

    try {
      const response = await axios.post('http://localhost:3000/api/product/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data); // Log the success message
      setSuccessMessage('Product added successfully!');  // Set the success message
      setErrorMessage('');  // Reset the error message (if any)
    } catch (error) {
      console.error('Error creating product:', error.response.data);
      setErrorMessage('Failed to add product. Please try again.');  // Set the error message
      setSuccessMessage('');  // Reset the success message (if any)
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Product</h2>

      {/* Display success or error message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title Input */}
        <InputField
          label="Title"
          name="title"
          type="text"
          register={register}
          placeholder="Enter product title"
        />
        {errors.title && <p className="text-red-500 text-sm">Product is required</p>}
        
        {/* Artist Name Input */}
        <InputField
          label="Product Name"
          name="productName"
          type="text"
          register={register}
          placeholder="Enter product name"
        />
        {errors.productName && <p className="text-red-500 text-sm">Artist Name is required</p>}

        {/* Description Input */}
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
          placeholder="Enter product description"
        />
        {errors.description && <p className="text-red-500 text-sm">Description is required</p>}

        {/* Category Dropdown */}
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Select Category' },
            { value: 'Android Phones', label: 'Android Phones' },
            { value: 'iPhones', label: 'iPhones' },
            { value: '5G Phones', label: '5G Phones' },
            { value: 'Gaming Phones', label: 'Gaming Phones' },
            { value: 'Refurbished Phones', label: 'Refurbished Phones' },
          ]}
          register={register}
        />
        {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
        
        {/* Trending Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        {/* Old Price Input */}
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          register={register}
          placeholder="Enter old price"
        />
        {errors.oldPrice && <p className="text-red-500 text-sm">Old Price is required</p>}

        {/* New Price Input */}
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          register={register}
          placeholder="Enter new price"
        />
        {errors.newPrice && <p className="text-red-500 text-sm">New Price is required</p>}

        {/* Product Image Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Product Image</label>
          <input 
            type="file" 
            onChange={(e) => setProductImage(e.target.files[0])} 
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
          />
        </div>

        {/* Product File Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Product File</label>
          <input 
            type="file" 
            onChange={(e) => setProductFile(e.target.files[0])} 
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
