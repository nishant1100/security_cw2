import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdIncompleteCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/baseURL';
import RevenueChart from './RevenueChart';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [orders, setOrders] = useState([]);  // New state for orders
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch the admin data
                const response = await axios.get(`${getBaseUrl()}/api/admin2`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                setData(response.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                // Fetch the orders data
                const response = await axios.get(`${getBaseUrl()}/api/orders/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                setOrders(response.data);  // Set the fetched orders
            } catch (error) {
                console.error('Error fetching orders data:', error);
            }
        };

        fetchAdminData();
        fetchOrders();
    }, []);

    const calculateMonthlyRevenue = () => {
        const monthlyRevenue = Array(12).fill(0); // Initialize an array with 12 months

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);  // Parse the createdAt field
            const month = orderDate.getMonth(); // Get the month index (0 = Jan, 1 = Feb, ..., 11 = Dec)
            monthlyRevenue[month] += order.totalPrice; // Add the totalPrice to the corresponding month
        });

        return monthlyRevenue;
    };

    return (
        <>
            {/* Stats Section */}
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalProducts}</span>
                        <span className="block text-gray-500">Products</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">Rs. {data?.totalSales}</span>
                        <span className="block text-gray-500">Total Sales</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block text-2xl font-bold">{data?.trendingProducts}</span>
                        <span className="block text-gray-500">Trending Products in This Month</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <MdIncompleteCircle className="size-6" />
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{data?.totalOrders}</span>
                        <span className="block text-gray-500">Total Orders</span>
                    </div>
                </div>
            </section>

            {/* Revenue Chart Section */}
            <section className="mt-8">
                {/* Passing the revenue data to the RevenueChart component */}
                {orders.length > 0 && (
                    <RevenueChart revenueData={calculateMonthlyRevenue()} />
                )}
            </section>
        </>
    );
};

export default Dashboard;
