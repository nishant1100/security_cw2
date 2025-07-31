import React, { useEffect, useState } from 'react'
import InputField from '../addProduct/InputField';
import SelectField from '../addProduct/SelectField';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productApi';
import Cookies from 'js-cookie';

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, refetch } = useFetchProductByIdQuery(id);
  const [updateProduct] = useUpdateProductMutation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [productImage, setProductImage] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (productData) {
      setValue('title', productData.title);
      setValue('description', productData.description);
      setValue('category', productData?.category);
      setValue('trending', productData.trending);
      setValue('oldPrice', productData.old_price.$numberDecimal);
      setValue('newPrice', productData.old_price.$numberDecimal);
      setValue('coverImage', productData.coverImage); // If the image is part of the product details
    }
  }, [productData, setValue]);

  // State to store CSRF token
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/csrf-token`, { withCredentials: true });
        if (response.data && response.data.csrfToken) {
          setCsrfToken(response.data.csrfToken);
          localStorage.setItem('csrfToken', response.data.csrfToken);
          console.log('CSRF token fetched:', response.data.csrfToken);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('trending', data.trending);
    formData.append('oldPrice', data.oldPrice);
    formData.append('newPrice', data.newPrice);
    formData.append('coverImage', data.coverImage || productData.coverImage);
    if (productImage) formData.append('productImage', productImage);
    if (productFile) formData.append('productFile', productFile);
    
    // Add CSRF token to the form data
    console.log('Using CSRF token:', csrfToken);
    formData.append('_csrf', csrfToken);

    try {
      // Use the updateProduct mutation from RTK Query
      // We need to create a proper request structure for RTK Query
      // Since we can't convert FormData to a plain object easily with files
      // Log the contents of the FormData for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Get auth token from cookies
      const authToken = Cookies.get('authToken');
      console.log('Using auth token:', authToken ? 'Present' : 'Missing');
      
      // Make direct axios request instead of using the RTK Query mutation
      const response = await axios.put(
        `${getBaseUrl()}/api/product/edit/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-Token': csrfToken,
            'Authorization': `Bearer ${authToken}`
          },
          withCredentials: true
        }
      );
      
      const result = response.data;
      
      setSuccessMessage('Product updated successfully!');
      setErrorMessage('');
      await refetch();
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage(error.data?.message || 'Failed to update product. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Product</h2>

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
        
        {/* Description Input */}
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
          placeholder="Enter product description"
        />

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
          placeholder="Enter old price"
          register={register}
        />

        {/* New Price Input */}
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="Enter new price"
          register={register}
        />

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
