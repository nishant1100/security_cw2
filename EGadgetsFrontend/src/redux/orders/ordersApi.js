import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../utils/baseURL";

const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include',
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({  // fix here
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders'],
        }),
        getOrderByUserId: builder.query({  // new endpoint by userId
            query: (userId) => `/user/${userId}`,
            providesTags: ['Orders'],
        }),
        getAllOrders: builder.query({
            query: () => "/",
            providesTags: ['Orders'],
        }),
        // If you want to keep getOrderByEmail (but your backend must support it)
        // getOrderByEmail: builder.query({
        //     query: (email) => `/email/${email}`,
        //     providesTags: ['Orders'],
        // }),
    }),
});

export const { useCreateOrderMutation, useGetOrderByUserIdQuery, useGetAllOrdersQuery } = ordersApi;

export default ordersApi;
