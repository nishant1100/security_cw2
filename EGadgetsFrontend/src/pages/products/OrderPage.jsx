import { useGetOrderByUserIdQuery } from '../../redux/orders/ordersApi';

const OrderPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const { data: orders = [], isLoading, error } = useGetOrderByUserIdQuery(currentUser?._id);

    if (isLoading) return <div className="text-center text-gray-500 mt-10">Loading orders...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error loading orders</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 border-b pb-4 text-gray-800">
                Your Orders
            </h2>

            {orders.length === 0 ? (
                <div className="text-gray-500 text-center mt-20">No orders found.</div>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-lg p-6 mb-8 shadow hover:shadow-lg transition duration-300"
                    >
                        <p className="text-sm bg-indigo-600 text-white inline-block px-3 py-1 rounded-full mb-4">
                            Order # {order._id.slice(-6).toUpperCase()}
                        </p>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{order.name}</h3>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Email:</span> {order.email}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Phone:</span> {order.phone}
                            </p>
                            <p className="text-gray-800 font-semibold">
                                Total Price:{" "}
                                <span className="text-indigo-600">
                                    Nrs. {order.totalPrice?.toFixed(2)}
                                </span>
                            </p>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-1">Shipping Address:</h4>
                            <p className="text-gray-700">
                                {order.address?.city}, {order.address?.state}, {order.address?.country},{" "}
                                {order.address?.zipcode}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                Products Ordered:
                            </h4>

                            {order.productIds?.length === 0 ? (
                                <p className="text-gray-500">No products found.</p>
                            ) : (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {order.productIds.map((product) => (
                                <li
                                    key={product._id}
                                    className="flex border rounded-lg p-3 shadow hover:shadow-md transition duration-300"
                                >
                                    {/* <img
                                    src={product?.productImage || "/placeholder.png"}
                                    alt={product?.productName || "Product"}
                                    className="w-24 h-24 object-cover rounded mr-4 border"
                                    /> */}
                                    <div>
                                    <h5 className="text-lg font-bold text-gray-800">
                                        {product?.productName || "Unnamed Product"}
                                    </h5>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {product?.description || "No description available"}
                                    </p>
                                    </div>
                                </li>
                                ))}

                                </ul>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderPage;
