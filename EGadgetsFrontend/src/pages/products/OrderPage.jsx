import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/orders/ordersApi';
const OrderPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user (email)
    const { data: orders = [] } = useGetOrderByEmailQuery(currentUser?.email); // Get orders based on email

   
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
                <div>No orders found!</div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="border-b mb-4 pb-4">
                        <p className="p-1 bg-secondary text-white w-10 rounded mb-1">Order # {order._id}</p>
                        <h3 className="font-bold">Customer: {order.name}</h3>
                        <p className="text-gray-600">Email: {order.email}</p>
                        <p className="text-gray-600">Phone: {order.phone}</p>
                        <p className="text-gray-600">Total Price: ${order.totalPrice}</p>

                        <h4 className="font-semibold mt-2">Shipping Address:</h4>
                        <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>

                        <h4 className="font-semibold mt-2">Products Ordered:</h4>
                        <ul>
                            {order.productIds.map((productId, index) => (
                                <li key={index} className="mb-2">
                                    {/* You should have product details like name and price in the order itself */}
                                    <strong>Product ID: {productId}</strong> {/* Adjust this line to match product details */}
                                    {/* You can also add quantity or any other data based on your order structure */}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderPage;
