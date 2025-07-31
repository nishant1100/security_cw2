import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";
import Cookies from 'js-cookie';

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/product`, // Make sure getBaseUrl() returns the correct URL
  credentials: "include",
  prepareHeaders: (headers) => {
    // Get token from cookies instead of localStorage
    const token = Cookies.get('authToken');
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    
    // Add CSRF token if available
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    
    return headers;
  },
});

// API slice
const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Fetch all products
    fetchAllProducts: builder.query({
      query: () => "/",
      providesTags: ["Product"],
    }),

    // Fetch a product by ID
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Create a new product
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update a product
    updateProduct: builder.mutation({
      query: ({ id, body }) => {
        // For FormData uploads, don't set Content-Type (browser will set it with boundary)
        // This allows file uploads to work properly
        return {
          url: `/edit/${id}`,
          method: "PUT",
          body: body, // This is the FormData object directly from the component
          formData: true,
        };
      },
      invalidatesTags: ["Product"],
    }),

    // Delete a product by ID
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

// Export the hooks for the queries and mutations
export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

export default productsApi;
