import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import InputField from '../addProduct/InputField'; // Assuming your InputField component
import SelectField from '../addProduct/SelectField'; // Assuming your SelectField component
import { useSessionContext } from '../../../context/SessionContext';
import getBaseUrl from '../../../utils/baseURL';

const AddProduct = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [productImage, setProductImage] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // State to store success message
  const [errorMessage, setErrorMessage] = useState('');  // State to store error message
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const { getAuthToken } = useSessionContext();

  // Fetch CSRF token when component mounts
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/csrf-token`, { withCredentials: true });
        if (response.data && response.data.csrfToken) {
          setCsrfToken(response.data.csrfToken);
          console.log('CSRF token fetched successfully');
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    
    fetchCSRFToken();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
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
    
    // Add CSRF token to the form data as well as headers
    if (csrfToken) formData.append('_csrf', csrfToken);

    // Get the authorization token from session context
    const token = getAuthToken();
    
    try {
      // Ensure we're using the correct baseURL
      const baseUrl = getBaseUrl();
      console.log('Using base URL:', baseUrl);
      
      // Log the token being used
      console.log('Using token:', token ? 'Token present' : 'No token');
      console.log('CSRF token:', csrfToken ? 'Present' : 'Missing');
      
      const response = await axios.post(`${baseUrl}/api/product/create-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        },
        withCredentials: true
      });
      console.log(response.data); // Log the success message
      setSuccessMessage('Product added successfully!');  // Set the success message
      setErrorMessage('');  // Reset the error message (if any)
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      // Provide more detailed error message
      if (error.response?.status === 400) {
        setErrorMessage(`Bad Request: ${error.response?.data || 'Invalid input data'}`);
      } else if (error.response?.status === 401) {
        setErrorMessage('Authentication failed: Invalid or expired token');
      } else {
        setErrorMessage(`Failed to add product: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
      setSuccessMessage('');  // Reset the success message (if any)
    } finally {
      setIsLoading(false);
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
            { value: 'iPhone', label: 'iPhone' },
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
          disabled={isLoading}
          className={`w-full py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold rounded-md`}
        >
          {isLoading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
