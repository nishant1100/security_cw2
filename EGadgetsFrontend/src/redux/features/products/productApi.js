import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/product`, // Make sure getBaseUrl() returns the correct URL
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
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
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: rest,
        headers: { "Content-Type": "application/json" },
      }),
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
